import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DocumentStatus, FiscalDocumentDto, FiscalDocumentItemDto, OperationType } from '@opennfe/shared';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { ToastService } from '../../core/services/toast.service';
import { DOCUMENT_TYPE_LABEL, formatDocument } from '../../core/utils/br';
import { DanfePreviewComponent } from '../../shared/components/danfe/danfe-preview.component';
import { FormFieldComponent } from '../../shared/components/form-field.component';
import { AppIconComponent } from '../../shared/components/icon.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

type DocType = 'NFE' | 'NFCE' | 'NFSE';

const STEPS = ['Empresa e operação', 'Cliente', 'Itens', 'Valores', 'Revisar e enviar'] as const;

const NATURES = [
  'VENDA DE MERCADORIA',
  'PRESTAÇÃO DE SERVIÇO',
  'DEVOLUÇÃO DE MERCADORIA',
  'REMESSA PARA CONSERTO',
] as const;
const OTHER = 'OUTRA';

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

@Component({
  selector: 'app-issuance',
  imports: [CurrencyPipe, RouterLink, AppIconComponent, DanfePreviewComponent, FormFieldComponent, PageHeaderComponent],
  template: `
    <div class="flex flex-col gap-6 max-w-5xl mx-auto">
      <app-page-header
        title="Emitir nota fiscal"
        description="Preencha 5 passos rápidos. No último, você vê como a nota vai ficar antes de enviar à SEFAZ."
        [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Notas fiscais', link: '/documentos' }, { label: 'Emitir nota' }]"
      >
        <a routerLink="/documentos" class="btn btn-ghost">Cancelar</a>
      </app-page-header>

      <!-- PASSOS -->
      <nav aria-label="Passos da emissão" class="card bg-base-100 border border-base-300 p-4 overflow-x-auto">
        <ol class="steps w-full min-w-[34rem]">
          @for (s of steps; track s; let i = $index) {
            <li class="step" [class.step-primary]="step() >= i + 1" [attr.aria-current]="step() === i + 1 ? 'step' : null">
              <button type="button" class="text-sm font-semibold px-1 cursor-pointer" [disabled]="i + 1 > maxReached()" (click)="step.set(i + 1)">{{ s }}</button>
            </li>
          }
        </ol>
      </nav>

      @if (errors().length) {
        <div class="alert alert-error alert-soft items-start" role="alert">
          <app-icon name="alert" [size]="20"></app-icon>
          <div>
            <strong>Corrija antes de continuar:</strong>
            <ul class="list-disc pl-5 mt-1 text-sm">
              @for (e of errors(); track e) { <li>{{ e }}</li> }
            </ul>
          </div>
        </div>
      }

      <!-- PASSO 1 -->
      @if (step() === 1) {
        <section class="card bg-base-100 border border-base-300 p-5 sm:p-6 grid gap-4 md:grid-cols-2" aria-labelledby="st1">
          <h2 id="st1" class="md:col-span-2 text-lg font-bold">Quem emite e que tipo de operação é</h2>

          <app-form-field label="Empresa que emite" for="e-company" [required]="true">
            <select id="e-company" class="select w-full" [value]="companyId()" (change)="companyId.set(val($event))">
              <option value="">Escolha a empresa…</option>
              @for (c of activeCompanies(); track c.id) { <option [value]="c.id">{{ c.tradeName }} — {{ c.state }}</option> }
            </select>
          </app-form-field>

          <app-form-field label="Tipo de nota" for="e-type" hint="Produtos para empresas: NF-e. Venda no balcão: NFC-e. Serviços: NFS-e.">
            <select id="e-type" class="select w-full" [value]="docType()" (change)="docType.set($any(val($event)))">
              @for (t of types; track t[0]) { <option [value]="t[0]">{{ t[1] }}</option> }
            </select>
          </app-form-field>

          <app-form-field label="Natureza da operação" for="e-nature" [required]="true">
            <select id="e-nature" class="select w-full" [value]="natureChoice()" (change)="natureChoice.set(val($event))">
              @for (n of natures; track n) { <option [value]="n">{{ n }}</option> }
              <option [value]="other">OUTRA (digitar)</option>
            </select>
          </app-form-field>
          @if (natureChoice() === other) {
            <app-form-field label="Descreva a natureza" for="e-nature2" [required]="true">
              <input id="e-nature2" class="input w-full uppercase" [value]="natureCustom()" (input)="natureCustom.set(val($event))" />
            </app-form-field>
          }

          @if (company(); as c) {
            <div class="md:col-span-2 rounded-lg p-4 flex flex-wrap items-center gap-3" [class]="c.environment === 'PRODUCTION' ? 'bg-error/10 border border-error' : 'bg-warning/15 border border-warning'">
              <app-icon [name]="c.environment === 'PRODUCTION' ? 'alert' : 'shield-check'" [size]="20"></app-icon>
              <p class="text-sm flex-1">
                @if (c.environment === 'PRODUCTION') {
                  <strong>Produção:</strong> esta nota terá <strong>valor fiscal real</strong> depois de autorizada.
                } @else {
                  <strong>Ambiente de testes:</strong> esta nota <strong>não tem valor fiscal</strong>. Ótimo para treinar.
                }
              </p>
            </div>
          }
        </section>
      }

      <!-- PASSO 2 -->
      @if (step() === 2) {
        <section class="card bg-base-100 border border-base-300 p-5 sm:p-6 flex flex-col gap-4" aria-labelledby="st2">
          <h2 id="st2" class="text-lg font-bold">Para quem é a nota</h2>

          @if (docType() === 'NFCE') {
            <label class="flex items-start gap-3 cursor-pointer rounded-lg border border-base-300 p-4">
              <input type="checkbox" class="checkbox checkbox-primary" [checked]="anonymous()" (change)="setAnonymous($event)" />
              <span class="text-sm"><strong>Consumidor não identificado.</strong> Permitido na NFC-e. Marque se o cliente não pediu CPF na nota.</span>
            </label>
          }

          @if (!anonymous()) {
            <app-form-field label="Cliente" for="e-cust" [required]="true" hint="Só aparecem clientes já cadastrados, para garantir CPF/CNPJ e endereço corretos.">
              <select id="e-cust" class="select w-full" [value]="customerId()" (change)="customerId.set(val($event))">
                <option value="">Escolha o cliente…</option>
                @for (c of api.customers(); track c.id) { <option [value]="c.id">{{ c.name }} — {{ fmtDoc(c.documentNumber) }}</option>}
              </select>
            </app-form-field>
            <a routerLink="/clientes" class="link text-sm self-start">Cliente não está na lista? Cadastre em “Clientes” e volte aqui.</a>

            @if (customer(); as c) {
              <div class="rounded-lg bg-base-200 p-4 text-sm grid gap-1 sm:grid-cols-2">
                <div><span class="text-base-content/70">Nome:</span> <strong>{{ c.name }}</strong></div>
                <div><span class="text-base-content/70">CPF/CNPJ:</span> <strong class="font-mono">{{ fmtDoc(c.documentNumber) }}</strong></div>
                <div><span class="text-base-content/70">Cidade:</span> {{ c.cityName }}/{{ c.state }}</div>
                <div><span class="text-base-content/70">E-mail:</span> {{ c.email || '—' }}</div>
              </div>
            }
          }
        </section>
      }

      <!-- PASSO 3 -->
      @if (step() === 3) {
        <section class="card bg-base-100 border border-base-300 p-5 sm:p-6 flex flex-col gap-4" aria-labelledby="st3">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <h2 id="st3" class="text-lg font-bold">O que está sendo vendido</h2>
            <label class="flex flex-col gap-1 w-full sm:w-80">
              <span class="text-sm font-semibold">Adicionar do catálogo</span>
              <select class="select w-full" (change)="addProduct($event)">
                <option value="">Escolha um produto ou serviço…</option>
                @for (p of api.products(); track p.id) { <option [value]="p.id">{{ p.code }} — {{ p.description }}</option> }
              </select>
            </label>
          </div>

          @if (items().length === 0) {
            <div class="rounded-lg border-2 border-dashed border-base-300 p-8 text-center text-base-content/70">
              Nenhum item ainda. Escolha um produto no catálogo acima.
              <a routerLink="/produtos" class="link block mt-1">Produto não existe? Cadastre em “Produtos e serviços”.</a>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr class="text-xs uppercase text-base-content/70">
                    <th>Item</th><th class="w-28 text-right">Quantidade</th><th class="w-36 text-right">Valor unit. (R$)</th><th class="w-32 text-right">Total</th><th class="w-12"><span class="sr-only">Remover</span></th>
                  </tr>
                </thead>
                <tbody>
                  @for (it of items(); track it.itemOrder) {
                    <tr>
                      <td>
                        <div class="font-medium">{{ it.description }}</div>
                        <div class="text-xs text-base-content/70 font-mono">{{ it.code }} · CFOP {{ it.cfop }} · {{ it.unit }}</div>
                      </td>
                      <td><input type="number" min="0" step="1" inputmode="decimal" class="input input-sm w-full text-right font-mono" [value]="it.quantity" (input)="setQty(it.itemOrder, $event)" [attr.aria-label]="'Quantidade de ' + it.description" /></td>
                      <td><input type="number" min="0" step="0.01" inputmode="decimal" class="input input-sm w-full text-right font-mono" [value]="it.unitPrice" (input)="setPrice(it.itemOrder, $event)" [attr.aria-label]="'Valor unitário de ' + it.description" /></td>
                      <td class="text-right font-semibold font-mono tabular">{{ it.totalPrice | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</td>
                      <td><button type="button" class="btn btn-ghost btn-sm btn-square text-error" (click)="removeItem(it.itemOrder)" [attr.aria-label]="'Remover ' + it.description"><app-icon name="trash" [size]="16"></app-icon></button></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            @if (cfopAdjusted()) {
              <p class="text-sm text-base-content/70 flex items-start gap-2"><app-icon name="info" [size]="16" customClass="mt-0.5 shrink-0"></app-icon> O CFOP foi ajustado automaticamente: vendas para outro estado usam 6xxx; no mesmo estado, 5xxx.</p>
            }
          }
        </section>
      }

      <!-- PASSO 4 -->
      @if (step() === 4) {
        <section class="card bg-base-100 border border-base-300 p-5 sm:p-6 grid gap-4 md:grid-cols-2" aria-labelledby="st4">
          <h2 id="st4" class="md:col-span-2 text-lg font-bold">Frete e desconto</h2>
          @if (docType() === 'NFE') {
            <app-form-field label="Frete (R$)" for="e-ship" hint="Deixe 0 se não há frete cobrado na nota.">
              <input id="e-ship" type="number" min="0" step="0.01" inputmode="decimal" class="input w-full font-mono" [value]="shipping()" (input)="shipping.set(num($event))" />
            </app-form-field>
          }
          <app-form-field label="Desconto (R$)" for="e-disc" hint="Não pode ser maior que o total dos produtos.">
            <input id="e-disc" type="number" min="0" step="0.01" inputmode="decimal" class="input w-full font-mono" [value]="discount()" (input)="discount.set(num($event))" />
          </app-form-field>

          <dl class="md:col-span-2 rounded-lg bg-base-200 p-4 grid gap-2 text-sm">
            <div class="flex justify-between"><dt>Total dos produtos</dt><dd class="font-mono tabular">{{ totalProducts() | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</dd></div>
            <div class="flex justify-between"><dt>+ Frete</dt><dd class="font-mono tabular">{{ effectiveShipping() | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</dd></div>
            <div class="flex justify-between"><dt>− Desconto</dt><dd class="font-mono tabular">{{ discount() | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</dd></div>
            <div class="flex justify-between border-t border-base-300 pt-2 text-lg font-bold"><dt>Total da nota</dt><dd class="font-mono tabular">{{ totalDocument() | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</dd></div>
          </dl>
        </section>
      }

      <!-- PASSO 5 -->
      @if (step() === 5) {
        <section class="flex flex-col gap-4" aria-labelledby="st5">
          <div class="card bg-base-100 border border-base-300 p-5 sm:p-6 flex flex-col gap-2">
            <h2 id="st5" class="text-lg font-bold">Confira antes de enviar</h2>
            <p class="text-sm text-base-content/70">Abaixo está a prévia de como a nota vai ficar. Depois de autorizada pela SEFAZ, ela só pode ser corrigida por cancelamento.</p>
          </div>
          <app-danfe-preview [doc]="draft()" [company]="company()" [customer]="customer()" [forceWatermark]="true" />
        </section>
      }

      <!-- NAVEGAÇÃO -->
      <div class="flex flex-wrap items-center justify-between gap-3 sticky bottom-0 bg-base-200/95 backdrop-blur py-3 -mx-1 px-1 border-t border-base-300">
        <button type="button" class="btn btn-ghost" [disabled]="step() === 1 || busy()" (click)="back()">
          <app-icon name="chevron-left" [size]="18"></app-icon> Voltar
        </button>
        <div class="flex flex-wrap items-center gap-2">
          @if (step() === 5) {
            <button type="button" class="btn btn-outline" [disabled]="busy()" (click)="save(false)">
              <app-icon name="save" [size]="18"></app-icon> Salvar como rascunho
            </button>
            <button type="button" class="btn btn-primary" [disabled]="busy()" (click)="save(true)">
              @if (busy()) { <span class="loading loading-spinner loading-xs"></span> } @else { <app-icon name="send" [size]="18"></app-icon> }
              Enviar para a SEFAZ
            </button>
          } @else {
            <button type="button" class="btn btn-primary" (click)="next()">
              Continuar <app-icon name="chevron-right" [size]="18"></app-icon>
            </button>
          }
        </div>
      </div>
    </div>
  `,
})
export class IssuanceComponent {
  readonly api = inject(FiscalApiService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly steps = STEPS;
  readonly natures = NATURES;
  readonly other = OTHER;
  readonly types = Object.entries(DOCUMENT_TYPE_LABEL);

  readonly step = signal(1);
  readonly maxReached = signal(1);
  readonly errors = signal<string[]>([]);
  readonly busy = signal(false);
  readonly cfopAdjusted = signal(false);

  readonly companyId = signal('');
  readonly docType = signal<DocType>('NFE');
  readonly natureChoice = signal<string>(NATURES[0]);
  readonly natureCustom = signal('');
  readonly customerId = signal('');
  readonly anonymous = signal(false);
  readonly items = signal<FiscalDocumentItemDto[]>([]);
  readonly shipping = signal(0);
  readonly discount = signal(0);

  readonly activeCompanies = computed(() => this.api.companies().filter((c) => c.isActive));
  readonly company = computed(() => this.api.companies().find((c) => c.id === this.companyId()) ?? null);
  readonly customer = computed(() => this.api.customers().find((c) => c.id === this.customerId()) ?? null);
  readonly nature = computed(() => (this.natureChoice() === OTHER ? this.natureCustom().trim().toUpperCase() : this.natureChoice()));

  readonly totalProducts = computed(() => round2(this.items().reduce((s, i) => s + i.totalPrice, 0)));
  readonly effectiveShipping = computed(() => (this.docType() === 'NFE' ? this.shipping() : 0));
  readonly totalDocument = computed(() => round2(this.totalProducts() + this.effectiveShipping() - this.discount()));

  /** Documento montado com o que foi digitado; alimenta a prévia do passo 5. */
  readonly draft = computed<FiscalDocumentDto>(() => ({
    id: 'preview',
    organizationId: '',
    companyId: this.companyId(),
    companyName: this.company()?.tradeName,
    customerId: this.anonymous() ? null : this.customerId() || null,
    customerName: this.anonymous() ? null : (this.customer()?.name ?? null),
    customerDocument: this.anonymous() ? null : (this.customer()?.documentNumber ?? null),
    documentType: this.docType() as FiscalDocumentDto['documentType'],
    status: DocumentStatus.DRAFT,
    environment: this.company()?.environment ?? ('HOMOLOGATION' as FiscalDocumentDto['environment']),
    series: 1,
    number: null,
    operationNature: this.nature(),
    operationType: OperationType.OUTBOUND,
    totalProducts: this.totalProducts(),
    totalDiscount: this.discount(),
    totalIcms: 0, totalIpi: 0, totalPis: 0, totalCofins: 0,
    totalShipping: this.effectiveShipping(),
    totalDocument: this.totalDocument(),
    items: this.items(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  constructor() {
    // Empresa padrão: a escolhida no topo da tela ou a única ativa.
    effect(() => {
      const list = this.activeCompanies();
      const preferred = this.api.activeCompany();
      untracked(() => {
        if (this.companyId()) return;
        if (preferred?.isActive) this.companyId.set(preferred.id);
        else if (list.length === 1) this.companyId.set(list[0].id);
      });
    });
    // Regra: se a empresa ou o cliente mudam, o CFOP (5xxx × 6xxx) acompanha o estado.
    effect(() => {
      const from = this.company()?.state;
      const to = this.customer()?.state;
      untracked(() => this.syncCfop(from, to));
    });
    // NFS-e é nota de serviço.
    effect(() => {
      const t = this.docType();
      untracked(() => {
        if (t === 'NFSE' && this.natureChoice() === NATURES[0]) this.natureChoice.set('PRESTAÇÃO DE SERVIÇO');
        if (t !== 'NFSE' && this.natureChoice() === 'PRESTAÇÃO DE SERVIÇO') this.natureChoice.set(NATURES[0]);
        if (t !== 'NFCE') this.anonymous.set(false);
      });
    });
  }

  fmtDoc = formatDocument;
  val(e: Event): string {
    return (e.target as HTMLInputElement | HTMLSelectElement).value;
  }
  num(e: Event): number {
    const n = Number(this.val(e));
    return Number.isFinite(n) && n > 0 ? round2(n) : 0;
  }

  setAnonymous(e: Event): void {
    const on = (e.target as HTMLInputElement).checked;
    this.anonymous.set(on);
    if (on) this.customerId.set('');
  }

  addProduct(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const p = this.api.products().find((x) => x.id === select.value);
    select.value = '';
    if (!p) return;
    const price = Number(p.unitPrice);
    const existing = this.items().find((i) => i.code === p.code);
    if (existing) {
      this.setQuantity(existing.itemOrder, existing.quantity + 1);
      return;
    }
    const cfop = this.cfopFor(p.cfopDefault, this.company()?.state, this.customer()?.state);
    if (cfop !== p.cfopDefault) this.cfopAdjusted.set(true);
    this.items.update((list) => [
      ...list,
      {
        itemOrder: list.length + 1,
        code: p.code,
        description: p.description,
        ncm: p.ncm,
        cfop,
        unit: p.unit,
        quantity: 1,
        unitPrice: price,
        totalPrice: round2(price),
        icmsCst: p.csosn ?? p.cstIcms ?? '102',
      },
    ]);
  }

  setQty(order: number, e: Event): void {
    this.setQuantity(order, Number(this.val(e)));
  }
  private setQuantity(order: number, q: number): void {
    const qty = Number.isFinite(q) && q > 0 ? q : 0;
    this.items.update((l) => l.map((i) => (i.itemOrder === order ? { ...i, quantity: qty, totalPrice: round2(qty * i.unitPrice) } : i)));
  }
  setPrice(order: number, e: Event): void {
    const n = Number(this.val(e));
    const price = Number.isFinite(n) && n > 0 ? round2(n) : 0;
    this.items.update((l) => l.map((i) => (i.itemOrder === order ? { ...i, unitPrice: price, totalPrice: round2(i.quantity * price) } : i)));
  }
  removeItem(order: number): void {
    this.items.update((l) => l.filter((i) => i.itemOrder !== order).map((i, idx) => ({ ...i, itemOrder: idx + 1 })));
  }

  /** Operação dentro do estado = 5xxx; para outro estado = 6xxx. */
  private cfopFor(cfop: string, from?: string, to?: string): string {
    if (!from || !to || !/^[56]\d{3}$/.test(cfop)) return cfop;
    return (from === to ? '5' : '6') + cfop.slice(1);
  }
  private syncCfop(from?: string, to?: string): void {
    let changed = false;
    this.items.update((list) =>
      list.map((i) => {
        const next = this.cfopFor(i.cfop, from, to);
        if (next !== i.cfop) changed = true;
        return next === i.cfop ? i : { ...i, cfop: next };
      })
    );
    if (changed) this.cfopAdjusted.set(true);
  }

  private validate(step: number): string[] {
    const errs: string[] = [];
    if (step === 1) {
      if (!this.company()) errs.push('Escolha a empresa que emite a nota.');
      else if (this.docType() === 'NFSE' && !this.company()!.municipalRegistration) errs.push('Para NFS-e, a empresa precisa ter Inscrição Municipal cadastrada.');
      else if (this.docType() !== 'NFSE' && !this.company()!.stateRegistration) errs.push('A empresa não tem Inscrição Estadual cadastrada. Confira em “Empresas” antes de emitir NF-e/NFC-e.');
      if (!this.nature()) errs.push('Informe a natureza da operação.');
    }
    if (step === 2 && !this.anonymous() && !this.customer()) errs.push('Escolha o cliente da nota.');
    if (step === 3) {
      if (this.items().length === 0) errs.push('Adicione pelo menos um item.');
      for (const i of this.items()) {
        if (i.quantity <= 0) errs.push(`“${i.description}”: a quantidade precisa ser maior que zero.`);
        if (i.unitPrice <= 0) errs.push(`“${i.description}”: o valor unitário precisa ser maior que zero.`);
      }
    }
    if (step === 4) {
      if (this.discount() > this.totalProducts()) errs.push('O desconto não pode ser maior que o total dos produtos.');
      if (this.totalDocument() <= 0) errs.push('O total da nota precisa ser maior que zero.');
    }
    return errs;
  }

  next(): void {
    const errs = this.validate(this.step());
    this.errors.set(errs);
    if (errs.length) return;
    const n = this.step() + 1;
    this.step.set(n);
    this.maxReached.update((m) => Math.max(m, n));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  back(): void {
    this.errors.set([]);
    this.step.update((s) => Math.max(1, s - 1));
  }

  async save(transmit: boolean): Promise<void> {
    // Revalida tudo: o usuário pode ter voltado e alterado algo.
    const all = [1, 2, 3, 4].flatMap((s) => this.validate(s));
    this.errors.set(all);
    if (all.length) return;

    this.busy.set(true);
    let draftId: string | null = null;
    try {
      const d = this.draft();
      const created = await this.api.createDraft({
        companyId: d.companyId,
        customerId: d.customerId,
        customerName: d.customerName,
        customerDocument: d.customerDocument,
        documentType: d.documentType,
        operationNature: d.operationNature,
        totalProducts: d.totalProducts,
        totalShipping: d.totalShipping,
        totalDiscount: d.totalDiscount,
        totalDocument: d.totalDocument,
        items: d.items,
      });
      draftId = created.id;
      if (!transmit) {
        this.toast.success('Rascunho salvo. Você pode enviar depois, na lista de notas.');
        await this.router.navigate(['/documentos', created.id]);
        return;
      }
      const sent = await this.api.submitDocument(created.id);
      if (sent.status === DocumentStatus.REJECTED) this.toast.error(sent.rejectionReason ?? 'A SEFAZ rejeitou a nota.');
      else if (sent.status === DocumentStatus.AUTHORIZED) this.toast.success(`Nota Nº ${sent.number} autorizada.`);
      else this.toast.info('Nota enviada. Aguardando a resposta da SEFAZ.');
      await this.router.navigate(['/documentos', created.id]);
    } catch (err: any) {
      const list: string[] = err?.error?.errors ?? [this.api.errorMessage(err, 'Não foi possível enviar a nota.')];
      this.errors.set(list);
      if (draftId) this.toast.warning('O rascunho foi salvo, mas o envio falhou. Corrija e envie pela lista de notas.');
    } finally {
      this.busy.set(false);
    }
  }
}
