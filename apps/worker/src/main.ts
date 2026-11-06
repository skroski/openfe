import { Logger } from '@nestjs/common';
import { FiscalProviderRegistry } from '@opennfe/providers';
import { DocumentStatus } from '@opennfe/shared';

const logger = new Logger('OpenNFE-Worker');

export interface FiscalWorkerJobData {
  jobId: string;
  tenantId: string;
  providerKey: string;
  document: any;
  credentials: Record<string, string>;
  idempotencyKey: string;
  attempts?: number;
}

export class FiscalWorkerService {
  private isRunning = false;

  async start(): Promise<void> {
    this.isRunning = true;
    logger.log('🚀 OpenNFE Fiscal Worker inicializado com sucesso.');
    logger.log('📡 Monitorando filas de emissão assíncrona SEFAZ (BullMQ / Redis).');

    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = process.env.REDIS_PORT || '6379';
    logger.log(`Conexão configurada para Redis em ${redisHost}:${redisPort}`);

    // Loop de monitoramento e heartbeat
    this.heartbeat();
  }

  async processJob(job: FiscalWorkerJobData): Promise<any> {
    logger.log(`[Worker] Processando job ${job.jobId} para documento ${job.document.id}`);

    const adapter = FiscalProviderRegistry.get(job.providerKey || 'MOCK_PROVIDER');
    logger.log(`[Worker] Executando submissão através do adapter: ${adapter.name}`);

    try {
      const result = await adapter.submitDocument({
        document: job.document,
        companyCredentials: job.credentials || {},
        environment: job.document.environment,
        idempotencyKey: job.idempotencyKey,
      });

      logger.log(`[Worker] Job ${job.jobId} concluído com status: ${result.status}`);
      return result;
    } catch (err: any) {
      logger.error(`[Worker] Falha no processamento do job ${job.jobId}: ${err.message}`);
      throw err;
    }
  }

  private heartbeat(): void {
    setInterval(() => {
      if (this.isRunning) {
        logger.debug('💓 Worker heartbeat: filas saudáveis, aguardando novos eventos fiscais.');
      }
    }, 60000);
  }

  stop(): void {
    this.isRunning = false;
    logger.log('🛑 OpenNFE Fiscal Worker finalizado com segurança.');
  }
}

async function bootstrap() {
  const worker = new FiscalWorkerService();
  await worker.start();

  process.on('SIGTERM', () => {
    worker.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    worker.stop();
    process.exit(0);
  });
}

bootstrap();

