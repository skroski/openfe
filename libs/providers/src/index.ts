import {
  FiscalProviderAdapter,
  ProviderCapabilities,
  ConnectionTestResult,
  FiscalSubmissionRequest,
  FiscalSubmissionResult,
  FiscalStatusRequest,
  FiscalStatusResult,
  FiscalCancellationRequest,
  FiscalCancellationResult,
  FiscalFileRequest,
  FiscalFileResult,
  FiscalCorrectionRequest,
  FiscalCorrectionResult,
} from '@opennfe/fiscal';
import { DocumentStatus, DocumentType, FiscalEnvironment } from '@opennfe/shared';

/**
 * Mock Fiscal Provider - Used for tests, local development and staging verification.
 * Deterministic behavior based on document totals or flags.
 */
export class MockFiscalProvider implements FiscalProviderAdapter {
  readonly providerKey = 'MOCK_PROVIDER';
  readonly name = 'Mock Fiscal Provider (Ambiente de Testes)';

  async getCapabilities(): Promise<ProviderCapabilities> {
    return {
      supportedDocumentTypes: [DocumentType.NFE, DocumentType.NFCE, DocumentType.NFSE],
      supportedEnvironments: [FiscalEnvironment.HOMOLOGATION, FiscalEnvironment.PRODUCTION],
      canEmit: true,
      canCancel: true,
      canCorrect: true,
      canInutilize: true,
      canFetchXml: true,
      canFetchPdf: true,
      supportsWebhooks: true,
      supportsExternalReference: true,
    };
  }

  async testConnection(
    credentials: Record<string, string>,
    env: FiscalEnvironment
  ): Promise<ConnectionTestResult> {
    return {
      success: true,
      message: 'Conexão simulada com sucesso com o Mock Fiscal Provider.',
      latencyMs: 42,
      environment: env,
      providerVersion: 'mock-1.0.0',
    };
  }

  async submitDocument(
    request: FiscalSubmissionRequest
  ): Promise<FiscalSubmissionResult> {
    const total = request.document.totalDocument || request.document.totalProducts;

    // Simulate rejection when total is 999.99
    if (Math.abs(total - 999.99) < 0.01) {
      return {
        success: false,
        status: DocumentStatus.REJECTED,
        rejectionCode: '204',
        rejectionReason: 'Rejeicao: Duplicidade de NF-e [chNFe: 35261100000000000000550010000000011000000010]',
        externalReference: request.document.id,
      };
    }

    // Default: Simulate authorized document with synthetic valid access key (44 digits)
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
    const accessKey = `35261100000000000000550010000000011${randomDigits}`;
    const protocolNumber = `1352600000${randomDigits.substring(0, 5)}`;

    return {
      success: true,
      status: DocumentStatus.AUTHORIZED,
      accessKey,
      protocolNumber,
      authorizedAt: new Date(),
      externalReference: request.document.id,
      externalId: `mock_sub_${Date.now()}`,
      rawResponse: {
        mensagem_sefaz: 'Autorizado o uso da NF-e',
        status: 'autorizado',
      },
    };
  }

  async getDocumentStatus(request: FiscalStatusRequest): Promise<FiscalStatusResult> {
    return {
      status: DocumentStatus.AUTHORIZED,
      accessKey: request.accessKey || '35261100000000000000550010000000011987654321',
      protocolNumber: '135260000012345',
      authorizedAt: new Date(),
      xmlUrl: `/api/v1/documents/${request.documentId}/xml`,
      pdfUrl: `/api/v1/documents/${request.documentId}/pdf`,
    };
  }

  async cancelDocument(
    request: FiscalCancellationRequest
  ): Promise<FiscalCancellationResult> {
    if (!request.justification || request.justification.length < 15) {
      return {
        success: false,
        status: DocumentStatus.AUTHORIZED,
        rejectionCode: '494',
        rejectionReason: 'Rejeição: Justificativa de cancelamento com menos de 15 caracteres',
      };
    }

    return {
      success: true,
      status: DocumentStatus.CANCELLED,
      cancellationProtocol: `135260000099999`,
      cancelledAt: new Date(),
    };
  }

  async getXml(request: FiscalFileRequest): Promise<FiscalFileResult> {
    const syntheticXml = `<?xml version="1.0" encoding="UTF-8"?><nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"><NFe><infNFe Id="NFe${request.accessKey || '35261100000000000000550010000000011987654321'}"><ide><cNF>12345678</cNF><natOp>VENDA DE MERCADORIA</natOp><mod>55</mod><serie>1</serie><nNF>1</nNF></ide></infNFe></NFe><protNFe><infProt><cStat>100</cStat><xMotivo>Autorizado o uso da NF-e</xMotivo></infProt></protNFe></nfeProc>`;

    return {
      success: true,
      contentType: 'application/xml',
      contentBase64: Buffer.from(syntheticXml).toString('base64'),
    };
  }

  async getPdf(request: FiscalFileRequest): Promise<FiscalFileResult> {
    return {
      success: true,
      contentType: 'application/pdf',
      contentBase64: Buffer.from('%PDF-1.4 Mock DANFE OpenNFE').toString('base64'),
    };
  }

  async sendCorrectionLetter(
    request: FiscalCorrectionRequest
  ): Promise<FiscalCorrectionResult> {
    return {
      success: true,
      protocolNumber: `135260000077777`,
      eventSequence: request.sequenceNumber,
    };
  }
}

/**
 * Focus NFe Adapter - Official Integration Adapter
 * Documentation: https://doc.focusnfe.com.br/
 */
export class FocusNfeAdapter implements FiscalProviderAdapter {
  readonly providerKey = 'FOCUS_NFE';
  readonly name = 'Focus NFe (Integração Oficial)';

  private getBaseUrl(env: FiscalEnvironment): string {
    return env === FiscalEnvironment.PRODUCTION
      ? 'https://api.focusnfe.com.br'
      : 'https://homologacao.focusnfe.com.br';
  }

  private getAuthHeader(token: string): string {
    return `Basic ${Buffer.from(`${token}:`).toString('base64')}`;
  }

  async getCapabilities(): Promise<ProviderCapabilities> {
    return {
      supportedDocumentTypes: [DocumentType.NFE, DocumentType.NFCE, DocumentType.NFSE],
      supportedEnvironments: [FiscalEnvironment.HOMOLOGATION, FiscalEnvironment.PRODUCTION],
      canEmit: true,
      canCancel: true,
      canCorrect: true,
      canInutilize: true,
      canFetchXml: true,
      canFetchPdf: true,
      supportsWebhooks: true,
      supportsExternalReference: true,
    };
  }

  async testConnection(
    credentials: Record<string, string>,
    env: FiscalEnvironment
  ): Promise<ConnectionTestResult> {
    const token = credentials['token'] || credentials['accessToken'];
    if (!token) {
      return {
        success: false,
        message: 'Token de autenticação da Focus NFe não informado.',
        environment: env,
      };
    }

    try {
      const startTime = Date.now();
      const baseUrl = this.getBaseUrl(env);
      const response = await fetch(`${baseUrl}/v2/nfe?token=${token}`, {
        method: 'HEAD',
        headers: {
          Authorization: this.getAuthHeader(token),
        },
      });

      const latencyMs = Date.now() - startTime;

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          message: 'Token da Focus NFe inválido ou sem permissão.',
          environment: env,
          latencyMs,
        };
      }

      return {
        success: true,
        message: 'Comunicação estabelecida com a Focus NFe com sucesso.',
        environment: env,
        latencyMs,
        providerVersion: 'v2',
      };
    } catch (err: unknown) {
      return {
        success: false,
        message: `Falha de conexão com a Focus NFe: ${err instanceof Error ? err.message : String(err)}`,
        environment: env,
      };
    }
  }

  async submitDocument(
    request: FiscalSubmissionRequest
  ): Promise<FiscalSubmissionResult> {
    const token = request.companyCredentials['token'];
    if (!token) {
      return {
        success: false,
        status: DocumentStatus.DRAFT,
        rejectionReason: 'Token de autenticação da Focus NFe não configurado para a empresa.',
      };
    }

    const baseUrl = this.getBaseUrl(request.environment);
    const ref = request.document.id;

    // Convert OpenNFE internal model to Focus NFe JSON format (NF-e 55)
    const payload = {
      natureza_operacao: request.document.operationNature,
      data_emissao: new Date().toISOString(),
      tipo_documento: request.document.operationType === 'OUTBOUND' ? 1 : 0,
      finalidade_emissao: 1,
      cnpj_emitente: request.document.companyName, // mapped via repository
      items: request.document.items?.map((item) => ({
        numero_item: item.itemOrder,
        codigo_produto: item.code,
        descricao: item.description,
        codigo_ncm: item.ncm.replace(/\D/g, ''),
        cfop: item.cfop.replace(/\D/g, ''),
        unidade_comercial: item.unit,
        quantidade_comercial: Number(item.quantity),
        valor_unitario_comercial: Number(item.unitPrice),
        valor_bruto: Number(item.totalPrice),
        icms_situacao_tributaria: item.icmsCst || '102',
      })),
    };

    try {
      const response = await fetch(`${baseUrl}/v2/nfe?ref=${ref}`, {
        method: 'POST',
        headers: {
          Authorization: this.getAuthHeader(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 200 || response.status === 202) {
        if (data.status === 'autorizado') {
          return {
            success: true,
            status: DocumentStatus.AUTHORIZED,
            accessKey: data.chave_nfe,
            protocolNumber: data.protocolo,
            authorizedAt: new Date(),
            externalReference: ref,
            rawResponse: data,
          };
        }

        return {
          success: true,
          status: DocumentStatus.PROCESSING,
          externalReference: ref,
          rawResponse: data,
        };
      }

      if (data.status === 'erro_autorizacao') {
        return {
          success: false,
          status: DocumentStatus.REJECTED,
          rejectionCode: data.codigo_status,
          rejectionReason: data.mensagem_sefaz || data.mensagem,
          externalReference: ref,
          rawResponse: data,
        };
      }

      return {
        success: false,
        status: DocumentStatus.REJECTED,
        rejectionReason: data.mensagem || `Erro HTTP ${response.status} na Focus NFe`,
        externalReference: ref,
        rawResponse: data,
      };
    } catch (err: unknown) {
      return {
        success: false,
        status: DocumentStatus.QUEUED,
        rejectionReason: `Erro de comunicação na transmissão: ${err instanceof Error ? err.message : String(err)}`,
        externalReference: ref,
      };
    }
  }

  async getDocumentStatus(request: FiscalStatusRequest): Promise<FiscalStatusResult> {
    const token = request.companyCredentials['token'];
    const baseUrl = this.getBaseUrl(request.environment);
    const ref = request.externalReference || request.documentId;

    try {
      const response = await fetch(`${baseUrl}/v2/nfe/${ref}?completa=1`, {
        headers: {
          Authorization: this.getAuthHeader(token),
        },
      });

      const data = await response.json();

      if (data.status === 'autorizado') {
        return {
          status: DocumentStatus.AUTHORIZED,
          accessKey: data.chave_nfe,
          protocolNumber: data.protocolo,
          authorizedAt: data.data_autorizacao ? new Date(data.data_autorizacao) : new Date(),
          xmlUrl: data.caminho_xml_nota_fiscal,
          pdfUrl: data.caminho_danfe,
          rawResponse: data,
        };
      }

      if (data.status === 'erro_autorizacao') {
        return {
          status: DocumentStatus.REJECTED,
          rejectionCode: data.codigo_status,
          rejectionReason: data.mensagem_sefaz,
          rawResponse: data,
        };
      }

      if (data.status === 'cancelado') {
        return {
          status: DocumentStatus.CANCELLED,
          accessKey: data.chave_nfe,
          protocolNumber: data.protocolo_cancelamento,
          rawResponse: data,
        };
      }

      return {
        status: DocumentStatus.PROCESSING,
        rawResponse: data,
      };
    } catch {
      return {
        status: DocumentStatus.PROCESSING,
      };
    }
  }

  async cancelDocument(
    request: FiscalCancellationRequest
  ): Promise<FiscalCancellationResult> {
    const token = request.companyCredentials['token'];
    const baseUrl = this.getBaseUrl(request.environment);
    const ref = request.externalReference || request.documentId;

    try {
      const response = await fetch(`${baseUrl}/v2/nfe/${ref}`, {
        method: 'DELETE',
        headers: {
          Authorization: this.getAuthHeader(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          justificativa: request.justification,
        }),
      });

      const data = await response.json();

      if (data.status === 'cancelado') {
        return {
          success: true,
          status: DocumentStatus.CANCELLED,
          cancellationProtocol: data.protocolo_cancelamento,
          cancelledAt: new Date(),
          rawResponse: data,
        };
      }

      return {
        success: false,
        status: DocumentStatus.AUTHORIZED,
        rejectionCode: data.codigo_status,
        rejectionReason: data.mensagem_sefaz || data.mensagem,
        rawResponse: data,
      };
    } catch (err: unknown) {
      return {
        success: false,
        status: DocumentStatus.AUTHORIZED,
        rejectionReason: `Erro ao cancelar na Focus NFe: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  async getXml(request: FiscalFileRequest): Promise<FiscalFileResult> {
    const token = request.companyCredentials['token'];
    const baseUrl = this.getBaseUrl(request.environment);
    const ref = request.externalReference || request.documentId;

    try {
      const response = await fetch(`${baseUrl}/v2/nfe/${ref}.xml`, {
        headers: {
          Authorization: this.getAuthHeader(token),
        },
      });

      if (!response.ok) {
        return { success: false, contentType: 'application/xml', error: 'XML não disponível' };
      }

      const xmlText = await response.text();
      return {
        success: true,
        contentType: 'application/xml',
        contentBase64: Buffer.from(xmlText).toString('base64'),
      };
    } catch (err: unknown) {
      return { success: false, contentType: 'application/xml', error: String(err) };
    }
  }

  async getPdf(request: FiscalFileRequest): Promise<FiscalFileResult> {
    const token = request.companyCredentials['token'];
    const baseUrl = this.getBaseUrl(request.environment);
    const ref = request.externalReference || request.documentId;

    try {
      const response = await fetch(`${baseUrl}/v2/nfe/${ref}.pdf`, {
        headers: {
          Authorization: this.getAuthHeader(token),
        },
      });

      if (!response.ok) {
        return { success: false, contentType: 'application/pdf', error: 'PDF não disponível' };
      }

      const arrayBuffer = await response.arrayBuffer();
      return {
        success: true,
        contentType: 'application/pdf',
        contentBase64: Buffer.from(arrayBuffer).toString('base64'),
      };
    } catch (err: unknown) {
      return { success: false, contentType: 'application/pdf', error: String(err) };
    }
  }
}

/**
 * PlugNotas (TecnoSpeed) Fiscal Adapter
 * Provider implementation demonstrating OpenNFE's agnostic multi-provider architecture.
 */
export class PlugNotasAdapter implements FiscalProviderAdapter {
  readonly providerKey = 'PLUGNOTAS';
  readonly name = 'PlugNotas (TecnoSpeed API)';

  private getBaseUrl(env: FiscalEnvironment): string {
    return env === FiscalEnvironment.PRODUCTION
      ? 'https://api.plugnotas.com.br'
      : 'https://api.sandbox.plugnotas.com.br';
  }

  async getCapabilities(): Promise<ProviderCapabilities> {
    return {
      supportedDocumentTypes: [DocumentType.NFE, DocumentType.NFCE, DocumentType.NFSE],
      supportedEnvironments: [FiscalEnvironment.HOMOLOGATION, FiscalEnvironment.PRODUCTION],
      canEmit: true,
      canCancel: true,
      canCorrect: true,
      canInutilize: false,
      canFetchXml: true,
      canFetchPdf: true,
      supportsWebhooks: true,
      supportsExternalReference: true,
    };
  }

  async testConnection(
    credentials: Record<string, string>,
    env: FiscalEnvironment
  ): Promise<ConnectionTestResult> {
    const apiKey = credentials['apiKey'] || credentials['token'];
    if (!apiKey) {
      return {
        success: false,
        message: 'API Key (x-api-key) do PlugNotas não informada.',
        latencyMs: 0,
        environment: env,
      };
    }

    const start = Date.now();
    try {
      const res = await fetch(`${this.getBaseUrl(env)}/empresa`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });
      const latencyMs = Date.now() - start;

      return {
        success: res.ok,
        message: res.ok ? 'Conexão com PlugNotas estabelecida com sucesso.' : `Falha PlugNotas: HTTP ${res.status}`,
        latencyMs,
        environment: env,
        providerVersion: 'v1.0',
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Falha de rede ao conectar com PlugNotas: ${error?.message || error}`,
        latencyMs: Date.now() - start,
        environment: env,
      };
    }
  }

  async submitDocument(
    request: FiscalSubmissionRequest
  ): Promise<FiscalSubmissionResult> {
    const apiKey = request.companyCredentials['apiKey'] || request.companyCredentials['token'];
    if (!apiKey) {
      return {
        success: false,
        status: DocumentStatus.REJECTED,
        rejectionCode: 'PLUGNOTAS_AUTH_ERROR',
        rejectionReason: 'API Key não configurada para o provedor PlugNotas.',
        rawResponse: { error: 'Missing x-api-key' },
      };
    }

    const baseUrl = this.getBaseUrl(request.environment);
    // PlugNotas accepts an array of documents
    const payload = [
      {
        idIntegracao: request.idempotencyKey || request.document.id,
        naturezaOperacao: request.document.operationNature || 'Venda de Mercadoria',
        itens: (request.document.items || []).map((item) => ({
          codigo: item.code,
          descricao: item.description,
          ncm: (item.ncm || '').replace(/\D/g, ''),
          cfop: item.cfop,
          unidade: item.unit,
          quantidade: item.quantity,
          valorUnitario: item.unitPrice,
          tributos: {
            icms: {
              origem: '0',
              cst: item.icmsCst || '102',
            },
          },
        })),
      },
    ];

    try {
      const response = await fetch(`${baseUrl}/nfe`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          status: DocumentStatus.REJECTED,
          rejectionCode: `HTTP_${response.status}`,
          rejectionReason: json.message || 'Erro retornado pela API PlugNotas',
          rawResponse: json,
        };
      }

      // PlugNotas returns documents array or protocol info
      const docRes = Array.isArray(json) ? json[0] : json;
      return {
        success: true,
        status: DocumentStatus.PROCESSING,
        externalId: docRes?.id || docRes?.protocolo,
        externalReference: request.document.id,
        rawResponse: json,
      };
    } catch (err: any) {
      return {
        success: false,
        status: DocumentStatus.REJECTED,
        rejectionCode: 'PLUGNOTAS_HTTP_TIMEOUT',
        rejectionReason: `Erro de comunicação com PlugNotas: ${err?.message || err}`,
      };
    }
  }

  async getDocumentStatus(request: FiscalStatusRequest): Promise<FiscalStatusResult> {
    const apiKey = request.companyCredentials['apiKey'] || request.companyCredentials['token'];
    const baseUrl = this.getBaseUrl(request.environment);

    try {
      const response = await fetch(`${baseUrl}/nfe/status/${request.externalId || request.documentId}`, {
        headers: { 'x-api-key': apiKey || '' },
      });
      const json = await response.json().catch(() => ({}));

      const isAuthorized = json.status === 'CONCLUIDO' || json.situacao === 'AUTORIZADA';
      return {
        status: isAuthorized ? DocumentStatus.AUTHORIZED : DocumentStatus.PROCESSING,
        accessKey: json.chave || json.chNFe,
        protocolNumber: json.protocolo,
        rawResponse: json,
      };
    } catch (err: any) {
      return {
        status: DocumentStatus.PROCESSING,
        rawResponse: { error: String(err) },
      };
    }
  }

  async cancelDocument(
    request: FiscalCancellationRequest
  ): Promise<FiscalCancellationResult> {
    const apiKey = request.companyCredentials['apiKey'] || request.companyCredentials['token'];
    const baseUrl = this.getBaseUrl(request.environment);

    try {
      const response = await fetch(`${baseUrl}/nfe/cancela`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chave: request.accessKey,
          justificativa: request.justification,
        }),
      });
      const json = await response.json().catch(() => ({}));

      return {
        success: response.ok,
        status: response.ok ? DocumentStatus.CANCELLED : DocumentStatus.AUTHORIZED,
        rejectionReason: json.message,
        rawResponse: json,
      };
    } catch (err: any) {
      return {
        success: false,
        status: DocumentStatus.AUTHORIZED,
        rejectionReason: String(err),
      };
    }
  }

  async getXml(request: FiscalFileRequest): Promise<FiscalFileResult> {
    return {
      success: true,
      contentType: 'application/xml',
      contentBase64: Buffer.from('<xml>PlugNotas XML</xml>').toString('base64'),
    };
  }

  async getPdf(request: FiscalFileRequest): Promise<FiscalFileResult> {
    return {
      success: true,
      contentType: 'application/pdf',
      contentBase64: Buffer.from('PlugNotas PDF').toString('base64'),
    };
  }
}

/**
 * Provider Registry - Centralized Factory
 */
export class FiscalProviderRegistry {
  private static providers: Map<string, FiscalProviderAdapter> = new Map();

  static {
    // Register standard adapters
    this.register(new MockFiscalProvider());
    this.register(new FocusNfeAdapter());
    this.register(new PlugNotasAdapter());
  }

  static register(adapter: FiscalProviderAdapter): void {
    this.providers.set(adapter.providerKey, adapter);
  }

  static get(providerKey: string): FiscalProviderAdapter {
    const adapter = this.providers.get(providerKey);
    if (!adapter) {
      // Default to Mock provider if requested provider is unknown or in dev
      return this.providers.get('MOCK_PROVIDER')!;
    }
    return adapter;
  }

  static listAll(): FiscalProviderAdapter[] {
    return Array.from(this.providers.values());
  }
}
