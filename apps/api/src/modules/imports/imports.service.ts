import { Injectable, BadRequestException } from '@nestjs/common';
import { NfeXmlParser } from '@opennfe/fiscal';
import { FiscalDocumentDto, DocumentType } from '@opennfe/shared';
import { DocumentsService } from '../documents/documents.service';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';
import { CompaniesService } from '../companies/companies.service';

export interface ImportXmlResult {
  document: FiscalDocumentDto;
  productsCreatedCount: number;
  customerCreated: boolean;
  message: string;
}

@Injectable()
export class ImportsService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
    private readonly companiesService: CompaniesService
  ) {}

  previewXml(xmlContent: string) {
    try {
      return NfeXmlParser.parse(xmlContent);
    } catch (err: any) {
      throw new BadRequestException(`Erro ao processar estrutura do XML: ${err.message}`);
    }
  }

  async processXmlImport(
    tenantId: string,
    companyId: string,
    xmlContent: string,
    options?: { autoRegisterProducts?: boolean; autoRegisterEntities?: boolean }
  ): Promise<ImportXmlResult> {
    const company = await this.companiesService.getById(tenantId, companyId);
    const parsed = this.previewXml(xmlContent);

    // 1. Converter para Documento Fiscal Interno
    const fiscalDoc = NfeXmlParser.toFiscalDocument(parsed, tenantId, company.id);

    let customerCreated = false;
    let productsCreatedCount = 0;

    // 2. Auto-cadastrar destinatário/fornecedor se solicitado (default true)
    if (options?.autoRegisterEntities !== false && parsed.issuer.document) {
      const existingCustomers = await this.customersService.list(tenantId);
      const cleanDoc = parsed.issuer.document.replace(/\D/g, '');
      const found = existingCustomers.find(
        (c) => c.documentNumber.replace(/\D/g, '') === cleanDoc
      );

      if (!found) {
        await this.customersService.create(tenantId, {
          name: parsed.issuer.legalName,
          documentNumber: parsed.issuer.document,
          documentType: parsed.issuer.document.length === 14 ? 'CNPJ' : 'CPF',
          ie: parsed.issuer.stateRegistration,
          street: parsed.issuer.street,
          number: parsed.issuer.number,
          neighborhood: parsed.issuer.neighborhood,
          cityCode: parsed.issuer.cityCode,
          cityName: parsed.issuer.cityName,
          state: parsed.issuer.state,
          zipCode: parsed.issuer.zipCode,
        });
        customerCreated = true;
      }
    }

    // 3. Auto-cadastrar produtos do catálogo se solicitado
    if (options?.autoRegisterProducts !== false && parsed.items.length > 0) {
      const existingProducts = await this.productsService.list(tenantId);
      for (const item of parsed.items) {
        const found = existingProducts.find(
          (p) => p.code.toLowerCase() === item.code.toLowerCase()
        );

        if (!found) {
          await this.productsService.create(tenantId, {
            code: item.code,
            description: item.description,
            ncm: item.ncm,
            cfopDefault: item.cfop,
            unit: item.unit,
            unitPrice: item.unitPrice,
            cstIcms: item.icmsCst || '102',
          });
          productsCreatedCount++;
        }
      }
    }

    // 4. Salvar o documento importado
    const saved = await this.documentsService.saveImportedDocument(tenantId, fiscalDoc);

    return {
      document: saved,
      productsCreatedCount,
      customerCreated,
      message: `XML importado com sucesso. Chave: ${saved.accessKey}. ${productsCreatedCount} novos produtos cadastrados.`,
    };
  }
}

