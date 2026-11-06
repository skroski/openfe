import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  label: string;
  link?: string;
}

/**
 * Cabeçalho padrão de toda página: trilha de navegação, título, explicação
 * em linguagem simples e, à direita, os botões de ação (conteúdo projetado).
 */
@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  template: `
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        @if (crumbs().length) {
          <nav aria-label="Você está em" class="breadcrumbs text-xs text-base-content/60 p-0">
            <ul>
              @for (c of crumbs(); track c.label) {
                <li>
                  @if (c.link) {
                    <a [routerLink]="c.link">{{ c.label }}</a>
                  } @else {
                    <span aria-current="page">{{ c.label }}</span>
                  }
                </li>
              }
            </ul>
          </nav>
        }
        <h1 class="text-2xl sm:text-3xl font-bold text-base-content mt-1">{{ title() }}</h1>
        @if (description()) {
          <p class="text-sm text-base-content/70 mt-1 max-w-3xl">{{ description() }}</p>
        }
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <ng-content />
      </div>
    </header>
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly crumbs = input<Crumb[]>([]);
}
