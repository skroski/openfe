import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { FiscalEnvironment } from '@opennfe/shared';

class TestConnectionDto {
  providerKey!: string;
  credentials!: Record<string, string>;
  environment!: FiscalEnvironment;
}

@ApiTags('Providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @ApiOperation({ summary: 'Lista os provedores disponíveis e suas capacidades' })
  async list() {
    return this.providersService.listProviders();
  }

  @Post('test-connection')
  @ApiOperation({ summary: 'Testa a conectividade com um provedor' })
  async testConnection(@Body() body: TestConnectionDto) {
    return this.providersService.testConnection(
      body.providerKey,
      body.credentials || {},
      body.environment || FiscalEnvironment.HOMOLOGATION
    );
  }
}

