import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { FiscalEnvironment } from '@opennfe/shared';
import { AppIconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-integrations',
  imports: [CommonModule, FormsModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold tracking-wider text-base-content/50 uppercase" style="font-family: var(--font-display);">
            GESTÃO · PROVEDORES FISCAIS
          </span>
          <h1 class="text-3xl font-light text-base-content mt-1">
            <strong class="font-bold">Integrações</strong> & Mensageria
          </h1>
          <p class="text-sm text-base-content/60">
            Arquitetura agnóstica: configure provedores e teste a conectividade sem afetar as regras de domínio
          </p>
        </div>
      </div>

      <!-- Test Connection Result Alert -->
      @if (testResult()) {
        <div
          class="alert text-xs"
          [class.alert-success]="testResult().success"
          [class.alert-error]="!testResult().success"
        >
          <app-icon [name]="testResult().success ? 'check' : 'alert'" [size]="18"></app-icon>
          <div>
            <span class="font-bold">{{ testResult().message }}</span>
            @if (testResult().latencyMs) {
              <span class="ml-2 font-mono">Latência: {{ testResult().latencyMs }}ms</span>
            }
          </div>
        </div>
      }

      <!-- Providers Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Focus NFe -->
        <div class="card bg-base-100 border border-base-300 shadow-xs">
          <div class="card-body p-6 space-y-4">
            <div class="flex items-start justify-between border-b border-base-200 pb-3">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-lg text-base-content">Focus NFe</h3>
                  <span class="badge badge-sm badge-primary text-white">ADAPTER OFICIAL</span>
                </div>
                <span class="text-xs text-base-content/60">Integração oficial de referência para SEFAZ e Prefeituras</span>
              </div>
              <div class="badge badge-success text-white text-xs">ATIVO</div>
            </div>

            <div class="space-y-3 text-xs">
              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Token de Acesso (Homologação / Produção)</span></label>
                <div class="relative">
                  <input
                    type="password"
                    class="input input-sm input-bordered w-full font-mono pr-20"
                    placeholder="tok_focus_****************"
                    [(ngModel)]="focusToken"
                  />
                  <span class="absolute right-3 top-2 text-[10px] text-base-content/40 font-mono">AES-256</span>
                </div>
              </div>

              <div class="form-control">
                <label class="label"><span class="label-text font-semibold">Ambiente de Operação</span></label>
                <select class="select select-sm select-bordered w-full" [(ngModel)]="focusEnv">
                  <option value="HOMOLOGATION">Homologação (Testes SEFAZ sem valor fiscal)</option>
                  <option value="PRODUCTION">Produção (SEFAZ com valor legal)</option>
                </select>
              </div>

              <!-- Capabilities Checkboxes -->
              <div class="p-3 bg-base-200/50 rounded-lg space-y-1.5 text-[11px]">
                <div class="font-bold text-base-content/80 mb-1">Capacidades Suportadas:</div>
                <div class="grid grid-cols-2 gap-1 text-base-content/70">
                  <span class="flex items-center gap-1 text-emerald-600">✔ NF-e (Mod. 55)</span>
                  <span class="flex items-center gap-1 text-emerald-600">✔ NFC-e (Mod. 65)</span>
                  <span class="flex items-center gap-1 text-emerald-600">✔ NFS-e Nacional</span>
                  <span class="flex items-center gap-1 text-emerald-600">✔ Cancelamento</span>
                  <span class="flex items-center gap-1 text-emerald-600">✔ Carta de Correção</span>
                  <span class="flex items-center gap-1 text-emerald-600">✔ Download XML / PDF</span>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t border-base-200">
              <button
                type="button"
                class="btn btn-sm btn-outline gap-2"
                [disabled]="isTesting()"
                (click)="testFocusConnection()"
              >
                <app-icon name="refresh" [size]="14"></app-icon>
                Testar Conexão
              </button>
              <button type="button" class="btn btn-sm btn-primary text-white">Salvar Configuração</button>
            </div>
          </div>
        </div>

        <!-- Mock Fiscal Provider -->
        <div class="card bg-base-100 border border-base-300 shadow-xs">
          <div class="card-body p-6 space-y-4">
            <div class="flex items-start justify-between border-b border-base-200 pb-3">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-lg text-base-content">Mock Fiscal Provider</h3>
                  <span class="badge badge-sm badge-neutral text-white font-mono">TESTS & CI</span>
                </div>
                <span class="text-xs text-base-content/60">Simulador determinístico para testes e validações locais</span>
              </div>
              <div class="badge badge-ghost text-xs">DISPONÍVEL</div>
            </div>

            <div class="space-y-3 text-xs">
              <p class="text-base-content/70">
                O provedor Mock permite executar suítes de testes automatizados e emitir notas em ambiente local sem qualquer custo ou dependência de internet.
              </p>

              <div class="p-3 bg-base-200/50 rounded-lg space-y-1.5 text-[11px]">
                <div class="font-bold text-base-content/80 mb-1">Cenários Determinísticos Suportados:</div>
                <ul class="list-disc pl-4 space-y-1 text-base-content/70">
                  <li><strong>Total = R$ 100,00:</strong> Autorização imediata com chave de teste válida.</li>
                  <li><strong>Total = R$ 999,99:</strong> Rejeição SEFAZ com cStat 204 (Duplicidade).</li>
                  <li><strong>Total = R$ 504,00:</strong> Simulação de timeout e erro de comunicação.</li>
                  <li>Geração instantânea de XML e DANFE sintéticos.</li>
                </ul>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t border-base-200">
              <button
                type="button"
                class="btn btn-sm btn-outline gap-2"
                (click)="testMockConnection()"
              >
                <app-icon name="refresh" [size]="14"></app-icon>
                Testar Conexão Mock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class IntegrationsComponent {
  readonly api = inject(FiscalApiService);

  focusToken = 'focus_homolog_sample_token_2026';
  focusEnv = 'HOMOLOGATION';
  isTesting = signal<boolean>(false);
  testResult = signal<any | null>(null);

  async testFocusConnection(): Promise<void> {
    this.isTesting.set(true);
    try {
      const res = await this.api.testProviderConnection(
        'FOCUS_NFE',
        { token: this.focusToken },
        this.focusEnv as FiscalEnvironment
      );
      this.testResult.set(res);
    } catch (err: any) {
      this.testResult.set({
        success: false,
        message: err.message || 'Falha ao testar conexão com Focus NFe',
      });
    } finally {
      this.isTesting.set(false);
    }
  }

  async testMockConnection(): Promise<void> {
    const res = await this.api.testProviderConnection(
      'MOCK_PROVIDER',
      {},
      FiscalEnvironment.HOMOLOGATION
    );
    this.testResult.set(res);
  }
}
