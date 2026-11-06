import {
  CompanyDto,
  CustomerDto,
  DocumentStatus,
  DocumentType,
  FiscalDocumentDto,
  FiscalDocumentItemDto,
  FiscalEnvironment,
  OperationType,
  ProductDto,
  TaxRegime,
} from '@opennfe/shared';

/**
 * Dados fictícios usados SOMENTE no modo demonstração (quando a API não responde).
 * Nada aqui é enviado à SEFAZ. Documentos e CNPJs são gerados com dígitos
 * verificadores válidos, mas pertencem a empresas inexistentes.
 */

const ORG = 'org_demo';
const NOW = new Date();

function cnpjFrom(base12: string): string {
  const calc = (nums: string) => {
    let pos = nums.length - 7;
    let sum = 0;
    for (let i = nums.length; i >= 1; i--) {
      sum += Number(nums[nums.length - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = calc(base12);
  const d2 = calc(base12 + d1);
  const full = base12 + d1 + d2;
  return full.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function cpfFrom(base9: string): string {
  const calc = (nums: string) => {
    let sum = 0;
    for (let i = 0; i < nums.length; i++) sum += Number(nums[i]) * (nums.length + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const d1 = calc(base9);
  const d2 = calc(base9 + d1);
  const f = base9 + d1 + d2;
  return `${f.slice(0, 3)}.${f.slice(3, 6)}.${f.slice(6, 9)}-${f.slice(9)}`;
}

const stamp = (d = NOW) => d.toISOString();

export const DEMO_COMPANIES: CompanyDto[] = [
  {
    id: 'comp_1',
    organizationId: ORG,
    legalName: 'Horizonte Alimentos Ltda',
    tradeName: 'Horizonte Alimentos',
    cnpj: cnpjFrom('112223330001'),
    stateRegistration: '110.042.490.114',
    municipalRegistration: '4.521.887-3',
    cnae: '4639701',
    taxRegime: TaxRegime.SIMPLES_NACIONAL,
    environment: FiscalEnvironment.HOMOLOGATION,
    street: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    cityCode: '3550308',
    cityName: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    email: 'fiscal@horizontealimentos.example',
    phone: '(11) 3000-1000',
    isActive: true,
    createdAt: stamp(),
    updatedAt: stamp(),
  },
  {
    id: 'comp_2',
    organizationId: ORG,
    legalName: 'Horizonte Serviços Contábeis Ltda',
    tradeName: 'Horizonte Contábil',
    cnpj: cnpjFrom('445556660001'),
    stateRegistration: null,
    municipalRegistration: '2.118.904-0',
    cnae: '6920601',
    taxRegime: TaxRegime.LUCRO_PRESUMIDO,
    environment: FiscalEnvironment.HOMOLOGATION,
    street: 'Rua XV de Novembro',
    number: '250',
    neighborhood: 'Centro',
    cityCode: '4106902',
    cityName: 'Curitiba',
    state: 'PR',
    zipCode: '80020-310',
    email: 'contato@horizontecontabil.example',
    phone: '(41) 3200-2000',
    isActive: true,
    createdAt: stamp(),
    updatedAt: stamp(),
  },
  {
    id: 'comp_3',
    organizationId: ORG,
    legalName: 'Filial Sul Comércio de Bebidas Ltda',
    tradeName: 'Filial Sul Bebidas',
    cnpj: cnpjFrom('778889990001'),
    stateRegistration: '096/3345678',
    cnae: '4635499',
    taxRegime: TaxRegime.LUCRO_REAL,
    environment: FiscalEnvironment.PRODUCTION,
    street: 'Av. Borges de Medeiros',
    number: '800',
    neighborhood: 'Praia de Belas',
    cityCode: '4314902',
    cityName: 'Porto Alegre',
    state: 'RS',
    zipCode: '90110-150',
    email: 'nfe@filialsul.example',
    phone: '(51) 3100-3000',
    isActive: false,
    createdAt: stamp(),
    updatedAt: stamp(),
  },
];

const customerSeeds: [string, 'CPF' | 'CNPJ', string, string, string, string, string][] = [
  ['Mercado Bom Preço Ltda', 'CNPJ', '123450000100', 'Campinas', 'SP', '3509502', '13010-001'],
  ['Padaria Pão Quente ME', 'CNPJ', '234560000100', 'Santos', 'SP', '3548500', '11010-001'],
  ['Restaurante Sabor da Serra', 'CNPJ', '345670000100', 'Gramado', 'RS', '4309100', '95670-000'],
  ['Maria das Graças Oliveira', 'CPF', '123456789', 'São Paulo', 'SP', '3550308', '01310-200'],
  ['João Pedro Almeida', 'CPF', '234567891', 'Curitiba', 'PR', '4106902', '80010-000'],
  ['Cafeteria Grão Dourado Ltda', 'CNPJ', '456780000100', 'Belo Horizonte', 'MG', '3106200', '30130-000'],
  ['Hotel Vista Mar S.A.', 'CNPJ', '567890000100', 'Florianópolis', 'SC', '4205407', '88010-000'],
  ['Ana Beatriz Costa', 'CPF', '345678912', 'Rio de Janeiro', 'RJ', '3304557', '20040-020'],
  ['Distribuidora Norte Sul Ltda', 'CNPJ', '678900000100', 'Goiânia', 'GO', '5208707', '74000-000'],
  ['Escola Aprender Mais', 'CNPJ', '789010000100', 'Londrina', 'PR', '4113700', '86010-000'],
  ['Carlos Eduardo Ferreira', 'CPF', '456789123', 'Porto Alegre', 'RS', '4314902', '90010-000'],
  ['Supermercado Família Ltda', 'CNPJ', '890120000100', 'Ribeirão Preto', 'SP', '3543402', '14010-000'],
  ['Clínica Vida Plena', 'CNPJ', '901230000100', 'Salvador', 'BA', '2927408', '40020-000'],
  ['Fernanda Lima Souza', 'CPF', '567891234', 'Recife', 'PE', '2611606', '50010-000'],
];

export const DEMO_CUSTOMERS: CustomerDto[] = customerSeeds.map(
  ([name, type, base, city, uf, cityCode, zip], i) => ({
    id: `cust_${i + 1}`,
    organizationId: ORG,
    documentType: type,
    documentNumber: type === 'CNPJ' ? cnpjFrom(base) : cpfFrom(base),
    name,
    email: `contato${i + 1}@exemplo.example`,
    phone: `(${11 + i}) 9${8000 + i * 37}-${1000 + i * 91}`,
    ie: type === 'CNPJ' ? `${100000000 + i * 1234567}` : null,
    ieIndicator: type === 'CNPJ' ? '1' : '9',
    street: 'Rua das Palmeiras',
    number: String(100 + i * 7),
    neighborhood: 'Centro',
    cityCode,
    cityName: city,
    state: uf,
    zipCode: zip,
    createdAt: stamp(),
    updatedAt: stamp(),
  })
);

const productSeeds: [string, string, string, string, string, number][] = [
  ['ALIM-001', 'Café Torrado e Moído Especial 500g', '09012100', '5102', 'UN', 28.5],
  ['ALIM-002', 'Açúcar Cristal 5kg', '17019900', '5102', 'UN', 24.9],
  ['ALIM-003', 'Arroz Agulhinha Tipo 1 5kg', '10063021', '5102', 'UN', 31.9],
  ['ALIM-004', 'Feijão Carioca 1kg', '07133319', '5102', 'UN', 8.9],
  ['ALIM-005', 'Óleo de Soja 900ml', '15079011', '5102', 'UN', 7.49],
  ['BEB-001', 'Suco de Laranja Integral 1L', '20091200', '5102', 'UN', 12.5],
  ['BEB-002', 'Água Mineral sem Gás 500ml (caixa 12un)', '22011000', '5102', 'CX', 18.0],
  ['BEB-003', 'Refrigerante Cola 2L', '22021000', '5405', 'UN', 9.9],
  ['SERV-001', 'Consultoria Contábil Mensal', '00000000', '5933', 'MES', 1500.0],
  ['SERV-002', 'Hora Técnica de Suporte Fiscal', '00000000', '5933', 'HR', 180.0],
  ['EMB-001', 'Caixa de Papelão 40x30x20', '48191000', '5101', 'UN', 3.2],
  ['LIMP-001', 'Detergente Neutro 500ml', '34022000', '5102', 'UN', 2.9],
];

export const DEMO_PRODUCTS: ProductDto[] = productSeeds.map(
  ([code, description, ncm, cfop, unit, price], i) => ({
    id: `prod_${i + 1}`,
    organizationId: ORG,
    code,
    description,
    ncm,
    cfopDefault: cfop,
    unit,
    unitPrice: price,
    origin: '0',
    csosn: '102',
    cstIcms: null,
    createdAt: stamp(),
    updatedAt: stamp(),
  })
);

/** Calcula a chave de acesso de 44 dígitos (com DV módulo 11) para a demonstração. */
export function demoAccessKey(uf: string, cnpjDigits: string, model: string, series: number, number: number, seed: number): string {
  const ufCode: Record<string, string> = { SP: '35', PR: '41', RS: '43', RJ: '33', MG: '31' };
  const body =
    (ufCode[uf] ?? '35') +
    '2611' +
    cnpjDigits +
    model +
    String(series).padStart(3, '0') +
    String(number).padStart(9, '0') +
    '1' +
    String(10000000 + seed).slice(-8);
  let sum = 0;
  let weight = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const r = sum % 11;
  const dv = r < 2 ? 0 : 11 - r;
  return body + dv;
}

const STATUS_CYCLE: DocumentStatus[] = [
  DocumentStatus.AUTHORIZED,
  DocumentStatus.AUTHORIZED,
  DocumentStatus.AUTHORIZED,
  DocumentStatus.AUTHORIZED,
  DocumentStatus.REJECTED,
  DocumentStatus.AUTHORIZED,
  DocumentStatus.DRAFT,
  DocumentStatus.AUTHORIZED,
  DocumentStatus.CANCELLED,
  DocumentStatus.PROCESSING,
];

function buildItems(seed: number, products: ProductDto[]): FiscalDocumentItemDto[] {
  const count = (seed % 3) + 1;
  return Array.from({ length: count }, (_, i) => {
    const p = products[(seed + i * 3) % products.length];
    const quantity = ((seed + i) % 5) + 1;
    const total = Math.round(quantity * p.unitPrice * 100) / 100;
    const isService = p.unit === 'MES' || p.unit === 'HR';
    const icmsRate = isService ? 0 : 18;
    return {
      itemOrder: i + 1,
      code: p.code,
      description: p.description,
      ncm: p.ncm,
      cfop: p.cfopDefault,
      unit: p.unit,
      quantity,
      unitPrice: p.unitPrice,
      totalPrice: total,
      icmsCst: p.csosn ?? '102',
      icmsBase: 0,
      icmsRate,
      icmsValue: 0,
      pisValue: 0,
      cofinsValue: 0,
    };
  });
}

export function buildDemoDocuments(): FiscalDocumentDto[] {
  const companies = DEMO_COMPANIES.filter((c) => c.isActive);
  const types = [DocumentType.NFE, DocumentType.NFE, DocumentType.NFCE, DocumentType.NFE, DocumentType.NFSE];
  return Array.from({ length: 42 }, (_, i) => {
    const company = companies[i % companies.length];
    const customer = DEMO_CUSTOMERS[(i * 5) % DEMO_CUSTOMERS.length];
    const status = STATUS_CYCLE[i % STATUS_CYCLE.length];
    const type = company.id === 'comp_2' ? DocumentType.NFSE : types[i % types.length] === DocumentType.NFSE ? DocumentType.NFE : types[i % types.length];
    const items = buildItems(i + 1, DEMO_PRODUCTS.filter((p) => (type === DocumentType.NFSE ? p.unit === 'MES' || p.unit === 'HR' : p.unit !== 'MES' && p.unit !== 'HR')));
    const totalProducts = Math.round(items.reduce((s, it) => s + it.totalPrice, 0) * 100) / 100;
    const created = new Date(NOW.getTime() - (i * 19 + 3) * 3_600_000);
    const hasNumber = status !== DocumentStatus.DRAFT;
    const number = hasNumber ? 1200 - i : null;
    const model = type === DocumentType.NFCE ? '65' : '55';
    const authorized = status === DocumentStatus.AUTHORIZED || status === DocumentStatus.CANCELLED;
    const cnpj = company.cnpj.replace(/\D/g, '');
    return {
      id: `doc_${i + 1}`,
      organizationId: ORG,
      companyId: company.id,
      companyName: company.tradeName,
      customerId: type === DocumentType.NFCE && i % 2 ? null : customer.id,
      customerName: type === DocumentType.NFCE && i % 2 ? null : customer.name,
      customerDocument: type === DocumentType.NFCE && i % 2 ? null : customer.documentNumber,
      documentType: type,
      status,
      environment: company.environment,
      series: 1,
      number,
      accessKey: authorized && number ? demoAccessKey(company.state, cnpj, model, 1, number, i * 7919) : null,
      protocolNumber: authorized ? `1352600${String(100000 + i * 37).slice(-6)}` : null,
      authorizedAt: authorized ? created.toISOString() : null,
      operationNature: type === DocumentType.NFSE ? 'PRESTAÇÃO DE SERVIÇO' : 'VENDA DE MERCADORIA',
      operationType: OperationType.OUTBOUND,
      totalProducts,
      totalDiscount: 0,
      totalIcms: 0,
      totalIpi: 0,
      totalPis: 0,
      totalCofins: 0,
      totalShipping: 0,
      totalDocument: totalProducts,
      providerKey: 'mock',
      xmlUrl: authorized ? `/api/v1/documents/doc_${i + 1}/xml` : null,
      pdfUrl: authorized ? `/api/v1/documents/doc_${i + 1}/pdf` : null,
      rejectionCode: status === DocumentStatus.REJECTED ? '539' : null,
      rejectionReason:
        status === DocumentStatus.REJECTED
          ? 'Rejeição 539: duplicidade de NF-e com diferença na chave de acesso.'
          : null,
      items,
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
    } satisfies FiscalDocumentDto;
  });
}
