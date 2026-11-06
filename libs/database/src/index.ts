import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';
export * from './database.module';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conexão com PostgreSQL via Prisma estabelecida com sucesso.');
    } catch (err: any) {
      this.logger.warn(
        `Banco de dados relacional offline (${err?.message || 'Host indisponível'}). Operando em modo de resiliência com cache e in-memory fallback.`
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {
      // Ignora erro no disconnect
    }
  }
}
