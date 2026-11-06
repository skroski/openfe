import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { ToastService } from '../../core/services/toast.service';
import { digitsOnly, formatDocument, formatNcm } from '../../core/utils/br';
import { AppIconComponent } from '../../shared/components/icon.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { GridCellDirective } from '../../shared/components/data-grid/grid-templates.directive';
import { FormFieldComponent } from '../../shared/components/form-field.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Component({
  selector: 'app-imports',
  imports: [CurrencyPipe, FormsModule, RouterLink, AppIconComponent, DataGridComponent, GridCellDirective, FormFieldComponent, PageHeaderComponent],
  template: `
    <div class="flex flex-col gap-6">
      <app-page-header
        title="Importar XML"
        description="Já emitiu uma nota em outro sistema? Envie o arquivo XML para ela aparecer aqui, com os produtos e clientes cadastrados automaticamente."
        [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Importar XML' }]"
      />

      @if (successMessage()) {
        <div class="alert alert-success alert-soft" role="status">
          <app-icon name="check" [size]="20"></app-icon>
          <div class="flex-1"><strong>{{ successMessage() }}</strong></div>
          <a routerLink="/documentos" class="btn btn-sm">Ver notas fiscais</a>
        </div>
      }
      @if (errorMessage()) {
        <div class="alert alert-error alert-soft" role="alert">
          <app-icon name="alert" [size]="20"></app-icon>
          <span>{{ errorMessage() }}</span>
        </div>
      }

      @if (!parsedData()) {
        <label
          for="xml-file"
          class="card bg-base-100 border-2 border-dashed p-8 sm:p-12 text-center flex flex-col items-center gap-4 cursor-pointer transition-colors focus-within:outline focus-within:outline-[3px] focus-within:outline-secondary"
          [class]="dragging() ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary'"
          (dragover)="onDrag($event, true)"
          (dragleave)="onDrag($event, false)"
          (drop)="onDrop($event)"
        >
          <input id="xml-file" type="file" accept=".xml,text/xml,application/xml" class="sr-only" (change)="onFileSelected($event)" />
          @if (reading()) {
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="font-semibold">Lendo o arquivo…</p>
          } @else {
            <span class="w-16 h-16 rounded-full bg-primary/15 text-base-content flex items-center justify-center"><app-icon name="upload" [size]="30"></app-icon></span>
            <div>
              <p class="font-bold text-lg">Arraste o arquivo XML até aqui ou clique para escolher</p>
              <p class="text-sm text-base-content/70 mt-1">Aceita NF-e e NFC-e no padrão da SEFAZ (versão 4.00). Um arquivo por vez.</p>
            </div>
            <span class="btn btn-primary pointer-events-none">Escolher arquivo XML</span>
          }
        </label>
      }

      @if (parsedData(); as doc) {
        <section class="card bg-base-100 border border-base-300 divide-y divide-base-300" aria-label="Conferência da nota importada">
          <div class="p-5 flex flex-wrap items-center justify-between gap-4">
            <div class="min-w-0">
              <span class="badge badge-info badge-soft font-semibold">NF-e modelo {{ doc.model }} · Série {{ doc.series }} · Nº {{ doc.number }}</span>
              <h2 class="text-lg font-bold mt-2">{{ doc.issuer.legalName }}</h2>
              <p class="text-xs font-mono text-base-content/70 break-all">Chave: {{ doc.accessKey }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" class="btn btn-ghost" (click)="reset()">Cancelar</button>
              <button type="button" class="btn btn-primary" [disabled]="importing() || !companyId()" (click)="confirmImport()">
                @if (importing()) { <span class="loading loading-spinner loading-xs"></span> }
                Confirmar importação
              </button>
            </div>
          </div>

          <div class="p-5 grid gap-4 md:grid-cols-2">
            <app-form-field label="Importar para qual empresa?" for="imp-comp" [required]="true" hint="A nota entra no livro desta empresa.">
              <select id="imp-comp" class="select w-full" [ngModel]="companyId()" (ngModelChange)="companyId.set($event)">
                <option value="">Escolha a empresa…</option>
                @for (c of api.companies(); track c.id) { <option [value]="c.id">{{ c.tradeName }}</option> }
              </select>
            </app-form-field>
            <label class="flex items-start gap-3 cursor-pointer pt-7">
              <input type="checkbox" class="checkbox checkbox-primary" [ngModel]="autoRegister()" (ngModelChange)="autoRegister.set($event)" />
              <span class="text-sm"><strong>Cadastrar automaticamente</strong> os produtos que ainda não existem no sistema.</span>
            </label>

            @if (mismatch()) {
              <div class="md:col-span-2 alert alert-warning alert-soft" role="alert">
                <app-icon name="alert" [size]="18"></app-icon>
                <span>O destinatário desta nota ({{ doc.recipient?.document }}) não é o CNPJ da empresa escolhida. Confira se é a empresa certa antes de importar.</span>
              </div>
            }
          </div>

          <div class="p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="rounded-lg bg-base-200 p-4"><span class="text-sm text-base-content/70 block">CNPJ do fornecedor</span><span class="font-mono font-semibold">{{ fmt(doc.issuer.document) }}</span></div>
            <div class="rounded-lg bg-base-200 p-4"><span class="text-sm text-base-content/70 block">Destinatário</span><span class="font-semibold break-words">{{ doc.recipient?.legalName }}</span></div>
            <div class="rounded-lg bg-base-200 p-4"><span class="text-sm text-base-content/70 block">Total dos produtos</span><span class="font-bold tabular">{{ doc.totalProducts | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</span></div>
            <div class="rounded-lg bg-primary/15 p-4"><span class="text-sm text-base-content/70 block">Total da nota</span><span class="font-bold text-lg tabular">{{ doc.totalDocument | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</span></div>
          </div>

          <div class="p-5 flex flex-col gap-3">
            <h3 class="font-bold">Itens encontrados no XML ({{ doc.items.length }})</h3>
            <app-data-grid label="Itens da nota importada" [rows]="doc.items" [columns]="itemColumns" [rowId]="itemId" [searchText]="itemSearch" searchPlaceholder="Código ou descrição" [initialSort]="{ key: 'n', direction: 'asc' }">
              <ng-template appGridCell="total" let-i><span class="font-semibold">{{ i.totalPrice | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</span></ng-template>
            </app-data-grid>
          </div>
        </section>
      }
    </div>
  `,
})
export class ImportsComponent {
  readonly api = inject(FiscalApiService);
  private readonly toast = inject(ToastService);

  readonly parsedData = signal<any | null>(null);
  readonly rawXml = signal('');
  readonly importing = signal(false);
  readonly reading = signal(false);
  readonly dragging = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly autoRegister = signal(true);
  readonly companyId = signal(this.api.activeCompany()?.id ?? '');

  /** O destinatário do XML deveria ser a empresa escolhida (nota de entrada). */
  readonly mismatch = computed(() => {
    const doc = this.parsedData();
    const company = this.api.companies().find((c) => c.id === this.companyId());
    const rec = digitsOnly(doc?.recipient?.document);
    return !!(doc && company && rec && rec !== digitsOnly(company.cnpj));
  });

  readonly itemId = (i: any) => `${i.itemOrder}-${i.code}`;
  readonly itemSearch = (i: any) => `${i.code} ${i.description} ${i.ncm}`;
  readonly itemColumns: GridColumn<any>[] = [
    { key: 'n', label: '#', value: (i) => i.itemOrder, mono: true },
    { key: 'code', label: 'Código', value: (i) => i.code, mono: true },
    { key: 'desc', label: 'Descrição', value: (i) => i.description },
    { key: 'ncm', label: 'NCM', value: (i) => formatNcm(i.ncm), mono: true, hideBelow: 'md' },
    { key: 'cfop', label: 'CFOP', value: (i) => i.cfop, mono: true, hideBelow: 'lg' },
    { key: 'qty', label: 'Qtd', value: (i) => Number(i.quantity), align: 'end', mono: true, format: (v, i) => `${v} ${i.unit}` },
    { key: 'unit', label: 'Valor unit.', value: (i) => Number(i.unitPrice), align: 'end', mono: true, hideBelow: 'md',
      format: (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
    { key: 'total', label: 'Total', value: (i) => Number(i.totalPrice), align: 'end', mono: true,
      format: (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
  ];

  fmt = formatDocument;

  onDrag(event: DragEvent, on: boolean): void {
    event.preventDefault();
    this.dragging.set(on);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.readFile(file);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.readFile(file);
    input.value = '';
  }

  private readFile(file: File): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    if (!/\.xml$/i.test(file.name)) {
      this.errorMessage.set('Esse arquivo não é um XML. Escolha o arquivo da nota com final “.xml”.');
      return;
    }
    if (this.api.demoMode()) {
      this.errorMessage.set('Modo demonstração: a leitura de XML precisa da API conectada.');
      return;
    }
    this.reading.set(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const xml = e.target?.result as string;
      this.rawXml.set(xml);
      try {
        this.parsedData.set(await this.api.previewXml(xml));
      } catch (err) {
        this.errorMessage.set(this.api.errorMessage(err, 'Arquivo XML inválido ou não suportado.'));
      } finally {
        this.reading.set(false);
      }
    };
    reader.onerror = () => {
      this.reading.set(false);
      this.errorMessage.set('Não foi possível ler o arquivo.');
    };
    reader.readAsText(file);
  }

  async confirmImport(): Promise<void> {
    const xml = this.rawXml();
    if (!xml || !this.companyId()) return;
    this.importing.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.api.importXml(this.companyId(), xml, this.autoRegister());
      this.successMessage.set(res.message ?? 'Nota importada com sucesso.');
      this.toast.success('Nota importada.');
      this.parsedData.set(null);
      this.rawXml.set('');
    } catch (err) {
      this.errorMessage.set(this.api.errorMessage(err, 'Falha ao importar o XML.'));
    } finally {
      this.importing.set(false);
    }
  }

  reset(): void {
    this.parsedData.set(null);
    this.rawXml.set('');
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}
