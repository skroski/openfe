import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { DocumentsModule } from '../documents/documents.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [DocumentsModule, CompaniesModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}

