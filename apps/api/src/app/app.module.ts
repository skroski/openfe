import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../modules/auth/auth.module';
import { CompaniesModule } from '../modules/companies/companies.module';
import { CustomersModule } from '../modules/customers/customers.module';
import { ProductsModule } from '../modules/products/products.module';
import { DocumentsModule } from '../modules/documents/documents.module';
import { ProvidersModule } from '../modules/providers/providers.module';
import { QueueModule } from '../modules/queue/queue.module';
import { ImportsModule } from '../modules/imports/imports.module';
import { CertificatesModule } from '../modules/certificates/certificates.module';
import { ReportsModule } from '../modules/reports/reports.module';
import { WebhooksModule } from '../modules/webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CompaniesModule,
    CustomersModule,
    ProductsModule,
    DocumentsModule,
    ProvidersModule,
    QueueModule,
    ImportsModule,
    CertificatesModule,
    ReportsModule,
    WebhooksModule,
  ],
})
export class AppModule {}
