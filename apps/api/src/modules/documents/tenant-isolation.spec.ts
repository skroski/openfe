import { describe, it, expect, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CompaniesService } from '../companies/companies.service';
import { FiscalQueueService } from '../queue/fiscal-queue.service';
import { DocumentStatus, DocumentType } from '@opennfe/shared';

describe('Multi-Tenant Data Isolation - DocumentsService', () => {
  let documentsService: DocumentsService;
  let companiesService: CompaniesService;
  let queueService: FiscalQueueService;

  const TENANT_A = 'tenant_alpha_1111';
  const TENANT_B = 'tenant_beta_2222';
  let companyAId: string;
  let companyBId: string;

  beforeEach(async () => {
    companiesService = new CompaniesService();
    queueService = new FiscalQueueService();
    documentsService = new DocumentsService(companiesService, queueService);

    const compA = await companiesService.create(TENANT_A, {
      legalName: 'Alpha Corporation LTDA',
      cnpj: '11.111.111/0001-11',
    });
    companyAId = compA.id;

    const compB = await companiesService.create(TENANT_B, {
      legalName: 'Beta Enterprises LTDA',
      cnpj: '22.222.222/0001-22',
    });
    companyBId = compB.id;
  });

  it('Tenant A should not list documents belonging to Tenant B', async () => {
    // Create draft for Tenant A
    const docA = await documentsService.createDraft(TENANT_A, {
      companyId: companyAId,
      operationNature: 'VENDA MERCADORIA TENANT A',
      documentType: DocumentType.NFE,
      items: [
        {
          itemOrder: 1,
          code: 'PROD-A',
          description: 'Produto A',
          ncm: '0901.21.00',
          cfop: '5102',
          unit: 'UN',
          quantity: 1,
          unitPrice: 100,
          totalPrice: 100,
          icmsCst: '102',
        },
      ],
    });

    // Create draft for Tenant B
    const docB = await documentsService.createDraft(TENANT_B, {
      companyId: companyBId,
      operationNature: 'VENDA MERCADORIA TENANT B',
      documentType: DocumentType.NFE,
      items: [
        {
          itemOrder: 1,
          code: 'PROD-B',
          description: 'Produto B',
          ncm: '0901.21.00',
          cfop: '5102',
          unit: 'UN',
          quantity: 1,
          unitPrice: 200,
          totalPrice: 200,
          icmsCst: '102',
        },
      ],
    });

    const listA = await documentsService.list(TENANT_A);
    const listB = await documentsService.list(TENANT_B);

    expect(listA.some((d) => d.id === docA.id)).toBe(true);
    expect(listA.some((d) => d.id === docB.id)).toBe(false);

    expect(listB.some((d) => d.id === docB.id)).toBe(true);
    expect(listB.some((d) => d.id === docA.id)).toBe(false);
  });

  it('Tenant A cannot retrieve document belonging to Tenant B by ID (throws NotFoundException)', async () => {
    const docB = await documentsService.createDraft(TENANT_B, {
      companyId: companyBId,
      operationNature: 'CONFIDENTIAL SALE B',
      documentType: DocumentType.NFE,
    });

    // Tenant B can retrieve it
    const retrievedByB = await documentsService.getById(TENANT_B, docB.id);
    expect(retrievedByB.id).toBe(docB.id);

    // Tenant A attempts to access Tenant B's document
    await expect(documentsService.getById(TENANT_A, docB.id)).rejects.toThrow(
      NotFoundException
    );
  });

  it('Tenant A cannot submit or process a document belonging to Tenant B', async () => {
    const docB = await documentsService.createDraft(TENANT_B, {
      companyId: companyBId,
      operationNature: 'VENDA DE B',
      documentType: DocumentType.NFE,
      items: [
        {
          itemOrder: 1,
          code: 'P-1',
          description: 'Produto',
          ncm: '0901.21.00',
          cfop: '5102',
          unit: 'UN',
          quantity: 1,
          unitPrice: 50,
          totalPrice: 50,
          icmsCst: '102',
        },
      ],
    });

    await expect(
      documentsService.submit(TENANT_A, docB.id, 'idemp_malicious_leak_attempt')
    ).rejects.toThrow(NotFoundException);
  });

  it('Tenant A cannot cancel or inspect files of Tenant B', async () => {
    const docB = await documentsService.createDraft(TENANT_B, {
      companyId: companyBId,
      operationNature: 'VENDA DE B',
      documentType: DocumentType.NFE,
    });

    await expect(
      documentsService.cancel(TENANT_A, docB.id, 'Cancelamento indevido')
    ).rejects.toThrow(NotFoundException);

    await expect(documentsService.getXml(TENANT_A, docB.id)).rejects.toThrow(
      NotFoundException
    );

    await expect(documentsService.getPdf(TENANT_A, docB.id)).rejects.toThrow(
      NotFoundException
    );
  });
});
