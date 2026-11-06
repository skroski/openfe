import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend web application
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix v1
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    })
  );

  // Swagger OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('OpenNFE API')
    .setDescription(
      'Plataforma independente de emissão e gestão de documentos fiscais eletrônicos brasileiros (NF-e, NFC-e, NFS-e)'
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }, 'X-API-KEY')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'OpenNFE API Documentation',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 OpenNFE API running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📚 Swagger documentation at: http://localhost:${port}/api/docs`);
}

bootstrap();
