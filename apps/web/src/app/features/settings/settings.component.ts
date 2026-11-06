import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <div>
        <span class="text-xs font-semibold tracking-wider text-base-content/50 uppercase" style="font-family: var(--font-display);">
          GESTÃO · ADMINISTRAÇÃO DO SISTEMA
        </span>
        <h1 class="text-3xl font-light text-base-content mt-1">
          <strong class="font-bold">Configurações</strong>
        </h1>
        <p class="text-sm text-base-content/60">
          Chaves de API, webhooks de saída, usuários e segurança multi-tenant
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- API Keys -->
        <div class="card bg-base-100 border border-base-300 shadow-xs p-5 space-y-4">
          <div class="flex items-center gap-2 border-b border-base-200 pb-3">
            <app-icon name="key" [size]="18" customClass="text-primary"></app-icon>
            <h3 class="font-bold text-base text-base-content">Chaves de API (REST v1)</h3>
          </div>
          <p class="text-xs text-base-content/60">Utilize chaves com escopos restritos para emitir notas a partir de ERPs e e-commerces.</p>
          <div class="p-3 bg-base-200/50 rounded font-mono text-xs flex justify-between items-center">
            <span>onfe_live_********************4f8a</span>
            <span class="badge badge-xs badge-success text-white">ATIVA</span>
          </div>
          <button type="button" class="btn btn-xs btn-outline">Gerar Nova Chave</button>
        </div>

        <!-- Webhooks -->
        <div class="card bg-base-100 border border-base-300 shadow-xs p-5 space-y-4">
          <div class="flex items-center gap-2 border-b border-base-200 pb-3">
            <app-icon name="integrations" [size]="18" customClass="text-secondary"></app-icon>
            <h3 class="font-bold text-base text-base-content">Webhooks de Saída</h3>
          </div>
          <p class="text-xs text-base-content/60">Receba notificações HTTP instantâneas quando notas forem autorizadas ou rejeitadas.</p>
          <div class="p-3 bg-base-200/50 rounded text-xs space-y-1">
            <div class="font-mono text-[11px] truncate">https://api.meusistema.com.br/webhooks/fiscal</div>
            <div class="text-emerald-600 font-semibold text-[11px]">Eventos: document.authorized, document.rejected</div>
          </div>
          <button type="button" class="btn btn-xs btn-outline">Configurar Webhooks</button>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent {}
