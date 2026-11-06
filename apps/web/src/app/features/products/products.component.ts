import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { AppIconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold tracking-wider text-base-content/50 uppercase" style="font-family: var(--font-display);">
            CADASTROS · CATÁLOGO FISCAL
          </span>
          <h1 class="text-3xl font-light text-base-content mt-1">
            <strong class="font-bold">Produtos</strong> & Serviços
          </h1>
          <p class="text-sm text-base-content/60">
            Catálogo com classificação fiscal NCM, CEST, CFOP padrão e tributação
          </p>
        </div>

        <button type="button" class="btn btn-primary btn-sm text-white gap-2" (click)="showModal.set(true)">
          <app-icon name="plus" [size]="16"></app-icon>
          Novo Produto
        </button>
      </div>

      <!-- Products Table -->
      <div class="card bg-base-100 border border-base-300 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead class="bg-base-200/50">
              <tr class="text-xs text-base-content/60">
                <th>CÓDIGO</th>
                <th>DESCRIÇÃO</th>
                <th>NCM</th>
                <th>CFOP</th>
                <th>UNIDADE</th>
                <th>PREÇO UNITÁRIO</th>
                <th class="text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              @for (prod of api.products(); track prod.id) {
                <tr class="hover:bg-base-200/40">
                  <td><span class="font-mono text-xs font-bold">{{ prod.code }}</span></td>
                  <td><span class="font-medium text-sm">{{ prod.description }}</span></td>
                  <td><span class="badge badge-sm badge-ghost font-mono">{{ prod.ncm }}</span></td>
                  <td><span class="badge badge-sm font-mono">{{ prod.cfopDefault }}</span></td>
                  <td><span class="badge badge-sm badge-outline font-mono">{{ prod.unit }}</span></td>
                  <td>
                    <span class="font-mono font-bold text-sm">
                      {{ prod.unitPrice | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                    </span>
                  </td>
                  <td class="text-right">
                    <button type="button" class="btn btn-ghost btn-xs">Editar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- New Product Modal -->
      @if (showModal()) {
        <div class="modal modal-open">
          <div class="modal-box">
            <h3 class="font-bold text-lg">Novo Produto / Serviço</h3>
            <div class="space-y-3 mt-4 text-xs">
              <div class="grid grid-cols-2 gap-2">
                <div class="form-control">
                  <label class="label"><span class="label-text">Código Interno *</span></label>
                  <input type="text" class="input input-sm input-bordered font-mono" [(ngModel)]="formCode" placeholder="EX: ALIM-003" />
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">Unidade Comercial</span></label>
                  <input type="text" class="input input-sm input-bordered font-mono" [(ngModel)]="formUnit" placeholder="UN, KG, HR" />
                </div>
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">Descrição Completa *</span></label>
                <input type="text" class="input input-sm input-bordered" [(ngModel)]="formDescription" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="form-control">
                  <label class="label"><span class="label-text">NCM (8 dígitos) *</span></label>
                  <input type="text" class="input input-sm input-bordered font-mono" [(ngModel)]="formNcm" placeholder="0000.00.00" />
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">CFOP Padrão (4 dígitos) *</span></label>
                  <input type="text" class="input input-sm input-bordered font-mono" [(ngModel)]="formCfop" placeholder="5102" />
                </div>
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">Preço Unitário de Venda (R$) *</span></label>
                <input type="number" class="input input-sm input-bordered font-mono" [(ngModel)]="formPrice" />
              </div>
            </div>
            <div class="modal-action">
              <button type="button" class="btn btn-sm btn-ghost" (click)="showModal.set(false)">Cancelar</button>
              <button type="button" class="btn btn-sm btn-primary text-white" (click)="saveProduct()">Salvar Produto</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ProductsComponent {
  readonly api = inject(FiscalApiService);

  showModal = signal<boolean>(false);
  formCode = '';
  formDescription = '';
  formUnit = 'UN';
  formNcm = '0901.21.00';
  formCfop = '5102';
  formPrice = 25.0;

  async saveProduct(): Promise<void> {
    await this.api.createProduct({
      code: this.formCode || `PRD-${Date.now().toString().slice(-4)}`,
      description: this.formDescription,
      unit: this.formUnit,
      ncm: this.formNcm,
      cfopDefault: this.formCfop,
      unitPrice: Number(this.formPrice),
    });
    this.showModal.set(false);
  }
}
