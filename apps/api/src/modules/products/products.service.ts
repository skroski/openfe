import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductDto } from '@opennfe/shared';

@Injectable()
export class ProductsService {
  private products: Map<string, ProductDto> = new Map([
    [
      'prod_1',
      {
        id: 'prod_1',
        organizationId: 'default-tenant-uuid',
        code: 'ALIM-001',
        description: 'Café Torrado e Moído Especial 500g',
        ncm: '0901.21.00',
        cest: '17.096.00',
        cfopDefault: '5102',
        unit: 'UN',
        unitPrice: 28.5,
        origin: '0',
        cstIcms: '102',
        csosn: '102',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    [
      'prod_2',
      {
        id: 'prod_2',
        organizationId: 'default-tenant-uuid',
        code: 'ALIM-002',
        description: 'Azeite de Oliva Extra Virgem 500ml',
        ncm: '1509.10.00',
        cest: '17.099.00',
        cfopDefault: '5102',
        unit: 'UN',
        unitPrice: 42.0,
        origin: '0',
        cstIcms: '102',
        csosn: '102',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    [
      'prod_3',
      {
        id: 'prod_3',
        organizationId: 'default-tenant-uuid',
        code: 'SERV-001',
        description: 'Consultoria e Auditoria em Sistemas Fiscais',
        ncm: '0000.00.00',
        cfopDefault: '5933',
        unit: 'HR',
        unitPrice: 150.0,
        origin: '0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  async list(tenantId: string): Promise<ProductDto[]> {
    return Array.from(this.products.values()).filter(
      (p) => p.organizationId === tenantId
    );
  }

  async getById(tenantId: string, id: string): Promise<ProductDto> {
    const prod = this.products.get(id);
    if (!prod || prod.organizationId !== tenantId) {
      throw new NotFoundException(`Produto com id ${id} não encontrado.`);
    }
    return prod;
  }

  async create(tenantId: string, data: Partial<ProductDto>): Promise<ProductDto> {
    const id = `prod_${Date.now()}`;
    const newProduct: ProductDto = {
      id,
      organizationId: tenantId,
      code: data.code || `PRD-${Date.now().toString().slice(-4)}`,
      description: data.description || 'Produto Novo',
      ncm: data.ncm || '0000.00.00',
      cest: data.cest || null,
      cfopDefault: data.cfopDefault || '5102',
      unit: data.unit || 'UN',
      unitPrice: Number(data.unitPrice) || 0,
      origin: data.origin || '0',
      cstIcms: data.cstIcms || '102',
      csosn: data.csosn || '102',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }
}

