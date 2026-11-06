import { describe, it, expect, beforeEach } from 'vitest';
import { ImportsService } from './imports.service';
import { DocumentsService } from '../documents/documents.service';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';
import { CompaniesService } from '../companies/companies.service';
import { FiscalQueueService } from '../queue/fiscal-queue.service';
import { DocumentStatus, OperationType } from '@opennfe/shared';

describe('ImportsService - XML Processing and Auto-Registration', () => {
  let importsService: ImportsService;
  let documentsService: DocumentsService;
  let productsService: ProductsService;
  let customersService: CustomersService;
  let companiesService: CompaniesService;
  let queueService: FiscalQueueService;

  const validXml = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe35261112345678000190550010000010421000001042" versao="4.00">
      <ide>
        <mod>55</mod>
        <serie>1</serie>
        <nNF>1042</nNF>
        <natOp>VENDA DE MERCADORIA</natOp>
        <dhEmi>2026-11-03T10:00:00-03:00</dhEmi>
        <tpNF>1</tpNF>
      </ide>
      <emit>
        <CNPJ>55555555000155</CNPJ>
        <xNome>FORNECEDOR AUTOMATICO BRASIL LTDA</xNome>
        <IE>123456789</IE>
      </emit>
      <dest>
        <CNPJ>98765432000110</CNPJ>
        <xNome>CLIENTE DESTINO LTDA</xNome>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>PROD-AUTO-99</cProd>
          <xProd>Produto Auto Cadastrado</xProd>
          <NCM>84713012</NCM>
          <CFOP>5102</CFOP>
          <uCom>UN</uCom>
          <qCom>2.0000</qCom>
          <vUnCom>150.0000</vUnCom>
          <vProd>300.00</vProd>
        </prod>
        <imposto>
          <ICMS><ICMS00><orig>0</orig><CST>00</CST><vBC>300.00</vBC><vICMS>54.00</vICMS></ICMS00></ICMS>
        </imposto>
      </det>
      <total>
        <ICMSTot><vProd>300.00</vProd><vNF>300.00</vNF><vICMS>54.00</vICMS></ICMSTot>
      </total>
    </infNFe>
  </NFe>
</nfeProc>`;

  beforeEach(() => {
    companiesService = new CompaniesService();
    queueService = new FiscalQueueService();
    documentsService = new DocumentsService(companiesService, queueService);
    productsService = new ProductsService();
    customersService = new CustomersService();

    importsService = new ImportsService(
      documentsService,
      productsService,
      customersService,
      companiesService
    );
  });

  it('deve importar XML, salvar documento de entrada e cadastrar novos produtos/fornecedores', async () => {
    const res = await importsService.processXmlImport(
      'default-tenant-uuid',
      'comp_1',
      validXml,
      { autoRegisterProducts: true, autoRegisterEntities: true }
    );

    expect(res.document).toBeDefined();
    expect(res.document.accessKey).toBe('35261112345678000190550010000010421000001042');
    expect(res.document.operationType).toBe(OperationType.INBOUND);
    expect(res.document.status).toBe(DocumentStatus.AUTHORIZED);
    expect(res.productsCreatedCount).toBe(1);
    expect(res.customerCreated).toBe(true);

    // Verifica se produto foi inserido no catálogo de produtos
    const products = await productsService.list('default-tenant-uuid');
    const importedProd = products.find((p) => p.code === 'PROD-AUTO-99');
    expect(importedProd).toBeDefined();
    expect(importedProd?.description).toBe('Produto Auto Cadastrado');

    // Verifica se fornecedor foi inserido na base de clientes/entidades
    const customers = await customersService.list('default-tenant-uuid');
    const importedSupplier = customers.find((c) => c.documentNumber === '55555555000155');
    expect(importedSupplier).toBeDefined();
    expect(importedSupplier?.name).toBe('FORNECEDOR AUTOMATICO BRASIL LTDA');
  });
});

