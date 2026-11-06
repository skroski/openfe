import {
  Controller,
  Post,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { CurrentTenant } from '../auth/current-tenant.decorator';

export class UploadCertificateDto {
  pfxBase64!: string;
  passphrase!: string;
}

@ApiTags('Certificados Digitais A1')
@Controller('companies/:companyId/certificate')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtém status, validade e metadados do certificado A1 da empresa' })
  getStatus(
    @CurrentTenant() tenantId: string,
    @Param('companyId') companyId: string
  ) {
    return this.certificatesService.getCertificateMetadata(tenantId, companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Faz upload, valida a senha e criptografa o certificado A1 (.pfx)' })
  upload(
    @CurrentTenant() tenantId: string,
    @Param('companyId') companyId: string,
    @Body() body: UploadCertificateDto
  ) {
    return this.certificatesService.uploadCertificate(
      tenantId,
      companyId,
      body.pfxBase64,
      body.passphrase
    );
  }
}
