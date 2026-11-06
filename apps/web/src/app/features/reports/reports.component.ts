import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { ToastService } from '../../core/services/toast.service';
import { AppIconComponent } from '../../shared/components/icon.component';
import { FormFieldComponent } from '../../shared/components/form-field.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

const thisMonth = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

@Component({
  selector: 'app-reports',
  imports: [FormsModule, AppIconComponent, FormFieldComponent, PageHeaderComponent],
  template: `
    <div class="flex flex-col gap-6">
      <app-page-header
        title="Relatórios"
        description="Tudo o que o seu contador precisa para o fechamento do mês, em um único arquivo."
        [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Relatórios' }]"
      />

      <section class="card bg-base-100 border border-base-300 p-5 sm:p-6 flex flex-col gap-5" aria-labelledby="r-zip">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h2 id="r-zip" class="text-lg font-bold">Fechamento mensal para o contador</h2>
            <span class="badge badge-primary badge-soft font-semibold">Recomendado</span>
          </div>
          <p class="text-sm text-base-content/70 mt-1">Baixa um arquivo .ZIP com os XMLs de todas as notas autorizadas do mês e uma planilha (CSV) com os totais e impostos.</p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 max-w-2xl">
          <app-form-field label="Empresa" for="r-comp" [required]="true" [error]="companyError()">
            <select id="r-comp" class="select w-full" [ngModel]="companyId()" (ngModelChange)="companyId.set($event)">
              <option value="">Escolha a empresa…</option>
              @for (c of api.companies(); track c.id) { <option [value]="c.id">{{ c.tradeName }}</option> }
            </select>
          </app-form-field>
          <app-form-field label="Mês" for="r-month" [required]="true">
            <input id="r-month" type="month" class="input w-full" [max]="currentMonth" [ngModel]="month()" (ngModelChange)="month.set($event)" />
          </app-form-field>
        </div>

        <div class="flex justify-end">
          <button type="button" class="btn btn-primary" [disabled]="downloading()" (click)="download()">
            @if (downloading()) { <span class="loading loading-spinner loading-xs"></span> } @else { <app-icon name="download" [size]="18"></app-icon> }
            Baixar pacote do mês (.zip)
          </button>
        </div>
      </section>

      <section class="grid gap-6 md:grid-cols-2">
        <div class="card bg-base-100 border border-base-300 p-5 gap-2">
          <h2 class="font-bold text-lg">Apuração de impostos</h2>
          <p class="text-sm text-base-content/70">A planilha com ICMS, PIS e COFINS já vem dentro do pacote mensal acima. Um relatório separado, com gráficos e comparação entre meses, está planejado.</p>
          <span class="badge badge-ghost self-start mt-auto">Em breve</span>
        </div>
        <div class="card bg-base-100 border border-base-300 p-5 gap-2">
          <h2 class="font-bold text-lg">Numeração inutilizada</h2>
          <p class="text-sm text-base-content/70">Lista dos números de nota que foram pulados e informados à SEFAZ. Depende de um endpoint que a API ainda não tem.</p>
          <span class="badge badge-ghost self-start mt-auto">Em breve</span>
        </div>
      </section>
    </div>
  `,
})
export class ReportsComponent {
  readonly api = inject(FiscalApiService);
  private readonly toast = inject(ToastService);

  readonly currentMonth = thisMonth();
  readonly companyId = signal(this.api.activeCompany()?.id ?? '');
  readonly month = signal(thisMonth());
  readonly downloading = signal(false);
  readonly tried = signal(false);
  readonly companyError = computed(() => (this.tried() && !this.companyId() ? 'Escolha a empresa.' : ''));

  async download(): Promise<void> {
    this.tried.set(true);
    if (!this.companyId() || !this.month()) return;
    if (this.api.demoMode()) {
      this.toast.warning('Modo demonstração: não há arquivo real para baixar.');
      return;
    }
    const [year, month] = this.month().split('-').map(Number);
    this.downloading.set(true);
    try {
      await this.api.downloadMonthlyZip(this.companyId(), year, month);
      this.toast.success('Pacote do mês gerado. Confira a pasta de downloads.');
    } catch (e) {
      this.toast.error(this.api.errorMessage(e, 'Não foi possível gerar o pacote do mês.'));
    } finally {
      this.downloading.set(false);
    }
  }
}
