import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { AppIconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-imports',
  imports: [CommonModule, FormsModule, RouterModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold tracking-wider text-base-content/50 uppercase" style="font-family: var(--font-display);">
            OPERAÇÃO · ENTRADA DE NOTAS
          </span>
          <h1 class="text-3xl font-light text-base-content mt-1">
            <strong class="font-bold">Importação</strong> de XMLs
          </h1>
          <p class="text-sm text-base-content/60">
            Upload de NF-e de fornecedores, validação estrutural SEFAZ e auto-cadastro de produtos e fornecedores
          </p>
        </div>
      </div>

      <!-- Success Notification -->
      @if (successMessage()) {
        <div class="alert alert-success shadow-sm">
          <app-icon name="check" [size]="20"></app-icon>
          <div class="flex-1">
            <span class="font-bold">{{ successMessage() }}</span>
            <div class="text-xs mt-0.5">O documento foi registrado no livro de entradas e os itens no catálogo de produtos.</div>
          </div>
          <a routerLink="/documentos" class="btn btn-xs btn-outline">Ver Documentos</a>
        </div>
      }

      <!-- Error Notification -->
      @if (errorMessage()) {
        <div class="alert alert-error shadow-sm">
          <app-icon name="alert" [size]="20"></app-icon>
          <span>{{ errorMessage() }}</span>
        </div>
      }

      <!-- Upload Dropzone Area -->
      @if (!parsedData()) {
        <div
          class="card bg-base-100 border-2 border-dashed border-base-300 shadow-xs p-12 text-center flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors cursor-pointer"
          (click)="fileInput.click()"
        >
          <input
            #fileInput
            type="file"
            accept=".xml"
            class="hidden"
            (change)="onFileSelected($event)"
          />
          <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <app-icon name="upload" [size]="32"></app-icon>
          </div>
          <div>
            <h3 class="font-bold text-lg text-base-content">Clique para selecionar ou arraste o arquivo XML da NF-e</h3>
            <p class="text-xs text-base-content/50 mt-1">Suporta arquivos padrão SEFAZ versão 4.00 (NF-e modelo 55 e NFC-e)</p>
          </div>
          <button type="button" class="btn btn-sm btn-primary text-white pointer-events-none">
            Selecionar Arquivo .XML
          </button>
        </div>
      }

      <!-- XML Preview Section -->
      @if (parsedData(); as doc) {
        <div class="card bg-base-100 border border-base-300 shadow-xs divide-y divide-base-200">
          <!-- Card Header -->
          <div class="p-5 flex flex-wrap items-center justify-between gap-4 bg-base-200/40">
            <div>
              <div class="badge badge-info gap-1 text-xs font-semibold mb-1">
                NF-e Modelo {{ doc.model }} · Série {{ doc.series }} · Nº {{ doc.number }}
              </div>
              <h2 class="text-lg font-bold text-base-content flex items-center gap-2">
                {{ doc.issuer.legalName }}
              </h2>
              <p class="text-xs font-mono text-base-content/60">
                Chave: {{ doc.accessKey }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="reset()"
                class="btn btn-sm btn-ghost"
              >
                Cancelar
              </button>
              <button
                type="button"
                (click)="confirmImport()"
                [disabled]="importing()"
                class="btn btn-sm btn-primary text-white gap-2"
              >
                @if (importing()) {
                  <span class="loading loading-spinner loading-xs"></span>
                }
                Confirmar Importação
              </button>
            </div>
          </div>

          <!-- Summary Grid -->
          <div class="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div class="p-3 bg-base-200/30 rounded-lg">
              <span class="text-base-content/50 font-bold uppercase tracking-wider block">CNPJ Fornecedor</span>
              <span class="font-mono font-semibold text-sm">{{ doc.issuer.document }}</span>
            </div>
            <div class="p-3 bg-base-200/30 rounded-lg">
              <span class="text-base-content/50 font-bold uppercase tracking-wider block">Destinatário</span>
              <span class="font-medium text-sm truncate block">{{ doc.recipient.legalName }}</span>
            </div>
            <div class="p-3 bg-base-200/30 rounded-lg">
              <span class="text-base-content/50 font-bold uppercase tracking-wider block">Total Produtos</span>
              <span class="font-bold text-sm">{{ doc.totalProducts | currency:'BRL' }}</span>
            </div>
            <div class="p-3 bg-primary/10 rounded-lg text-primary">
              <span class="font-bold uppercase tracking-wider block">Total da Nota</span>
              <span class="font-bold text-base">{{ doc.totalDocument | currency:'BRL' }}</span>
            </div>
          </div>

          <!-- Items Table -->
          <div class="p-5 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-sm text-base-content">
                Itens Identificados no XML ({{ doc.items.length }})
              </h3>
              <label class="label cursor-pointer gap-2 py-0">
                <input
                  type="checkbox"
                  class="checkbox checkbox-xs checkbox-primary"
                  [(ngModel)]="autoRegisterProducts"
                />
                <span class="label-text text-xs font-medium">Cadastrar novos produtos automaticamente</span>
              </label>
            </div>

            <div class="overflow-x-auto border border-base-200 rounded-lg">
              <table class="table table-xs w-full">
                <thead class="bg-base-200/60 font-semibold">
                  <tr>
                    <th>#</th>
                    <th>Código</th>
                    <th>Descrição</th>
                    <th>NCM</th>
                    <th>CFOP</th>
                    <th>Qtd</th>
                    <th>Preço Un.</th>
                    <th>Total</th>
                    <th>ICMS</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of doc.items; track item.code) {
                    <tr class="hover">
                      <td class="font-mono text-base-content/50">{{ item.itemOrder }}</td>
                      <td class="font-mono font-medium">{{ item.code }}</td>
                      <td class="font-medium">{{ item.description }}</td>
                      <td class="font-mono">{{ item.ncm }}</td>
                      <td class="font-mono">{{ item.cfop }}</td>
                      <td class="font-mono">{{ item.quantity }} {{ item.unit }}</td>
                      <td class="font-mono">{{ item.unitPrice | currency:'BRL' }}</td>
                      <td class="font-mono font-bold">{{ item.totalPrice | currency:'BRL' }}</td>
                      <td class="font-mono text-xs">{{ item.icmsValue ? (item.icmsValue | currency:'BRL') : 'R$ 0,00' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ImportsComponent {
  private readonly api = inject(FiscalApiService);

  readonly parsedData = signal<any | null>(null);
  readonly rawXml = signal<string>('');
  readonly importing = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  autoRegisterProducts = true;

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.errorMessage.set(null);
    this.successMessage.set(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const xmlContent = e.target?.result as string;
      this.rawXml.set(xmlContent);

      try {
        const preview = await this.api.previewXml(xmlContent);
        this.parsedData.set(preview);
      } catch (err: any) {
        this.errorMessage.set(err?.error?.message || 'Arquivo XML inválido ou não suportado.');
      }
    };
    reader.readAsText(file);
  }

  async confirmImport(): Promise<void> {
    const xml = this.rawXml();
    if (!xml) return;

    this.importing.set(true);
    this.errorMessage.set(null);

    try {
      const activeCompId = this.api.activeCompany()?.id || 'comp_1';
      const res = await this.api.importXml(activeCompId, xml, this.autoRegisterProducts);
      this.successMessage.set(res.message);
      this.parsedData.set(null);
      this.rawXml.set('');
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || 'Falha ao importar XML.');
    } finally {
      this.importing.set(false);
    }
  }

  reset(): void {
    this.parsedData.set(null);
    this.rawXml.set('');
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}
