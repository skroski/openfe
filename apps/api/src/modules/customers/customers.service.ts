import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerDto } from '@opennfe/shared';

@Injectable()
export class CustomersService {
  private customers: Map<string, CustomerDto> = new Map([
    [
      'cust_1',
      {
        id: 'cust_1',
        organizationId: 'default-tenant-uuid',
        documentType: 'CNPJ',
        documentNumber: '98.765.432/0001-10',
        name: 'Supermercados Alvorada LTDA',
        email: 'compras@alvoradasup.com.br',
        phone: '(11) 4567-8900',
        ie: '987.654.321.000',
        ieIndicator: '1',
        street: 'Avenida Brasil',
        number: '2500',
        complement: 'Setor C',
        neighborhood: 'Jardins',
        cityCode: '3550308',
        cityName: 'São Paulo',
        state: 'SP',
        zipCode: '01430-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    [
      'cust_2',
      {
        id: 'cust_2',
        organizationId: 'default-tenant-uuid',
        documentType: 'CPF',
        documentNumber: '123.456.789-00',
        name: 'Carlos Eduardo Oliveira',
        email: 'carlos.eduardo@gmail.com',
        phone: '(19) 99876-5432',
        ieIndicator: '9',
        street: 'Rua das Palmeiras',
        number: '120',
        neighborhood: 'Vila Nova',
        cityCode: '3509502',
        cityName: 'Campinas',
        state: 'SP',
        zipCode: '13020-000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  async list(tenantId: string): Promise<CustomerDto[]> {
    return Array.from(this.customers.values()).filter(
      (c) => c.organizationId === tenantId
    );
  }

  async getById(tenantId: string, id: string): Promise<CustomerDto> {
    const cust = this.customers.get(id);
    if (!cust || cust.organizationId !== tenantId) {
      throw new NotFoundException(`Destinatário ${id} não encontrado.`);
    }
    return cust;
  }

  async create(tenantId: string, data: Partial<CustomerDto>): Promise<CustomerDto> {
    const id = `cust_${Date.now()}`;
    const newCustomer: CustomerDto = {
      id,
      organizationId: tenantId,
      documentType: data.documentType || 'CNPJ',
      documentNumber: data.documentNumber || '00.000.000/0000-00',
      name: data.name || 'Cliente Novo',
      email: data.email || null,
      phone: data.phone || null,
      ie: data.ie || null,
      ieIndicator: data.ieIndicator || '9',
      street: data.street || 'Rua Principal',
      number: data.number || '10',
      complement: data.complement || null,
      neighborhood: data.neighborhood || 'Centro',
      cityCode: data.cityCode || '3550308',
      cityName: data.cityName || 'São Paulo',
      state: data.state || 'SP',
      zipCode: data.zipCode || '01000-000',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }
}

