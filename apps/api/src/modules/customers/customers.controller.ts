import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CurrentTenant } from '../auth/current-tenant.decorator';
import { CustomerDto } from '@opennfe/shared';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Lista os clientes e destinatários' })
  async list(@CurrentTenant() tenantId: string) {
    return this.customersService.list(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de um destinatário' })
  async getById(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.customersService.getById(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastra novo destinatário' })
  async create(@CurrentTenant() tenantId: string, @Body() body: Partial<CustomerDto>) {
    return this.customersService.create(tenantId, body);
  }
}

