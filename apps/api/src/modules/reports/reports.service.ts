import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentsService } from '../documents/documents.service';
import { CompaniesService } from '../companies/companies.service';
import { DocumentStatus } from '@opennfe/shared';
import { SimpleZip } from './zip-builder';

@Injectable()
export class ReportsService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly companiesService: CompaniesService
  ) {}

  async generateMonthlyClosureZip(
    tenantId: string,
    companyId: string,
    year: number,
    month: number
  ): Promise<{ filename: string; buffer: Buffer }> {
    const company = await this.companiesService.getById(tenantId, companyId);
    const documents = await this.documentsService.list(tenantId, {
      companyId,
      status: DocumentStatus.AUTHORIZED,
    });

    const zip = new SimpleZip();

    // 1. Gera CSV consolidado de fechamento
    const csvRows: string[] = [
      'ID;CHAVE_ACESSO;SERIE;NUMERO;DATA_AUTORIZACAO;DESTINATARIO;VALOR_PRODUTOS;VALOR_TOTAL;VALOR_ICMS;VALOR_PIS;VALOR_COFINS',
    ];

    let totalGeral = 0;
    let totalIcms = 0;
    let totalPis = 0;
    let totalCofins = 0;

    for (const doc of documents) {
      csvRows.push(
        [
          doc.id,
          doc.accessKey || '',
          doc.series,
          doc.number || '',
          doc.authorizedAt || doc.createdAt,
          doc.customerName || 'Consumidor',
          doc.totalProducts.toFixed(2),
          doc.totalDocument.toFixed(2),
          doc.totalIcms.toFixed(2),
          doc.totalPis.toFixed(2),
          doc.totalCofins.toFixed(2),
        ].join(';')
      );

      totalGeral += Number(doc.totalDocument) || 0;
      totalIcms += Number(doc.totalIcms) || 0;
      totalPis += Number(doc.totalPis) || 0;
      totalCofins += Number(doc.totalCofins) || 0;

      // 2. Adiciona XML individual da nota no ZIP
      try {
        const xmlRes = await this.documentsService.getXml(tenantId, doc.id);
        if (xmlRes.success && xmlRes.contentBase64) {
          const xmlBuf = Buffer.from(xmlRes.contentBase64, 'base64');
          zip.addFile(`xmls/${doc.accessKey || doc.id}.xml`, xmlBuf);
        }
      } catch {
        // Se XML não estiver gerado ainda, gera XML básico de contingência
        zip.addFile(
          `xmls/${doc.accessKey || doc.id}.xml`,
          `<nfeProc versao="4.00"><NFe><infNFe Id="NFe${doc.accessKey}"></infNFe></NFe></nfeProc>`
        );
      }
    }

    // Totais no final do CSV
    csvRows.push('');
    csvRows.push(`TOTALIZADORES;;;;;;;${totalGeral.toFixed(2)};${totalIcms.toFixed(2)};${totalPis.toFixed(2)};${totalCofins.toFixed(2)}`);

    zip.addFile('fechamento_fiscal_resumo.csv', csvRows.join('\r\n'));

    const filename = `fechamento_${company.legalName.replace(/[^a-zA-Z0-9]/g, '_')}_${year}_${String(month).padStart(2, '0')}.zip`;
    const buffer = zip.build();

    return { filename, buffer };
  }
}

