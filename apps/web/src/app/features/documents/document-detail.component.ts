import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { ToastService } from '../../core/services/toast.service';
import { DOCUMENT_TYPE_LABEL } from '../../core/utils/br';
import { DanfePreviewComponent } from '../../shared/components/danfe/danfe-preview.component';
import { AppIconComponent } from '../../shared/components/icon.component';
import { CancelDocumentDialogComponent } from './cancel-document-dialog.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-document-detail',
  imports: [CurrencyPipe, DatePipe, RouterLink, AppIconComponent, CancelDocumentDialogComponent, DanfePreviewComponent, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="flex flex-col gap-6">
      @if (docRes.isLoading()) {
        <div class="skeleton h-24 w-full"></div>
        <div class="skeleton h-96 w-full"></div>
      } @else if (doc(); as d) {
        <app-page-header
          [title]="title()"
          [description]="typeLabel()"
          [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Notas fiscais', link: '/documentos' }, { label: title() }]"
        >
          <a routerLink="/documentos" class="btn btn-ghost"><app-icon name="chevron-left" [size]="18"></app-icon> Voltar à lista</a>
          <button type="button" class="btn btn-ghost" [disabled]="docRes.isLoading() || sending()" (click)="refresh()" title="Buscar a situação mais recente">
            <app-icon name="refresh" [size]="18" [customClass]="docRes.isLoading() ? 'animate-spin' : ''"></app-icon> Atualizar
          </button>
          @if (d.status === 'DRAFT' || d.status === 'REJECTED') {
            <button type="button" class="btn btn-primary" [disabled]="sending()" (click)="send()">
              @if (sending()) { <span class="loading loading-spinner loading-xs"></span> } @else { <app-icon name="send" [size]="18"></app-icon> }
              {{ d.status === 'REJECTED' ? 'Reenviar para a SEFAZ' : 'Enviar para a SEFAZ' }}
            </button>
          }
          @if (d.status === 'AUTHORIZED') {
            @if (api.fileUrl(d.pdfUrl); as pdf) { <a [href]="pdf" target="_blank" rel="noopener" class="btn btn-primary"><app-icon name="download" [size]="18"></app-icon> DANFE oficial (PDF)</a> }
            @if (api.fileUrl(d.xmlUrl); as xml) { <a [href]="xml" target="_blank" rel="noopener" class="btn btn-outline"><app-icon name="download" [size]="18"></app-icon> XML</a> }
            <button type="button" class="btn btn-outline btn-error" (click)="cancelling.set(true)">Cancelar nota</button>
          }
          <button type="button" class="btn btn-outline" (click)="print()"><app-icon name="printer" [size]="18"></app-icon> Imprimir prévia</button>
        </app-page-header>

        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print" aria-label="Resumo da nota">
          <div class="card bg-base-100 border border-base-300 p-5 gap-1">
            <span class="text-sm text-base-content/70">Situação</span>
            <div><app-status-badge [status]="d.status" /></div>
            @if (d.status === 'REJECTED') { <p class="text-sm text-error mt-1">{{ d.rejectionReason }}</p> }
          </div>
          <div class="card bg-base-100 border border-base-300 p-5 gap-1">
            <span class="text-sm text-base-content/70">Valor total</span>
            <span class="text-2xl font-bold tabular">{{ d.totalDocument | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</span>
          </div>
          <div class="card bg-base-100 border border-base-300 p-5 gap-1">
            <span class="text-sm text-base-content/70">Cliente</span>
            <span class="font-semibold">{{ d.customerName || 'Consumidor não identificado' }}</span>
          </div>
          <div class="card bg-base-100 border border-base-300 p-5 gap-1">
            <span class="text-sm text-base-content/70">{{ d.authorizedAt ? 'Autorizada em' : 'Criada em' }}</span>
            <span class="font-semibold">{{ d.authorizedAt ?? d.createdAt | date: "dd/MM/yyyy 'às' HH:mm" }}</span>
          </div>
        </section>

        @if (d.accessKey) {
          <section class="card bg-base-100 border border-base-300 p-5 flex flex-col sm:flex-row sm:items-center gap-3 no-print">
            <div class="min-w-0 flex-1">
              <span class="text-sm text-base-content/70">Chave de acesso (44 dígitos)</span>
              <p class="font-mono text-sm break-all">{{ d.accessKey }}</p>
            </div>
            <button type="button" class="btn btn-outline" (click)="copy(d.accessKey)"><app-icon name="copy" [size]="16"></app-icon> Copiar chave</button>
          </section>
        }

        <section aria-label="Prévia da nota">
          <h2 class="text-lg font-bold mb-3 no-print">Prévia da nota</h2>
          <app-danfe-preview [doc]="d" [company]="company()" [customer]="customer()" [forceWatermark]="api.demoMode()" />
        </section>
        @if (cancelling()) {
          <app-cancel-document-dialog [doc]="d" (closed)="cancelling.set(false)" (cancelled)="docRes.reload()" />
        }
      } @else {
        <div class="card bg-base-100 border border-base-300 p-10 text-center items-center gap-3">
          <app-icon name="search" [size]="28"></app-icon>
          <p class="font-semibold">Nota fiscal não encontrada</p>
          <p class="text-sm text-base-content/70">Ela pode ter sido removida ou o endereço está incorreto.</p>
          <a routerLink="/documentos" class="btn btn-primary">Voltar para as notas</a>
        </div>
      }
    </div>
  `,
})
export class DocumentDetailComponent {
  readonly api = inject(FiscalApiService);
  private readonly toast = inject(ToastService);

  /** Vem da rota `/documentos/:id` (withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly docRes = resource({
    params: () => this.id(),
    loader: ({ params }) => this.api.getDocument(params),
  });
  protected readonly sending = signal(false);
  protected readonly cancelling = signal(false);
  protected readonly doc = computed(() => this.docRes.value() ?? null);
  protected readonly company = computed(() => this.api.companies().find((c) => c.id === this.doc()?.companyId) ?? null);
  protected readonly customer = computed(() => this.api.customers().find((c) => c.id === this.doc()?.customerId) ?? null);
  protected readonly typeLabel = computed(() => DOCUMENT_TYPE_LABEL[this.doc()?.documentType ?? ''] ?? '');
  protected readonly title = computed(() => {
    const d = this.doc();
    if (!d) return 'Nota fiscal';
    return d.number ? `Nota Nº ${d.number}` : 'Rascunho de nota';
  });

  async refresh(): Promise<void> {
    if (!this.api.demoMode()) await this.api.loadDocuments();
    this.docRes.reload();
  }

  async send(): Promise<void> {
    const d = this.doc();
    if (!d) return;
    this.sending.set(true);
    try {
      const res = await this.api.submitDocument(d.id);
      if (res.status === 'AUTHORIZED') this.toast.success(`Nota Nº ${res.number} autorizada pela SEFAZ.`);
      else if (res.status === 'REJECTED') this.toast.error(res.rejectionReason ?? 'A SEFAZ rejeitou a nota.');
      else this.toast.info('Nota enviada. Use “Atualizar” para ver a resposta da SEFAZ.');
      this.docRes.reload();
    } catch (e) {
      this.toast.error(this.api.errorMessage(e, 'Não foi possível enviar a nota.'));
    } finally {
      this.sending.set(false);
    }
  }

  copy(text: string): void {
    navigator.clipboard.writeText(text).then(
      () => this.toast.success('Chave de acesso copiada.'),
      () => this.toast.error('Não foi possível copiar. Selecione o texto e use Ctrl+C.')
    );
  }

  print(): void {
    window.print();
  }
}
