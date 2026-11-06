import { Component, computed, inject, input, output, signal } from '@angular/core';
import { form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { FiscalDocumentDto } from '@opennfe/shared';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { ToastService } from '../../core/services/toast.service';
import { fieldError } from '../../shared/forms';
import { FormFieldComponent } from '../../shared/components/form-field.component';
import { AppIconComponent } from '../../shared/components/icon.component';
import { ModalComponent } from '../../shared/components/modal.component';

export const MIN_JUSTIFICATION = 15;
const CANCEL_WINDOW_HOURS = 24;

/** Diálogo de cancelamento, usado na lista e na página da nota. */
@Component({
  selector: 'app-cancel-document-dialog',
  imports: [FormField, AppIconComponent, FormFieldComponent, ModalComponent],
  template: `
    <app-modal title="Cancelar nota fiscal" [subtitle]="'Nota Nº ' + doc().number + ' · ' + (doc().customerName || 'Consumidor')" (closed)="closed.emit()">
      <div class="flex flex-col gap-4">
        <div class="alert alert-warning text-sm">
          <app-icon name="alert" [size]="18"></app-icon>
          <span>O cancelamento é enviado {{ isService() ? 'à prefeitura' : 'à SEFAZ' }} e <strong>não pode ser desfeito</strong>.</span>
        </div>

        @if (overDeadline()) {
          <div class="alert alert-error alert-soft text-sm" role="alert">
            <app-icon name="clock" [size]="18"></app-icon>
            <span>
              Esta nota foi autorizada há mais de {{ hours }} horas. O prazo de cancelamento varia por estado e município, e depois dele
              pode ser recusado ou exigir outro procedimento. Fale com seu contador antes de continuar.
            </span>
          </div>
        } @else if (!isService()) {
          <p class="text-sm text-base-content/70">Em geral o cancelamento de NF-e/NFC-e é permitido em até {{ hours }} horas após a autorização (pode variar por estado).</p>
        } @else {
          <p class="text-sm text-base-content/70">O prazo e as regras de cancelamento de NFS-e dependem da prefeitura do prestador.</p>
        }

        <app-form-field label="Motivo do cancelamento" for="cancel-reason" [required]="true"
          [hint]="'Explique com pelo menos ' + min + ' letras. Ex.: valor digitado errado no pedido.'" [error]="err(f.justification)">
          <textarea id="cancel-reason" class="textarea w-full h-28" [formField]="f.justification"></textarea>
          <span class="text-xs text-base-content/70 text-right">{{ model().justification.trim().length }}/{{ min }} mínimo</span>
        </app-form-field>
      </div>

      <ng-container modalActions>
        <button type="button" class="btn btn-ghost" (click)="closed.emit()">Voltar</button>
        <button type="button" class="btn btn-error" [disabled]="busy()" (click)="confirm()">
          @if (busy()) { <span class="loading loading-spinner loading-xs"></span> }
          Cancelar esta nota
        </button>
      </ng-container>
    </app-modal>
  `,
})
export class CancelDocumentDialogComponent {
  private readonly api = inject(FiscalApiService);
  private readonly toast = inject(ToastService);

  readonly doc = input.required<FiscalDocumentDto>();
  readonly closed = output<void>();
  readonly cancelled = output<FiscalDocumentDto>();

  readonly min = MIN_JUSTIFICATION;
  readonly hours = CANCEL_WINDOW_HOURS;
  readonly err = fieldError;
  readonly busy = signal(false);
  readonly model = signal({ justification: '' });
  readonly f = form(this.model, (p) => {
    required(p.justification, { message: 'Informe o motivo.' });
    minLength(p.justification, MIN_JUSTIFICATION, { message: `Escreva pelo menos ${MIN_JUSTIFICATION} caracteres.` });
  });

  protected readonly isService = computed(() => this.doc().documentType === 'NFSE');
  protected readonly overDeadline = computed(() => {
    const at = this.doc().authorizedAt;
    return !!at && Date.now() - new Date(at).getTime() > CANCEL_WINDOW_HOURS * 3_600_000;
  });

  async confirm(): Promise<void> {
    await submit(this.f, async () => {
      this.busy.set(true);
      try {
        const updated = await this.api.cancelDocument(this.doc().id, this.model().justification.trim());
        this.toast.success(`Nota Nº ${this.doc().number} cancelada.`);
        this.cancelled.emit(updated);
        this.closed.emit();
      } catch (e) {
        this.toast.error(this.api.errorMessage(e, 'Não foi possível cancelar a nota.'));
      } finally {
        this.busy.set(false);
      }
    });
  }
}
