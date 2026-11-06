import { Component, computed, inject, signal } from '@angular/core';
import { email, form, FormField, pattern, required, submit, validate } from '@angular/forms/signals';
import { CustomerDto, isValidCnpj, isValidCpf } from '@opennfe/shared';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { ToastService } from '../../core/services/toast.service';
import { digitsOnly, formatCep, formatDocument, UFS } from '../../core/utils/br';
import { fieldError } from '../../shared/forms';
import { AppIconComponent } from '../../shared/components/icon.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { GridColumn, GridFilter } from '../../shared/components/data-grid/data-grid.types';
import { GridActionsDirective, GridCellDirective } from '../../shared/components/data-grid/grid-templates.directive';
import { FormFieldComponent } from '../../shared/components/form-field.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

const emptyModel = () => ({
  documentType: 'CNPJ' as 'CPF' | 'CNPJ',
  documentNumber: '',
  name: '',
  email: '',
  phone: '',
  ieIndicator: '9',
  ie: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  cityName: '',
  cityCode: '',
  state: '',
});

@Component({
  selector: 'app-customers',
  imports: [
    FormField, AppIconComponent, DataGridComponent, GridCellDirective, GridActionsDirective,
    FormFieldComponent, ModalComponent, PageHeaderComponent,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <app-page-header
        title="Clientes"
        description="Pessoas e empresas para quem você emite notas. Os dados daqui são usados na hora de emitir, então confira CPF/CNPJ e endereço."
        [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Clientes' }]"
      >
        <button type="button" class="btn btn-primary" (click)="openNew()">
          <app-icon name="plus" [size]="18"></app-icon> Novo cliente
        </button>
      </app-page-header>

      <app-data-grid
        label="Clientes"
        [rows]="api.customers()"
        [columns]="columns"
        [filters]="filters()"
        [searchText]="searchText"
        searchPlaceholder="Nome, CPF/CNPJ, e-mail ou cidade"
        [loading]="api.loading() && api.customers().length === 0"
        [initialSort]="{ key: 'name', direction: 'asc' }"
        exportName="clientes"
        emptyTitle="Nenhum cliente cadastrado"
        emptyHint="Cadastre quem compra de você para emitir notas mais rápido."
      >
        <ng-template appGridCell="name" let-c>
          <div class="font-medium">{{ c.name }}</div>
          <div class="text-xs text-base-content/70">{{ c.email || 'Sem e-mail' }}</div>
        </ng-template>
        <ng-template appGridCell="type" let-c>
          <span class="badge badge-ghost font-semibold">{{ c.documentType === 'CNPJ' ? 'Empresa' : 'Pessoa' }}</span>
        </ng-template>
        <ng-template appGridActions let-c>
          <button type="button" class="btn btn-sm btn-outline" (click)="openEdit(c)">
            <app-icon name="pencil" [size]="14"></app-icon> Editar
          </button>
        </ng-template>
      </app-data-grid>
    </div>

    @if (open()) {
      <app-modal [title]="editingId() ? 'Editar cliente' : 'Novo cliente'" subtitle="Campos com * são obrigatórios." [wide]="true" (closed)="close()">
        <form class="flex flex-col gap-6" (submit)="save($event)" novalidate id="customer-form">
          <fieldset class="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <legend class="font-bold mb-2">Identificação</legend>
            <div class="sm:col-span-2">
              <app-form-field label="Tipo de cliente" for="c-type">
                <select id="c-type" class="select w-full" [formField]="f.documentType">
                  <option value="CNPJ">Empresa (CNPJ)</option>
                  <option value="CPF">Pessoa física (CPF)</option>
                </select>
              </app-form-field>
            </div>
            <div class="sm:col-span-4">
              <app-form-field [label]="model().documentType === 'CNPJ' ? 'CNPJ' : 'CPF'" for="c-doc" [required]="true" [error]="err(f.documentNumber)" hint="Só números ou já com pontos e traço.">
                <input id="c-doc" class="input w-full font-mono" inputmode="numeric" [formField]="f.documentNumber" (blur)="formatDoc()" [attr.aria-invalid]="!!err(f.documentNumber)" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-6">
              <app-form-field [label]="model().documentType === 'CNPJ' ? 'Razão social' : 'Nome completo'" for="c-name" [required]="true" [error]="err(f.name)">
                <input id="c-name" class="input w-full" [formField]="f.name" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-3">
              <app-form-field label="E-mail" for="c-mail" hint="A nota autorizada pode ser enviada para este e-mail." [error]="err(f.email)">
                <input id="c-mail" type="email" class="input w-full" [formField]="f.email" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-3">
              <app-form-field label="Telefone" for="c-phone">
                <input id="c-phone" type="tel" class="input w-full" [formField]="f.phone" autocomplete="off" />
              </app-form-field>
            </div>

            @if (model().documentType === 'CNPJ') {
              <div class="sm:col-span-3">
                <app-form-field label="Contribuinte de ICMS?" for="c-ind" hint="Define se a empresa tem Inscrição Estadual.">
                  <select id="c-ind" class="select w-full" [formField]="f.ieIndicator">
                    <option value="1">Sim, tem Inscrição Estadual</option>
                    <option value="2">Isento de Inscrição Estadual</option>
                    <option value="9">Não contribuinte</option>
                  </select>
                </app-form-field>
              </div>
              @if (model().ieIndicator === '1') {
                <div class="sm:col-span-3">
                  <app-form-field label="Inscrição Estadual" for="c-ie" [required]="true" [error]="err(f.ie)">
                    <input id="c-ie" class="input w-full font-mono" [formField]="f.ie" autocomplete="off" />
                  </app-form-field>
                </div>
              }
            }
          </fieldset>

          <fieldset class="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <legend class="font-bold mb-2">Endereço</legend>
            <div class="sm:col-span-2">
              <app-form-field label="CEP" for="c-cep" [required]="true" [error]="err(f.zipCode)">
                <input id="c-cep" class="input w-full font-mono" inputmode="numeric" [formField]="f.zipCode" (blur)="formatZip()" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-4">
              <app-form-field label="Rua / Avenida" for="c-street" [required]="true" [error]="err(f.street)">
                <input id="c-street" class="input w-full" [formField]="f.street" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-2">
              <app-form-field label="Número" for="c-num" [required]="true" [error]="err(f.number)" hint="Use S/N se não houver.">
                <input id="c-num" class="input w-full" [formField]="f.number" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-4">
              <app-form-field label="Complemento" for="c-comp">
                <input id="c-comp" class="input w-full" [formField]="f.complement" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-3">
              <app-form-field label="Bairro" for="c-bairro" [required]="true" [error]="err(f.neighborhood)">
                <input id="c-bairro" class="input w-full" [formField]="f.neighborhood" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-3">
              <app-form-field label="Cidade" for="c-city" [required]="true" [error]="err(f.cityName)">
                <input id="c-city" class="input w-full" [formField]="f.cityName" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-2">
              <app-form-field label="Estado (UF)" for="c-uf" [required]="true" [error]="err(f.state)">
                <select id="c-uf" class="select w-full" [formField]="f.state">
                  <option value="">Escolha…</option>
                  @for (uf of ufs; track uf) { <option [value]="uf">{{ uf }}</option> }
                </select>
              </app-form-field>
            </div>
            <div class="sm:col-span-4">
              <app-form-field label="Código IBGE da cidade" for="c-ibge" [required]="true" [error]="err(f.cityCode)" hint="7 números. A SEFAZ exige este código na nota (ex.: São Paulo = 3550308).">
                <input id="c-ibge" class="input w-full font-mono" inputmode="numeric" [formField]="f.cityCode" autocomplete="off" />
              </app-form-field>
            </div>
          </fieldset>
        </form>

        <ng-container modalActions>
          <button type="button" class="btn btn-ghost" (click)="close()">Cancelar</button>
          <button type="submit" form="customer-form" class="btn btn-primary" [disabled]="saving()">
            @if (saving()) { <span class="loading loading-spinner loading-xs"></span> }
            Salvar cliente
          </button>
        </ng-container>
      </app-modal>
    }
  `,
})
export class CustomersComponent {
  readonly api = inject(FiscalApiService);
  private readonly toast = inject(ToastService);

  readonly ufs = UFS;
  readonly err = fieldError;
  readonly open = signal(false);
  readonly saving = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly model = signal(emptyModel());
  readonly f = form(this.model, (p) => {
    validate(p.documentNumber, ({ value, valueOf }) => {
      const v = value();
      if (!digitsOnly(v)) return { kind: 'required', message: 'Informe o documento do cliente.' };
      const type = valueOf(p.documentType);
      const ok = type === 'CNPJ' ? isValidCnpj(v) : isValidCpf(v);
      if (!ok) return { kind: 'document', message: `${type} inválido. Confira os números digitados.` };
      const dup = this.api.customers().find((c) => digitsOnly(c.documentNumber) === digitsOnly(v) && c.id !== this.editingId());
      return dup ? { kind: 'duplicate', message: `Já existe um cliente com este documento: ${dup.name}.` } : undefined;
    });
    required(p.name, { message: 'Informe o nome.' });
    email(p.email, { message: 'E-mail inválido. Exemplo: nome@empresa.com.br' });
    required(p.ie, { when: ({ valueOf }) => valueOf(p.documentType) === 'CNPJ' && valueOf(p.ieIndicator) === '1', message: 'Informe a Inscrição Estadual ou marque “Isento”.' });
    required(p.zipCode, { message: 'Informe o CEP.' });
    pattern(p.zipCode, /^(\d{8}|\d{5}-\d{3})$/, { message: 'CEP deve ter 8 números.' });
    required(p.street, { message: 'Informe a rua.' });
    required(p.number, { message: 'Informe o número (ou S/N).' });
    required(p.neighborhood, { message: 'Informe o bairro.' });
    required(p.cityName, { message: 'Informe a cidade.' });
    required(p.state, { message: 'Escolha o estado.' });
    required(p.cityCode, { message: 'Informe o código IBGE.' });
    pattern(p.cityCode, /^\d{7}$/, { message: 'O código IBGE tem exatamente 7 números.' });
  });

  readonly columns: GridColumn<CustomerDto>[] = [
    { key: 'name', label: 'Nome / Razão social', value: (c) => c.name },
    { key: 'type', label: 'Tipo', value: (c) => (c.documentType === 'CNPJ' ? 'Empresa' : 'Pessoa'), hideBelow: 'md' },
    { key: 'doc', label: 'CPF / CNPJ', value: (c) => formatDocument(c.documentNumber), mono: true },
    { key: 'phone', label: 'Telefone', value: (c) => c.phone, hideBelow: 'xl' },
    { key: 'city', label: 'Cidade / UF', value: (c) => `${c.cityName} / ${c.state}`, hideBelow: 'lg' },
  ];

  readonly filters = computed<GridFilter<CustomerDto>[]>(() => [
    {
      key: 'type', label: 'Tipo', allLabel: 'Todos os tipos',
      options: [{ value: 'CNPJ', label: 'Empresas' }, { value: 'CPF', label: 'Pessoas físicas' }],
      match: (c, v) => c.documentType === v,
    },
    {
      key: 'uf', label: 'Estado', allLabel: 'Todos os estados',
      options: [...new Set(this.api.customers().map((c) => c.state))].sort().map((v) => ({ value: v, label: v })),
      match: (c, v) => c.state === v,
    },
  ]);

  readonly searchText = (c: CustomerDto): string =>
    [c.name, c.documentNumber, digitsOnly(c.documentNumber), c.email, c.cityName, c.state].join(' ');

  formatDoc(): void {
    this.model.update((m) => ({ ...m, documentNumber: formatDocument(m.documentNumber) }));
  }
  formatZip(): void {
    this.model.update((m) => ({ ...m, zipCode: formatCep(m.zipCode) }));
  }

  openNew(): void {
    this.editingId.set(null);
    this.model.set(emptyModel());
    this.f().reset();
    this.open.set(true);
  }

  openEdit(c: CustomerDto): void {
    this.editingId.set(c.id);
    this.model.set({
      documentType: c.documentType,
      documentNumber: formatDocument(c.documentNumber),
      name: c.name,
      email: c.email ?? '',
      phone: c.phone ?? '',
      ieIndicator: c.ieIndicator || '9',
      ie: c.ie ?? '',
      zipCode: c.zipCode,
      street: c.street,
      number: c.number,
      complement: c.complement ?? '',
      neighborhood: c.neighborhood,
      cityName: c.cityName,
      cityCode: c.cityCode,
      state: c.state,
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
        const body: Partial<CustomerDto> = {
          ...m,
          documentNumber: formatDocument(m.documentNumber),
          zipCode: formatCep(m.zipCode),
          // Pessoa física nunca tem IE: indicador 9 (não contribuinte).
          ieIndicator: m.documentType === 'CPF' ? '9' : m.ieIndicator,
          ie: m.documentType === 'CNPJ' && m.ieIndicator === '1' ? m.ie.trim() : null,
          email: m.email.trim() || null,
          phone: m.phone.trim() || null,
          complement: m.complement.trim() || null,
        };
        const id = this.editingId();
        if (id) await this.api.updateCustomer(id, body);
        else await this.api.createCustomer(body);
        this.toast.success(id ? 'Cliente atualizado.' : 'Cliente cadastrado.');
        this.close();
      } catch (e) {
        this.toast.error(this.api.errorMessage(e, 'Não foi possível salvar o cliente.'));
      } finally {
        this.saving.set(false);
      }
    });
  }
}
