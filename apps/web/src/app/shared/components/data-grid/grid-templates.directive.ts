import { Directive, inject, input, TemplateRef } from '@angular/core';

export interface GridRowContext<T> {
  $implicit: T;
}

/** Personaliza a célula de uma coluna: `<ng-template appGridCell="status" let-row>`. */
@Directive({ selector: 'ng-template[appGridCell]' })
export class GridCellDirective<T = unknown> {
  readonly key = input.required<string>({ alias: 'appGridCell' });
  readonly template = inject<TemplateRef<GridRowContext<T>>>(TemplateRef);
}

/** Define os botões da coluna "Ações": `<ng-template appGridActions let-row>`. */
@Directive({ selector: 'ng-template[appGridActions]' })
export class GridActionsDirective<T = unknown> {
  readonly template = inject<TemplateRef<GridRowContext<T>>>(TemplateRef);
}
