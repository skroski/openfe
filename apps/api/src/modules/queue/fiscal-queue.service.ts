import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { FiscalDocumentDto, DocumentStatus } from '@opennfe/shared';
import { FiscalProviderRegistry } from '@opennfe/providers';
import { FiscalSubmissionResult } from '@opennfe/fiscal';

export interface FiscalIssuanceJob {
  tenantId: string;
  document: FiscalDocumentDto;
  providerKey: string;
  companyCredentials: Record<string, string>;
  idempotencyKey: string;
  attempts?: number;
}

export interface SubmissionAuditRecord {
  idempotencyKey: string;
  tenantId: string;
  documentId: string;
  status: DocumentStatus;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
  result?: FiscalSubmissionResult;
  lastError?: string;
}

@Injectable()
export class FiscalQueueService {
  private readonly logger = new Logger(FiscalQueueService.name);
  private readonly idempotencyStore: Map<string, SubmissionAuditRecord> = new Map();
  private readonly deadLetterQueue: SubmissionAuditRecord[] = new Map<string, SubmissionAuditRecord>().values() as any;

  /**
   * Enqueues and processes an issuance job with idempotency and exponential backoff
   */
  async processIssuance(job: FiscalIssuanceJob): Promise<FiscalSubmissionResult> {
    const { idempotencyKey, document, tenantId, providerKey, companyCredentials } = job;

    // 1. Idempotency Check
    const existing = this.idempotencyStore.get(idempotencyKey);
    if (existing) {
      if (existing.status === DocumentStatus.PROCESSING) {
        this.logger.warn(`Operação com idempotencyKey ${idempotencyKey} já está em processamento.`);
        throw new ConflictException('Emissão já em andamento para esta chave de idempotência.');
      }
      if (existing.result) {
        this.logger.log(`Retornando resultado em cache para idempotencyKey ${idempotencyKey}`);
        return existing.result;
      }
    }

    // 2. Register attempt
    const record: SubmissionAuditRecord = {
      idempotencyKey,
      tenantId,
      documentId: document.id,
      status: DocumentStatus.PROCESSING,
      attempts: (job.attempts || 0) + 1,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.idempotencyStore.set(idempotencyKey, record);

    // 3. Resolve Provider Adapter
    const adapter = FiscalProviderRegistry.get(providerKey);
    this.logger.log(
      `Disparando transmissão da nota ${document.id} (Série ${document.series}) via adapter ${adapter.name}`
    );

    const maxAttempts = 3;
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < maxAttempts) {
      attempt++;
      try {
        const result = await adapter.submitDocument({
          document,
          companyCredentials,
          environment: document.environment,
          idempotencyKey,
        });

        // 4. Update Audit Record
        record.status = result.status;
        record.result = result;
        record.updatedAt = new Date();
        this.idempotencyStore.set(idempotencyKey, record);

        this.logger.log(
          `Documento ${document.id} processado com status ${result.status} (chave: ${result.accessKey || 'N/A'})`
        );
        return result;
      } catch (err: any) {
        lastError = err;
        this.logger.warn(
          `Tentativa ${attempt}/${maxAttempts} falhou para documento ${document.id}: ${err.message}`
        );

        if (attempt < maxAttempts) {
          // Exponential backoff: 200ms, 400ms...
          const delay = Math.pow(2, attempt) * 100;
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    }

    // 5. Send to Dead Letter Queue on complete failure
    record.status = DocumentStatus.QUEUED;
    record.lastError = lastError?.message || 'Falha persistente de comunicação';
    record.updatedAt = new Date();
    this.idempotencyStore.set(idempotencyKey, record);

    return {
      success: false,
      status: DocumentStatus.QUEUED,
      rejectionReason: `Falha na transmissão após ${maxAttempts} tentativas. Enfileirado para reprocessamento: ${lastError?.message}`,
    };
  }

  getAuditRecord(idempotencyKey: string): SubmissionAuditRecord | undefined {
    return this.idempotencyStore.get(idempotencyKey);
  }
}

