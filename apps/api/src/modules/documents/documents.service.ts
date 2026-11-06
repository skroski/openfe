import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  FiscalDocumentDto,
  DocumentStatus,
  DocumentType,
  FiscalEnvironment,
  OperationType,
} from '@opennfe/shared';
import { FiscalDomainValidator } from '@opennfe/fiscal';
import { FiscalProviderRegistry } from '@opennfe/providers';
import { CompaniesService } from '../companies/companies.service';
import { FiscalQueueService } from '../queue/fiscal-queue.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly fiscalQueueService: FiscalQueueService
  ) {}

  private documents: Map<string, FiscalDocumentDto> = new Map([
    [
      'doc_1',
      {
        id: 'doc_1',
        organizationId: 'default-tenant-uuid',
        companyId: 'comp_1',
        companyName: 'Matriz São Paulo Comércio de Alimentos LTDA',
        customerId: 'cust_1',
        customerName: 'Supermercados Alvorada LTDA',
        customerDocument: '98.765.432/0001-10',
        documentType: DocumentType.NFE,
        status: DocumentStatus.AUTHORIZED,
        environment: FiscalEnvironment.HOMOLOGATION,
        series: 1,
        number: 1042,
        accessKey: '35261112345678000190550010000010421000001042',
        protocolNumber: '135260012345678',
        authorizedAt: new Date(Date.now() - 3600000).toISOString(),
        operationNature: 'VENDA DE MERCADORIA',
        operationType: OperationType.OUTBOUND,
        totalProducts: 1425.0,
        totalDiscount: 0,
        totalIcms: 256.5,
        totalIpi: 0,
        totalPis: 23.51,
        totalCofins: 108.3,
        totalShipping: 0,
        totalDocument: 1425.0,
        providerKey: 'FOCUS_NFE',
        externalReference: 'doc_1',
        xmlUrl: '/api/v1/documents/doc_1/xml',
        pdfUrl: '/api/v1/documents/doc_1/pdf',
        items: [
          {
            itemOrder: 1,
            code: 'ALIM-001',
            description: 'Café Torrado e Moído Especial 500g',
            ncm: '0901.21.00',
            cfop: '5102',
            unit: 'UN',
            quantity: 50,
            unitPrice: 28.5,
            totalPrice: 1425.0,
            icmsCst: '102',
          },
        ],
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    [
      'doc_2',
      {
        id: 'doc_2',
        organizationId: 'default-tenant-uuid',
        companyId: 'comp_1',
        companyName: 'Matriz São Paulo Comércio de Alimentos LTDA',
        customerId: 'cust_2',
        customerName: 'Carlos Eduardo Oliveira',
        customerDocument: '123.456.789-00',
        documentType: DocumentType.NFE,
        status: DocumentStatus.REJECTED,
        environment: FiscalEnvironment.HOMOLOGATION,
        series: 1,
        number: 1043,
        operationNature: 'VENDA DE MERCADORIA CONSUMIDOR FINAL',
        operationType: OperationType.OUTBOUND,
        totalProducts: 42.0,
        totalDiscount: 0,
        totalIcms: 0,
        totalIpi: 0,
        totalPis: 0,
        totalCofins: 0,
        totalShipping: 0,
        totalDocument: 42.0,
        providerKey: 'FOCUS_NFE',
        externalReference: 'doc_2',
        rejectionCode: '204',
        rejectionReason: 'Rejeicao: Duplicidade de NF-e [chNFe: 35261112345678000190550010000010431000001043]',
        items: [
          {
            itemOrder: 1,
            code: 'ALIM-002',
            description: 'Azeite de Oliva Extra Virgem 500ml',
            ncm: '1509.10.00',
            cfop: '5102',
            unit: 'UN',
            quantity: 1,
            unitPrice: 42.0,
            totalPrice: 42.0,
            icmsCst: '102',
          },
        ],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3500000).toISOString(),
      },
    ],
    [
      'doc_3',
      {
        id: 'doc_3',
        organizationId: 'default-tenant-uuid',
        companyId: 'comp_2',
        companyName: 'Filial Campinas Distribuidora LTDA',
        customerId: 'cust_1',
        customerName: 'Supermercados Alvorada LTDA',
        customerDocument: '98.765.432/0001-10',
        documentType: DocumentType.NFE,
        status: DocumentStatus.DRAFT,
        environment: FiscalEnvironment.HOMOLOGATION,
        series: 1,
        operationNature: 'REMESSA PARA DEMONSTRAÇÃO',
        operationType: OperationType.OUTBOUND,
        totalProducts: 570.0,
        totalDiscount: 0,
        totalIcms: 0,
        totalIpi: 0,
        totalPis: 0,
        totalCofins: 0,
        totalShipping: 0,
        totalDocument: 570.0,
        items: [
          {
            itemOrder: 1,
            code: 'ALIM-001',
            description: 'Café Torrado e Moído Especial 500g',
            ncm: '0901.21.00',
            cfop: '5912',
            unit: 'UN',
            quantity: 20,
            unitPrice: 28.5,
            totalPrice: 570.0,
            icmsCst: '102',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  async list(
    tenantId: string,
    filters?: { companyId?: string; status?: DocumentStatus; type?: DocumentType }
  ): Promise<FiscalDocumentDto[]> {
    return Array.from(this.documents.values()).filter((doc) => {
      if (doc.organizationId !== tenantId) return false;
      if (filters?.companyId && doc.companyId !== filters.companyId) return false;
      if (filters?.status && doc.status !== filters.status) return false;
      if (filters?.type && doc.documentType !== filters.type) return false;
      return true;
    });
  }

  async getById(tenantId: string, id: string): Promise<FiscalDocumentDto> {
    const doc = this.documents.get(id);
    if (!doc || doc.organizationId !== tenantId) {
      throw new NotFoundException(`Documento ${id} não encontrado.`);
    }
    return doc;
  }

  async createDraft(
    tenantId: string,
    data: Partial<FiscalDocumentDto>
  ): Promise<FiscalDocumentDto> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const company = await this.companiesService.getById(tenantId, data.companyId || 'comp_1');

    const totalProducts = (data.items || []).reduce((acc, it) => acc + (it.totalPrice || 0), 0);

    const newDoc: FiscalDocumentDto = {
      id,
      organizationId: tenantId,
      companyId: company.id,
      companyName: company.legalName,
      customerId: data.customerId || null,
      customerName: data.customerName || null,
      customerDocument: data.customerDocument || null,
      documentType: data.documentType || DocumentType.NFE,
      status: DocumentStatus.DRAFT,
      environment: company.environment,
      series: data.series || 1,
      operationNature: data.operationNature || 'VENDA DE MERCADORIA',
      operationType: data.operationType || OperationType.OUTBOUND,
      totalProducts,
      totalDiscount: data.totalDiscount || 0,
      totalIcms: data.totalIcms || 0,
      totalIpi: data.totalIpi || 0,
      totalPis: data.totalPis || 0,
      totalCofins: data.totalCofins || 0,
      totalShipping: data.totalShipping || 0,
      totalDocument: totalProducts,
      items: data.items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.documents.set(id, newDoc);
    return newDoc;
  }

  async saveImportedDocument(
    tenantId: string,
    doc: FiscalDocumentDto
  ): Promise<FiscalDocumentDto> {
    doc.organizationId = tenantId;
    this.documents.set(doc.id, doc);
    return doc;
  }

  async validate(tenantId: string, id: string) {
    const doc = await this.getById(tenantId, id);
    const result = FiscalDomainValidator.validateForSubmission(doc);
    if (result.valid && doc.status === DocumentStatus.DRAFT) {
      doc.status = DocumentStatus.VALIDATED;
      doc.updatedAt = new Date().toISOString();
      this.documents.set(id, doc);
    }
    return result;
  }

  async submit(tenantId: string, id: string, idempotencyKey: string): Promise<FiscalDocumentDto> {
    const doc = await this.getById(tenantId, id);

    // 1. Domain Validation
    const validation = FiscalDomainValidator.validateForSubmission(doc);
    if (!validation.valid) {
      throw new BadRequestException({
        message: 'Falha na validação de regras de domínio fiscal.',
        errors: validation.errors,
      });
    }

    // 2. Resolve Company Provider Configuration
    const providerConfig = await this.companiesService.getProviderConfig(tenantId, doc.companyId);
    const providerKey = providerConfig.providerKey || 'MOCK_PROVIDER';

    // 3. Resolve Provider Adapter via Factory
    const adapter = FiscalProviderRegistry.get(providerKey);

    // 4. Update status to QUEUED / PROCESSING
    doc.status = DocumentStatus.PROCESSING;
    doc.providerKey = providerKey;
    doc.updatedAt = new Date().toISOString();
    this.documents.set(id, doc);

    // 5. Submit through Fiscal Queue Engine (Idempotent + Backoff + Audit)
    const result = await this.fiscalQueueService.processIssuance({
      tenantId,
      document: doc,
      providerKey,
      companyCredentials: {
        token: providerConfig.token || 'mock_token',
      },
      idempotencyKey: idempotencyKey || `idem_${id}_${Date.now()}`,
    });

    // 6. Update document with provider result
    doc.status = result.status;
    if (result.accessKey) doc.accessKey = result.accessKey;
    if (result.protocolNumber) doc.protocolNumber = result.protocolNumber;
    if (result.authorizedAt) doc.authorizedAt = result.authorizedAt.toISOString();
    if (result.rejectionCode) doc.rejectionCode = result.rejectionCode;
    if (result.rejectionReason) doc.rejectionReason = result.rejectionReason;
    if (result.externalReference) doc.externalReference = result.externalReference;
    if (result.externalId) doc.externalId = result.externalId;
    doc.xmlUrl = `/api/v1/documents/${id}/xml`;
    doc.pdfUrl = `/api/v1/documents/${id}/pdf`;
    doc.updatedAt = new Date().toISOString();

    this.documents.set(id, doc);
    return doc;
  }

  async cancel(
    tenantId: string,
    id: string,
    justification: string
  ): Promise<FiscalDocumentDto> {
    const doc = await this.getById(tenantId, id);

    if (doc.status !== DocumentStatus.AUTHORIZED) {
      throw new BadRequestException('Apenas documentos AUTORIZADOS podem ser cancelados.');
    }

    const providerConfig = await this.companiesService.getProviderConfig(tenantId, doc.companyId);
    const adapter = FiscalProviderRegistry.get(doc.providerKey || 'MOCK_PROVIDER');

    const result = await adapter.cancelDocument({
      documentId: id,
      accessKey: doc.accessKey || '',
      protocolNumber: doc.protocolNumber || '',
      justification,
      companyCredentials: { token: providerConfig.token || 'mock_token' },
      environment: doc.environment,
    });

    if (!result.success) {
      throw new BadRequestException({
        message: 'Rejeição no cancelamento junto ao provedor/SEFAZ.',
        rejectionCode: result.rejectionCode,
        rejectionReason: result.rejectionReason,
      });
    }

    doc.status = DocumentStatus.CANCELLED;
    doc.updatedAt = new Date().toISOString();
    this.documents.set(id, doc);
    return doc;
  }

  async getXml(tenantId: string, id: string) {
    const doc = await this.getById(tenantId, id);
    const adapter = FiscalProviderRegistry.get(doc.providerKey || 'MOCK_PROVIDER');
    return adapter.getXml({
      documentId: id,
      accessKey: doc.accessKey || undefined,
      externalReference: doc.externalReference || id,
      fileType: 'XML',
      companyCredentials: {},
      environment: doc.environment,
    });
  }

  async getPdf(tenantId: string, id: string) {
    const doc = await this.getById(tenantId, id);
    const adapter = FiscalProviderRegistry.get(doc.providerKey || 'MOCK_PROVIDER');
    return adapter.getPdf({
      documentId: id,
      accessKey: doc.accessKey || undefined,
      externalReference: doc.externalReference || id,
      fileType: 'PDF',
      companyCredentials: {},
      environment: doc.environment,
    });
  }

  async getDashboardKpis(tenantId: string) {
    const all = await this.list(tenantId);
    const authorized = all.filter((d) => d.status === DocumentStatus.AUTHORIZED);
    const rejected = all.filter((d) => d.status === DocumentStatus.REJECTED);
    const pending = all.filter((d) => [DocumentStatus.DRAFT, DocumentStatus.VALIDATED, DocumentStatus.QUEUED, DocumentStatus.PROCESSING].includes(d.status));

    const totalValue = authorized.reduce((acc, d) => acc + (Number(d.totalDocument) || 0), 0);

    return {
      totalDocuments: all.length,
      authorizedCount: authorized.length,
      rejectedCount: rejected.length,
      pendingCount: pending.length,
      totalAuthorizedValue: totalValue,
      approvalRate: all.length > 0 ? Math.round((authorized.length / all.length) * 100) : 100,
    };
  }
}

