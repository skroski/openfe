import { Component } from '@angular/core';
import { AppIconComponent } from '../../shared/components/icon.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

/**
 * Prévia das configurações. Chaves de API e webhooks ainda não têm endpoint na API,
 * então a tela mostra como ficarão, sem simular dados reais.
 */
@Component({
  selector: 'app-settings',
  imports: [AppIconComponent, PageHeaderComponent],
  template: `
    <div class="flex flex-col gap-6">
      <app-page-header
        title="Configurações"
        description="Conexão com outros sistemas (ERP, loja virtual) e avisos automáticos."
        [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Configurações' }]"
      />

      <div class="alert alert-info alert-soft">
        <app-icon name="info" [size]="18"></app-icon>
        <span>Estas duas áreas estão desenhadas, mas ainda <strong>não estão ligadas à API</strong>. Os botões ficam desativados até o servidor oferecer os endpoints.</span>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <section class="card bg-base-100 border border-base-300 p-5 sm:p-6 gap-4" aria-labelledby="s-key">
          <h2 id="s-key" class="text-lg font-bold flex items-center gap-2"><app-icon name="key" [size]="20"></app-icon> Chaves de API</h2>
          <p class="text-sm text-base-content/70">Permitem que o seu ERP ou loja virtual emita notas sozinho, sem ninguém abrir esta tela.</p>
          <div class="rounded-lg bg-base-200 p-4 text-sm text-base-content/70">Nenhuma chave criada.</div>
          <button type="button" class="btn btn-outline self-start" disabled>Criar nova chave</button>
        </section>

        <section class="card bg-base-100 border border-base-300 p-5 sm:p-6 gap-4" aria-labelledby="s-hook">
          <h2 id="s-hook" class="text-lg font-bold flex items-center gap-2"><app-icon name="send" [size]="20"></app-icon> Avisos automáticos (webhooks)</h2>
          <p class="text-sm text-base-content/70">Quando uma nota for autorizada ou rejeitada, o sistema avisa o endereço que você escolher.</p>
          <div class="rounded-lg bg-base-200 p-4 text-sm text-base-content/70">Nenhum endereço configurado.</div>
          <button type="button" class="btn btn-outline self-start" disabled>Adicionar endereço</button>
        </section>
      </div>
    </div>
  `,
})
export class SettingsComponent {}
