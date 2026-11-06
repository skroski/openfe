import { describe, it, expect } from 'vitest';
import {
  FiscalProviderRegistry,
  MockFiscalProvider,
  FocusNfeAdapter,
  PlugNotasAdapter,
} from '../index';
import {
  DocumentStatus,
  DocumentType,
  FiscalEnvironment,
  OperationType,
  FiscalDocumentDto,
} from '@opennfe/shared';

describe('Fiscal Provider Adapters & Contracts', () => {
  const sampleDoc: FiscalDocumentDto = {
    id: 'doc_mock_123',
    organizationId: 'org_1',
    companyId: 'comp_1',
    companyName: 'Empresa Teste LTDA',
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

  it('deve registrar e recuperar o adapter Focus NFe, PlugNotas e Mock Provider no Registry', () => {
    const mockAdapter = FiscalProviderRegistry.get('MOCK_PROVIDER');
    expect(mockAdapter).toBeDefined();
    expect(mockAdapter.providerKey).toBe('MOCK_PROVIDER');

    const focusAdapter = FiscalProviderRegistry.get('FOCUS_NFE');
    expect(focusAdapter).toBeDefined();
    expect(focusAdapter.providerKey).toBe('FOCUS_NFE');

    const plugAdapter = FiscalProviderRegistry.get('PLUGNOTAS');
    expect(plugAdapter).toBeDefined();
    expect(plugAdapter.providerKey).toBe('PLUGNOTAS');
  });

  describe('MockFiscalProvider', () => {
    const provider = new MockFiscalProvider();

    it('deve retornar capacidades completas', async () => {
      const caps = await provider.getCapabilities();
      expect(caps.canEmit).toBe(true);
      expect(caps.canCancel).toBe(true);
      expect(caps.canFetchXml).toBe(true);
      expect(caps.canFetchPdf).toBe(true);
      expect(caps.supportedDocumentTypes).toContain(DocumentType.NFE);
    });

    it('deve autorizar com chave de 44 dígitos para valor padrão de R$ 100,00', async () => {
      const result = await provider.submitDocument({
        document: sampleDoc,
        companyCredentials: {},
        environment: FiscalEnvironment.HOMOLOGATION,
        idempotencyKey: 'idem_test_1',
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(DocumentStatus.AUTHORIZED);
      expect(result.accessKey).toHaveLength(44);
      expect(result.protocolNumber).toBeDefined();
    });

    it('deve simular rejeição cStat 204 quando o total for R$ 999,99', async () => {
      const docRejected = { ...sampleDoc, totalDocument: 999.99, totalProducts: 999.99 };
      const result = await provider.submitDocument({
        document: docRejected,
        companyCredentials: {},
        environment: FiscalEnvironment.HOMOLOGATION,
        idempotencyKey: 'idem_test_2',
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(DocumentStatus.REJECTED);
      expect(result.rejectionCode).toBe('204');
      expect(result.rejectionReason).toContain('Duplicidade');
    });

    it('deve rejeitar cancelamento com justificativa menor que 15 caracteres', async () => {
      const result = await provider.cancelDocument({
        documentId: 'doc_1',
        accessKey: '35261100000000000000550010000000011987654321',
        justification: 'Erro', // apenas 4 caracteres
        companyCredentials: {},
        environment: FiscalEnvironment.HOMOLOGATION,
      });

      expect(result.success).toBe(false);
      expect(result.rejectionCode).toBe('494');
    });

    it('deve cancelar com sucesso com justificativa válida (>= 15 caracteres)', async () => {
      const result = await provider.cancelDocument({
        documentId: 'doc_1',
        accessKey: '35261100000000000000550010000000011987654321',
        justification: 'Cancelamento por motivo de desistência da compra pelo cliente',
        companyCredentials: {},
        environment: FiscalEnvironment.HOMOLOGATION,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(DocumentStatus.CANCELLED);
      expect(result.cancellationProtocol).toBeDefined();
    });

    it('deve retornar XML assinado e PDF do DANFE sintéticos', async () => {
      const xmlRes = await provider.getXml({
        documentId: 'doc_1',
        fileType: 'XML',
        companyCredentials: {},
        environment: FiscalEnvironment.HOMOLOGATION,
      });
      expect(xmlRes.success).toBe(true);
      expect(xmlRes.contentBase64).toBeDefined();

      const pdfRes = await provider.getPdf({
        documentId: 'doc_1',
        fileType: 'PDF',
        companyCredentials: {},
        environment: FiscalEnvironment.HOMOLOGATION,
      });
      expect(pdfRes.success).toBe(true);
      expect(pdfRes.contentBase64).toBeDefined();
    });
  });

  describe('FocusNfeAdapter', () => {
    const provider = new FocusNfeAdapter();

    it('deve declarar suporte a NF-e, NFC-e e NFS-e nos ambientes de homologação e produção', async () => {
      const caps = await provider.getCapabilities();
      expect(caps.supportedDocumentTypes).toEqual([
        DocumentType.NFE,
        DocumentType.NFCE,
        DocumentType.NFSE,
      ]);
      expect(caps.supportedEnvironments).toEqual([
        FiscalEnvironment.HOMOLOGATION,
        FiscalEnvironment.PRODUCTION,
      ]);
    });
  });

  describe('PlugNotasAdapter', () => {
    const provider = new PlugNotasAdapter();

    it('deve declarar suporte a NF-e, NFC-e e NFS-e e retornar capacidades adequadas', async () => {
      const caps = await provider.getCapabilities();
      expect(caps.supportedDocumentTypes).toEqual([
        DocumentType.NFE,
        DocumentType.NFCE,
        DocumentType.NFSE,
      ]);
      expect(caps.canEmit).toBe(true);
      expect(caps.canCancel).toBe(true);
    });

    it('deve rejeitar submissão com erro de autenticação quando apiKey não for informada', async () => {
      const res = await provider.submitDocument({
        document: sampleDoc,
        companyCredentials: {},
        environment: FiscalEnvironment.HOMOLOGATION,
        idempotencyKey: 'test_no_key',
      });
      expect(res.success).toBe(false);
      expect(res.rejectionCode).toBe('PLUGNOTAS_AUTH_ERROR');
    });
  });
});

