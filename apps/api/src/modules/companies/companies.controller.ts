import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CurrentTenant } from '../auth/current-tenant.decorator';
import { CompanyDto } from '@opennfe/shared';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as empresas do tenant atual' })
  async list(@CurrentTenant() tenantId: string) {
    return this.companiesService.list(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém detalhes de uma empresa' })
  async getById(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.companiesService.getById(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastra nova empresa' })
  async create(@CurrentTenant() tenantId: string, @Body() body: Partial<CompanyDto>) {
    return this.companiesService.create(tenantId, body);
  }

  @Get(':id/provider-config')
  @ApiOperation({ summary: 'Configuração do provedor fiscal da empresa' })
  async getProviderConfig(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.companiesService.getProviderConfig(tenantId, id);
  }

  @Put(':id/provider-config')
  @ApiOperation({ summary: 'Atualiza configuração do provedor fiscal' })
  async updateProviderConfig(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.companiesService.updateProviderConfig(tenantId, id, body);
  }
}

