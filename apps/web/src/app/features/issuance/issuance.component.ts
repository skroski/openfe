import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import {
  DocumentType,
  FiscalDocumentItemDto,
} from '@opennfe/shared';
import { AppIconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-issuance',
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold tracking-wider text-base-content/50 uppercase" style="font-family: var(--font-display);">
            EMISSÃO FISCAL · PASSO A PASSO
          </span>
          <h1 class="text-3xl font-light text-base-content mt-1">
            <strong class="font-bold">Emitir</strong> Documento Fiscal
          </h1>
          <p class="text-sm text-base-content/60">
            Fluxo guiado com conferência tributária e validação de regras de domínio antes do envio
          </p>
        </div>
        <a routerLink="/documentos" class="btn btn-sm btn-ghost">Cancelar</a>
      </div>

      <!-- Step Indicator (DaisyUI Steps) -->
      <ul class="steps steps-horizontal w-full bg-base-100 p-4 rounded-xl border border-base-300 shadow-xs text-xs font-semibold">
        <li class="step" [class.step-primary]="currentStep() >= 1">1. Emitente & Operação</li>
        <li class="step" [class.step-primary]="currentStep() >= 2">2. Destinatário</li>
        <li class="step" [class.step-primary]="currentStep() >= 3">3. Produtos & Serviços</li>
        <li class="step" [class.step-primary]="currentStep() >= 4">4. Transporte & Totais</li>
        <li class="step" [class.step-primary]="currentStep() >= 5">5. Revisão & Envio</li>
      </ul>

      <!-- Step 1: Emitente & Operação -->
      @if (currentStep() === 1) {
        <div class="card bg-base-100 border border-base-300 shadow-xs p-6 space-y-4">
          <h2 class="text-lg font-bold flex items-center gap-2 border-b border-base-200 pb-3">
            <app-icon name="companies" [size]="20" customClass="text-primary"></app-icon>
            Dados da Operação e Emitente
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-xs">Empresa Emitente *</span></label>
              <select class="select select-bordered select-sm" [(ngModel)]="companyId">
                @for (c of api.companies(); track c.id) {
                  <option [value]="c.id">{{ c.tradeName }} (CNPJ: {{ c.cnpj }})</option>
                }
              </select>
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-xs">Modelo do Documento *</span></label>
              <select class="select select-bordered select-sm" [(ngModel)]="documentType">
                <option value="NFE">NF-e — Nota Fiscal Eletrônica (Mod. 55)</option>
                <option value="NFCE">NFC-e — Cupom Fiscal do Consumidor (Mod. 65)</option>
                <option value="NFSE">NFS-e — Nota Fiscal de Serviço Municipal</option>
              </select>
            </div>

            <div class="form-control md:col-span-2">
              <label class="label"><span class="label-text font-semibold text-xs">Natureza da Operação *</span></label>
              <input
                type="text"
                class="input input-bordered input-sm"
                placeholder="Ex: VENDA DE MERCADORIA ADQUIRIDA DE TERCEIROS"
                [(ngModel)]="operationNature"
              />
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button type="button" class="btn btn-sm btn-primary text-white gap-2" (click)="goToStep(2)">
              Avançar para Destinatário
              <app-icon name="chevron-right" [size]="16"></app-icon>
            </button>
          </div>
        </div>
      }

      <!-- Step 2: Destinatário -->
      @if (currentStep() === 2) {
        <div class="card bg-base-100 border border-base-300 shadow-xs p-6 space-y-4">
          <h2 class="text-lg font-bold flex items-center gap-2 border-b border-base-200 pb-3">
            <app-icon name="users" [size]="20" customClass="text-primary"></app-icon>
            Dados do Destinatário
          </h2>

          <div class="form-control">
            <label class="label"><span class="label-text font-semibold text-xs">Selecionar Destinatário Cadastrado</span></label>
            <select class="select select-bordered select-sm" (change)="onSelectCustomer($event)">
              <option value="">-- Selecione ou digite manualmente abaixo --</option>
              @for (cust of api.customers(); track cust.id) {
                <option [value]="cust.id">{{ cust.name }} ({{ cust.documentNumber }})</option>
              }
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-xs">Nome / Razão Social *</span></label>
              <input type="text" class="input input-bordered input-sm" [(ngModel)]="customerName" placeholder="Razão Social ou Nome Completo" />
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-xs">CPF / CNPJ *</span></label>
              <input type="text" class="input input-bordered input-sm" [(ngModel)]="customerDocument" placeholder="00.000.000/0000-00" />
            </div>
          </div>

          <div class="flex justify-between pt-4">
            <button type="button" class="btn btn-sm btn-ghost gap-2" (click)="goToStep(1)">
              <app-icon name="chevron-left" [size]="16"></app-icon>
              Voltar
            </button>
            <button type="button" class="btn btn-sm btn-primary text-white gap-2" (click)="goToStep(3)">
              Avançar para Itens
              <app-icon name="chevron-right" [size]="16"></app-icon>
            </button>
          </div>
        </div>
      }

      <!-- Step 3: Produtos & Serviços -->
      @if (currentStep() === 3) {
        <div class="card bg-base-100 border border-base-300 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-base-200 pb-3">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <app-icon name="products" [size]="20" customClass="text-primary"></app-icon>
              Itens do Documento Fiscal
            </h2>
            <div class="flex gap-2">
              <select class="select select-bordered select-sm text-xs" (change)="addProductFromCatalog($event)">
                <option value="">+ Adicionar do Catálogo</option>
                @for (p of api.products(); track p.id) {
                  <option [value]="p.id">{{ p.code }} — {{ p.description }}</option>
                }
              </select>
            </div>
          </div>

          <!-- Items Table -->
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead class="bg-base-200/50">
                <tr class="text-xs text-base-content/60">
                  <th>#</th>
                  <th>CÓDIGO</th>
                  <th>DESCRIÇÃO</th>
                  <th>NCM</th>
                  <th>CFOP</th>
                  <th>QTD</th>
                  <th>VALOR UN.</th>
                  <th>TOTAL</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (item of items(); track item.itemOrder) {
                  <tr>
                    <td class="font-mono text-xs">{{ item.itemOrder }}</td>
                    <td><input type="text" class="input input-xs input-bordered w-20 font-mono" [(ngModel)]="item.code" /></td>
                    <td><input type="text" class="input input-xs input-bordered w-48" [(ngModel)]="item.description" /></td>
                    <td><input type="text" class="input input-xs input-bordered w-24 font-mono" [(ngModel)]="item.ncm" /></td>
                    <td><input type="text" class="input input-xs input-bordered w-16 font-mono" [(ngModel)]="item.cfop" /></td>
                    <td><input type="number" class="input input-xs input-bordered w-16 text-right font-mono" [(ngModel)]="item.quantity" (ngModelChange)="updateItemTotal(item)" /></td>
                    <td><input type="number" class="input input-xs input-bordered w-20 text-right font-mono" [(ngModel)]="item.unitPrice" (ngModelChange)="updateItemTotal(item)" /></td>
                    <td class="font-mono font-bold">{{ item.totalPrice | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td>
                    <td>
                      <button type="button" class="btn btn-ghost btn-xs text-error p-1" (click)="removeItem(item.itemOrder)">
                        <app-icon name="trash" [size]="14"></app-icon>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="flex justify-end p-3 bg-base-200/40 rounded-lg text-sm">
            <span>Subtotal dos Produtos: <strong class="font-mono text-base ml-2">{{ totalProducts() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></span>
          </div>

          <div class="flex justify-between pt-4">
            <button type="button" class="btn btn-sm btn-ghost gap-2" (click)="goToStep(2)">
              <app-icon name="chevron-left" [size]="16"></app-icon>
              Voltar
            </button>
            <button type="button" class="btn btn-sm btn-primary text-white gap-2" [disabled]="items().length === 0" (click)="goToStep(4)">
              Avançar para Totais
              <app-icon name="chevron-right" [size]="16"></app-icon>
            </button>
          </div>
        </div>
      }

      <!-- Step 4: Transporte & Totais -->
      @if (currentStep() === 4) {
        <div class="card bg-base-100 border border-base-300 shadow-xs p-6 space-y-4">
          <h2 class="text-lg font-bold flex items-center gap-2 border-b border-base-200 pb-3">
            <app-icon name="truck" [size]="20" customClass="text-primary"></app-icon>
            Transporte e Apuração de Tributos
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-xs">Valor do Frete (R$)</span></label>
              <input type="number" class="input input-bordered input-sm font-mono" [(ngModel)]="totalShipping" />
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-xs">Desconto Comercial (R$)</span></label>
              <input type="number" class="input input-bordered input-sm font-mono" [(ngModel)]="totalDiscount" />
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-xs">Modalidade do Frete</span></label>
              <select class="select select-bordered select-sm text-xs">
                <option value="9">9 — Sem Ocorrência de Transporte</option>
                <option value="0">0 — Por conta do Emitente (CIF)</option>
                <option value="1">1 — Por conta do Destinatário (FOB)</option>
              </select>
            </div>
          </div>

          <div class="p-4 rounded-lg bg-base-200/50 border border-base-300 space-y-2 text-xs">
            <div class="font-bold text-sm text-base-content">Resumo de Impostos Calculados</div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono">
              <div>ICMS Previsto: <span class="font-bold">{{ (totalProducts() * 0.18) | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span></div>
              <div>PIS Previsto: <span class="font-bold">{{ (totalProducts() * 0.0165) | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span></div>
              <div>COFINS Previsto: <span class="font-bold">{{ (totalProducts() * 0.076) | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span></div>
              <div>Total da Nota: <span class="font-bold text-emerald-600 text-sm">{{ totalDocument() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span></div>
            </div>
          </div>

          <div class="flex justify-between pt-4">
            <button type="button" class="btn btn-sm btn-ghost gap-2" (click)="goToStep(3)">
              <app-icon name="chevron-left" [size]="16"></app-icon>
              Voltar
            </button>
            <button type="button" class="btn btn-sm btn-primary text-white gap-2" (click)="goToStep(5)">
              Avançar para Revisão & Envio
              <app-icon name="chevron-right" [size]="16"></app-icon>
            </button>
          </div>
        </div>
      }

      <!-- Step 5: Revisão & Transmissão -->
      @if (currentStep() === 5) {
        <div class="card bg-base-100 border border-base-300 shadow-xs p-6 space-y-6">
          <h2 class="text-lg font-bold flex items-center gap-2 border-b border-base-200 pb-3">
            <app-icon name="check" [size]="20" customClass="text-success"></app-icon>
            Conferência Final da Nota Fiscal
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="p-4 rounded-lg bg-base-200/40 border border-base-300 space-y-2">
              <div class="font-bold uppercase tracking-wider text-base-content/60">Dados do Documento</div>
              <div><strong>Emitente:</strong> {{ getCompanyName() }}</div>
              <div><strong>Destinatário:</strong> {{ customerName }} ({{ customerDocument }})</div>
              <div><strong>Operação:</strong> {{ operationNature }}</div>
              <div><strong>Modelo:</strong> {{ documentType }} · Ambiente Homologação</div>
            </div>

            <div class="p-4 rounded-lg bg-base-200/40 border border-base-300 space-y-2">
              <div class="font-bold uppercase tracking-wider text-base-content/60">Valores Totais</div>
              <div>Quantidade de Itens: <strong>{{ items().length }} item(ns)</strong></div>
              <div>Total dos Produtos: <strong>{{ totalProducts() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></div>
              <div>Frete: <strong>{{ totalShipping | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></div>
              <div class="text-sm font-bold text-emerald-600">
                Valor Final: {{ totalDocument() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
              </div>
            </div>
          </div>

          <!-- Domain Validation Box -->
          @if (validationErrors().length > 0) {
            <div class="alert alert-error text-xs">
              <app-icon name="alert" [size]="18"></app-icon>
              <div>
                <span class="font-bold">Erros de validação encontrados:</span>
                <ul class="list-disc pl-4 mt-1">
                  @for (err of validationErrors(); track err) {
                    <li>{{ err }}</li>
                  }
                </ul>
              </div>
            </div>
          }

          <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-base-200">
            <button type="button" class="btn btn-sm btn-ghost gap-2" (click)="goToStep(4)">
              <app-icon name="chevron-left" [size]="16"></app-icon>
              Voltar
            </button>

            <div class="flex gap-2">
              <button
                type="button"
                class="btn btn-sm btn-outline gap-2"
                [disabled]="isSubmitting()"
                (click)="saveDraftOnly()"
              >
                <app-icon name="save" [size]="16"></app-icon>
                Salvar Rascunho
              </button>

              <button
                type="button"
                class="btn btn-sm btn-primary text-white gap-2"
                [disabled]="isSubmitting()"
                (click)="saveAndTransmit()"
              >
                <app-icon name="send" [size]="16"></app-icon>
                Transmitir para SEFAZ
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class IssuanceComponent {
  readonly api = inject(FiscalApiService);
  private router = inject(Router);

  currentStep = signal<number>(1);
  isSubmitting = signal<boolean>(false);
  validationErrors = signal<string[]>([]);

  companyId = 'comp_1';
  documentType = 'NFE' as DocumentType;
  operationNature = 'VENDA DE MERCADORIA';

  customerId: string | null = null;
  customerName = '';
  customerDocument = '';

  items = signal<FiscalDocumentItemDto[]>([
    {
      itemOrder: 1,
      code: 'ALIM-001',
      description: 'Café Torrado e Moído Especial 500g',
      ncm: '0901.21.00',
      cfop: '5102',
      unit: 'UN',
      quantity: 10,
      unitPrice: 28.5,
      totalPrice: 285.0,
      icmsCst: '102',
    },
  ]);

  totalShipping = 0;
  totalDiscount = 0;

  readonly totalProducts = computed(() => {
    return this.items().reduce((acc, it) => acc + (it.totalPrice || 0), 0);
  });

  readonly totalDocument = computed(() => {
    return this.totalProducts() + Number(this.totalShipping) - Number(this.totalDiscount);
  });

  goToStep(step: number): void {
    this.currentStep.set(step);
  }

  onSelectCustomer(event: Event): void {
    const custId = (event.target as HTMLSelectElement).value;
    const cust = this.api.customers().find((c) => c.id === custId);
    if (cust) {
      this.customerId = cust.id;
      this.customerName = cust.name;
      this.customerDocument = cust.documentNumber;
    }
  }

  addProductFromCatalog(event: Event): void {
    const prodId = (event.target as HTMLSelectElement).value;
    const prod = this.api.products().find((p) => p.id === prodId);
    if (prod) {
      const nextOrder = this.items().length + 1;
      this.items.update((list) => [
        ...list,
        {
          itemOrder: nextOrder,
          code: prod.code,
          description: prod.description,
          ncm: prod.ncm,
          cfop: prod.cfopDefault,
          unit: prod.unit,
          quantity: 1,
          unitPrice: Number(prod.unitPrice),
          totalPrice: Number(prod.unitPrice),
          icmsCst: prod.cstIcms || '102',
        },
      ]);
    }
  }

  updateItemTotal(item: FiscalDocumentItemDto): void {
    item.totalPrice = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    this.items.update((list) => [...list]);
  }

  removeItem(order: number): void {
    this.items.update((list) =>
      list
        .filter((it) => it.itemOrder !== order)
        .map((it, idx) => ({ ...it, itemOrder: idx + 1 }))
    );
  }

  getCompanyName(): string {
    const comp = this.api.companies().find((c) => c.id === this.companyId);
    return comp ? comp.legalName : 'Não Selecionada';
  }

  async saveDraftOnly(): Promise<void> {
    this.isSubmitting.set(true);
    try {
      await this.api.createDraft({
        companyId: this.companyId,
        customerId: this.customerId,
        customerName: this.customerName,
        customerDocument: this.customerDocument,
        documentType: this.documentType,
        operationNature: this.operationNature,
        totalProducts: this.totalProducts(),
        totalShipping: this.totalShipping,
        totalDiscount: this.totalDiscount,
        totalDocument: this.totalDocument(),
        items: this.items(),
      });
      this.router.navigate(['/documentos']);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async saveAndTransmit(): Promise<void> {
    this.isSubmitting.set(true);
    this.validationErrors.set([]);
    try {
      const draft = await this.api.createDraft({
        companyId: this.companyId,
        customerId: this.customerId,
        customerName: this.customerName,
        customerDocument: this.customerDocument,
        documentType: this.documentType,
        operationNature: this.operationNature,
        totalProducts: this.totalProducts(),
        totalShipping: this.totalShipping,
        totalDiscount: this.totalDiscount,
        totalDocument: this.totalDocument(),
        items: this.items(),
      });

      await this.api.submitDocument(draft.id);
      this.router.navigate(['/documentos']);
    } catch (err: any) {
      if (err.error?.errors) {
        this.validationErrors.set(err.error.errors);
      } else {
        this.validationErrors.set([err.message || 'Erro ao transmitir documento.']);
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
