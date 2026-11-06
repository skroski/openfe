import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FiscalDocumentDto } from '@opennfe/shared';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { DOCUMENT_TYPE_SHORT } from '../../core/utils/br';
import { AppIconComponent } from '../../shared/components/icon.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { GridActionsDirective, GridCellDirective } from '../../shared/components/data-grid/grid-templates.directive';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

const DAY_MS = 86_400_000;
const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

@Component({
  selector: 'app-dashboard',
  imports: [
    CurrencyPipe, RouterLink, AppIconComponent, DataGridComponent, GridCellDirective, GridActionsDirective,
    PageHeaderComponent, StatusBadgeComponent,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <app-page-header
        title="Início"
        [description]="api.activeCompany() ? 'Resumo de ' + api.activeCompany()!.tradeName : 'Resumo de todas as empresas'"
      >
        <button type="button" class="btn btn-outline" (click)="api.refreshAll()" [disabled]="api.loading()">
          <app-icon name="refresh" [size]="18" [customClass]="api.loading() ? 'animate-spin' : ''"></app-icon>
          Atualizar
        </button>
        <a routerLink="/emissao" class="btn btn-primary"><app-icon name="file-plus-2" [size]="18"></app-icon> Emitir nota</a>
      </app-page-header>

      <!-- O QUE PRECISA DE ATENÇÃO -->
      @if (rejected() > 0 || drafts() > 0) {
        <section aria-label="Precisa da sua atenção" class="flex flex-col gap-3">
          @if (rejected() > 0) {
            <div class="alert alert-error alert-soft" role="alert">
              <app-icon name="alert" [size]="20"></app-icon>
              <div class="flex-1">
                <strong>{{ rejected() }} {{ rejected() === 1 ? 'nota foi rejeitada' : 'notas foram rejeitadas' }} pela SEFAZ.</strong>
                Corrija os dados e envie de novo — enquanto isso, a venda não tem nota válida.
              </div>
              <a routerLink="/documentos" class="btn btn-sm btn-error">Ver notas rejeitadas</a>
            </div>
          }
          @if (drafts() > 0) {
            <div class="alert alert-warning alert-soft">
              <app-icon name="clock" [size]="20"></app-icon>
              <div class="flex-1"><strong>{{ drafts() }} {{ drafts() === 1 ? 'rascunho' : 'rascunhos' }}</strong> ainda não {{ drafts() === 1 ? 'foi enviado' : 'foram enviados' }} à SEFAZ.</div>
              <a routerLink="/documentos" class="btn btn-sm">Revisar e enviar</a>
            </div>
          }
        </section>
      }

      <!-- NÚMEROS -->
      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-label="Números do período">
        <div class="card bg-base-100 border border-base-300 p-5 gap-1">
          <div class="flex items-center gap-2 text-sm font-semibold text-base-content/70"><app-icon name="check" [size]="18" customClass="text-success"></app-icon> Autorizadas</div>
          <div class="text-3xl font-bold tabular">{{ api.kpis().authorizedCount }}</div>
          <div class="text-sm text-base-content/70">Taxa de aprovação: {{ api.kpis().approvalRate }}%</div>
        </div>
        <div class="card bg-base-100 border border-base-300 p-5 gap-1">
          <div class="flex items-center gap-2 text-sm font-semibold text-base-content/70"><app-icon name="alert" [size]="18" customClass="text-error"></app-icon> Rejeitadas</div>
          <div class="text-3xl font-bold tabular">{{ api.kpis().rejectedCount }}</div>
          <div class="text-sm text-base-content/70">Precisam de correção</div>
        </div>
        <div class="card bg-base-100 border border-base-300 p-5 gap-1">
          <div class="flex items-center gap-2 text-sm font-semibold text-base-content/70"><app-icon name="clock" [size]="18" customClass="text-warning"></app-icon> Em andamento</div>
          <div class="text-3xl font-bold tabular">{{ api.kpis().pendingCount }}</div>
          <div class="text-sm text-base-content/70">Rascunhos e aguardando SEFAZ</div>
        </div>
        <div class="card bg-base-100 border border-base-300 p-5 gap-1">
          <div class="flex items-center gap-2 text-sm font-semibold text-base-content/70"><app-icon name="dollar" [size]="18" customClass="text-info"></app-icon> Valor autorizado</div>
          <div class="text-3xl font-bold tabular">{{ api.kpis().totalAuthorizedValue | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</div>
          <div class="text-sm text-base-content/70">Soma das notas autorizadas</div>
        </div>
      </section>

      <!-- GRÁFICOS COM DADOS REAIS -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 card bg-base-100 border border-base-300 p-5">
          <h2 class="font-bold text-lg">Notas dos últimos 7 dias</h2>
          <p class="text-sm text-base-content/70 mb-4">Quantidade de notas criadas por dia, separadas por situação.</p>

          @if (week().total === 0) {
            <p class="py-10 text-center text-base-content/70">Nenhuma nota nos últimos 7 dias.</p>
          } @else {
            <div class="flex items-end justify-between gap-2 h-44" role="img" [attr.aria-label]="weekSummary()">
              @for (d of week().days; track d.label) {
                <div class="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                  <span class="text-xs font-semibold tabular">{{ d.total || '' }}</span>
                  <div class="w-full flex flex-col-reverse rounded-t overflow-hidden bg-base-200" [style.height.%]="d.total ? (d.total / week().max) * 85 : 2">
                    <div class="bg-success" [style.height.%]="(d.ok / (d.total || 1)) * 100"></div>
                    <div class="bg-warning" [style.height.%]="(d.pending / (d.total || 1)) * 100"></div>
                    <div class="bg-error" [style.height.%]="(d.bad / (d.total || 1)) * 100"></div>
                  </div>
                  <span class="text-xs text-base-content/70">{{ d.label }}</span>
                </div>
              }
            </div>
            <div class="flex flex-wrap gap-4 text-sm mt-4">
              <span class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm bg-success"></span> Autorizadas</span>
              <span class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm bg-warning"></span> Em andamento</span>
              <span class="flex items-center gap-2"><span class="w-3 h-3 rounded-sm bg-error"></span> Rejeitadas / canceladas</span>
            </div>
          }
        </div>

        <div class="card bg-base-100 border border-base-300 p-5">
          <h2 class="font-bold text-lg">Por tipo de nota</h2>
          <p class="text-sm text-base-content/70 mb-4">Participação de cada tipo no total.</p>
          <div class="flex flex-col gap-4">
            @for (t of byType(); track t.type) {
              <div>
                <div class="flex justify-between text-sm font-semibold mb-1">
                  <span>{{ t.label }}</span>
                  <span class="tabular">{{ t.count }} ({{ t.pct }}%)</span>
                </div>
                <progress class="progress w-full" [class]="t.cls" [value]="t.pct" max="100" [attr.aria-label]="t.label + ' ' + t.pct + '%'"></progress>
              </div>
            } @empty {
              <p class="text-base-content/70">Sem notas para mostrar.</p>
            }
          </div>
          <a routerLink="/integracoes" class="btn btn-sm btn-ghost mt-auto self-start"><app-icon name="sliders" [size]="14"></app-icon> Ver provedor fiscal</a>
        </div>
      </section>

      <!-- RECENTES -->
      <section class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-lg">Últimas notas</h2>
          <a routerLink="/documentos" class="btn btn-sm btn-ghost">Ver todas <app-icon name="chevron-right" [size]="14"></app-icon></a>
        </div>
        <app-data-grid
          label="Últimas notas"
          [rows]="recent()"
          [columns]="columns"
          [pageSizes]="[5]"
          [initialPageSize]="5"
          [loading]="api.loading() && api.documents().length === 0"
          emptyTitle="Nenhuma nota ainda"
          emptyHint="Quando você emitir notas, as mais recentes aparecem aqui."
        >
          <ng-template appGridCell="total" let-d>
            <span class="font-semibold">{{ d.totalDocument | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</span>
          </ng-template>
          <ng-template appGridCell="status" let-d><app-status-badge [status]="d.status" /></ng-template>
          <ng-template appGridActions let-d>
            <a [routerLink]="['/documentos', d.id]" class="btn btn-sm btn-outline"><app-icon name="eye" [size]="14"></app-icon> Ver</a>
          </ng-template>
        </app-data-grid>
      </section>
    </div>
  `,
})
export class DashboardComponent {
  readonly api = inject(FiscalApiService);

  readonly rejected = computed(() => this.api.kpis().rejectedCount);
  readonly drafts = computed(() => this.api.scopedDocuments().filter((d) => d.status === 'DRAFT').length);

  readonly recent = computed(() =>
    [...this.api.scopedDocuments()]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 10)
  );

  readonly columns: GridColumn<FiscalDocumentDto>[] = [
    { key: 'type', label: 'Tipo', value: (d) => DOCUMENT_TYPE_SHORT[d.documentType] ?? d.documentType, mono: true, sortable: false },
    { key: 'number', label: 'Número', value: (d) => d.number ?? 'Rascunho', mono: true, sortable: false },
    { key: 'customer', label: 'Cliente', value: (d) => d.customerName ?? 'Consumidor não identificado', sortable: false },
    { key: 'total', label: 'Valor', value: (d) => Number(d.totalDocument), align: 'end', mono: true, sortable: false },
    { key: 'status', label: 'Situação', value: (d) => d.status, sortable: false },
  ];

  /** Contagem real por dia, em horário local. */
  readonly week = computed(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfToday.getTime() - (6 - i) * DAY_MS);
      return { start: day.getTime(), label: i === 6 ? 'hoje' : WEEKDAYS[day.getDay()], ok: 0, pending: 0, bad: 0, total: 0 };
    });
    for (const d of this.api.scopedDocuments()) {
      const t = new Date(d.createdAt).getTime();
      const slot = days.find((x) => t >= x.start && t < x.start + DAY_MS);
      if (!slot) continue;
      slot.total++;
      if (d.status === 'AUTHORIZED') slot.ok++;
      else if (d.status === 'REJECTED' || d.status === 'CANCELLED' || d.status === 'DENIED') slot.bad++;
      else slot.pending++;
    }
    return { days, total: days.reduce((s, d) => s + d.total, 0), max: Math.max(1, ...days.map((d) => d.total)) };
  });

  readonly weekSummary = computed(
    () => 'Notas por dia: ' + this.week().days.map((d) => `${d.label} ${d.total}`).join(', ')
  );

  readonly byType = computed(() => {
    const docs = this.api.scopedDocuments();
    const total = docs.length;
    const defs = [
      { type: 'NFE', label: 'NF-e (produtos)', cls: 'progress-primary' },
      { type: 'NFCE', label: 'NFC-e (consumidor)', cls: 'progress-secondary' },
      { type: 'NFSE', label: 'NFS-e (serviços)', cls: 'progress-accent' },
    ];
    return defs
      .map((t) => {
        const count = docs.filter((d) => d.documentType === t.type).length;
        return { ...t, count, pct: total ? Math.round((count / total) * 100) : 0 };
      })
      .filter((t) => t.count > 0);
  });
}
