import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  contentChildren,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { AppIconComponent } from '../icon.component';
import {
  GridActionsDirective,
  GridCellDirective,
} from './grid-templates.directive';
import {
  GridBreakpoint,
  GridColumn,
  GridFilter,
  GridSort,
} from './data-grid.types';

const collator = new Intl.Collator('pt-BR', {
  numeric: true,
  sensitivity: 'base',
});

const HIDE_BELOW: Record<GridBreakpoint, string> = {
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
  xl: 'hidden xl:table-cell',
};

const ALIGN: Record<'start' | 'center' | 'end', string> = {
  start: 'text-left',
  center: 'text-center',
  end: 'text-right',
};

/**
 * Grid padrão do sistema: busca, filtros, ordenação, paginação e exportação.
 * Todas as listas devem usar este componente para manter o mesmo comportamento.
 */
@Component({
  selector: 'app-data-grid',
  imports: [NgTemplateOutlet, AppIconComponent],
  template: `
    <section class="card bg-base-100 border border-base-300 shadow-xs">
      <!-- Barra de ferramentas: busca + filtros + exportar -->
      <div class="p-4 flex flex-wrap items-end gap-3 border-b border-base-300">
        @if (searchText()) {
          <label class="flex flex-col gap-1 grow basis-64 min-w-0">
            <span class="text-xs font-semibold text-base-content/70">Buscar</span>
            <span class="input w-full">
              <app-icon name="search" [size]="16" customClass="opacity-50"></app-icon>
              <input
                type="search"
                class="grow"
                [placeholder]="searchPlaceholder()"
                [value]="query()"
                (input)="onSearch($event)"
                [attr.aria-label]="'Buscar em ' + label()"
              />
            </span>
          </label>
        }

        @for (f of filters(); track f.key) {
          <label class="flex flex-col gap-1 w-full sm:w-52">
            <span class="text-xs font-semibold text-base-content/70">{{ f.label }}</span>
            <select
              class="select w-full"
              [value]="filterValues()[f.key] ?? ''"
              (change)="onFilter(f.key, $event)"
            >
              <option value="">{{ f.allLabel }}</option>
              @for (o of f.options; track o.value) {
                <option [value]="o.value">{{ o.label }}</option>
              }
            </select>
          </label>
        }

        <div class="flex items-center gap-2 ml-auto">
          @if (hasActiveFilters()) {
            <button type="button" class="btn btn-ghost" (click)="clearFilters()">
              <app-icon name="x" [size]="16"></app-icon>
              Limpar filtros
            </button>
          }
          @if (exportName()) {
            <button
              type="button"
              class="btn btn-outline"
              [disabled]="filteredRows().length === 0"
              (click)="exportCsv()"
              title="Baixa em planilha (CSV) os registros que estão filtrados"
            >
              <app-icon name="download" [size]="16"></app-icon>
              Exportar planilha
            </button>
          }
        </div>
      </div>

      <!-- Tabela -->
      <div class="overflow-x-auto">
        <table class="table">
          <caption class="sr-only">
            {{ label() }}
          </caption>
          <thead>
            <tr class="bg-base-200/60 text-base-content/70">
              @for (col of columns(); track col.key) {
                <th
                  scope="col"
                  class="whitespace-nowrap text-xs uppercase tracking-wide"
                  [class]="headerClass(col)"
                  [attr.aria-sort]="ariaSort(col)"
                >
                  @if (col.sortable !== false) {
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 uppercase font-semibold hover:text-base-content cursor-pointer"
                      [class.flex-row-reverse]="col.align === 'end'"
                      (click)="toggleSort(col)"
                      [title]="'Ordenar por ' + col.label"
                    >
                      {{ col.label }}
                      <app-icon [name]="sortIcon(col)" [size]="14" [customClass]="sortState()?.key === col.key ? 'text-primary' : 'opacity-40'"></app-icon>
                    </button>
                  } @else {
                    <span class="font-semibold">{{ col.label }}</span>
                  }
                </th>
              }
              @if (actionsTpl()) {
                <th scope="col" class="text-right whitespace-nowrap text-xs uppercase tracking-wide font-semibold">Ações</th>
              }
            </tr>
          </thead>
          <tbody>
            @if (loading()) {
              @for (n of skeletonRows; track n) {
                <tr>
                  @for (col of columns(); track col.key) {
                    <td [class]="cellClass(col)"><div class="skeleton h-4 w-3/4"></div></td>
                  }
                  @if (actionsTpl()) { <td><div class="skeleton h-4 w-16 ml-auto"></div></td> }
                </tr>
              }
            } @else {
              @for (row of pageRows(); track rowId()(row)) {
                <tr class="hover:bg-base-200/40" [class.cursor-pointer]="rowClickable()" (click)="rowClick.emit(row)">
                  @for (col of columns(); track col.key) {
                    <td [class]="cellClass(col)">
                      @if (cellTemplate(col.key); as tpl) {
                        <ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="{ $implicit: row }" />
                      } @else {
                        {{ display(col, row) }}
                      }
                    </td>
                  }
                  @if (actionsTpl(); as actions) {
                    <td class="text-right whitespace-nowrap" (click)="$event.stopPropagation()">
                      <div class="inline-flex items-center gap-1.5">
                        <ng-container [ngTemplateOutlet]="actions.template" [ngTemplateOutletContext]="{ $implicit: row }" />
                      </div>
                    </td>
                  }
                </tr>
              } @empty {
                <tr>
                  <td [attr.colspan]="columnCount()" class="py-14">
                    <div class="flex flex-col items-center gap-2 text-center">
                      <span class="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center text-base-content/50">
                        <app-icon name="search" [size]="22"></app-icon>
                      </span>
                      @if (rows().length === 0) {
                        <p class="font-semibold">{{ emptyTitle() }}</p>
                        <p class="text-sm text-base-content/60 max-w-md">{{ emptyHint() }}</p>
                        <ng-content select="[gridEmpty]" />
                      } @else {
                        <p class="font-semibold">Nenhum resultado para esta busca</p>
                        <p class="text-sm text-base-content/60">Tente outro termo ou remova os filtros.</p>
                        <button type="button" class="btn btn-sm btn-outline mt-1" (click)="clearFilters()">Limpar filtros</button>
                      }
                    </div>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Rodapé: contagem + paginação -->
      <div class="p-4 flex flex-wrap items-center justify-between gap-3 border-t border-base-300 text-sm">
        <p class="text-base-content/70" aria-live="polite">
          @if (filteredRows().length === 0) {
            Nenhum registro
          } @else {
            Mostrando <strong>{{ firstItem() }}</strong>–<strong>{{ lastItem() }}</strong>
            de <strong>{{ filteredRows().length }}</strong>
            @if (filteredRows().length !== rows().length) {
              <span> (filtrado de {{ rows().length }})</span>
            }
          }
        </p>

        <div class="flex flex-wrap items-center gap-4">
          <label class="flex items-center gap-2">
            <span class="text-base-content/70">Linhas por página</span>
            <select class="select select-sm w-20" [value]="pageSize()" (change)="onPageSize($event)">
              @for (s of pageSizes(); track s) {
                <option [value]="s">{{ s }}</option>
              }
            </select>
          </label>

          @if (pageCount() > 1) {
            <nav class="join" aria-label="Paginação">
              <button type="button" class="join-item btn btn-sm" [disabled]="currentPage() === 1" (click)="goTo(1)" aria-label="Primeira página">
                <app-icon name="chevrons-left" [size]="16"></app-icon>
              </button>
              <button type="button" class="join-item btn btn-sm" [disabled]="currentPage() === 1" (click)="goTo(currentPage() - 1)" aria-label="Página anterior">
                <app-icon name="chevron-left" [size]="16"></app-icon>
              </button>
              @for (p of pageButtons(); track $index) {
                @if (p === null) {
                  <span class="join-item btn btn-sm btn-disabled">…</span>
                } @else {
                  <button
                    type="button"
                    class="join-item btn btn-sm"
                    [class.btn-primary]="p === currentPage()"
                    [attr.aria-current]="p === currentPage() ? 'page' : null"
                    (click)="goTo(p)"
                  >{{ p }}</button>
                }
              }
              <button type="button" class="join-item btn btn-sm" [disabled]="currentPage() === pageCount()" (click)="goTo(currentPage() + 1)" aria-label="Próxima página">
                <app-icon name="chevron-right" [size]="16"></app-icon>
              </button>
              <button type="button" class="join-item btn btn-sm" [disabled]="currentPage() === pageCount()" (click)="goTo(pageCount())" aria-label="Última página">
                <app-icon name="chevrons-right" [size]="16"></app-icon>
              </button>
            </nav>
          }
        </div>
      </div>
    </section>
  `,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DataGridComponent<T = any> {
  readonly rows = input.required<T[]>();
  readonly columns = input.required<GridColumn<T>[]>();
  readonly rowId = input<(row: T) => string | number>((row) => (row as { id: string }).id);
  readonly filters = input<GridFilter<T>[]>([]);
  /** Texto pesquisável de cada linha. Sem ele, a caixa de busca não aparece. */
  readonly searchText = input<((row: T) => string) | null>(null);
  readonly searchPlaceholder = input('Digite para buscar…');
  readonly label = input('Lista de registros');
  readonly loading = input(false);
  readonly pageSizes = input<number[]>([10, 25, 50, 100]);
  readonly initialPageSize = input(10);
  readonly initialSort = input<GridSort | null>(null);
  readonly emptyTitle = input('Nada cadastrado ainda');
  readonly emptyHint = input('Quando houver registros, eles aparecerão aqui.');
  /** Nome do arquivo (sem extensão) para habilitar o botão "Exportar planilha". */
  readonly exportName = input<string | null>(null);
  readonly rowClickable = input(false);

  readonly rowClick = output<T>();

  private readonly cellTpls = contentChildren(GridCellDirective);
  protected readonly actionsTpl = contentChild(GridActionsDirective);

  protected readonly skeletonRows = [1, 2, 3, 4, 5];

  protected readonly query = signal('');
  protected readonly filterValues = signal<Record<string, string>>({});
  protected readonly sortState = linkedSignal<GridSort | null>(() => this.initialSort());
  protected readonly pageSize = linkedSignal(() => this.initialPageSize());
  private readonly page = signal(1);

  protected readonly columnCount = computed(
    () => this.columns().length + (this.actionsTpl() ? 1 : 0)
  );

  protected readonly hasActiveFilters = computed(
    () => this.query().trim() !== '' || Object.values(this.filterValues()).some((v) => v !== '')
  );

  protected readonly filteredRows = computed(() => {
    const textOf = this.searchText();
    const q = this.normalize(this.query());
    const active = Object.entries(this.filterValues()).filter(([, v]) => v !== '');
    const filters = this.filters();

    let list = this.rows();
    if (textOf && q) {
      list = list.filter((r) => this.normalize(textOf(r)).includes(q));
    }
    for (const [key, value] of active) {
      const f = filters.find((x) => x.key === key);
      if (f) list = list.filter((r) => f.match(r, value));
    }

    const sort = this.sortState();
    const col = sort ? this.columns().find((c) => c.key === sort.key) : undefined;
    if (sort && col) {
      const dir = sort.direction === 'asc' ? 1 : -1;
      list = [...list].sort((a, b) => dir * this.compare(col.value(a), col.value(b)));
    }
    return list;
  });

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredRows().length / this.pageSize()))
  );
  protected readonly currentPage = computed(() => Math.min(this.page(), this.pageCount()));
  protected readonly pageRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredRows().slice(start, start + this.pageSize());
  });
  protected readonly firstItem = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  protected readonly lastItem = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.filteredRows().length)
  );

  /** Janela de páginas com reticências (null = "…"). */
  protected readonly pageButtons = computed<(number | null)[]>(() => {
    const total = this.pageCount();
    const current = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, current - 1, current, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const out: (number | null)[] = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) out.push(null);
      out.push(p);
    });
    return out;
  });

  protected cellTemplate(key: string) {
    return this.cellTpls().find((t) => t.key() === key)?.template ?? null;
  }

  protected display(col: GridColumn<T>, row: T): string {
    const v = col.value(row);
    if (col.format) return col.format(v, row);
    return v === null || v === undefined || v === '' ? '—' : String(v);
  }

  protected headerClass(col: GridColumn<T>): string {
    return [ALIGN[col.align ?? 'start'], col.hideBelow ? HIDE_BELOW[col.hideBelow] : ''].join(' ');
  }

  protected cellClass(col: GridColumn<T>): string {
    return [
      ALIGN[col.align ?? 'start'],
      col.mono ? 'font-mono tabular-nums' : '',
      col.hideBelow ? HIDE_BELOW[col.hideBelow] : '',
    ].join(' ');
  }

  protected sortIcon(col: GridColumn<T>): string {
    const s = this.sortState();
    if (s?.key !== col.key) return 'arrow-up-down';
    return s.direction === 'asc' ? 'arrow-up' : 'arrow-down';
  }

  protected ariaSort(col: GridColumn<T>): 'ascending' | 'descending' | 'none' | null {
    if (col.sortable === false) return null;
    const s = this.sortState();
    if (s?.key !== col.key) return 'none';
    return s.direction === 'asc' ? 'ascending' : 'descending';
  }

  /** Clique no cabeçalho: crescente → decrescente → sem ordenação. */
  protected toggleSort(col: GridColumn<T>): void {
    const s = this.sortState();
    if (s?.key !== col.key) this.sortState.set({ key: col.key, direction: 'asc' });
    else if (s.direction === 'asc') this.sortState.set({ key: col.key, direction: 'desc' });
    else this.sortState.set(null);
    this.page.set(1);
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  protected onFilter(key: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filterValues.update((v) => ({ ...v, [key]: value }));
    this.page.set(1);
  }

  protected onPageSize(event: Event): void {
    this.pageSize.set(Number((event.target as HTMLSelectElement).value));
    this.page.set(1);
  }

  protected goTo(p: number): void {
    this.page.set(Math.min(Math.max(1, p), this.pageCount()));
  }

  protected clearFilters(): void {
    this.query.set('');
    this.filterValues.set({});
    this.page.set(1);
  }

  protected exportCsv(): void {
    const cols = this.columns();
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [
      cols.map((c) => esc(c.label)).join(';'),
      ...this.filteredRows().map((r) => cols.map((c) => esc(this.display(c, r))).join(';')),
    ];
    // BOM para o Excel reconhecer acentos (UTF-8).
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.exportName()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private compare(a: unknown, b: unknown): number {
    const aEmpty = a === null || a === undefined || a === '';
    const bEmpty = b === null || b === undefined || b === '';
    if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return collator.compare(String(a), String(b));
  }

  /** Busca sem diferenciar maiúsculas nem acentos. */
  private normalize(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim();
  }
}
