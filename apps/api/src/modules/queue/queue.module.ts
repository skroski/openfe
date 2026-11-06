import { Module } from '@nestjs/common';
import { FiscalQueueService } from './fiscal-queue.service';

@Module({
  providers: [FiscalQueueService],
  exports: [FiscalQueueService],
})
export class QueueModule {}

