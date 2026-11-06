import { describe, it, expect } from 'vitest';
import { FiscalDomainValidator } from '../index';
import { DocumentStatus, DocumentType, FiscalEnvironment, OperationType, FiscalDocumentDto } from '@opennfe/shared';

describe('FiscalDomainValidator', () => {
  const baseDocument: FiscalDocumentDto = {
    id: 'test_doc_1',
    organizationId: 'org_1',
    companyId: 'comp_1',
    companyName: 'Empresa Teste',
    customerId: 'cust_1',
    customerName: 'Cliente Teste',
    customerDocument: '12.345.678/0001-90',
    documentType: DocumentType.NFE,
    status: DocumentStatus.DRAFT,
    environment: FiscalEnvironment.HOMOLOGATION,
    series: 1,
    operationNature: 'VENDA DE MERCADORIA',
    operationType: OperationType.OUTBOUND,
    totalProducts: 100,
    totalDiscount: 0,
    totalIcms: 18,
    totalIpi: 0,
    totalPis: 1.65,
    totalCofins: 7.6,
    totalShipping: 0,
    totalDocument: 100,
    items: [
      {
        itemOrder: 1,
        code: 'PRD-01',
        description: 'Produto Teste A',
        ncm: '09012100',
        cfop: '5102',
        unit: 'UN',
        quantity: 1,
        unitPrice: 100,
        totalPrice: 100,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('deve validar com sucesso um documento com dados fiscais corretos', () => {
    const result = FiscalDomainValidator.validateForSubmission(baseDocument);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('deve rejeitar documento sem itens', () => {
    const invalidDoc = { ...baseDocument, items: [] };
    const result = FiscalDomainValidator.validateForSubmission(invalidDoc);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('O documento fiscal precisa de pelo menos 1 item.');
  });

  it('deve rejeitar documento com NCM inválido (diferente de 8 dígitos)', () => {
    const invalidDoc: FiscalDocumentDto = {
      ...baseDocument,
      items: [
        {
          itemOrder: 1,
          code: 'PRD-01',
          description: 'Produto Teste',
          ncm: '123',
          cfop: '5102',
          unit: 'UN',
          quantity: 1,
          unitPrice: 100,
          totalPrice: 100,
        },
      ],
    };
    const result = FiscalDomainValidator.validateForSubmission(invalidDoc);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('NCM'))).toBe(true);
  });

  it('deve rejeitar NF-e modelo 55 sem destinatário selecionado', () => {
    const invalidDoc: FiscalDocumentDto = {
      ...baseDocument,
      customerId: null,
      documentType: DocumentType.NFE,
    };
    const result = FiscalDomainValidator.validateForSubmission(invalidDoc);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'NF-e modelo 55 requer a seleção de um destinatário cadastrado.'
    );
  });
});

