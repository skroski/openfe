import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DocumentStatus, FiscalDocumentDto } from '@opennfe/shared';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { ToastService } from '../../core/services/toast.service';
import { DOCUMENT_TYPE_SHORT, formatDocument } from '../../core/utils/br';
import { AppIconComponent } from '../../shared/components/icon.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { GridColumn, GridFilter } from '../../shared/components/data-grid/data-grid.types';
import {
  GridActionsDirective,
  GridCellDirective,
} from '../../shared/components/data-grid/grid-templates.directive';
import { CancelDocumentDialogComponent } from './cancel-document-dialog.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-documents',
  imports: [
    CurrencyPipe,
    RouterLink,
    AppIconComponent,
    DataGridComponent,
    GridCellDirective,
    GridActionsDirective,
    CancelDocumentDialogComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <app-page-header
        title="Notas fiscais"
        description="Veja todas as notas, envie rascunhos para a SEFAZ, baixe o XML e o PDF (DANFE) e cancele quando necessário."
        [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Notas fiscais' }]"
      >
        <a routerLink="/documentos/exemplo" class="btn btn-outline">
          <app-icon name="eye" [size]="18"></app-icon>
          Ver exemplo de nota
        </a>
        <a routerLink="/emissao" class="btn btn-primary">
          <app-icon name="file-plus-2" [size]="18"></app-icon>
          Emitir nota
        </a>
      </app-page-header>

      <app-data-grid
        label="Notas fiscais"
        [rows]="api.scopedDocuments()"
        [columns]="columns"
        [filters]="filters()"
        [searchText]="searchText"
        searchPlaceholder="Cliente, CNPJ/CPF, número ou chave de acesso"
        [loading]="api.loading() && api.documents().length === 0"
        [initialSort]="{ key: 'date', direction: 'desc' }"
        exportName="notas-fiscais"
        emptyTitle="Nenhuma nota emitida ainda"
        emptyHint="Clique em “Emitir nota” para criar a primeira. Ela aparecerá aqui."
        [rowClickable]="true"
        (rowClick)="open($event)"
      >
        <ng-template appGridCell="number" let-d>
          @if (d.number) {
            <div class="font-semibold">Nº {{ d.number }}</div>
            <div class="text-xs text-base-content/70">Série {{ d.series }}</div>
          } @else {
            <span class="text-base-content/70">Sem número</span>
          }
        </ng-template>

        <ng-template appGridCell="customer" let-d>
          <div class="font-medium">{{ d.customerName || 'Consumidor não identificado' }}</div>
          <div class="text-xs text-base-content/70 font-mono whitespace-nowrap">{{ d.customerDocument || '—' }}</div>
        </ng-template>

        <ng-template appGridCell="total" let-d>
          <span class="font-semibold">{{ d.totalDocument | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</span>
        </ng-template>

        <ng-template appGridCell="status" let-d>
          <app-status-badge [status]="d.status" />
          @if (d.status === 'REJECTED' && d.rejectionReason) {
            <div class="text-xs text-error mt-1 max-w-[16rem] whitespace-normal">{{ d.rejectionReason }}</div>
          }
        </ng-template>

        <ng-template appGridActions let-d>
          <a [routerLink]="['/documentos', d.id]" class="btn btn-sm btn-ghost" title="Ver todos os detalhes e a prévia da nota">
            <app-icon name="eye" [size]="16"></app-icon> Ver
          </a>
          @if (d.status === 'DRAFT' || d.status === 'REJECTED') {
            <button type="button" class="btn btn-sm btn-primary" [disabled]="busyId() === d.id" (click)="transmit(d)" title="Envia a nota para autorização da SEFAZ">
              @if (busyId() === d.id) { <span class="loading loading-spinner loading-xs"></span> } @else { <app-icon name="send" [size]="14"></app-icon> }
              {{ d.status === 'REJECTED' ? 'Reenviar' : 'Enviar' }}
            </button>
          }
          @if (d.status === 'AUTHORIZED') {
            @if (api.fileUrl(d.xmlUrl); as xml) {
              <a [href]="xml" target="_blank" rel="noopener" class="btn btn-sm btn-outline" title="Baixar XML assinado">XML</a>
            }
            @if (api.fileUrl(d.pdfUrl); as pdf) {
              <a [href]="pdf" target="_blank" rel="noopener" class="btn btn-sm btn-outline" title="Baixar DANFE em PDF">PDF</a>
            }
            <button type="button" class="btn btn-sm btn-outline btn-error" (click)="openCancel(d)">Cancelar</button>
          }
        </ng-template>
      </app-data-grid>
    </div>

    @if (cancelling(); as doc) {
      <app-cancel-document-dialog [doc]="doc" (closed)="cancelling.set(null)" />
    }
  `,
})
export class DocumentsComponent {
  readonly api = inject(FiscalApiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly busyId = signal<string | null>(null);
  readonly cancelling = signal<FiscalDocumentDto | null>(null);

  readonly columns: GridColumn<FiscalDocumentDto>[] = [
    { key: 'type', label: 'Tipo', value: (d) => DOCUMENT_TYPE_SHORT[d.documentType] ?? d.documentType, mono: true },
    { key: 'number', label: 'Número', value: (d) => d.number ?? null, mono: true },
    { key: 'customer', label: 'Cliente', value: (d) => d.customerName ?? 'Consumidor não identificado' },
    { key: 'company', label: 'Emitente', value: (d) => d.companyName, hideBelow: 'xl' },
    { key: 'date', label: 'Data', value: (d) => new Date(d.authorizedAt ?? d.createdAt).getTime(), format: (v) => new Date(Number(v)).toLocaleDateString('pt-BR'), hideBelow: 'lg' },
    {
      key: 'total',
      label: 'Valor',
      align: 'end',
      mono: true,
      value: (d) => Number(d.totalDocument),
      format: (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
    { key: 'status', label: 'Situação', value: (d) => STATUS_LABEL[d.status] ?? d.status },
  ];

  readonly filters = computed<GridFilter<FiscalDocumentDto>[]>(() => [
    {
      key: 'status',
      label: 'Situação',
      allLabel: 'Todas as situações',
      options: Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label })),
      match: (d, v) => d.status === v,
    },
    {
      key: 'type',
      label: 'Tipo de nota',
      allLabel: 'Todos os tipos',
      options: [
        { value: 'NFE', label: 'NF-e (produtos)' },
        { value: 'NFCE', label: 'NFC-e (consumidor)' },
        { value: 'NFSE', label: 'NFS-e (serviços)' },
      ],
      match: (d, v) => d.documentType === v,
    },
  ]);

  /** Busca por nome, documento (com ou sem pontuação), número e chave. */
  readonly searchText = (d: FiscalDocumentDto): string =>
    [
      d.customerName,
      d.customerDocument,
      formatDocument(d.customerDocument).replace(/\D/g, ''),
      d.number,
      d.accessKey,
      d.companyName,
    ].join(' ');

  open(d: FiscalDocumentDto): void {
    this.router.navigate(['/documentos', d.id]);
  }

  async transmit(d: FiscalDocumentDto): Promise<void> {
    this.busyId.set(d.id);
    try {
      const res = await this.api.submitDocument(d.id);
      if (res.status === DocumentStatus.AUTHORIZED) this.toast.success(`Nota Nº ${res.number} autorizada pela SEFAZ.`);
      else if (res.status === DocumentStatus.REJECTED) this.toast.error(res.rejectionReason ?? 'A SEFAZ rejeitou a nota.');
      else this.toast.info('Nota enviada. Aguardando a resposta da SEFAZ.');
    } catch (err) {
      this.toast.error(this.api.errorMessage(err, 'Não foi possível enviar a nota.'));
    } finally {
      this.busyId.set(null);
    }
  }

  openCancel(d: FiscalDocumentDto): void {
    this.cancelling.set(d);
  }
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Rascunho',
  VALIDATED: 'Validada',
  QUEUED: 'Na fila',
  PROCESSING: 'Processando',
  AUTHORIZED: 'Autorizada',
  REJECTED: 'Rejeitada',
  DENIED: 'Denegada',
  CANCELLED: 'Cancelada',
};
