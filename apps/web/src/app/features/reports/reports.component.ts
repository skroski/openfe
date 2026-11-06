import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { AppIconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold tracking-wider text-base-content/50 uppercase" style="font-family: var(--font-display);">
            GESTÃO · LIVROS FISCAIS
          </span>
          <h1 class="text-3xl font-light text-base-content mt-1">
            <strong class="font-bold">Relatórios</strong> & Auditoria
          </h1>
          <p class="text-sm text-base-content/60">
            Exportação de dados fiscais, apuração de tributos e pacote mensal para contabilidade
          </p>
        </div>

        <button
          type="button"
          (click)="downloadZip()"
          [disabled]="downloading()"
          class="btn btn-sm btn-primary text-white gap-2"
        >
          @if (downloading()) {
            <span class="loading loading-spinner loading-xs"></span>
          } @else {
            <app-icon name="download" [size]="16"></app-icon>
          }
          Exportar Pacote Mensal .ZIP
        </button>
      </div>

      @if (downloadSuccess()) {
        <div class="alert alert-success shadow-xs text-xs">
          <app-icon name="check" [size]="18"></app-icon>
          <span>Arquivo .ZIP com XMLs e planilha consolidada gerado com sucesso!</span>
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card bg-base-100 border border-base-300 shadow-xs p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-base-content">Fechamento Mensal XMLs</h3>
            <span class="badge badge-primary badge-sm">Recomendado</span>
          </div>
          <p class="text-xs text-base-content/60">
            Download em arquivo .ZIP contendo todas as NF-e e NFC-e autorizadas no mês corrente e demonstrativo CSV de apuração.
          </p>
          <button
            type="button"
            (click)="downloadZip()"
            [disabled]="downloading()"
            class="btn btn-xs btn-outline btn-primary gap-1"
          >
            <app-icon name="download" [size]="14"></app-icon>
            Gerar Arquivo .ZIP
          </button>
        </div>

        <div class="card bg-base-100 border border-base-300 shadow-xs p-5 space-y-3">
          <h3 class="font-bold text-base text-base-content">Planilha de Apuração ICMS/PIS</h3>
          <p class="text-xs text-base-content/60">Relatório consolidado em formato CSV com detalhamento de bases de cálculo, alíquotas e impostos.</p>
          <button
            type="button"
            (click)="downloadZip()"
            [disabled]="downloading()"
            class="btn btn-xs btn-outline"
          >
            Exportar CSV
          </button>
        </div>

        <div class="card bg-base-100 border border-base-300 shadow-xs p-5 space-y-3">
          <h3 class="font-bold text-base text-base-content">Relatório de Inutilizações</h3>
          <p class="text-xs text-base-content/60">Relação de números de notas inutilizadas e justificativas protocoladas na SEFAZ estadual.</p>
          <button type="button" class="btn btn-xs btn-outline">Visualizar Histórico</button>
        </div>
      </div>
    </div>
  `,
})
export class ReportsComponent {
  private readonly api = inject(FiscalApiService);

  readonly downloading = signal<boolean>(false);
  readonly downloadSuccess = signal<boolean>(false);

  async downloadZip(): Promise<void> {
    const activeCompId = this.api.activeCompany()?.id || 'comp_1';
    this.downloading.set(true);
    this.downloadSuccess.set(false);

    try {
      await this.api.downloadMonthlyZip(activeCompId, 2026, 11);
      this.downloadSuccess.set(true);
      setTimeout(() => this.downloadSuccess.set(false), 4000);
    } catch {
      // Fallback
    } finally {
      this.downloading.set(false);
    }
  }
}
