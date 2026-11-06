import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { FiscalDocumentDto } from '@opennfe/shared';
import { AppIconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-documents',
  imports: [CommonModule, RouterModule, FormsModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold tracking-wider text-base-content/50 uppercase" style="font-family: var(--font-display);">
            OPERAÇÃO · GESTÃO FISCAL
          </span>
          <h1 class="text-3xl font-light text-base-content mt-1">
            <strong class="font-bold">Documentos</strong> Fiscais
          </h1>
          <p class="text-sm text-base-content/60">
            Consulta, transmissão, cancelamento e guarda de NF-e, NFC-e e NFS-e
          </p>
        </div>

        <a routerLink="/emissao" class="btn btn-primary btn-sm text-white gap-2">
          <app-icon name="file-plus" [size]="16"></app-icon>
          Nova Emissão
        </a>
      </div>

      <!-- Filters & Controls Bar -->
      <div class="card bg-base-100 border border-base-300 p-4 shadow-xs">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <!-- Text Search -->
          <div class="relative">
            <div class="absolute left-3 top-3 text-base-content/40">
              <app-icon name="search" [size]="16"></app-icon>
            </div>
            <input
              type="text"
              placeholder="Buscar destinatário, CNPJ ou chave..."
              class="input input-sm input-bordered w-full pl-9 text-xs"
              [(ngModel)]="searchQuery"
            />
          </div>

          <!-- Status Filter -->
          <select
            class="select select-sm select-bordered w-full text-xs"
            [(ngModel)]="selectedStatus"
          >
            <option value="">Todos os Status</option>
            <option value="AUTHORIZED">Autorizadas</option>
            <option value="REJECTED">Rejeitadas</option>
            <option value="DRAFT">Rascunhos</option>
            <option value="CANCELLED">Canceladas</option>
          </select>

          <!-- Type Filter -->
          <select
            class="select select-sm select-bordered w-full text-xs"
            [(ngModel)]="selectedType"
          >
            <option value="">Todos os Tipos</option>
            <option value="NFE">NF-e (Mod. 55)</option>
            <option value="NFCE">NFC-e (Mod. 65)</option>
            <option value="NFSE">NFS-e (Serviço)</option>
          </select>

          <!-- Company Filter -->
          <select
            class="select select-sm select-bordered w-full text-xs"
            [(ngModel)]="selectedCompany"
          >
            <option value="">Todas as Empresas</option>
            @for (comp of api.companies(); track comp.id) {
              <option [value]="comp.id">{{ comp.tradeName }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Documents Table -->
      <div class="card bg-base-100 border border-base-300 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead class="bg-base-200/50">
              <tr class="text-xs text-base-content/60">
                <th>TIPO</th>
                <th>SÉRIE / NÚMERO</th>
                <th>DESTINATÁRIO</th>
                <th>EMITENTE</th>
                <th>VALOR TOTAL</th>
                <th>STATUS</th>
                <th>CHAVE DE ACESSO</th>
                <th class="text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              @for (doc of filteredDocuments(); track doc.id) {
                <tr class="hover:bg-base-200/40 transition-colors">
                  <td>
                    <span class="badge badge-sm font-bold font-mono">{{ doc.documentType }}</span>
                  </td>
                  <td>
                    <span class="font-mono font-medium">
                      {{ doc.number ? ('Série ' + doc.series + ' · Nº ' + doc.number) : 'Rascunho' }}
                    </span>
                  </td>
                  <td>
                    <div class="font-medium text-sm">{{ doc.customerName || 'Não Informado' }}</div>
                    <div class="text-[11px] font-mono text-base-content/50">{{ doc.customerDocument || '—' }}</div>
                  </td>
                  <td>
                    <div class="text-xs truncate max-w-[180px]">{{ doc.companyName }}</div>
                  </td>
                  <td>
                    <span class="font-mono font-bold">
                      {{ doc.totalDocument | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                    </span>
                  </td>
                  <td>
                    @switch (doc.status) {
                      @case ('AUTHORIZED') {
                        <span class="badge badge-success text-white text-xs font-semibold">AUTORIZADA</span>
                      }
                      @case ('REJECTED') {
                        <span class="badge badge-error text-white text-xs font-semibold" [title]="doc.rejectionReason || ''">
                          REJEITADA
                        </span>
                      }
                      @case ('PROCESSING') {
                        <span class="badge badge-info text-white text-xs font-semibold">PROCESSANDO</span>
                      }
                      @case ('CANCELLED') {
                        <span class="badge badge-neutral text-xs font-semibold">CANCELADA</span>
                      }
                      @case ('DRAFT') {
                        <span class="badge badge-ghost text-xs font-semibold">RASCUNHO</span>
                      }
                      @default {
                        <span class="badge badge-neutral text-xs">{{ doc.status }}</span>
                      }
                    }
                  </td>
                  <td>
                    @if (doc.accessKey) {
                      <div class="flex items-center gap-1.5 font-mono text-[11px] text-base-content/70">
                        <span class="truncate max-w-[140px]" [title]="doc.accessKey">{{ doc.accessKey }}</span>
                        <button
                          type="button"
                          class="btn btn-ghost btn-xs p-1"
                          (click)="copyToClipboard(doc.accessKey)"
                          title="Copiar Chave"
                        >
                          <app-icon name="copy" [size]="12"></app-icon>
                        </button>
                      </div>
                    } @else {
                      <span class="text-xs text-base-content/40">—</span>
                    }
                  </td>
                  <td class="text-right space-x-1">
                    @if (doc.status === 'AUTHORIZED') {
                      <a
                        [href]="'http://localhost:3000' + doc.xmlUrl"
                        target="_blank"
                        class="btn btn-xs btn-outline"
                        title="Baixar XML"
                      >
                        XML
                      </a>
                      <a
                        [href]="'http://localhost:3000' + doc.pdfUrl"
                        target="_blank"
                        class="btn btn-xs btn-outline btn-primary"
                        title="Baixar DANFE PDF"
                      >
                        DANFE
                      </a>
                      <button
                        type="button"
                        class="btn btn-xs btn-error btn-outline"
                        (click)="openCancelModal(doc)"
                        title="Cancelar Nota Fiscal"
                      >
                        Cancelar
                      </button>
                    }

                    @if (doc.status === 'DRAFT' || doc.status === 'REJECTED') {
                      <button
                        type="button"
                        class="btn btn-xs btn-primary text-white"
                        (click)="submit(doc.id)"
                        title="Transmitir para Autorização"
                      >
                        Transmitir
                      </button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="text-center py-8 text-base-content/50">
                    Nenhum documento fiscal encontrado com os filtros selecionados.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cancel Modal Dialog -->
      @if (cancellingDoc()) {
        <div class="modal modal-open">
          <div class="modal-box">
            <h3 class="font-bold text-lg text-error flex items-center gap-2">
              <app-icon name="ban" [size]="20"></app-icon>
              Cancelar Documento Fiscal
            </h3>
            <p class="py-2 text-sm text-base-content/70">
              Você está prestes a solicitar o cancelamento da NF-e junto à SEFAZ. O cancelamento é irreversível.
            </p>
            <div class="form-control mt-3">
              <label class="label">
                <span class="label-text font-semibold text-xs">Justificativa (mínimo 15 caracteres)</span>
              </label>
              <textarea
                class="textarea textarea-bordered h-24 text-xs"
                placeholder="Ex: Cancelamento motivado por erro na digitação dos valores do pedido..."
                [(ngModel)]="cancelJustification"
              ></textarea>
            </div>
            <div class="modal-action">
              <button type="button" class="btn btn-sm btn-ghost" (click)="cancellingDoc.set(null)">
                Voltar
              </button>
              <button
                type="button"
                class="btn btn-sm btn-error text-white"
                [disabled]="cancelJustification.length < 15"
                (click)="confirmCancel()"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DocumentsComponent {
  readonly api = inject(FiscalApiService);

  searchQuery = '';
  selectedStatus = '';
  selectedType = '';
  selectedCompany = '';

  cancellingDoc = signal<FiscalDocumentDto | null>(null);
  cancelJustification = '';

  readonly filteredDocuments = computed(() => {
    let list = this.api.documents();
    if (this.selectedStatus) {
      list = list.filter((d) => d.status === this.selectedStatus);
    }
    if (this.selectedType) {
      list = list.filter((d) => d.documentType === this.selectedType);
    }
    if (this.selectedCompany) {
      list = list.filter((d) => d.companyId === this.selectedCompany);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.customerName?.toLowerCase().includes(q) ||
          d.customerDocument?.includes(q) ||
          d.accessKey?.includes(q) ||
          String(d.number).includes(q)
      );
    }
    return list;
  });

  async submit(id: string): Promise<void> {
    await this.api.submitDocument(id);
  }

  openCancelModal(doc: FiscalDocumentDto): void {
    this.cancellingDoc.set(doc);
    this.cancelJustification = '';
  }

  async confirmCancel(): Promise<void> {
    const doc = this.cancellingDoc();
    if (!doc) return;
    await this.api.cancelDocument(doc.id, this.cancelJustification);
    this.cancellingDoc.set(null);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }
}
