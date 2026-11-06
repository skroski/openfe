import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FiscalApiService } from '../services/fiscal-api.service';
import { ToastService } from '../services/toast.service';
import { AppIconComponent } from '../../shared/components/icon.component';

interface NavItem {
  label: string;
  hint: string;
  icon: string;
  link: string;
  exact?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const TOAST_ICON = { success: 'check', error: 'alert', info: 'info', warning: 'alert' } as const;
const TOAST_CLASS = {
  success: 'alert-success',
  error: 'alert-error',
  info: 'alert-info',
  warning: 'alert-warning',
} as const;

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AppIconComponent],
  template: `
    <a href="#conteudo" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] btn btn-primary">
      Ir para o conteúdo
    </a>

    <div class="drawer lg:drawer-open bg-base-200 min-h-dvh">
      <input id="menu-drawer" type="checkbox" class="drawer-toggle" [checked]="menuOpen()" (change)="menuOpen.set(!menuOpen())" aria-label="Abrir menu" />

      <!-- ÁREA PRINCIPAL -->
      <div class="drawer-content flex flex-col min-w-0">
        <header class="sticky top-0 z-30 bg-base-100 border-b border-base-300 px-4 sm:px-6 h-16 flex items-center gap-3">
          <label for="menu-drawer" class="btn btn-ghost btn-square lg:hidden" aria-label="Abrir menu">
            <app-icon name="menu" [size]="22"></app-icon>
          </label>

          <label class="flex items-center gap-2 min-w-0">
            <span class="hidden sm:inline text-sm font-semibold text-base-content/70 whitespace-nowrap">Empresa:</span>
            <select
              class="select max-w-[16rem] sm:max-w-xs"
              [value]="api.selectedCompanyId()"
              (change)="onCompanyChange($event)"
              aria-label="Empresa que está sendo exibida"
            >
              <option value="">Todas as empresas</option>
              @for (comp of api.companies(); track comp.id) {
                <option [value]="comp.id">{{ comp.tradeName }} ({{ comp.state }})</option>
              }
            </select>
          </label>

          @if (api.activeCompany(); as comp) {
            @if (comp.environment === 'PRODUCTION') {
              <span class="badge badge-error gap-1 font-semibold hidden md:inline-flex" title="Notas emitidas neste ambiente têm valor fiscal real.">
                <app-icon name="alert" [size]="12"></app-icon> PRODUÇÃO · valor fiscal real
              </span>
            } @else {
              <span class="badge badge-warning gap-1 font-semibold hidden md:inline-flex" title="Ambiente de testes: as notas não têm valor fiscal.">
                <app-icon name="shield-check" [size]="12"></app-icon> HOMOLOGAÇÃO · só testes
              </span>
            }
          }

          <div class="ml-auto flex items-center gap-2">
            <a routerLink="/emissao" class="btn btn-primary">
              <app-icon name="file-plus-2" [size]="18"></app-icon>
              <span class="hidden sm:inline">Emitir nota</span>
              <span class="sr-only sm:hidden">Emitir nota</span>
            </a>
          </div>
        </header>

        @if (api.connectionFailed()) {
          <div class="bg-error text-error-content px-4 sm:px-6 py-3 text-sm flex flex-wrap items-center gap-x-3 gap-y-2" role="alert">
            <app-icon name="alert" [size]="18"></app-icon>
            <p class="flex-1 min-w-[14rem]"><strong>Sem conexão com a API.</strong> Não foi possível carregar seus dados. Confira se o servidor está ligado e tente de novo.</p>
            <button type="button" class="btn btn-sm bg-base-100 border-base-300 text-base-content" (click)="reconnect()" [disabled]="api.loading()">
              <app-icon name="refresh" [size]="14" [customClass]="api.loading() ? 'animate-spin' : ''"></app-icon> Tentar de novo
            </button>
            <button type="button" class="btn btn-sm btn-ghost" (click)="api.startDemo()">Ver demonstração</button>
          </div>
        }

        @if (api.demoMode()) {
          <div class="bg-warning text-warning-content border-b border-warning/40 px-4 sm:px-6 py-3 text-sm flex flex-wrap items-center gap-x-3 gap-y-2" role="status">
            <app-icon name="info" [size]="18"></app-icon>
            <p class="flex-1 min-w-[14rem]">
              <strong>Modo demonstração.</strong>
              Não foi possível conectar à API, então você está vendo dados de exemplo. Nada é enviado à SEFAZ.
            </p>
            <button type="button" class="btn btn-sm bg-base-100 border-base-300 text-base-content" (click)="reconnect()" [disabled]="api.loading()">
              <app-icon name="refresh" [size]="14" [customClass]="api.loading() ? 'animate-spin' : ''"></app-icon>
              Tentar conectar de novo
            </button>
          </div>
        }

        <main id="conteudo" class="flex-1 p-4 sm:p-6 w-full max-w-[90rem] mx-auto" tabindex="-1">
          <router-outlet />
        </main>
      </div>

      <!-- MENU LATERAL -->
      <div class="drawer-side z-40">
        <label for="menu-drawer" aria-label="Fechar menu" class="drawer-overlay"></label>
        <aside class="w-72 min-h-full flex flex-col bg-[#363d3f] text-white">
          <a routerLink="/dashboard" class="h-16 px-5 flex items-center gap-3 border-b border-white/10 text-white no-underline" (click)="menuOpen.set(false)">
            <span class="w-9 h-9 rounded bg-[#23527a] flex items-center justify-center font-bold tracking-wider" style="font-family: var(--font-display);">NF</span>
            <span class="text-xl tracking-tight">open<strong class="font-bold text-[#f58220]">nfe</strong></span>
          </a>

          <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Menu principal">
            @for (group of nav; track group.title) {
              <div>
                <h2 class="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-white/60" style="font-family: var(--font-display);">
                  {{ group.title }}
                </h2>
                <ul class="space-y-0.5">
                  @for (item of group.items; track item.link) {
                    <li>
                      <a
                        [routerLink]="item.link"
                        routerLinkActive="bg-white/15 text-[#fbd23a] font-semibold"
                        [routerLinkActiveOptions]="{ exact: !!item.exact }"
                        class="flex items-center gap-3 px-3 min-h-11 rounded-md text-sm text-white/90 hover:bg-white/10 hover:text-white transition-colors no-underline"
                        [title]="item.hint"
                        (click)="menuOpen.set(false)"
                      >
                        <app-icon [name]="item.icon" [size]="19"></app-icon>
                        <span class="flex-1">{{ item.label }}</span>
                        @if (item.link === '/documentos') {
                          <span class="badge badge-sm bg-white/20 text-white border-0">{{ api.scopedDocuments().length }}</span>
                        }
                      </a>
                    </li>
                  }
                </ul>
              </div>
            }
          </nav>

          <div class="p-3 border-t border-white/10">
            <a routerLink="/guia" routerLinkActive="bg-white/15 text-[#fbd23a]" class="flex items-center gap-3 px-3 min-h-11 rounded-md text-sm text-white/90 hover:bg-white/10 no-underline" (click)="menuOpen.set(false)">
              <app-icon name="circle-help" [size]="19"></app-icon>
              Guia do sistema
            </a>
          </div>
        </aside>
      </div>
    </div>

    <!-- AVISOS -->
    <div class="toast toast-end toast-bottom z-[90]" aria-live="polite">
      @for (t of toasts.toasts(); track t.id) {
        <div class="alert shadow-lg max-w-sm" [class]="toastClass[t.kind]" role="status">
          <app-icon [name]="toastIcon[t.kind]" [size]="18"></app-icon>
          <span class="text-sm">{{ t.message }}</span>
          <button type="button" class="btn btn-ghost btn-xs btn-square" (click)="toasts.dismiss(t.id)" aria-label="Fechar aviso">
            <app-icon name="x" [size]="14"></app-icon>
          </button>
        </div>
      }
    </div>
  `,
})
export class AppLayoutComponent {
  readonly api = inject(FiscalApiService);
  readonly toasts = inject(ToastService);
  readonly menuOpen = signal(false);

  readonly toastIcon = TOAST_ICON;
  readonly toastClass = TOAST_CLASS;

  /** Estrutura do menu — agrupada pelo que a pessoa quer FAZER, em linguagem simples. */
  readonly nav: NavGroup[] = [
    {
      title: 'Dia a dia',
      items: [
        { label: 'Início', hint: 'Resumo do que está acontecendo', icon: 'layout-dashboard', link: '/dashboard', exact: true },
        { label: 'Notas fiscais', hint: 'Consultar, enviar, baixar e cancelar notas', icon: 'file-text', link: '/documentos' },
        { label: 'Emitir nota', hint: 'Criar uma nova nota passo a passo', icon: 'file-plus-2', link: '/emissao' },
        { label: 'Importar XML', hint: 'Trazer notas que você já emitiu em outro sistema', icon: 'upload-cloud', link: '/importacao' },
      ],
    },
    {
      title: 'Cadastros',
      items: [
        { label: 'Empresas', hint: 'Empresas que emitem as notas', icon: 'building-2', link: '/empresas' },
        { label: 'Clientes', hint: 'Quem compra de você', icon: 'users', link: '/clientes' },
        { label: 'Produtos e serviços', hint: 'O que você vende', icon: 'package', link: '/produtos' },
      ],
    },
    {
      title: 'Administração',
      items: [
        { label: 'Relatórios', hint: 'Fechamento mensal para o contador', icon: 'bar-chart-3', link: '/relatorios' },
        { label: 'Integrações', hint: 'Conexão com o provedor que fala com a SEFAZ', icon: 'sliders', link: '/integracoes' },
        { label: 'Configurações', hint: 'Chaves de API e avisos automáticos', icon: 'settings', link: '/configuracoes' },
      ],
    },
  ];

  onCompanyChange(event: Event): void {
    this.api.selectedCompanyId.set((event.target as HTMLSelectElement).value);
  }

  async reconnect(): Promise<void> {
    await this.api.refreshAll();
    if (!this.api.demoMode() && !this.api.connectionFailed()) this.toasts.success('Conectado à API.');
    else this.toasts.warning('A API continua sem responder.');
  }
}
