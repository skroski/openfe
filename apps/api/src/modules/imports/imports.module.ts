import { Module } from '@nestjs/common';
import { ImportsService } from './imports.service';
import { ImportsController } from './imports.controller';
import { DocumentsModule } from '../documents/documents.module';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [DocumentsModule, ProductsModule, CustomersModule, CompaniesModule],
  controllers: [ImportsController],
  providers: [ImportsService],
  exports: [ImportsService],
})
export class ImportsModule {}

