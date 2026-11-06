import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FiscalApiService } from '../services/fiscal-api.service';
import { AppIconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="min-h-screen flex bg-base-200 text-base-content antialiased">
      <!-- Sidebar -->
      <aside
        [class.w-64]="!isCollapsed()"
        [class.w-20]="isCollapsed()"
        class="transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-40 flex flex-col bg-[#363d3f] text-white border-r border-[#2b2b2b] shadow-xl"
      >
        <!-- Brand Header -->
        <div class="h-16 flex items-center px-4 border-b border-white/10 gap-3 justify-between">
          <a routerLink="/dashboard" class="flex items-center gap-3 no-underline text-white">
            <span
              class="w-9 h-9 rounded bg-[#23527a] shadow-inner flex items-center justify-center font-bold text-white tracking-wider text-base"
              style="font-family: var(--font-display);"
            >
              NF
            </span>
            @if (!isCollapsed()) {
              <span class="text-xl tracking-tight" style="font-family: var(--font-sans);">
                open<strong class="font-bold text-[#f58220]">nfe</strong>
              </span>
            }
          </a>
          <button
            type="button"
            (click)="toggleCollapse()"
            class="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Recolher / Expandir Menu"
          >
            <app-icon [name]="isCollapsed() ? 'chevron-right' : 'chevron-left'" [size]="18"></app-icon>
          </button>
        </div>

        <!-- Organization Selector -->
        @if (!isCollapsed()) {
          <div class="p-3">
            <div class="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80">
              <span class="w-7 h-7 rounded bg-[#4b5054] flex items-center justify-center text-white font-semibold">CH</span>
              <div class="flex flex-col min-w-0 flex-1">
                <span class="text-[10px] font-bold uppercase tracking-wider text-white/50">Organização</span>
                <span class="truncate font-medium text-white">Contábil Horizonte</span>
              </div>
            </div>
          </div>
        }

        <!-- Direct Emission Button -->
        <div class="px-3 py-1">
          <a
            routerLink="/emissao"
            class="flex items-center justify-center gap-2 w-full h-10 rounded-md bg-gradient-to-b from-[#ee9c0a] to-[#d97d08] text-white font-medium text-sm shadow hover:brightness-105 active:scale-95 transition-all"
            title="Emitir Novo Documento"
          >
            <app-icon name="file-plus-2" [size]="18"></app-icon>
            @if (!isCollapsed()) {
              <span>emitir documento</span>
            }
          </a>
        </div>

        <!-- Navigation Categories -->
        <nav class="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          <!-- Operação -->
          <div>
            @if (!isCollapsed()) {
              <div class="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40" style="font-family: var(--font-display);">
                OPERAÇÃO
              </div>
            }
            <div class="space-y-1">
              <a
                routerLink="/dashboard"
                routerLinkActive="bg-white/15 text-[#fbd23a] font-semibold"
                [routerLinkActiveOptions]="{ exact: true }"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                title="Visão Geral"
              >
                <app-icon name="layout-dashboard" [size]="18"></app-icon>
                @if (!isCollapsed()) { <span>Visão Geral</span> }
              </a>

              <a
                routerLink="/documentos"
                routerLinkActive="bg-white/15 text-[#fbd23a] font-semibold"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                title="Documentos Fiscais"
              >
                <app-icon name="file-text" [size]="18"></app-icon>
                @if (!isCollapsed()) {
                  <span class="flex-1">Documentos</span>
                  <span class="badge badge-sm bg-white/20 text-white border-0">{{ api.documents().length }}</span>
                }
              </a>

              <a
                routerLink="/emissao"
                routerLinkActive="bg-white/15 text-[#fbd23a] font-semibold"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                title="Emissão Guiada"
              >
                <app-icon name="file-plus-2" [size]="18"></app-icon>
                @if (!isCollapsed()) { <span>Emitir NF-e</span> }
              </a>

              <a
                routerLink="/importacao"
                routerLinkActive="bg-white/15 text-[#fbd23a] font-semibold"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                title="Importação de XML"
              >
                <app-icon name="upload-cloud" [size]="18"></app-icon>
                @if (!isCollapsed()) { <span>Importar XML</span> }
              </a>
            </div>
          </div>

          <!-- Cadastros -->
          <div>
            @if (!isCollapsed()) {
              <div class="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40" style="font-family: var(--font-display);">
                CADASTROS
              </div>
            }
            <div class="space-y-1">
              <a
                routerLink="/empresas"
                routerLinkActive="bg-white/15 text-[#fbd23a] font-semibold"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                title="Empresas Emitentes"
              >
                <app-icon name="building-2" [size]="18"></app-icon>
                @if (!isCollapsed()) { <span>Empresas</span> }
              </a>

              <a
                routerLink="/clientes"
                routerLinkActive="bg-white/15 text-[#fbd23a] font-semibold"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                title="Clientes e Destinatários"
              >
                <app-icon name="users" [size]="18"></app-icon>
                @if (!isCollapsed()) { <span>Clientes</span> }
              </a>

              <a
                routerLink="/produtos"
                routerLinkActive="bg-white/15 text-[#fbd23a] font-semibold"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                title="Produtos e Serviços"
              >
                <app-icon name="package" [size]="18"></app-icon>
                @if (!isCollapsed()) { <span>Produtos</span> }
              </a>
            </div>
          </div>

          <!-- Gestão e Integrações -->
          <div>
            @if (!isCollapsed()) {
              <div class="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40" style="font-family: var(--font-display);">
                GESTÃO
              </div>
            }
            <div class="space-y-1">
              <a
                routerLink="/relatorios"
                routerLinkActive="bg-white/15 text-[#fbd23a] font-semibold"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                title="Relatórios e Fechamento"
              >
                <app-icon name="bar-chart-3" [size]="18"></app-icon>
                @if (!isCollapsed()) { <span>Relatórios</span> }
              </a>

              <a
                routerLink="/integracoes"
                routerLinkActive="bg-white/15 text-[#fbd23a] font-semibold"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                title="Provedores e Integrações"
              >
                <app-icon name="sliders" [size]="18"></app-icon>
                @if (!isCollapsed()) { <span>Integrações</span> }
              </a>

              <a
                routerLink="/configuracoes"
                routerLinkActive="bg-white/15 text-[#fbd23a] font-semibold"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                title="Configurações do Sistema"
              >
                <app-icon name="settings" [size]="18"></app-icon>
                @if (!isCollapsed()) { <span>Configurações</span> }
              </a>
            </div>
          </div>
        </nav>

        <!-- User Profile Footer -->
        <div class="p-3 border-t border-white/10 bg-black/10">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#f58220] text-white flex items-center justify-center font-bold text-xs">
              DS
            </div>
            @if (!isCollapsed()) {
              <div class="flex flex-col min-w-0 flex-1">
                <span class="text-xs font-medium text-white truncate">Daniel Skroski</span>
                <span class="text-[10px] text-white/50 truncate">TENANT_ADMIN</span>
              </div>
            }
          </div>
        </div>
      </aside>

      <!-- Main App Content Area -->
      <div
        [class.pl-64]="!isCollapsed()"
        [class.pl-20]="isCollapsed()"
        class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
      >
        <!-- Top App Bar -->
        <header class="h-16 bg-base-100 border-b border-base-300 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div class="flex items-center gap-4">
            <div class="flex flex-col">
              <span class="text-xs font-bold uppercase tracking-wider text-base-content/60" style="font-family: var(--font-display);">
                OpenNFE · Plataforma Fiscal Independente
              </span>
              <div class="flex items-center gap-2 text-sm font-semibold text-base-content">
                <span>{{ api.activeCompany()?.tradeName || 'Todas as Empresas' }}</span>
                <span class="text-xs font-mono text-base-content/50">({{ api.activeCompany()?.cnpj || 'Consolidado' }})</span>
              </div>
            </div>
          </div>

          <!-- Right Controls: Environment & Company Selector -->
          <div class="flex items-center gap-3">
            <!-- Environment Badge -->
            <div class="badge badge-warning gap-1 font-semibold text-xs tracking-wider uppercase py-3">
              <app-icon name="shield-check" [size]="14"></app-icon>
              HOMOLOGAÇÃO
            </div>

            <!-- Company Switcher -->
            <select
              class="select select-bordered select-sm max-w-xs text-xs font-medium bg-base-100"
              [value]="api.selectedCompanyId()"
              (change)="onCompanyChange($event)"
            >
              @for (comp of api.companies(); track comp.id) {
                <option [value]="comp.id">{{ comp.tradeName }} ({{ comp.state }})</option>
              }
            </select>

            <a
              routerLink="/emissao"
              class="btn btn-sm btn-primary text-white gap-2"
            >
              <app-icon name="file-plus-2" [size]="16"></app-icon>
              Emitir NF-e
            </a>
          </div>
        </header>

        <!-- Page View Container -->
        <main class="flex-1 p-6 max-w-7xl w-full mx-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AppLayoutComponent {
  readonly api = inject(FiscalApiService);
  readonly isCollapsed = signal<boolean>(false);

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }

  onCompanyChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.api.selectedCompanyId.set(value);
  }
}
