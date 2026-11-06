import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { email, form, FormField, pattern, required, submit, validate } from '@angular/forms/signals';
import { CompanyDto, FiscalEnvironment, isValidCnpj, TaxRegime } from '@opennfe/shared';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { ToastService } from '../../core/services/toast.service';
import { digitsOnly, formatCep, formatDocument, TAX_REGIME_LABEL, UFS } from '../../core/utils/br';
import { fieldError } from '../../shared/forms';
import { AppIconComponent } from '../../shared/components/icon.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { GridColumn, GridFilter } from '../../shared/components/data-grid/data-grid.types';
import { GridActionsDirective, GridCellDirective } from '../../shared/components/data-grid/grid-templates.directive';
import { FormFieldComponent } from '../../shared/components/form-field.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

const emptyModel = () => ({
  legalName: '', tradeName: '', cnpj: '', stateRegistration: '', municipalRegistration: '',
  taxRegime: TaxRegime.SIMPLES_NACIONAL as string,
  // Toda empresa nova começa em testes. Produção só depois de configurar o certificado.
  environment: FiscalEnvironment.HOMOLOGATION as string,
  zipCode: '', street: '', number: '', neighborhood: '', cityName: '', cityCode: '', state: '',
  email: '', phone: '',
});

@Component({
  selector: 'app-companies',
  imports: [
    RouterLink, FormField, AppIconComponent, DataGridComponent, GridCellDirective, GridActionsDirective,
    FormFieldComponent, ModalComponent, PageHeaderComponent,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <app-page-header
        title="Empresas"
        description="As empresas (matriz e filiais) que emitem notas. Cada uma precisa de certificado digital A1 e de um provedor fiscal configurado."
        [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Empresas' }]"
      >
        <button type="button" class="btn btn-primary" (click)="openNew()">
          <app-icon name="plus" [size]="18"></app-icon> Nova empresa
        </button>
      </app-page-header>

      <app-data-grid
        label="Empresas emitentes"
        [rows]="api.companies()"
        [columns]="columns"
        [filters]="filters"
        [searchText]="searchText"
        searchPlaceholder="Nome, CNPJ ou cidade"
        [loading]="api.loading() && api.companies().length === 0"
        [initialSort]="{ key: 'name', direction: 'asc' }"
        exportName="empresas"
        emptyTitle="Nenhuma empresa cadastrada"
        emptyHint="Cadastre a empresa que vai emitir as notas para começar."
      >
        <ng-template appGridCell="name" let-c>
          <div class="font-medium">{{ c.tradeName }}</div>
          <div class="text-xs text-base-content/70">{{ c.legalName }}</div>
        </ng-template>
        <ng-template appGridCell="env" let-c>
          @if (c.environment === 'PRODUCTION') {
            <span class="badge badge-error badge-soft font-semibold gap-1"><app-icon name="alert" [size]="12"></app-icon> Produção</span>
          } @else {
            <span class="badge badge-warning badge-soft font-semibold gap-1"><app-icon name="shield-check" [size]="12"></app-icon> Testes</span>
          }
        </ng-template>
        <ng-template appGridCell="active" let-c>
          <span class="badge font-semibold" [class]="c.isActive ? 'badge-success badge-soft' : 'badge-ghost'">{{ c.isActive ? 'Ativa' : 'Inativa' }}</span>
        </ng-template>
        <ng-template appGridActions let-c>
          <a routerLink="/integracoes" class="btn btn-sm btn-ghost" title="Certificado digital e provedor fiscal">
            <app-icon name="key" [size]="14"></app-icon> Certificado
          </a>
          <button type="button" class="btn btn-sm btn-outline" (click)="openEdit(c)">
            <app-icon name="pencil" [size]="14"></app-icon> Editar
          </button>
        </ng-template>
      </app-data-grid>
    </div>

    @if (open()) {
      <app-modal [title]="editingId() ? 'Editar empresa' : 'Nova empresa'" subtitle="Campos com * são obrigatórios." [wide]="true" (closed)="close()">
        <form class="flex flex-col gap-6" (submit)="save($event)" novalidate id="company-form">
          <fieldset class="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <legend class="font-bold mb-2">Dados da empresa</legend>
            <div class="sm:col-span-3">
              <app-form-field label="Razão social" for="e-legal" [required]="true" [error]="err(f.legalName)" hint="Nome registrado no CNPJ.">
                <input id="e-legal" class="input w-full" [formField]="f.legalName" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-3">
              <app-form-field label="Nome fantasia" for="e-trade" hint="Se ficar vazio, usamos a razão social.">
                <input id="e-trade" class="input w-full" [formField]="f.tradeName" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-2">
              <app-form-field label="CNPJ" for="e-cnpj" [required]="true" [error]="err(f.cnpj)">
                <input id="e-cnpj" class="input w-full font-mono" inputmode="numeric" [formField]="f.cnpj" (blur)="fmtCnpj()" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-2">
              <app-form-field label="Inscrição Estadual" for="e-ie" hint="Deixe vazio se for isenta.">
                <input id="e-ie" class="input w-full font-mono" [formField]="f.stateRegistration" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-2">
              <app-form-field label="Inscrição Municipal" for="e-im" hint="Necessária para notas de serviço.">
                <input id="e-im" class="input w-full font-mono" [formField]="f.municipalRegistration" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-3">
              <app-form-field label="Regime tributário" for="e-reg">
                <select id="e-reg" class="select w-full" [formField]="f.taxRegime">
                  @for (r of regimes; track r[0]) { <option [value]="r[0]">{{ r[1] }}</option> }
                </select>
              </app-form-field>
            </div>
            <div class="sm:col-span-3">
              <app-form-field label="Ambiente de emissão" for="e-env" hint="Use “Testes” até confirmar que tudo funciona.">
                <select id="e-env" class="select w-full" [formField]="f.environment">
                  <option value="HOMOLOGATION">Testes (homologação) — sem valor fiscal</option>
                  <option value="PRODUCTION">Produção — valor fiscal real</option>
                </select>
              </app-form-field>
            </div>
            @if (model().environment === 'PRODUCTION') {
              <div class="sm:col-span-6 alert alert-warning text-sm" role="alert">
                <app-icon name="alert" [size]="18"></app-icon>
                <span>Em produção, cada nota enviada tem valor fiscal e gera obrigações. Antes, envie o certificado digital A1 e faça notas de teste.</span>
              </div>
            }
          </fieldset>

          <fieldset class="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <legend class="font-bold mb-2">Endereço e contato</legend>
            <div class="sm:col-span-2">
              <app-form-field label="CEP" for="e-cep" [required]="true" [error]="err(f.zipCode)">
                <input id="e-cep" class="input w-full font-mono" inputmode="numeric" [formField]="f.zipCode" (blur)="fmtCep()" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-4">
              <app-form-field label="Rua / Avenida" for="e-street" [required]="true" [error]="err(f.street)">
                <input id="e-street" class="input w-full" [formField]="f.street" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-2">
              <app-form-field label="Número" for="e-num" [required]="true" [error]="err(f.number)">
                <input id="e-num" class="input w-full" [formField]="f.number" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-4">
              <app-form-field label="Bairro" for="e-bairro" [required]="true" [error]="err(f.neighborhood)">
                <input id="e-bairro" class="input w-full" [formField]="f.neighborhood" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-3">
              <app-form-field label="Cidade" for="e-city" [required]="true" [error]="err(f.cityName)">
                <input id="e-city" class="input w-full" [formField]="f.cityName" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-1">
              <app-form-field label="UF" for="e-uf" [required]="true" [error]="err(f.state)">
                <select id="e-uf" class="select w-full" [formField]="f.state">
                  <option value="">—</option>
                  @for (uf of ufs; track uf) { <option [value]="uf">{{ uf }}</option> }
                </select>
              </app-form-field>
            </div>
            <div class="sm:col-span-2">
              <app-form-field label="Código IBGE" for="e-ibge" [required]="true" [error]="err(f.cityCode)" hint="7 números.">
                <input id="e-ibge" class="input w-full font-mono" inputmode="numeric" [formField]="f.cityCode" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-3">
              <app-form-field label="E-mail fiscal" for="e-mail" [required]="true" [error]="err(f.email)">
                <input id="e-mail" type="email" class="input w-full" [formField]="f.email" autocomplete="off" />
              </app-form-field>
            </div>
            <div class="sm:col-span-3">
              <app-form-field label="Telefone" for="e-phone">
                <input id="e-phone" type="tel" class="input w-full" [formField]="f.phone" autocomplete="off" />
              </app-form-field>
            </div>
          </fieldset>
        </form>
        <ng-container modalActions>
          <button type="button" class="btn btn-ghost" (click)="close()">Cancelar</button>
          <button type="submit" form="company-form" class="btn btn-primary" [disabled]="saving()">
            @if (saving()) { <span class="loading loading-spinner loading-xs"></span> }
            Salvar empresa
          </button>
        </ng-container>
      </app-modal>
    }
  `,
})
export class CompaniesComponent {
  readonly api = inject(FiscalApiService);
  private readonly toast = inject(ToastService);

  readonly ufs = UFS;
  readonly regimes = Object.entries(TAX_REGIME_LABEL);
  readonly err = fieldError;
  readonly open = signal(false);
  readonly saving = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly model = signal(emptyModel());
  readonly f = form(this.model, (p) => {
    required(p.legalName, { message: 'Informe a razão social.' });
    validate(p.cnpj, ({ value }) => {
      const v = value();
      if (!digitsOnly(v)) return { kind: 'required', message: 'Informe o CNPJ.' };
      if (!isValidCnpj(v)) return { kind: 'cnpj', message: 'CNPJ inválido. Confira os números digitados.' };
      const dup = this.api.companies().find((c) => digitsOnly(c.cnpj) === digitsOnly(v) && c.id !== this.editingId());
      return dup ? { kind: 'duplicate', message: `Este CNPJ já está cadastrado em “${dup.tradeName}”.` } : undefined;
    });
    required(p.zipCode, { message: 'Informe o CEP.' });
    pattern(p.zipCode, /^(\d{8}|\d{5}-\d{3})$/, { message: 'CEP deve ter 8 números.' });
    required(p.street, { message: 'Informe a rua.' });
    required(p.number, { message: 'Informe o número (ou S/N).' });
    required(p.neighborhood, { message: 'Informe o bairro.' });
    required(p.cityName, { message: 'Informe a cidade.' });
    required(p.state, { message: 'Escolha o estado.' });
    required(p.cityCode, { message: 'Informe o código IBGE.' });
    pattern(p.cityCode, /^\d{7}$/, { message: 'O código IBGE tem exatamente 7 números.' });
    required(p.email, { message: 'Informe o e-mail fiscal.' });
    email(p.email, { message: 'E-mail inválido. Exemplo: fiscal@empresa.com.br' });
  });

  readonly columns: GridColumn<CompanyDto>[] = [
    { key: 'name', label: 'Empresa', value: (c) => c.tradeName },
    { key: 'cnpj', label: 'CNPJ', value: (c) => formatDocument(c.cnpj), mono: true },
    { key: 'city', label: 'Cidade / UF', value: (c) => `${c.cityName} / ${c.state}`, hideBelow: 'lg' },
    { key: 'regime', label: 'Regime', value: (c) => TAX_REGIME_LABEL[c.taxRegime] ?? c.taxRegime, hideBelow: 'xl' },
    { key: 'env', label: 'Ambiente', value: (c) => (c.environment === 'PRODUCTION' ? 'Produção' : 'Testes'), hideBelow: 'md' },
    { key: 'active', label: 'Situação', value: (c) => (c.isActive ? 'Ativa' : 'Inativa') },
  ];

  readonly filters: GridFilter<CompanyDto>[] = [
    {
      key: 'env', label: 'Ambiente', allLabel: 'Todos os ambientes',
      options: [{ value: 'HOMOLOGATION', label: 'Testes' }, { value: 'PRODUCTION', label: 'Produção' }],
      match: (c, v) => c.environment === v,
    },
    {
      key: 'active', label: 'Situação', allLabel: 'Ativas e inativas',
      options: [{ value: 'yes', label: 'Somente ativas' }, { value: 'no', label: 'Somente inativas' }],
      match: (c, v) => c.isActive === (v === 'yes'),
    },
  ];

  readonly searchText = (c: CompanyDto): string =>
    [c.tradeName, c.legalName, c.cnpj, digitsOnly(c.cnpj), c.cityName].join(' ');

  fmtCnpj(): void {
    this.model.update((m) => ({ ...m, cnpj: formatDocument(m.cnpj) }));
  }
  fmtCep(): void {
    this.model.update((m) => ({ ...m, zipCode: formatCep(m.zipCode) }));
  }

  openNew(): void {
    this.editingId.set(null);
    this.model.set(emptyModel());
    this.f().reset();
    this.open.set(true);
  }

  openEdit(c: CompanyDto): void {
    this.editingId.set(c.id);
    this.model.set({
      legalName: c.legalName, tradeName: c.tradeName, cnpj: formatDocument(c.cnpj),
      stateRegistration: c.stateRegistration ?? '', municipalRegistration: c.municipalRegistration ?? '',
      taxRegime: c.taxRegime, environment: c.environment, zipCode: c.zipCode, street: c.street,
      number: c.number, neighborhood: c.neighborhood, cityName: c.cityName, cityCode: c.cityCode,
      state: c.state, email: c.email, phone: c.phone ?? '',
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
        const body = {
          ...m,
          tradeName: m.tradeName.trim() || m.legalName.trim(),
          cnpj: formatDocument(m.cnpj),
          zipCode: formatCep(m.zipCode),
          stateRegistration: m.stateRegistration.trim() || null,
          municipalRegistration: m.municipalRegistration.trim() || null,
          phone: m.phone.trim() || null,
        } as Partial<CompanyDto>;
        const id = this.editingId();
        if (id) await this.api.updateCompany(id, body);
        else await this.api.createCompany(body);
        this.toast.success(id ? 'Empresa atualizada.' : 'Empresa cadastrada. Agora envie o certificado digital.');
        this.close();
      } catch (e) {
        this.toast.error(this.api.errorMessage(e, 'Não foi possível salvar a empresa.'));
      } finally {
        this.saving.set(false);
      }
    });
  }
}
