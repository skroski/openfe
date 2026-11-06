import { Injectable, signal, computed, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CompanyDto,
  CustomerDto,
  DocumentStatus,
  FiscalDocumentDto,
  FiscalEnvironment,
  ProductDto,
} from '@opennfe/shared';
import { firstValueFrom } from 'rxjs';
import {
  buildDemoDocuments,
  DEMO_COMPANIES,
  DEMO_CUSTOMERS,
  DEMO_PRODUCTS,
  demoAccessKey,
} from '../data/demo-data';

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
  /** Vazio = "Todas as empresas". */
  readonly selectedCompanyId = signal<string>('');
  readonly documents = signal<FiscalDocumentDto[]>([]);
  readonly customers = signal<CustomerDto[]>([]);
  readonly products = signal<ProductDto[]>([]);
  readonly providers = signal<any[]>([]);
  private readonly serverKpis = signal<DashboardKpis | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  /** true quando a API não respondeu e o sistema mostra dados fictícios. */
  readonly demoMode = signal<boolean>(false);
  /** true quando a API não respondeu e a demonstração não foi ativada. */
  readonly connectionFailed = signal<boolean>(false);

  readonly activeCompany = computed<CompanyDto | null>(() => {
    const id = this.selectedCompanyId();
    return id ? (this.companies().find((c) => c.id === id) ?? null) : null;
  });

  /** Documentos da empresa escolhida no topo da tela (ou todos). */
  readonly scopedDocuments = computed(() => {
    const id = this.selectedCompanyId();
    return id ? this.documents().filter((d) => d.companyId === id) : this.documents();
  });

  readonly kpis = computed<DashboardKpis>(() => {
    const server = this.serverKpis();
    if (server && !this.demoMode() && !this.selectedCompanyId()) return server;
    return this.computeKpis(this.scopedDocuments());
  });

  /** Primeira carga; páginas abertas direto por link esperam por ela. */
  private readonly initialLoad: Promise<void>;

  constructor() {
    this.initialLoad = this.refreshAll();
  }

  /** Mensagem amigável a partir de um erro HTTP. */
  errorMessage(err: any, fallback = 'Não foi possível concluir a operação.'): string {
    if (err?.status === 404 || err?.status === 405) return 'Este recurso ainda não está disponível no servidor (API). A tela já está pronta para quando for liberado.';
    if (err?.status === 0) return 'Sem conexão com o servidor. Verifique se a API está ligada.';
    const msg = err?.error?.message;
    if (Array.isArray(msg)) return msg.join(' · ');
    return msg || err?.message || fallback;
  }

  private computeKpis(docs: FiscalDocumentDto[]): DashboardKpis {
    const authorized = docs.filter((d) => d.status === DocumentStatus.AUTHORIZED);
    const rejected = docs.filter((d) => d.status === DocumentStatus.REJECTED);
    const pending = docs.filter((d) =>
      [DocumentStatus.DRAFT, DocumentStatus.VALIDATED, DocumentStatus.QUEUED, DocumentStatus.PROCESSING].includes(d.status)
    );
    const sent = authorized.length + rejected.length;
    return {
      totalDocuments: docs.length,
      authorizedCount: authorized.length,
      rejectedCount: rejected.length,
      pendingCount: pending.length,
      totalAuthorizedValue: authorized.reduce((s, d) => s + Number(d.totalDocument), 0),
      approvalRate: sent ? Math.round((authorized.length / sent) * 100) : 0,
    };
  }

  async refreshAll(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.apiReachable = false;
    try {
      const results = await Promise.allSettled([
        this.loadCompanies(),
        this.loadDocuments(),
        this.loadCustomers(),
        this.loadProducts(),
        this.loadProviders(),
        this.loadKpis(),
      ]);
      // Nenhuma chamada funcionou: a API está fora do ar → exibe exemplos.
      void results;
      if (this.apiReachable) {
        this.demoMode.set(false);
        this.connectionFailed.set(false);
      } else if (this.demoAllowed()) {
        this.startDemo();
      } else {
        this.demoMode.set(false);
        this.connectionFailed.set(true);
      }
    } finally {
      this.loading.set(false);
    }
  }

  private apiReachable = false;

  /** Demonstração automática só em desenvolvimento ou com ?demo=1. Em produção, mostra erro. */
  private demoAllowed(): boolean {
    if (isDevMode()) return true;
    return typeof location !== 'undefined' && new URLSearchParams(location.search).has('demo');
  }

  /** Liga os dados de exemplo (nada vai à SEFAZ). Também usado pelo botão “Ver demonstração”. */
  startDemo(): void {
    this.connectionFailed.set(false);
    this.demoMode.set(true);
    this.companies.set(DEMO_COMPANIES);
    this.documents.set(buildDemoDocuments());
    this.customers.set(DEMO_CUSTOMERS);
    this.products.set(DEMO_PRODUCTS);
    this.providers.set([]);
    this.serverKpis.set(null);
  }

  private async load<R>(path: string, apply: (res: R) => void): Promise<void> {
    try {
      const res = await firstValueFrom(this.http.get<R>(`${this.baseUrl}${path}`));
      this.apiReachable = true;
      apply(res);
    } catch (err) {
      this.error.set(this.errorMessage(err));
    }
  }

  loadCompanies(): Promise<void> {
    return this.load<CompanyDto[]>('/companies', (r) => this.companies.set(r));
  }
  loadDocuments(): Promise<void> {
    return this.load<FiscalDocumentDto[]>('/documents', (r) => this.documents.set(r));
  }
  loadCustomers(): Promise<void> {
    return this.load<CustomerDto[]>('/customers', (r) => this.customers.set(r));
  }
  loadProducts(): Promise<void> {
    return this.load<ProductDto[]>('/products', (r) => this.products.set(r));
  }
  loadProviders(): Promise<void> {
    return this.load<any[]>('/providers', (r) => this.providers.set(r));
  }
  loadKpis(): Promise<void> {
    return this.load<DashboardKpis>('/documents/dashboard/kpis', (r) => this.serverKpis.set(r));
  }

  async getDocument(id: string): Promise<FiscalDocumentDto | null> {
    await this.initialLoad;
    const cached = this.documents().find((d) => d.id === id);
    if (this.demoMode()) return cached ?? null;
    try {
      return await firstValueFrom(this.http.get<FiscalDocumentDto>(`${this.baseUrl}/documents/${id}`));
    } catch {
      return cached ?? null;
    }
  }

  /** Endereço absoluto para baixar XML/PDF. Indisponível em modo demonstração. */
  fileUrl(path: string | null | undefined): string | null {
    if (!path || this.demoMode()) return null;
    return this.baseUrl.replace(/\/api\/v1$/, '') + path;
  }

  async createDraft(doc: Partial<FiscalDocumentDto>): Promise<FiscalDocumentDto> {
    if (this.demoMode()) {
      const company = this.companies().find((c) => c.id === doc.companyId);
      const created = {
        ...doc,
        id: `doc_demo_${Date.now()}`,
        organizationId: 'org_demo',
        companyName: company?.tradeName,
        status: DocumentStatus.DRAFT,
        environment: company?.environment ?? FiscalEnvironment.HOMOLOGATION,
        series: 1,
        number: null,
        operationType: 'OUTBOUND',
        totalIcms: 0, totalIpi: 0, totalPis: 0, totalCofins: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as FiscalDocumentDto;
      this.documents.update((docs) => [created, ...docs]);
      return created;
    }
    const created = await firstValueFrom(
      this.http.post<FiscalDocumentDto>(`${this.baseUrl}/documents`, doc)
    );
    this.documents.update((docs) => [created, ...docs]);
    await this.loadKpis();
    return created;
  }

  async validateDocument(id: string): Promise<{ valid: boolean; errors: string[] }> {
    if (this.demoMode()) return { valid: true, errors: [] };
    return firstValueFrom(
      this.http.post<{ valid: boolean; errors: string[] }>(`${this.baseUrl}/documents/${id}/validate`, {})
    );
  }

  async submitDocument(id: string): Promise<FiscalDocumentDto> {
    if (this.demoMode()) {
      const cur = this.documents().find((d) => d.id === id);
      if (!cur) throw new Error('Documento não encontrado.');
      const company = this.companies().find((c) => c.id === cur.companyId);
      const number = cur.number ?? 1300 + this.documents().filter((d) => d.number).length;
      const model = cur.documentType === 'NFCE' ? '65' : '55';
      const updated: FiscalDocumentDto = {
        ...cur,
        status: DocumentStatus.AUTHORIZED,
        number,
        accessKey: demoAccessKey(company?.state ?? 'SP', (company?.cnpj ?? '').replace(/\D/g, ''), model, cur.series || 1, number, Date.now() % 99999999),
        protocolNumber: `1352600${String(Date.now()).slice(-6)}`,
        authorizedAt: new Date().toISOString(),
        rejectionCode: null,
        rejectionReason: null,
      };
      this.documents.update((docs) => docs.map((d) => (d.id === id ? updated : d)));
      return updated;
    }
    const updated = await firstValueFrom(
      this.http.post<FiscalDocumentDto>(
        `${this.baseUrl}/documents/${id}/submit`,
        {},
        { headers: { 'X-Idempotency-Key': `idem_${id}_${Date.now()}` } }
      )
    );
    this.documents.update((docs) => docs.map((d) => (d.id === id ? updated : d)));
    await this.loadKpis();
    return updated;
  }

  async cancelDocument(id: string, justification: string): Promise<FiscalDocumentDto> {
    if (this.demoMode()) {
      const cur = this.documents().find((d) => d.id === id);
      if (!cur) throw new Error('Documento não encontrado.');
      const updated = { ...cur, status: DocumentStatus.CANCELLED };
      this.documents.update((docs) => docs.map((d) => (d.id === id ? updated : d)));
      return updated;
    }
    const updated = await firstValueFrom(
      this.http.post<FiscalDocumentDto>(`${this.baseUrl}/documents/${id}/cancel`, { justification })
    );
    this.documents.update((docs) => docs.map((d) => (d.id === id ? updated : d)));
    await this.loadKpis();
    return updated;
  }

  async testProviderConnection(
    providerKey: string,
    credentials: Record<string, string>,
    environment: FiscalEnvironment
  ) {
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/providers/test-connection`, { providerKey, credentials, environment })
    );
  }

  private async create<T extends { id: string }>(
    path: string,
    body: Partial<T>,
    list: { update: (fn: (l: T[]) => T[]) => void },
    demoDefaults: Partial<T>
  ): Promise<T> {
    if (this.demoMode()) {
      const created = {
        ...demoDefaults,
        ...body,
        id: `demo_${Date.now()}`,
        organizationId: 'org_demo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as T;
      list.update((l) => [created, ...l]);
      return created;
    }
    const created = await firstValueFrom(this.http.post<T>(`${this.baseUrl}${path}`, body));
    list.update((l) => [created, ...l]);
    return created;
  }

  /** Edição: usa PUT /<recurso>/:id. Em modo demonstração altera só a lista local. */
  private async update<T extends { id: string }>(
    path: string,
    id: string,
    body: Partial<T>,
    list: { update: (fn: (l: T[]) => T[]) => void }
  ): Promise<T> {
    if (this.demoMode()) {
      let result!: T;
      list.update((l) => l.map((x) => (x.id === id ? (result = { ...x, ...body, updatedAt: new Date().toISOString() }) : x)));
      return result;
    }
    const saved = await firstValueFrom(this.http.put<T>(`${this.baseUrl}${path}/${id}`, body));
    list.update((l) => l.map((x) => (x.id === id ? saved : x)));
    return saved;
  }

  updateCompany(id: string, body: Partial<CompanyDto>): Promise<CompanyDto> {
    return this.update<CompanyDto>('/companies', id, body, this.companies);
  }
  updateCustomer(id: string, body: Partial<CustomerDto>): Promise<CustomerDto> {
    return this.update<CustomerDto>('/customers', id, body, this.customers);
  }
  updateProduct(id: string, body: Partial<ProductDto>): Promise<ProductDto> {
    return this.update<ProductDto>('/products', id, body, this.products);
  }

  createCompany(company: Partial<CompanyDto>): Promise<CompanyDto> {
    return this.create<CompanyDto>('/companies', company, this.companies, { isActive: true });
  }
  createCustomer(customer: Partial<CustomerDto>): Promise<CustomerDto> {
    return this.create<CustomerDto>('/customers', customer, this.customers, {});
  }
  createProduct(product: Partial<ProductDto>): Promise<ProductDto> {
    return this.create<ProductDto>('/products', product, this.products, { origin: '0' });
  }

  async previewXml(xmlContent: string) {
    return firstValueFrom(this.http.post<any>(`${this.baseUrl}/imports/preview`, { xmlContent }));
  }

  async importXml(companyId: string, xmlContent: string, autoRegisterProducts = true) {
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

  async downloadMonthlyZip(companyId: string, year: number, month: number) {
    const blob = await firstValueFrom(
      this.http.get(`${this.baseUrl}/reports/monthly-zip`, {
        params: { companyId, year, month },
        responseType: 'blob',
      })
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fechamento_fiscal_${year}_${String(month).padStart(2, '0')}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async uploadCertificate(companyId: string, pfxBase64: string, passphrase: string) {
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/companies/${companyId}/certificate`, { pfxBase64, passphrase })
    );
  }

  async getCertificateStatus(companyId: string) {
    return firstValueFrom(this.http.get<any>(`${this.baseUrl}/companies/${companyId}/certificate`));
  }
}
