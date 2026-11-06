/** Estrutura mínima de um campo de Signal Forms usada para exibir erros. */
interface FieldLike {
  (): {
    touched(): boolean;
    invalid(): boolean;
    errors(): readonly { message?: string }[];
  };
}

/** Mensagem de erro para mostrar embaixo do campo (somente depois que a pessoa mexeu nele). */
export function fieldError(field: FieldLike): string {
  const state = field();
  return state.touched() && state.invalid() ? (state.errors()[0]?.message ?? 'Valor inválido.') : '';
}
