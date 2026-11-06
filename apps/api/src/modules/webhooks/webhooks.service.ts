import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { DocumentsService } from '../documents/documents.service';
import { DocumentStatus } from '@opennfe/shared';

export interface WebhookDeliveryLog {
  id: string;
  tenantId: string;
  targetUrl: string;
  event: string;
  statusCode?: number;
  success: boolean;
  sentAt: string;
  error?: string;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private tenantWebhookConfigs: Map<string, { url: string; secret: string }> = new Map([
    [
      'default-tenant-uuid',
      {
        url: 'https://webhook.site/opennfe-sample',
        secret: 'whsec_prod_secret_token_123',
      },
    ],
  ]);
  private deliveryLogs: WebhookDeliveryLog[] = [];

  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * Processes inbound webhook from Focus NFe
   * Docs reference: https://doc.focusnfe.com.br/
   */
  async handleFocusNfeCallback(payload: any): Promise<{ received: boolean; updated: boolean }> {
    this.logger.log(`Recebido webhook Focus NFe: ${JSON.stringify(payload)}`);

    const ref = payload.referencia || payload.ref;
    if (!ref) {
      return { received: true, updated: false };
    }

    const statusStr = (payload.status || payload.situacao || '').toLowerCase();
    let status = DocumentStatus.PROCESSING;

    if (statusStr === 'autorizado' || statusStr === 'autorizada') {
      status = DocumentStatus.AUTHORIZED;
    } else if (statusStr === 'erro_autorizacao' || statusStr === 'rejeitado' || statusStr === 'rejeitada') {
      status = DocumentStatus.REJECTED;
    } else if (statusStr === 'cancelado' || statusStr === 'cancelada') {
      status = DocumentStatus.CANCELLED;
    }

    // Procura documento pela referência externa
    const allDocs = await this.documentsService.list('default-tenant-uuid');
    const doc = allDocs.find((d) => d.externalReference === ref || d.id === ref);

    if (doc) {
      doc.status = status;
      if (payload.chave_nfe) doc.accessKey = payload.chave_nfe;
      if (payload.protocolo_autorizacao) doc.protocolNumber = payload.protocolo_autorizacao;
      if (payload.mensagem_sefaz) doc.rejectionReason = payload.mensagem_sefaz;
      doc.updatedAt = new Date().toISOString();

      // Dispara webhook outbound para o cliente externo
      await this.dispatchOutboundWebhook(doc.organizationId, 'document.status_changed', {
        documentId: doc.id,
        status: doc.status,
        accessKey: doc.accessKey,
        protocolNumber: doc.protocolNumber,
      });

      return { received: true, updated: true };
    }

    return { received: true, updated: false };
  }

  /**
   * Dispatches signed HMAC-SHA256 outbound webhook to client
   */
  async dispatchOutboundWebhook(
    tenantId: string,
    event: string,
    data: any
  ): Promise<WebhookDeliveryLog> {
    const config = this.tenantWebhookConfigs.get(tenantId);
    const logId = `whlog_${Date.now()}`;

    if (!config || !config.url) {
      const log: WebhookDeliveryLog = {
        id: logId,
        tenantId,
        targetUrl: 'NENHUMA_URL_CONFIGURADA',
        event,
        success: false,
        sentAt: new Date().toISOString(),
        error: 'Nenhum webhook configurado para este tenant.',
      };
      this.deliveryLogs.push(log);
      return log;
    }

    const bodyString = JSON.stringify({
      id: logId,
      event,
      timestamp: new Date().toISOString(),
      data,
    });

    const signature = crypto
      .createHmac('sha256', config.secret)
      .update(bodyString)
      .digest('hex');

    this.logger.log(`Disparando webhook ${event} para ${config.url} com assinatura HMAC-SHA256`);

    try {
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OpenNFE-Signature': `sha256=${signature}`,
          'X-OpenNFE-Event': event,
        },
        body: bodyString,
        signal: AbortSignal.timeout(5000),
      }).catch((err) => ({ ok: false, status: 0, statusText: err.message } as any));

      const log: WebhookDeliveryLog = {
        id: logId,
        tenantId,
        targetUrl: config.url,
        event,
        statusCode: response.status || 0,
        success: response.ok,
        sentAt: new Date().toISOString(),
      };
      this.deliveryLogs.push(log);
      return log;
    } catch (err: any) {
      const log: WebhookDeliveryLog = {
        id: logId,
        tenantId,
        targetUrl: config.url,
        event,
        success: false,
        sentAt: new Date().toISOString(),
        error: err.message,
      };
      this.deliveryLogs.push(log);
      return log;
    }
  }

  getLogs(tenantId: string): WebhookDeliveryLog[] {
    return this.deliveryLogs.filter((l) => l.tenantId === tenantId);
  }
}

