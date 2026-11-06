import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { FiscalEnvironment, TaxRegime } from '@opennfe/shared';
import { AppIconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-companies',
  imports: [CommonModule, FormsModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold tracking-wider text-base-content/50 uppercase" style="font-family: var(--font-display);">
            CADASTROS · GESTÃO MULTI-EMPRESAS
          </span>
          <h1 class="text-3xl font-light text-base-content mt-1">
            <strong class="font-bold">Empresas</strong> & Filiais
          </h1>
          <p class="text-sm text-base-content/60">
            Configuração de emitentes fiscais, certificados digitais A1 e provedores de mensageria
          </p>
        </div>

        <button type="button" class="btn btn-primary btn-sm text-white gap-2" (click)="openCreateModal()">
          <app-icon name="plus" [size]="16"></app-icon>
          Nova Empresa
        </button>
      </div>

      <!-- Companies Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (comp of api.companies(); track comp.id) {
          <div class="card bg-base-100 border border-base-300 shadow-xs">
            <div class="card-body p-5 space-y-4">
              <!-- Card Header -->
              <div class="flex items-start justify-between gap-2 border-b border-base-200 pb-3">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-bold text-base text-base-content">{{ comp.tradeName }}</h3>
                    <span class="badge badge-sm badge-success text-white">ATIVA</span>
                  </div>
                  <span class="text-xs text-base-content/60 font-mono">{{ comp.legalName }}</span>
                </div>
                <div class="badge badge-outline text-[11px] font-mono">{{ comp.taxRegime }}</div>
              </div>

              <!-- Details Grid -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div><span class="text-base-content/50">CNPJ:</span> <strong class="font-mono">{{ comp.cnpj }}</strong></div>
                <div><span class="text-base-content/50">Inscrição Estadual:</span> <strong class="font-mono">{{ comp.stateRegistration || 'Isento' }}</strong></div>
                <div><span class="text-base-content/50">Município / UF:</span> {{ comp.cityName }} - {{ comp.state }}</div>
                <div><span class="text-base-content/50">Ambiente Fiscal:</span> <span class="badge badge-xs badge-warning">{{ comp.environment }}</span></div>
              </div>

              <!-- Certificate & Provider Pills -->
              <div class="p-3 bg-base-200/50 rounded-lg space-y-2 text-xs">
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-1.5 font-semibold text-base-content">
                    <app-icon name="shield" [size]="15" customClass="text-emerald-600"></app-icon>
                    Certificado Digital A1
                  </span>
                  <span class="text-emerald-700 font-medium">Válido até 12/2026</span>
                </div>

                <div class="flex items-center justify-between pt-1 border-t border-base-300/50">
                  <span class="flex items-center gap-1.5 font-semibold text-base-content">
                    <app-icon name="key" [size]="15" customClass="text-primary"></app-icon>
                    Provedor Fiscal:
                  </span>
                  <span class="font-mono font-medium text-primary">Focus NFe (Homologação)</span>
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <button type="button" class="btn btn-xs btn-outline">Configurar Provedor</button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- New Company Modal -->
      @if (showModal()) {
        <div class="modal modal-open">
          <div class="modal-box max-w-2xl">
            <h3 class="font-bold text-lg">Cadastrar Nova Empresa Emitente</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
              <div class="form-control">
                <label class="label"><span class="label-text">Razão Social *</span></label>
                <input type="text" class="input input-sm input-bordered" [(ngModel)]="formLegalName" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">Nome Fantasia *</span></label>
                <input type="text" class="input input-sm input-bordered" [(ngModel)]="formTradeName" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">CNPJ *</span></label>
                <input type="text" class="input input-sm input-bordered" [(ngModel)]="formCnpj" placeholder="00.000.000/0000-00" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">Inscrição Estadual</span></label>
                <input type="text" class="input input-sm input-bordered" [(ngModel)]="formIe" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">Município</span></label>
                <input type="text" class="input input-sm input-bordered" [(ngModel)]="formCity" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">UF (Sigla)</span></label>
                <input type="text" class="input input-sm input-bordered max-w-xs" [(ngModel)]="formState" maxlength="2" />
              </div>
            </div>
            <div class="modal-action">
              <button type="button" class="btn btn-sm btn-ghost" (click)="showModal.set(false)">Cancelar</button>
              <button type="button" class="btn btn-sm btn-primary text-white" (click)="saveCompany()">Salvar Empresa</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CompaniesComponent {
  readonly api = inject(FiscalApiService);

  showModal = signal<boolean>(false);
  formLegalName = '';
  formTradeName = '';
  formCnpj = '';
  formIe = '';
  formCity = 'São Paulo';
  formState = 'SP';

  openCreateModal(): void {
    this.showModal.set(true);
  }

  async saveCompany(): Promise<void> {
    await this.api.createCompany({
      legalName: this.formLegalName,
      tradeName: this.formTradeName || this.formLegalName,
      cnpj: this.formCnpj,
      stateRegistration: this.formIe,
      cityName: this.formCity,
      state: this.formState,
      taxRegime: TaxRegime.SIMPLES_NACIONAL,
      environment: FiscalEnvironment.HOMOLOGATION,
    });
    this.showModal.set(false);
  }
}
