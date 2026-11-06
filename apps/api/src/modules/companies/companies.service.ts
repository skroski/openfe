import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyDto, FiscalEnvironment, TaxRegime } from '@opennfe/shared';

@Injectable()
export class CompaniesService {
  // In-memory persistent store initialized with demo data for reliable immediate execution
  private companies: Map<string, CompanyDto> = new Map([
    [
      'comp_1',
      {
        id: 'comp_1',
        organizationId: 'default-tenant-uuid',
        legalName: 'Matriz São Paulo Comércio de Alimentos LTDA',
        tradeName: 'Horizonte Alimentos SP',
        cnpj: '12.345.678/0001-90',
        stateRegistration: '123.456.789.110',
        municipalRegistration: '9876543',
        cnae: '4711-3/02',
        taxRegime: TaxRegime.SIMPLES_NACIONAL,
        environment: FiscalEnvironment.HOMOLOGATION,
        street: 'Avenida Paulista',
        number: '1000',
        complement: 'Conjunto 142',
        neighborhood: 'Bela Vista',
        cityCode: '3550308',
        cityName: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        email: 'fiscal@horizontealimentos.com.br',
        phone: '(11) 3210-9000',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    [
      'comp_2',
      {
        id: 'comp_2',
        organizationId: 'default-tenant-uuid',
        legalName: 'Filial Campinas Distribuidora LTDA',
        tradeName: 'Horizonte Campinas',
        cnpj: '12.345.678/0002-71',
        stateRegistration: '244.555.666.777',
        municipalRegistration: '123456',
        cnae: '4639-7/01',
        taxRegime: TaxRegime.LUCRO_PRESUMIDO,
        environment: FiscalEnvironment.HOMOLOGATION,
        street: 'Rua Barão de Jaguara',
        number: '550',
        complement: 'Galpão 3',
        neighborhood: 'Centro',
        cityCode: '3509502',
        cityName: 'Campinas',
        state: 'SP',
        zipCode: '13015-001',
        email: 'campinas@horizontealimentos.com.br',
        phone: '(19) 3780-4000',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  private providerConfigs: Map<string, any> = new Map([
    [
      'comp_1',
      {
        providerKey: 'FOCUS_NFE',
        environment: FiscalEnvironment.HOMOLOGATION,
        isConfigured: true,
        tokenPreview: 'tok_focus_homolog_***',
      },
    ],
    [
      'comp_2',
      {
        providerKey: 'MOCK_PROVIDER',
        environment: FiscalEnvironment.HOMOLOGATION,
        isConfigured: true,
        tokenPreview: 'mock_provider_local',
      },
    ],
  ]);

  async list(tenantId: string): Promise<CompanyDto[]> {
    return Array.from(this.companies.values()).filter(
      (c) => c.organizationId === tenantId
    );
  }

  async getById(tenantId: string, id: string): Promise<CompanyDto> {
    const comp = this.companies.get(id);
    if (!comp || comp.organizationId !== tenantId) {
      throw new NotFoundException(`Empresa com id ${id} não encontrada.`);
    }
    return comp;
  }

  async create(tenantId: string, data: Partial<CompanyDto>): Promise<CompanyDto> {
    const id = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newCompany: CompanyDto = {
      id,
      organizationId: tenantId,
      legalName: data.legalName || 'Nova Empresa LTDA',
      tradeName: data.tradeName || data.legalName || 'Nova Empresa',
      cnpj: data.cnpj || '00.000.000/0001-00',
      stateRegistration: data.stateRegistration || null,
      municipalRegistration: data.municipalRegistration || null,
      cnae: data.cnae || null,
      taxRegime: data.taxRegime || TaxRegime.SIMPLES_NACIONAL,
      environment: data.environment || FiscalEnvironment.HOMOLOGATION,
      street: data.street || 'Rua Principal',
      number: data.number || '100',
      complement: data.complement || null,
      neighborhood: data.neighborhood || 'Centro',
      cityCode: data.cityCode || '3550308',
      cityName: data.cityName || 'São Paulo',
      state: data.state || 'SP',
      zipCode: data.zipCode || '01001-000',
      email: data.email || 'contato@empresa.com.br',
      phone: data.phone || null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.companies.set(id, newCompany);
    return newCompany;
  }

  async getProviderConfig(tenantId: string, companyId: string) {
    await this.getById(tenantId, companyId);
    return this.providerConfigs.get(companyId) || {
      providerKey: 'MOCK_PROVIDER',
      environment: FiscalEnvironment.HOMOLOGATION,
      isConfigured: false,
    };
  }

  async updateProviderConfig(tenantId: string, companyId: string, config: any) {
    await this.getById(tenantId, companyId);
    this.providerConfigs.set(companyId, {
      ...config,
      isConfigured: Boolean(config.token || config.providerKey),
      tokenPreview: config.token ? `tok_${config.token.substring(0, 4)}***` : 'configurado',
    });
    return this.providerConfigs.get(companyId);
  }
}

