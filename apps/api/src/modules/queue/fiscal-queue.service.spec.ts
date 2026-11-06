import { describe, it, expect, beforeEach } from 'vitest';
import { FiscalQueueService } from './fiscal-queue.service';
import { DocumentStatus, DocumentType, FiscalEnvironment, OperationType, FiscalDocumentDto } from '@opennfe/shared';

describe('FiscalQueueService (Idempotência e Filas)', () => {
  let queueService: FiscalQueueService;

  const mockDoc: FiscalDocumentDto = {
    id: 'doc_queue_01',
    organizationId: 'tenant_abc',
    companyId: 'comp_1',
    companyName: 'Empresa Teste',
    customerId: 'cust_1',
    customerName: 'Cliente Teste',
    customerDocument: '11.222.333/0001-44',
    documentType: DocumentType.NFE,
    status: DocumentStatus.DRAFT,
    environment: FiscalEnvironment.HOMOLOGATION,
    series: 1,
    operationNature: 'VENDA DE MERCADORIA',
    operationType: OperationType.OUTBOUND,
    totalProducts: 100,
    totalDiscount: 0,
    totalIcms: 0,
    totalIpi: 0,
    totalPis: 0,
    totalCofins: 0,
    totalShipping: 0,
    totalDocument: 100,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    queueService = new FiscalQueueService();
  });

  it('deve processar emissão com sucesso e registrar chave de idempotência', async () => {
    const idempotencyKey = 'idem_unique_key_001';
    const result = await queueService.processIssuance({
      tenantId: 'tenant_abc',
      document: mockDoc,
      providerKey: 'MOCK_PROVIDER',
      companyCredentials: {},
      idempotencyKey,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe(DocumentStatus.AUTHORIZED);
    expect(result.accessKey).toHaveLength(44);

    const record = queueService.getAuditRecord(idempotencyKey);
    expect(record).toBeDefined();
    expect(record?.status).toBe(DocumentStatus.AUTHORIZED);
  });

  it('deve retornar o resultado já emitido sem duplicar transmissão quando a mesma idempotencyKey for reenviada', async () => {
    const idempotencyKey = 'idem_unique_key_002';

    // Primeira transmissão
    const firstResult = await queueService.processIssuance({
      tenantId: 'tenant_abc',
      document: mockDoc,
      providerKey: 'MOCK_PROVIDER',
      companyCredentials: {},
      idempotencyKey,
    });

    // Segunda transmissão com a mesma chave (ex: timeout de rede ou retentativa pelo cliente)
    const secondResult = await queueService.processIssuance({
      tenantId: 'tenant_abc',
      document: mockDoc,
      providerKey: 'MOCK_PROVIDER',
      companyCredentials: {},
      idempotencyKey,
    });

    expect(secondResult.accessKey).toBe(firstResult.accessKey);
    expect(secondResult.protocolNumber).toBe(firstResult.protocolNumber);
  });
});

