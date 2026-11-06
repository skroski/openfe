import { describe, it, expect, beforeEach } from 'vitest';
import { WebhooksService } from './webhooks.service';
import { DocumentsService } from '../documents/documents.service';
import { CompaniesService } from '../companies/companies.service';
import { FiscalQueueService } from '../queue/fiscal-queue.service';
import { DocumentStatus } from '@opennfe/shared';

describe('WebhooksService - Inbound and Outbound Webhooks', () => {
  let webhooksService: WebhooksService;
  let documentsService: DocumentsService;
  let companiesService: CompaniesService;
  let queueService: FiscalQueueService;

  beforeEach(() => {
    companiesService = new CompaniesService();
    queueService = new FiscalQueueService();
    documentsService = new DocumentsService(companiesService, queueService);
    webhooksService = new WebhooksService(documentsService);
  });

  it('deve processar callback da Focus NFe e atualizar status do documento', async () => {
    const doc = await documentsService.createDraft('default-tenant-uuid', {
      operationNature: 'VENDA DE TESTE',
    });
    doc.externalReference = 'doc_ref_123';

    const result = await webhooksService.handleFocusNfeCallback({
      referencia: 'doc_ref_123',
      status: 'autorizado',
      chave_nfe: '35261112345678000190550010000010421000001042',
      protocolo_autorizacao: '135260012345678',
    });

    expect(result.received).toBe(true);
    expect(result.updated).toBe(true);

    const updated = await documentsService.getById('default-tenant-uuid', doc.id);
    expect(updated.status).toBe(DocumentStatus.AUTHORIZED);
    expect(updated.accessKey).toBe('35261112345678000190550010000010421000001042');
  });

  it('deve registrar tentativa de disparo de webhook outbound com HMAC-SHA256', async () => {
    const log = await webhooksService.dispatchOutboundWebhook(
      'default-tenant-uuid',
      'document.authorized',
      { documentId: 'doc_1', status: 'AUTHORIZED' }
    );

    expect(log).toBeDefined();
    expect(log.tenantId).toBe('default-tenant-uuid');
    expect(log.event).toBe('document.authorized');
    expect(log.targetUrl).toContain('opennfe-sample');
  });
});

