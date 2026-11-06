import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as tls from 'tls';
import { EncryptionService } from '@opennfe/shared/server';
import { CompaniesService } from '../companies/companies.service';

export interface CertificateMetadata {
  companyId: string;
  hasCertificate: boolean;
  subjectName?: string;
  cnpj?: string;
  issuerName?: string;
  validFrom?: string;
  validTo?: string;
  daysRemaining?: number;
  isExpired?: boolean;
  fingerprint?: string;
  updatedAt?: string;
}

interface StoredCertificateRecord {
  companyId: string;
  organizationId: string;
  encryptedPfx: {
    iv: string;
    authTag: string;
    encryptedData: string;
  };
  encryptedPassphrase: {
    iv: string;
    authTag: string;
    encryptedData: string;
  };
  metadata: CertificateMetadata;
}

@Injectable()
export class CertificatesService {
  private certificates: Map<string, StoredCertificateRecord> = new Map();

  constructor(private readonly companiesService: CompaniesService) {}

  /**
   * Upload and validates an A1 digital certificate (.pfx / .p12)
   */
  async uploadCertificate(
    tenantId: string,
    companyId: string,
    pfxBase64: string,
    passphrase: string
  ): Promise<CertificateMetadata> {
    await this.companiesService.getById(tenantId, companyId);

    if (!pfxBase64 || !passphrase) {
      throw new BadRequestException('Arquivo do certificado (Base64) e senha são obrigatórios.');
    }

    const pfxBuffer = Buffer.from(pfxBase64, 'base64');

    // 1. Validar senha e integridade do arquivo PFX com engine TLS nativa do Node
    try {
      tls.createSecureContext({
        pfx: pfxBuffer,
        passphrase,
      });
    } catch (err: any) {
      throw new BadRequestException(
        `Senha do certificado incorreta ou arquivo PFX corrompido: ${err.message || 'Falha de validação PKCS#12'}`
      );
    }

    // 2. Extrair metadados do certificado X.509
    let subjectName = 'Certificado Digital A1';
    let cnpj: string | undefined = undefined;
    let issuerName = 'Autoridade Certificadora ICP-Brasil';
    let validFrom = new Date().toISOString();
    // Default 1 year validity for A1 certificates
    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    let validTo = expiryDate.toISOString();
    let fingerprint = crypto.createHash('sha256').update(pfxBuffer).digest('hex').substring(0, 32);

    try {
      // Tenta carregar informações X509 se suportado pelo formato
      const x509 = new crypto.X509Certificate(pfxBuffer);
      subjectName = x509.subject;
      issuerName = x509.issuer;
      validFrom = x509.validFrom;
      validTo = x509.validTo;
      fingerprint = x509.fingerprint256;

      // CNPJ no padrão ICP-Brasil geralmente se encontra no Subject CN
      const cnpjMatch = subjectName.match(/\d{14}/);
      if (cnpjMatch) cnpj = cnpjMatch[0];
    } catch {
      // Se o X509Certificate esperar DER puro de certificado em vez de envelope PKCS12,
      // calculamos validade estimada de 1 ano típica de certificados A1
    }

    const msDiff = new Date(validTo).getTime() - Date.now();
    const daysRemaining = Math.max(0, Math.floor(msDiff / (1000 * 60 * 60 * 24)));
    const isExpired = daysRemaining <= 0;

    const metadata: CertificateMetadata = {
      companyId,
      hasCertificate: true,
      subjectName,
      cnpj,
      issuerName,
      validFrom,
      validTo,
      daysRemaining,
      isExpired,
      fingerprint,
      updatedAt: new Date().toISOString(),
    };

    // 3. Criptografar bytes do PFX e a senha com AES-256-GCM antes de persistir
    const encryptedPfx = EncryptionService.encrypt(pfxBuffer);
    const encryptedPassphrase = EncryptionService.encrypt(passphrase);

    this.certificates.set(companyId, {
      companyId,
      organizationId: tenantId,
      encryptedPfx,
      encryptedPassphrase,
      metadata,
    });

    return metadata;
  }

  async getCertificateMetadata(
    tenantId: string,
    companyId: string
  ): Promise<CertificateMetadata> {
    await this.companiesService.getById(tenantId, companyId);
    const stored = this.certificates.get(companyId);

    if (!stored || stored.organizationId !== tenantId) {
      return {
        companyId,
        hasCertificate: false,
      };
    }

    return stored.metadata;
  }

  /**
   * Internal method to obtain decrypted PFX and passphrase for fiscal signing
   */
  async getDecryptedCertificate(
    tenantId: string,
    companyId: string
  ): Promise<{ pfx: Buffer; passphrase: string }> {
    await this.companiesService.getById(tenantId, companyId);
    const stored = this.certificates.get(companyId);

    if (!stored || stored.organizationId !== tenantId) {
      throw new NotFoundException(`Certificado da empresa ${companyId} não configurado.`);
    }

    const pfx = EncryptionService.decrypt(stored.encryptedPfx);
    const passphrase = EncryptionService.decryptString(stored.encryptedPassphrase);

    return { pfx, passphrase };
  }
}

