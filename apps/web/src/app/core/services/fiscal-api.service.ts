import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CompanyDto,
  CustomerDto,
  FiscalDocumentDto,
  FiscalEnvironment,
  ProductDto,
} from '@opennfe/shared';
import { firstValueFrom } from 'rxjs';

export interface DashboardKpis {
  totalDocuments: number;
  authorizedCount: number;
  rejectedCount: number;
  pendingCount: number;
  totalAuthorizedValue: number;
  approvalRate: number;
}

@Injectable({
  providedIn: 'root',
})
export class FiscalApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/v1';

  // Reactive State via Signals
  readonly companies = signal<CompanyDto[]>([]);
  readonly selectedCompanyId = signal<string>('comp_1');
  readonly documents = signal<FiscalDocumentDto[]>([]);
  readonly customers = signal<CustomerDto[]>([]);
  readonly products = signal<ProductDto[]>([]);
  readonly providers = signal<any[]>([]);
  readonly kpis = signal<DashboardKpis>({
    totalDocuments: 3,
    authorizedCount: 1,
    rejectedCount: 1,
    pendingCount: 1,
    totalAuthorizedValue: 1425.0,
    approvalRate: 33,
  });
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly activeCompany = computed<CompanyDto | null>(() => {
    const list = this.companies();
    const id = this.selectedCompanyId();
    return list.find((c) => c.id === id) || list[0] || null;
  });

  constructor() {
    this.refreshAll();
  }

  async refreshAll(): Promise<void> {
    this.loading.set(true);
    try {
      await Promise.allSettled([
        this.loadCompanies(),
        this.loadDocuments(),
        this.loadCustomers(),
        this.loadProducts(),
        this.loadProviders(),
        this.loadKpis(),
      ]);
    } finally {
      this.loading.set(false);
    }
  }

  async loadCompanies(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<CompanyDto[]>(`${this.baseUrl}/companies`)
      );
      this.companies.set(res);
      if (res.length > 0 && !this.selectedCompanyId()) {
        this.selectedCompanyId.set(res[0].id);
      }
    } catch {
      // Fallback initial in-memory
    }
  }

  async loadDocuments(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<FiscalDocumentDto[]>(`${this.baseUrl}/documents`)
      );
      this.documents.set(res);
    } catch {
      // Fallback initial
    }
  }

  async loadCustomers(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<CustomerDto[]>(`${this.baseUrl}/customers`)
      );
      this.customers.set(res);
    } catch {
      // Fallback
    }
  }

  async loadProducts(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<ProductDto[]>(`${this.baseUrl}/products`)
      );
      this.products.set(res);
    } catch {
      // Fallback
    }
  }

  async loadProviders(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<any[]>(`${this.baseUrl}/providers`)
      );
      this.providers.set(res);
    } catch {
      // Fallback
    }
  }

  async loadKpis(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<DashboardKpis>(`${this.baseUrl}/documents/dashboard/kpis`)
      );
      this.kpis.set(res);
    } catch {
      // Keep state
    }
  }

  async createDraft(doc: Partial<FiscalDocumentDto>): Promise<FiscalDocumentDto> {
    const created = await firstValueFrom(
      this.http.post<FiscalDocumentDto>(`${this.baseUrl}/documents`, doc)
    );
    this.documents.update((docs) => [created, ...docs]);
    await this.loadKpis();
    return created;
  }

  async validateDocument(id: string): Promise<{ valid: boolean; errors: string[] }> {
    return firstValueFrom(
      this.http.post<{ valid: boolean; errors: string[] }>(
        `${this.baseUrl}/documents/${id}/validate`,
        {}
      )
    );
  }

  async submitDocument(id: string): Promise<FiscalDocumentDto> {
    const updated = await firstValueFrom(
      this.http.post<FiscalDocumentDto>(
        `${this.baseUrl}/documents/${id}/submit`,
        {},
        {
          headers: {
            'X-Idempotency-Key': `idem_${id}_${Date.now()}`,
          },
        }
      )
    );
    this.documents.update((docs) =>
      docs.map((d) => (d.id === id ? updated : d))
    );
    await this.loadKpis();
    return updated;
  }

  async cancelDocument(id: string, justification: string): Promise<FiscalDocumentDto> {
    const updated = await firstValueFrom(
      this.http.post<FiscalDocumentDto>(
        `${this.baseUrl}/documents/${id}/cancel`,
        { justification }
      )
    );
    this.documents.update((docs) =>
      docs.map((d) => (d.id === id ? updated : d))
    );
    await this.loadKpis();
    return updated;
  }

  async testProviderConnection(
    providerKey: string,
    credentials: Record<string, string>,
    environment: FiscalEnvironment
  ) {
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/providers/test-connection`, {
        providerKey,
        credentials,
        environment,
      })
    );
  }

  async createCompany(company: Partial<CompanyDto>): Promise<CompanyDto> {
    const created = await firstValueFrom(
      this.http.post<CompanyDto>(`${this.baseUrl}/companies`, company)
    );
    this.companies.update((list) => [...list, created]);
    return created;
  }

  async createCustomer(customer: Partial<CustomerDto>): Promise<CustomerDto> {
    const created = await firstValueFrom(
      this.http.post<CustomerDto>(`${this.baseUrl}/customers`, customer)
    );
    this.customers.update((list) => [...list, created]);
    return created;
  }

  async createProduct(product: Partial<ProductDto>): Promise<ProductDto> {
    const created = await firstValueFrom(
      this.http.post<ProductDto>(`${this.baseUrl}/products`, product)
    );
    this.products.update((list) => [...list, created]);
    return created;
  }

  async previewXml(xmlContent: string) {
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/imports/preview`, { xmlContent })
    );
  }

  async importXml(
    companyId: string,
    xmlContent: string,
    autoRegisterProducts = true
  ) {
    const res = await firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/imports/xml`, {
        companyId,
        xmlContent,
        autoRegisterProducts,
        autoRegisterEntities: true,
      })
    );
    await this.refreshAll();
    return res;
  }

  async downloadMonthlyZip(companyId: string, year?: number, month?: number) {
    const params: any = { companyId };
    if (year) params.year = year;
    if (month) params.month = month;

    const blob = await firstValueFrom(
      this.http.get(`${this.baseUrl}/reports/monthly-zip`, {
        params,
        responseType: 'blob',
      })
    );

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fechamento_fiscal_${year || 2026}_${month || 11}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async uploadCertificate(companyId: string, pfxBase64: string, passphrase: string) {
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/companies/${companyId}/certificate`, {
        pfxBase64,
        passphrase,
      })
    );
  }

  async getCertificateStatus(companyId: string) {
    return firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/companies/${companyId}/certificate`)
    );
  }
}

