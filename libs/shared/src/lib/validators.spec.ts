import { describe, expect, it } from 'vitest';
import { isValidCnpj, isValidCpf } from '../index';

describe('validadores de documento', () => {
  it('aceita CPF válido, com ou sem máscara', () => {
    expect(isValidCpf('123.456.789-09')).toBe(true);
    expect(isValidCpf('12345678909')).toBe(true);
  });

  it('recusa CPF com dígito errado, tamanho errado e sequências repetidas', () => {
    expect(isValidCpf('123.456.789-00')).toBe(false);
    expect(isValidCpf('1234567890')).toBe(false);
    expect(isValidCpf('111.111.111-11')).toBe(false);
  });

  it('aceita CNPJ válido e recusa inválido', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
    expect(isValidCnpj('11.222.333/0001-99')).toBe(false);
  });
});
