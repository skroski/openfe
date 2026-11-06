import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CurrentTenant } from '../auth/current-tenant.decorator';
import { DocumentStatus, DocumentType, FiscalDocumentDto } from '@opennfe/shared';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista documentos fiscais com filtros' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: DocumentStatus })
  @ApiQuery({ name: 'type', required: false, enum: DocumentType })
  async list(
    @CurrentTenant() tenantId: string,
    @Query('companyId') companyId?: string,
    @Query('status') status?: DocumentStatus,
    @Query('type') type?: DocumentType
  ) {
    return this.documentsService.list(tenantId, { companyId, status, type });
  }

  @Get('dashboard/kpis')
  @ApiOperation({ summary: 'Indicadores agregados do dashboard fiscal' })
  async getDashboardKpis(@CurrentTenant() tenantId: string) {
    return this.documentsService.getDashboardKpis(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes completos de um documento fiscal' })
  async getById(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.documentsService.getById(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria novo documento em rascunho (Draft)' })
  async createDraft(
    @CurrentTenant() tenantId: string,
    @Body() body: Partial<FiscalDocumentDto>
  ) {
    return this.documentsService.createDraft(tenantId, body);
  }

  @Post(':id/validate')
  @ApiOperation({ summary: 'Executa validações de regras de domínio fiscal' })
  async validate(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.documentsService.validate(tenantId, id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Transmite o documento fiscal ao provedor ativo' })
  async submit(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Headers('x-idempotency-key') idempotencyKey: string
  ) {
    return this.documentsService.submit(tenantId, id, idempotencyKey);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancela documento fiscal autorizado junto à SEFAZ' })
  async cancel(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body('justification') justification: string
  ) {
    return this.documentsService.cancel(tenantId, id, justification);
  }

  @Get(':id/xml')
  @ApiOperation({ summary: 'Download do XML do documento fiscal' })
  async getXml(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const fileResult = await this.documentsService.getXml(tenantId, id);
    if (!fileResult.success || !fileResult.contentBase64) {
      return res.status(404).json({ message: fileResult.error || 'XML não disponível' });
    }
    const buffer = Buffer.from(fileResult.contentBase64, 'base64');
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="${id}.xml"`);
    return res.send(buffer);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Download do DANFE (PDF) do documento fiscal' })
  async getPdf(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const fileResult = await this.documentsService.getPdf(tenantId, id);
    if (!fileResult.success || !fileResult.contentBase64) {
      return res.status(404).json({ message: fileResult.error || 'PDF não disponível' });
    }
    const buffer = Buffer.from(fileResult.contentBase64, 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${id}.pdf"`);
    return res.send(buffer);
  }
}

