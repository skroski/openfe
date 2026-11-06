import { Component, input } from '@angular/core';

/**
 * Campo de formulário padrão: rótulo sempre visível, dica e erro abaixo do campo.
 * O controle (input/select) entra como conteúdo.
 */
@Component({
  selector: 'app-form-field',
  template: `
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-semibold text-base-content" [attr.for]="for()">
        {{ label() }}
        @if (required()) {
          <span class="text-error" aria-hidden="true"> *</span>
          <span class="sr-only"> (obrigatório)</span>
        }
      </label>
      <ng-content />
      @if (error()) {
        <p class="text-sm text-error flex items-center gap-1" role="alert">{{ error() }}</p>
      } @else if (hint()) {
        <p class="text-xs text-base-content/60">{{ hint() }}</p>
      }
    </div>
  `,
})
export class FormFieldComponent {
  readonly label = input.required<string>();
  readonly for = input<string | null>(null);
  readonly hint = input('');
  readonly error = input('');
  readonly required = input(false);
}
