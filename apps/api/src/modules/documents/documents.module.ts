import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { CompaniesModule } from '../companies/companies.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [CompaniesModule, QueueModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}

