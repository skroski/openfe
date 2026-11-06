export type GridAlign = 'start' | 'center' | 'end';
export type GridBreakpoint = 'md' | 'lg' | 'xl';
export type GridSortDirection = 'asc' | 'desc';

export interface GridColumn<T> {
  /** Identificador único da coluna (também usado para encontrar o template da célula). */
  key: string;
  /** Texto exibido no cabeçalho. */
  label: string;
  /** Valor puro da célula: usado na ordenação, na exibição padrão e na exportação para planilha. */
  value: (row: T) => string | number | null | undefined;
  /** Permite ordenar ao clicar no cabeçalho. Padrão: true. */
  sortable?: boolean;
  align?: GridAlign;
  /** Fonte monoespaçada para números de documento, códigos e valores. */
  mono?: boolean;
  /** Formata o valor para exibição/exportação (ex.: moeda). */
  format?: (value: string | number | null | undefined, row: T) => string;
  /** Esconde a coluna abaixo deste breakpoint (telas pequenas). */
  hideBelow?: GridBreakpoint;
}

export interface GridFilterOption {
  value: string;
  label: string;
}

export interface GridFilter<T> {
  key: string;
  label: string;
  /** Texto da opção que não filtra nada (ex.: "Todos os status"). */
  allLabel: string;
  options: GridFilterOption[];
  match: (row: T, value: string) => boolean;
}

export interface GridSort {
  key: string;
  direction: GridSortDirection;
}
