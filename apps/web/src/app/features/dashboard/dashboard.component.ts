import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { AppIconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold tracking-wider text-base-content/50 uppercase" style="font-family: var(--font-display);">
            OPERAÇÃO · {{ api.activeCompany()?.tradeName || 'GERAL' }}
          </span>
          <h1 class="text-3xl font-light text-base-content mt-1">
            <strong class="font-bold">Visão</strong> Geral
          </h1>
          <p class="text-sm text-base-content/60">
            Acompanhamento em tempo real de emissões, autorizações SEFAZ e saúde das integrações
          </p>
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            (click)="api.refreshAll()"
            [disabled]="api.loading()"
            class="btn btn-outline btn-sm gap-2"
          >
            <app-icon name="refresh" [customClass]="api.loading() ? 'animate-spin' : ''" [size]="15"></app-icon>
            Atualizar
          </button>
          <a routerLink="/emissao" class="btn btn-primary btn-sm text-white gap-2">
            Emitir Documento
            <app-icon name="arrow-up-right" [size]="16"></app-icon>
          </a>
        </div>
      </div>

      <!-- System Alert Banner -->
      <div class="alert alert-info shadow-xs border border-info/20 text-sm">
        <app-icon name="alert" [size]="20"></app-icon>
        <div class="flex-1">
          <span class="font-bold">Ambiente de Homologação Ativo:</span>
          As emissões atuais estão sendo roteadas para testes sem valor fiscal perante a Receita Federal.
        </div>
        <a routerLink="/integracoes" class="btn btn-xs btn-outline btn-info">Ver Provedores »</a>
      </div>

      <!-- KPI Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Autorizadas -->
        <div class="card bg-base-100 border border-base-300 shadow-xs">
          <div class="card-body p-4 flex flex-row items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <app-icon name="check" [size]="24"></app-icon>
            </div>
            <div>
              <span class="text-xs font-semibold text-base-content/60 uppercase">Autorizadas</span>
              <div class="text-2xl font-bold font-mono text-emerald-600">
                {{ api.kpis().authorizedCount }}
              </div>
              <span class="text-[11px] text-base-content/50">Taxa de aprovação: {{ api.kpis().approvalRate }}%</span>
            </div>
          </div>
        </div>

        <!-- Rejeitadas -->
        <div class="card bg-base-100 border border-base-300 shadow-xs">
          <div class="card-body p-4 flex flex-row items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <app-icon name="ban" [size]="24"></app-icon>
            </div>
            <div>
              <span class="text-xs font-semibold text-base-content/60 uppercase">Rejeitadas</span>
              <div class="text-2xl font-bold font-mono text-rose-600">
                {{ api.kpis().rejectedCount }}
              </div>
              <span class="text-[11px] text-base-content/50">Requer correção fiscal</span>
            </div>
          </div>
        </div>

        <!-- Pendentes / Rascunhos -->
        <div class="card bg-base-100 border border-base-300 shadow-xs">
          <div class="card-body p-4 flex flex-row items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <app-icon name="clock" [size]="24"></app-icon>
            </div>
            <div>
              <span class="text-xs font-semibold text-base-content/60 uppercase">Pendentes</span>
              <div class="text-2xl font-bold font-mono text-amber-600">
                {{ api.kpis().pendingCount }}
              </div>
              <span class="text-[11px] text-base-content/50">Prontos para transmissão</span>
            </div>
          </div>
        </div>

        <!-- Total Faturado -->
        <div class="card bg-base-100 border border-base-300 shadow-xs">
          <div class="card-body p-4 flex flex-row items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <app-icon name="dollar" [size]="24"></app-icon>
            </div>
            <div>
              <span class="text-xs font-semibold text-base-content/60 uppercase">Total Autorizado</span>
              <div class="text-2xl font-bold font-mono text-base-content">
                {{ api.kpis().totalAuthorizedValue | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
              </div>
              <span class="text-[11px] text-base-content/50">Período consolidado</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Visual Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Visual Bar Chart -->
        <div class="lg:col-span-2 card bg-base-100 border border-base-300 shadow-xs">
          <div class="card-body p-5">
            <div class="flex items-center justify-between pb-3 border-b border-base-200">
              <div>
                <h3 class="font-bold text-base text-base-content">Emissões por Situação</h3>
                <span class="text-xs text-base-content/50">Comparativo das últimas transmissões</span>
              </div>
              <div class="flex items-center gap-4 text-xs">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded bg-emerald-500"></span> Autorizadas</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded bg-rose-500"></span> Rejeitadas</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded bg-amber-400"></span> Pendentes</span>
              </div>
            </div>

            <!-- Synthetic Interactive Bar View -->
            <div class="h-48 flex items-end justify-around gap-4 pt-6 pb-2 border-b border-base-300">
              <div class="flex flex-col items-center gap-1 flex-1">
                <div class="w-full flex flex-col-reverse h-36 rounded-t overflow-hidden bg-base-200">
                  <div class="bg-emerald-500 h-[65%]"></div>
                  <div class="bg-amber-400 h-[20%]"></div>
                  <div class="bg-rose-500 h-[15%]"></div>
                </div>
                <span class="text-[11px] font-mono text-base-content/60">Seg</span>
              </div>

              <div class="flex flex-col items-center gap-1 flex-1">
                <div class="w-full flex flex-col-reverse h-36 rounded-t overflow-hidden bg-base-200">
                  <div class="bg-emerald-500 h-[80%]"></div>
                  <div class="bg-rose-500 h-[10%]"></div>
                  <div class="bg-amber-400 h-[10%]"></div>
                </div>
                <span class="text-[11px] font-mono text-base-content/60">Ter</span>
              </div>

              <div class="flex flex-col items-center gap-1 flex-1">
                <div class="w-full flex flex-col-reverse h-36 rounded-t overflow-hidden bg-base-200">
                  <div class="bg-emerald-500 h-[90%]"></div>
                  <div class="bg-amber-400 h-[10%]"></div>
                </div>
                <span class="text-[11px] font-mono text-base-content/60">Qua</span>
              </div>

              <div class="flex flex-col items-center gap-1 flex-1">
                <div class="w-full flex flex-col-reverse h-36 rounded-t overflow-hidden bg-base-200">
                  <div class="bg-emerald-500 h-[70%]"></div>
                  <div class="bg-rose-500 h-[25%]"></div>
                  <div class="bg-amber-400 h-[5%]"></div>
                </div>
                <span class="text-[11px] font-mono text-base-content/60">Qui</span>
              </div>

              <div class="flex flex-col items-center gap-1 flex-1">
                <div class="w-full flex flex-col-reverse h-36 rounded-t overflow-hidden bg-base-200">
                  <div class="bg-emerald-500 h-[85%]"></div>
                  <div class="bg-rose-500 h-[15%]"></div>
                </div>
                <span class="text-[11px] font-mono text-base-content/60">Hoje</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Document Types Breakdown -->
        <div class="card bg-base-100 border border-base-300 shadow-xs">
          <div class="card-body p-5">
            <h3 class="font-bold text-base text-base-content pb-3 border-b border-base-200">
              Distribuição por Tipo
            </h3>
            <div class="space-y-4 pt-2">
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span>NF-e (Modelo 55)</span>
                  <span class="font-mono">82%</span>
                </div>
                <progress class="progress progress-primary w-full" value="82" max="100"></progress>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span>NFC-e (Modelo 65)</span>
                  <span class="font-mono">14%</span>
                </div>
                <progress class="progress progress-secondary w-full" value="14" max="100"></progress>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span>NFS-e (Serviços)</span>
                  <span class="font-mono">4%</span>
                </div>
                <progress class="progress progress-accent w-full" value="4" max="100"></progress>
              </div>
            </div>

            <div class="mt-6 p-3 rounded bg-base-200/50 border border-base-300 text-xs text-base-content/70">
              <span class="font-semibold text-base-content">Provedor Ativo:</span>
              <div class="mt-1 flex items-center justify-between">
                <span>Focus NFe (Homologação)</span>
                <span class="badge badge-xs badge-success text-white">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Emissions Table -->
      <div class="card bg-base-100 border border-base-300 shadow-xs">
        <div class="card-body p-5">
          <div class="flex items-center justify-between pb-3 border-b border-base-200">
            <div>
              <h3 class="font-bold text-base text-base-content">Últimos Documentos Fiscais</h3>
              <span class="text-xs text-base-content/50">Emissões mais recentes transmitidas ou em rascunho</span>
            </div>
            <a routerLink="/documentos" class="btn btn-sm btn-ghost text-xs">Ver Todos »</a>
          </div>

          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead>
                <tr class="text-xs text-base-content/60 border-b border-base-200">
                  <th>TIPO / NÚMERO</th>
                  <th>DESTINATÁRIO</th>
                  <th>EMPRESA EMITENTE</th>
                  <th>VALOR TOTAL</th>
                  <th>SITUAÇÃO</th>
                  <th class="text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                @for (doc of api.documents(); track doc.id) {
                  <tr class="hover:bg-base-200/50 transition-colors">
                    <td>
                      <div class="flex items-center gap-2">
                        <span class="badge badge-sm font-bold font-mono">{{ doc.documentType }}</span>
                        <span class="font-mono font-medium">{{ doc.number ? ('Nº ' + doc.number) : 'Rascunho' }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="font-medium text-sm">{{ doc.customerName || 'Não Informado' }}</div>
                      <div class="text-xs font-mono text-base-content/50">{{ doc.customerDocument || '—' }}</div>
                    </td>
                    <td>
                      <div class="text-xs font-medium">{{ doc.companyName }}</div>
                    </td>
                    <td>
                      <div class="font-mono font-semibold">
                        {{ doc.totalDocument | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                      </div>
                    </td>
                    <td>
                      @switch (doc.status) {
                        @case ('AUTHORIZED') {
                          <span class="badge badge-success text-white text-xs font-semibold">AUTORIZADA</span>
                        }
                        @case ('REJECTED') {
                          <span class="badge badge-error text-white text-xs font-semibold">REJEITADA</span>
                        }
                        @case ('PROCESSING') {
                          <span class="badge badge-info text-white text-xs font-semibold">PROCESSANDO</span>
                        }
                        @case ('DRAFT') {
                          <span class="badge badge-ghost text-xs font-semibold">RASCUNHO</span>
                        }
                        @default {
                          <span class="badge badge-neutral text-xs font-semibold">{{ doc.status }}</span>
                        }
                      }
                    </td>
                    <td class="text-right space-x-1">
                      @if (doc.status === 'AUTHORIZED') {
                        <a
                          [href]="'http://localhost:3000' + doc.xmlUrl"
                          target="_blank"
                          class="btn btn-xs btn-outline"
                          title="Baixar XML Autorizado"
                        >
                          XML
                        </a>
                        <a
                          [href]="'http://localhost:3000' + doc.pdfUrl"
                          target="_blank"
                          class="btn btn-xs btn-outline btn-primary"
                          title="Visualizar DANFE PDF"
                        >
                          PDF
                        </a>
                      }
                      @if (doc.status === 'DRAFT' || doc.status === 'REJECTED') {
                        <button
                          type="button"
                          (click)="api.submitDocument(doc.id)"
                          class="btn btn-xs btn-primary text-white"
                          title="Transmitir para SEFAZ"
                        >
                          Transmitir
                        </button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  readonly api = inject(FiscalApiService);
}
