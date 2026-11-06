import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { AppIconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, FormsModule, AppIconComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold tracking-wider text-base-content/50 uppercase" style="font-family: var(--font-display);">
            CADASTROS · DESTINATÁRIOS
          </span>
          <h1 class="text-3xl font-light text-base-content mt-1">
            <strong class="font-bold">Clientes</strong> & Destinatários
          </h1>
          <p class="text-sm text-base-content/60">
            Base de compradores PF e PJ com validação de CPF, CNPJ e Inscrição Estadual
          </p>
        </div>

        <button type="button" class="btn btn-primary btn-sm text-white gap-2" (click)="showModal.set(true)">
          <app-icon name="plus" [size]="16"></app-icon>
          Novo Destinatário
        </button>
      </div>

      <!-- Customers Table -->
      <div class="card bg-base-100 border border-base-300 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead class="bg-base-200/50">
              <tr class="text-xs text-base-content/60">
                <th>TIPO</th>
                <th>DOCUMENTO</th>
                <th>NOME / RAZÃO SOCIAL</th>
                <th>CONTATOS</th>
                <th>CIDADE / UF</th>
                <th class="text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              @for (cust of api.customers(); track cust.id) {
                <tr class="hover:bg-base-200/40">
                  <td><span class="badge badge-sm font-mono font-bold">{{ cust.documentType }}</span></td>
                  <td><span class="font-mono text-xs font-semibold">{{ cust.documentNumber }}</span></td>
                  <td><span class="font-medium text-sm">{{ cust.name }}</span></td>
                  <td>
                    <div class="text-xs text-base-content/70">
                      <div>{{ cust.email || '—' }}</div>
                      <div>{{ cust.phone || '—' }}</div>
                    </div>
                  </td>
                  <td>{{ cust.cityName }} / {{ cust.state }}</td>
                  <td class="text-right">
                    <button type="button" class="btn btn-ghost btn-xs">Editar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- New Customer Modal -->
      @if (showModal()) {
        <div class="modal modal-open">
          <div class="modal-box">
            <h3 class="font-bold text-lg">Novo Destinatário</h3>
            <div class="space-y-3 mt-4 text-xs">
              <div class="form-control">
                <label class="label"><span class="label-text">Nome Completo / Razão Social *</span></label>
                <input type="text" class="input input-sm input-bordered" [(ngModel)]="formName" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="form-control">
                  <label class="label"><span class="label-text">Tipo</span></label>
                  <select class="select select-sm select-bordered" [(ngModel)]="formType">
                    <option value="CNPJ">Pessoa Jurídica (CNPJ)</option>
                    <option value="CPF">Pessoa Física (CPF)</option>
                  </select>
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">Número do Documento *</span></label>
                  <input type="text" class="input input-sm input-bordered" [(ngModel)]="formNumber" placeholder="00.000.000/0000-00" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="form-control">
                  <label class="label"><span class="label-text">E-mail</span></label>
                  <input type="email" class="input input-sm input-bordered" [(ngModel)]="formEmail" />
                </div>
                <div class="form-control">
                  <label class="label"><span class="label-text">Telefone</span></label>
                  <input type="text" class="input input-sm input-bordered" [(ngModel)]="formPhone" />
                </div>
              </div>
            </div>
            <div class="modal-action">
              <button type="button" class="btn btn-sm btn-ghost" (click)="showModal.set(false)">Cancelar</button>
              <button type="button" class="btn btn-sm btn-primary text-white" (click)="saveCustomer()">Salvar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CustomersComponent {
  readonly api = inject(FiscalApiService);

  showModal = signal<boolean>(false);
  formName = '';
  formType: 'CPF' | 'CNPJ' = 'CNPJ';
  formNumber = '';
  formEmail = '';
  formPhone = '';

  async saveCustomer(): Promise<void> {
    await this.api.createCustomer({
      name: this.formName,
      documentType: this.formType,
      documentNumber: this.formNumber,
      email: this.formEmail,
      phone: this.formPhone,
      cityName: 'São Paulo',
      state: 'SP',
      street: 'Rua Principal',
      number: '10',
      neighborhood: 'Centro',
      cityCode: '3550308',
      zipCode: '01000-000',
    });
    this.showModal.set(false);
  }
}
