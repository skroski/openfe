import {
  DocumentType,
  DocumentStatus,
  FiscalEnvironment,
  OperationType,
  FiscalDocumentDto,
  FiscalDocumentItemDto,
} from '@opennfe/shared';

export interface ParsedNfeParty {
  document: string; // CNPJ or CPF
  legalName: string;
  tradeName?: string;
  stateRegistration?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  cityCode?: string;
  cityName?: string;
  state?: string;
  zipCode?: string;
}

export interface ParsedNfeItem {
  itemOrder: number;
  code: string;
  description: string;
  ncm: string;
  cfop: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  icmsCst?: string;
  icmsBase?: number;
  icmsValue?: number;
  pisValue?: number;
  cofinsValue?: number;
}

export interface ParsedNfeDocument {
  accessKey: string;
  series: number;
  number: number;
  model: string;
  operationNature: string;
  issuedAt: string;
  operationType: OperationType;
  issuer: ParsedNfeParty;
  recipient: ParsedNfeParty;
  items: ParsedNfeItem[];
  totalProducts: number;
  totalDocument: number;
  totalIcms: number;
  totalPis: number;
  totalCofins: number;
  totalShipping: number;
  totalDiscount: number;
  protocolNumber?: string;
  authorizedAt?: string;
}

/**
 * Robust SEFAZ NF-e (Model 55/65) XML Parser
 * Extracts all relevant tags without external dependencies.
 */
export class NfeXmlParser {
  private static getTagValue(xml: string, tag: string): string {
    const regex = new RegExp(`<(?:\\w+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
  }

  private static getTagBlock(xml: string, tag: string): string {
    const regex = new RegExp(`<(?:\\w+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1] : '';
  }

  private static getAllTagBlocks(xml: string, tag: string): string[] {
    const regex = new RegExp(`<(?:\\w+:)?${tag}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/(?:\\w+:)?${tag}>`, 'gi');
    const blocks: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(xml)) !== null) {
      blocks.push(match[1]);
    }
    return blocks;
  }

  public static parse(xmlContent: string): ParsedNfeDocument {
    if (!xmlContent || !xmlContent.includes('<infNFe')) {
      throw new Error('Conteúdo XML inválido ou não é uma NF-e/NFC-e padrão SEFAZ.');
    }

    // 1. Chave de acesso e Identificação
    const infNFeBlock = this.getTagBlock(xmlContent, 'infNFe');
    let accessKey = '';
    const idMatch = xmlContent.match(/Id=["']NFe(\d{44})["']/i);
    if (idMatch) {
      accessKey = idMatch[1];
    } else {
      accessKey = this.getTagValue(xmlContent, 'chNFe');
    }

    const ideBlock = this.getTagBlock(infNFeBlock, 'ide');
    const series = parseInt(this.getTagValue(ideBlock, 'serie') || '1', 10);
    const number = parseInt(this.getTagValue(ideBlock, 'nNF') || '1', 10);
    const model = this.getTagValue(ideBlock, 'mod') || '55';
    const operationNature = this.getTagValue(ideBlock, 'natOp') || 'VENDA';
    const issuedAt = this.getTagValue(ideBlock, 'dhEmi') || new Date().toISOString();
    const tpNF = this.getTagValue(ideBlock, 'tpNF') || '1';
    const operationType = tpNF === '0' ? OperationType.INBOUND : OperationType.OUTBOUND;

    // 2. Emitente
    const emitBlock = this.getTagBlock(infNFeBlock, 'emit');
    const emitCnpj = this.getTagValue(emitBlock, 'CNPJ');
    const emitCpf = this.getTagValue(emitBlock, 'CPF');
    const emitEnder = this.getTagBlock(emitBlock, 'enderEmit');
    const issuer: ParsedNfeParty = {
      document: emitCnpj || emitCpf,
      legalName: this.getTagValue(emitBlock, 'xNome'),
      tradeName: this.getTagValue(emitBlock, 'xFant') || undefined,
      stateRegistration: this.getTagValue(emitBlock, 'IE') || undefined,
      street: this.getTagValue(emitEnder, 'xLgr') || undefined,
      number: this.getTagValue(emitEnder, 'nro') || undefined,
      neighborhood: this.getTagValue(emitEnder, 'xBairro') || undefined,
      cityCode: this.getTagValue(emitEnder, 'cMun') || undefined,
      cityName: this.getTagValue(emitEnder, 'xMun') || undefined,
      state: this.getTagValue(emitEnder, 'UF') || undefined,
      zipCode: this.getTagValue(emitEnder, 'CEP') || undefined,
    };

    // 3. Destinatário
    const destBlock = this.getTagBlock(infNFeBlock, 'dest');
    const destCnpj = this.getTagValue(destBlock, 'CNPJ');
    const destCpf = this.getTagValue(destBlock, 'CPF');
    const destEnder = this.getTagBlock(destBlock, 'enderDest');
    const recipient: ParsedNfeParty = {
      document: destCnpj || destCpf,
      legalName: this.getTagValue(destBlock, 'xNome'),
      stateRegistration: this.getTagValue(destBlock, 'IE') || undefined,
      street: this.getTagValue(destEnder, 'xLgr') || undefined,
      number: this.getTagValue(destEnder, 'nro') || undefined,
      neighborhood: this.getTagValue(destEnder, 'xBairro') || undefined,
      cityCode: this.getTagValue(destEnder, 'cMun') || undefined,
      cityName: this.getTagValue(destEnder, 'xMun') || undefined,
      state: this.getTagValue(destEnder, 'UF') || undefined,
      zipCode: this.getTagValue(destEnder, 'CEP') || undefined,
    };

    // 4. Itens (det)
    const detBlocks = this.getAllTagBlocks(infNFeBlock, 'det');
    const items: ParsedNfeItem[] = detBlocks.map((det, index) => {
      const prodBlock = this.getTagBlock(det, 'prod');
      const impostoBlock = this.getTagBlock(det, 'imposto');
      const icmsBlock = this.getTagBlock(impostoBlock, 'ICMS');

      const code = this.getTagValue(prodBlock, 'cProd') || `ITEM-${index + 1}`;
      const description = this.getTagValue(prodBlock, 'xProd') || 'Produto sem descrição';
      const ncm = this.getTagValue(prodBlock, 'NCM');
      const cfop = this.getTagValue(prodBlock, 'CFOP');
      const unit = this.getTagValue(prodBlock, 'uCom') || 'UN';
      const quantity = parseFloat(this.getTagValue(prodBlock, 'qCom') || '1');
      const unitPrice = parseFloat(this.getTagValue(prodBlock, 'vUnCom') || '0');
      const totalPrice = parseFloat(this.getTagValue(prodBlock, 'vProd') || '0');

      const icmsValue = parseFloat(this.getTagValue(icmsBlock, 'vICMS') || '0');
      const icmsBase = parseFloat(this.getTagValue(icmsBlock, 'vBC') || '0');
      const icmsCst = this.getTagValue(icmsBlock, 'CST') || this.getTagValue(icmsBlock, 'CSOSN') || '102';

      const pisValue = parseFloat(this.getTagValue(impostoBlock, 'vPIS') || '0');
      const cofinsValue = parseFloat(this.getTagValue(impostoBlock, 'vCOFINS') || '0');

      return {
        itemOrder: index + 1,
        code,
        description,
        ncm,
        cfop,
        unit,
        quantity,
        unitPrice,
        totalPrice,
        icmsCst,
        icmsBase,
        icmsValue,
        pisValue,
        cofinsValue,
      };
    });

    // 5. Totais
    const totalBlock = this.getTagBlock(infNFeBlock, 'total');
    const icmsTot = this.getTagBlock(totalBlock, 'ICMSTot');
    const totalProducts = parseFloat(this.getTagValue(icmsTot, 'vProd') || '0');
    const totalDocument = parseFloat(this.getTagValue(icmsTot, 'vNF') || '0');
    const totalIcms = parseFloat(this.getTagValue(icmsTot, 'vICMS') || '0');
    const totalPis = parseFloat(this.getTagValue(icmsTot, 'vPIS') || '0');
    const totalCofins = parseFloat(this.getTagValue(icmsTot, 'vCOFINS') || '0');
    const totalShipping = parseFloat(this.getTagValue(icmsTot, 'vFrete') || '0');
    const totalDiscount = parseFloat(this.getTagValue(icmsTot, 'vDesc') || '0');

    // 6. Protocolo SEFAZ
    const protBlock = this.getTagBlock(xmlContent, 'protNFe');
    const infProtBlock = this.getTagBlock(protBlock, 'infProt');
    const protocolNumber = this.getTagValue(infProtBlock, 'nProt') || undefined;
    const authorizedAt = this.getTagValue(infProtBlock, 'dhRecbto') || undefined;

    return {
      accessKey,
      series,
      number,
      model,
      operationNature,
      issuedAt,
      operationType,
      issuer,
      recipient,
      items,
      totalProducts,
      totalDocument,
      totalIcms,
      totalPis,
      totalCofins,
      totalShipping,
      totalDiscount,
      protocolNumber,
      authorizedAt,
    };
  }

  /**
   * Converts a ParsedNfeDocument to an internal FiscalDocumentDto
   */
  public static toFiscalDocument(
    parsed: ParsedNfeDocument,
    organizationId: string,
    companyId: string
  ): FiscalDocumentDto {
    return {
      id: `doc_imp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      organizationId,
      companyId,
      companyName: parsed.issuer.legalName,
      customerId: null,
      customerName: parsed.recipient.legalName,
      customerDocument: parsed.recipient.document,
      documentType: parsed.model === '65' ? DocumentType.NFCE : DocumentType.NFE,
      status: DocumentStatus.AUTHORIZED,
      environment: FiscalEnvironment.PRODUCTION,
      series: parsed.series,
      number: parsed.number,
      accessKey: parsed.accessKey,
      protocolNumber: parsed.protocolNumber,
      authorizedAt: parsed.authorizedAt,
      operationNature: parsed.operationNature,
      operationType: OperationType.INBOUND,
      totalProducts: parsed.totalProducts,
      totalDiscount: parsed.totalDiscount,
      totalIcms: parsed.totalIcms,
      totalIpi: 0,
      totalPis: parsed.totalPis,
      totalCofins: parsed.totalCofins,
      totalShipping: parsed.totalShipping,
      totalDocument: parsed.totalDocument,
      items: parsed.items.map((it): FiscalDocumentItemDto => ({
        itemOrder: it.itemOrder,
        code: it.code,
        description: it.description,
        ncm: it.ncm,
        cfop: it.cfop,
        unit: it.unit,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        totalPrice: it.totalPrice,
        icmsCst: it.icmsCst,
        icmsBase: it.icmsBase,
        icmsValue: it.icmsValue,
        pisValue: it.pisValue,
        cofinsValue: it.cofinsValue,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

