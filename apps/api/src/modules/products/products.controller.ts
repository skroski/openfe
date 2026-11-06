import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CurrentTenant } from '../auth/current-tenant.decorator';
import { ProductDto } from '@opennfe/shared';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista os produtos e serviços cadastrados' })
  async list(@CurrentTenant() tenantId: string) {
    return this.productsService.list(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de um produto' })
  async getById(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.productsService.getById(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastra novo produto ou serviço' })
  async create(@CurrentTenant() tenantId: string, @Body() body: Partial<ProductDto>) {
    return this.productsService.create(tenantId, body);
  }
}

