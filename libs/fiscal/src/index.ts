import {
  DocumentStatus,
  DocumentType,
  FiscalEnvironment,
  FiscalDocumentDto,
} from '@opennfe/shared';

export interface ProviderCapabilities {
  supportedDocumentTypes: DocumentType[];
  supportedEnvironments: FiscalEnvironment[];
  canEmit: boolean;
  canCancel: boolean;
  canCorrect: boolean;
  canInutilize: boolean;
  canFetchXml: boolean;
  canFetchPdf: boolean;
  supportsWebhooks: boolean;
  supportsExternalReference: boolean;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  environment: FiscalEnvironment;
  providerVersion?: string;
}

export interface FiscalSubmissionRequest {
  document: FiscalDocumentDto;
  companyCredentials: Record<string, string>;
  environment: FiscalEnvironment;
  idempotencyKey: string;
}

export interface FiscalSubmissionResult {
  success: boolean;
  status: DocumentStatus;
  externalReference?: string;
  externalId?: string;
  protocolNumber?: string;
  accessKey?: string;
  authorizedAt?: Date;
  rejectionCode?: string;
  rejectionReason?: string;
  rawResponse?: unknown;
}

export interface FiscalStatusRequest {
  documentId: string;
  externalReference?: string;
  externalId?: string;
  accessKey?: string;
  companyCredentials: Record<string, string>;
  environment: FiscalEnvironment;
}

export interface FiscalStatusResult {
  status: DocumentStatus;
  protocolNumber?: string;
  accessKey?: string;
  authorizedAt?: Date;
  rejectionCode?: string;
  rejectionReason?: string;
  xmlUrl?: string;
  pdfUrl?: string;
  rawResponse?: unknown;
}

export interface FiscalCancellationRequest {
  documentId: string;
  accessKey: string;
  protocolNumber?: string;
  externalReference?: string;
  justification: string;
  companyCredentials: Record<string, string>;
  environment: FiscalEnvironment;
}

export interface FiscalCancellationResult {
  success: boolean;
  status: DocumentStatus;
  cancellationProtocol?: string;
  cancelledAt?: Date;
  rejectionCode?: string;
  rejectionReason?: string;
  rawResponse?: unknown;
}

export interface FiscalFileRequest {
  documentId: string;
  accessKey?: string;
  externalReference?: string;
  fileType: 'XML' | 'PDF';
  companyCredentials: Record<string, string>;
  environment: FiscalEnvironment;
}

export interface FiscalFileResult {
  success: boolean;
  contentType: string;
  contentBase64?: string;
  url?: string;
  error?: string;
}

export interface FiscalCorrectionRequest {
  documentId: string;
  accessKey: string;
  correctionText: string;
  sequenceNumber: number;
  companyCredentials: Record<string, string>;
  environment: FiscalEnvironment;
}

export interface FiscalCorrectionResult {
  success: boolean;
  protocolNumber?: string;
  eventSequence?: number;
  rejectionCode?: string;
  rejectionReason?: string;
}

export interface FiscalProviderAdapter {
  readonly providerKey: string;
  readonly name: string;

  getCapabilities(): Promise<ProviderCapabilities>;

  testConnection(
    credentials: Record<string, string>,
    env: FiscalEnvironment
  ): Promise<ConnectionTestResult>;

  submitDocument(
    request: FiscalSubmissionRequest
  ): Promise<FiscalSubmissionResult>;

  getDocumentStatus(
    request: FiscalStatusRequest
  ): Promise<FiscalStatusResult>;

  cancelDocument(
    request: FiscalCancellationRequest
  ): Promise<FiscalCancellationResult>;

  getXml(request: FiscalFileRequest): Promise<FiscalFileResult>;

  getPdf(request: FiscalFileRequest): Promise<FiscalFileResult>;

  sendCorrectionLetter?(
    request: FiscalCorrectionRequest
  ): Promise<FiscalCorrectionResult>;
}

/**
 * Domain Validation Service (Independent of any external provider)
 */
export class FiscalDomainValidator {
  static validateForSubmission(document: FiscalDocumentDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!document.companyId) {
      errors.push('Empresa emitente não informada.');
    }

    if (!document.items || document.items.length === 0) {
      errors.push('O documento fiscal precisa de pelo menos 1 item.');
    } else {
      document.items.forEach((item, index) => {
        if (!item.code || !item.description) {
          errors.push(`Item #${index + 1}: Código e descrição são obrigatórios.`);
        }
        if (!item.ncm || item.ncm.replace(/\D/g, '').length !== 8) {
          errors.push(`Item #${index + 1}: NCM deve conter 8 dígitos numéricos.`);
        }
        if (!item.cfop || item.cfop.replace(/\D/g, '').length !== 4) {
          errors.push(`Item #${index + 1}: CFOP deve conter 4 dígitos numéricos.`);
        }
        if (item.quantity <= 0) {
          errors.push(`Item #${index + 1}: Quantidade deve ser maior que zero.`);
        }
        if (item.unitPrice <= 0) {
          errors.push(`Item #${index + 1}: Preço unitário deve ser maior que zero.`);
        }
      });
    }

    if (document.documentType === DocumentType.NFE && !document.customerId) {
      errors.push('NF-e modelo 55 requer a seleção de um destinatário cadastrado.');
    }

    if (document.totalDocument <= 0 && document.totalProducts <= 0) {
      errors.push('Valor total do documento não pode ser zero.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export * from './lib/parser/nfe-xml-parser';

