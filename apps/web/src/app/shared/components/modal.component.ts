import { Component, input, output } from '@angular/core';
import { AppIconComponent } from './icon.component';

/**
 * Janela de diálogo padrão. Fecha com Esc, com o X ou clicando fora.
 * Rodapé de botões entra pelo slot `[modalActions]`.
 */
@Component({
  selector: 'app-modal',
  imports: [AppIconComponent],
  host: { '(document:keydown.escape)': 'closed.emit()' },
  template: `
    <div class="modal modal-open" role="dialog" aria-modal="true" [attr.aria-label]="title()">
      <div class="modal-box p-0 flex flex-col max-h-[90vh]" [class]="wide() ? 'max-w-3xl' : 'max-w-xl'">
        <div class="flex items-start justify-between gap-4 p-6 pb-4 border-b border-base-300">
          <div>
            <h2 class="text-lg font-bold">{{ title() }}</h2>
            @if (subtitle()) {
              <p class="text-sm text-base-content/70 mt-0.5">{{ subtitle() }}</p>
            }
          </div>
          <button type="button" class="btn btn-ghost btn-sm btn-square" (click)="closed.emit()" aria-label="Fechar">
            <app-icon name="x" [size]="18"></app-icon>
          </button>
        </div>
        <div class="p-6 overflow-y-auto">
          <ng-content />
        </div>
        <div class="flex justify-end gap-2 p-4 border-t border-base-300 bg-base-200/50">
          <ng-content select="[modalActions]" />
        </div>
      </div>
      <button type="button" class="modal-backdrop" (click)="closed.emit()" aria-label="Fechar janela"></button>
    </div>
  `,
})
export class ModalComponent {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly wide = input(false);
  readonly closed = output<void>();
}
