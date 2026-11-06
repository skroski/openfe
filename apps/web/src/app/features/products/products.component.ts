import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, min, pattern, required, submit, validate } from '@angular/forms/signals';
import { ProductDto } from '@opennfe/shared';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { ToastService } from '../../core/services/toast.service';
import { digitsOnly, formatNcm } from '../../core/utils/br';
import { fieldError } from '../../shared/forms';
import { AppIconComponent } from '../../shared/components/icon.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { GridColumn, GridFilter } from '../../shared/components/data-grid/data-grid.types';
import { GridActionsDirective, GridCellDirective } from '../../shared/components/data-grid/grid-templates.directive';
import { FormFieldComponent } from '../../shared/components/form-field.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

const UNITS = [
  ['UN', 'Unidade (UN)'], ['CX', 'Caixa (CX)'], ['PC', 'Peça (PC)'], ['KG', 'Quilo (KG)'],
  ['L', 'Litro (L)'], ['M', 'Metro (M)'], ['HR', 'Hora (HR)'], ['MES', 'Mês (MES)'],
] as const;

const ORIGINS = [
  ['0', '0 — Nacional'], ['1', '1 — Estrangeira (importação direta)'], ['2', '2 — Estrangeira (mercado interno)'],
] as const;

const emptyModel = () => ({
  code: '', description: '', unit: 'UN', ncm: '', cfopDefault: '5102', origin: '0', unitPrice: 0,
});

@Component({
  selector: 'app-products',
  imports: [
    CurrencyPipe, FormField, AppIconComponent, DataGridComponent, GridCellDirective, GridActionsDirective,
    FormFieldComponent, ModalComponent, PageHeaderComponent,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <app-page-header
        title="Produtos e serviços"
        description="O que você vende. Cada item guarda a classificação fiscal (NCM e CFOP) e o preço, para preencher a nota automaticamente."
        [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Produtos e serviços' }]"
      >
        <button type="button" class="btn btn-primary" (click)="openNew()">
          <app-icon name="plus" [size]="18"></app-icon> Novo produto ou serviço
        </button>
      </app-page-header>

      <app-data-grid
        label="Produtos e serviços"
        [rows]="api.products()"
        [columns]="columns"
        [filters]="filters"
        [searchText]="searchText"
        searchPlaceholder="Código, descrição ou NCM"
        [loading]="api.loading() && api.products().length === 0"
        [initialSort]="{ key: 'code', direction: 'asc' }"
        exportName="produtos-e-servicos"
        emptyTitle="Nenhum produto cadastrado"
        emptyHint="Cadastre o que você vende para emitir notas sem digitar tudo de novo."
      >
        <ng-template appGridCell="price" let-p>
          <span class="font-semibold">{{ p.unitPrice | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</span>
        </ng-template>
        <ng-template appGridActions let-p>
          <button type="button" class="btn btn-sm btn-outline" (click)="openEdit(p)">
            <app-icon name="pencil" [size]="14"></app-icon> Editar
          </button>
        </ng-template>
      </app-data-grid>
    </div>

    @if (open()) {
      <app-modal [title]="editingId() ? 'Editar produto ou serviço' : 'Novo produto ou serviço'" subtitle="Campos com * são obrigatórios." (closed)="close()">
        <form class="grid grid-cols-1 sm:grid-cols-6 gap-4" (submit)="save($event)" novalidate id="product-form">
          <div class="sm:col-span-2">
            <app-form-field label="Código interno" for="p-code" [required]="true" [error]="err(f.code)" hint="Seu código. Ex.: ALIM-001">
              <input id="p-code" class="input w-full font-mono uppercase" [formField]="f.code" autocomplete="off" />
            </app-form-field>
          </div>
          <div class="sm:col-span-4">
            <app-form-field label="Descrição" for="p-desc" [required]="true" [error]="err(f.description)" hint="Aparece na nota. Seja claro: marca, tamanho, peso.">
              <input id="p-desc" class="input w-full" [formField]="f.description" autocomplete="off" />
            </app-form-field>
          </div>
          <div class="sm:col-span-2">
            <app-form-field label="Unidade de venda" for="p-unit">
              <select id="p-unit" class="select w-full" [formField]="f.unit">
                @for (u of units; track u[0]) { <option [value]="u[0]">{{ u[1] }}</option> }
              </select>
            </app-form-field>
          </div>
          <div class="sm:col-span-4">
            <app-form-field label="Preço de venda (R$)" for="p-price" [required]="true" [error]="err(f.unitPrice)">
              <input id="p-price" type="number" step="0.01" inputmode="decimal" class="input w-full font-mono" [formField]="f.unitPrice" />
            </app-form-field>
          </div>
          <div class="sm:col-span-3">
            <app-form-field label="NCM" for="p-ncm" [required]="true" [error]="err(f.ncm)" hint="8 números. Para serviços, use 00000000.">
              <input id="p-ncm" class="input w-full font-mono" inputmode="numeric" [formField]="f.ncm" (blur)="fmtNcm()" autocomplete="off" />
            </app-form-field>
          </div>
          <div class="sm:col-span-3">
            <app-form-field label="CFOP padrão" for="p-cfop" [required]="true" [error]="err(f.cfopDefault)" hint="4 números. Venda no estado = 5102; para outro estado = 6102.">
              <input id="p-cfop" class="input w-full font-mono" inputmode="numeric" [formField]="f.cfopDefault" autocomplete="off" />
            </app-form-field>
          </div>
          <div class="sm:col-span-6">
            <app-form-field label="Origem da mercadoria" for="p-origin">
              <select id="p-origin" class="select w-full" [formField]="f.origin">
                @for (o of origins; track o[0]) { <option [value]="o[0]">{{ o[1] }}</option> }
              </select>
            </app-form-field>
          </div>
        </form>
        <ng-container modalActions>
          <button type="button" class="btn btn-ghost" (click)="close()">Cancelar</button>
          <button type="submit" form="product-form" class="btn btn-primary" [disabled]="saving()">
            @if (saving()) { <span class="loading loading-spinner loading-xs"></span> }
            Salvar
          </button>
        </ng-container>
      </app-modal>
    }
  `,
})
export class ProductsComponent {
  readonly api = inject(FiscalApiService);
  private readonly toast = inject(ToastService);

  readonly units = UNITS;
  readonly origins = ORIGINS;
  readonly err = fieldError;
  readonly open = signal(false);
  readonly saving = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly model = signal(emptyModel());
  readonly f = form(this.model, (p) => {
    validate(p.code, ({ value }) => {
      const v = value().trim();
      if (!v) return { kind: 'required', message: 'Informe um código.' };
      const dup = this.api.products().find((x) => x.code.toLowerCase() === v.toLowerCase() && x.id !== this.editingId());
      return dup ? { kind: 'duplicate', message: `O código ${dup.code} já está em uso.` } : undefined;
    });
    required(p.description, { message: 'Informe a descrição.' });
    required(p.ncm, { message: 'Informe o NCM.' });
    validate(p.ncm, ({ value }) =>
      digitsOnly(value()).length === 8 ? undefined : { kind: 'ncm', message: 'O NCM tem exatamente 8 números.' }
    );
    required(p.cfopDefault, { message: 'Informe o CFOP.' });
    pattern(p.cfopDefault, /^[567]\d{3}$/, { message: 'CFOP de venda tem 4 números e começa com 5, 6 ou 7.' });
    min(p.unitPrice, 0.01, { message: 'O preço precisa ser maior que zero.' });
  });

  readonly columns: GridColumn<ProductDto>[] = [
    { key: 'code', label: 'Código', value: (p) => p.code, mono: true },
    { key: 'description', label: 'Descrição', value: (p) => p.description },
    { key: 'ncm', label: 'NCM', value: (p) => formatNcm(p.ncm), mono: true, hideBelow: 'md' },
    { key: 'cfop', label: 'CFOP', value: (p) => p.cfopDefault, mono: true, hideBelow: 'lg' },
    { key: 'unit', label: 'Unidade', value: (p) => p.unit, hideBelow: 'md' },
    { key: 'price', label: 'Preço', value: (p) => Number(p.unitPrice), align: 'end', mono: true,
      format: (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
  ];

  readonly filters: GridFilter<ProductDto>[] = [
    {
      key: 'kind', label: 'Tipo', allLabel: 'Produtos e serviços',
      options: [{ value: 'product', label: 'Somente produtos' }, { value: 'service', label: 'Somente serviços' }],
      match: (p, v) => (v === 'service') === (p.unit === 'HR' || p.unit === 'MES' || digitsOnly(p.ncm) === '00000000'),
    },
  ];

  readonly searchText = (p: ProductDto): string => [p.code, p.description, p.ncm, digitsOnly(p.ncm)].join(' ');

  fmtNcm(): void {
    this.model.update((m) => ({ ...m, ncm: formatNcm(m.ncm) }));
  }

  openNew(): void {
    this.editingId.set(null);
    this.model.set(emptyModel());
    this.f().reset();
    this.open.set(true);
  }

  openEdit(p: ProductDto): void {
    this.editingId.set(p.id);
    this.model.set({
      code: p.code, description: p.description, unit: p.unit, ncm: formatNcm(p.ncm),
      cfopDefault: p.cfopDefault, origin: p.origin || '0', unitPrice: Number(p.unitPrice),
    });
    this.f().reset();
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }

  async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.f, async () => {
      this.saving.set(true);
      try {
        const m = this.model();
        const body: Partial<ProductDto> = {
          ...m,
          code: m.code.trim().toUpperCase(),
          description: m.description.trim(),
          ncm: formatNcm(m.ncm),
          unitPrice: Number(m.unitPrice),
        };
        const id = this.editingId();
        if (id) await this.api.updateProduct(id, body);
        else await this.api.createProduct(body);
        this.toast.success(id ? 'Item atualizado.' : 'Item cadastrado.');
        this.close();
      } catch (e) {
        this.toast.error(this.api.errorMessage(e, 'Não foi possível salvar o item.'));
      } finally {
        this.saving.set(false);
      }
    });
  }
}
