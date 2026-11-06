import { formatCnpj, formatCpf } from '@opennfe/shared';

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

export const digitsOnly = (v: string | null | undefined): string => (v ?? '').replace(/\D/g, '');

/** Mostra CPF ou CNPJ formatado a partir de qualquer entrada. */
export function formatDocument(v: string | null | undefined): string {
  const d = digitsOnly(v);
  if (d.length === 11) return formatCpf(d);
  if (d.length === 14) return formatCnpj(d);
  return v ?? '';
}

export function formatCep(v: string): string {
  const d = digitsOnly(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function formatNcm(v: string): string {
  const d = digitsOnly(v);
  return d.length === 8 ? `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}` : v;
}

export const TAX_REGIME_LABEL: Record<string, string> = {
  SIMPLES_NACIONAL: 'Simples Nacional',
  SIMPLES_EXCESSO: 'Simples (excesso de sublimite)',
  LUCRO_PRESUMIDO: 'Lucro Presumido',
  LUCRO_REAL: 'Lucro Real',
};

export const DOCUMENT_TYPE_LABEL: Record<string, string> = {
  NFE: 'NF-e (modelo 55)',
  NFCE: 'NFC-e (modelo 65)',
  NFSE: 'NFS-e (serviço)',
};

export const DOCUMENT_TYPE_SHORT: Record<string, string> = {
  NFE: 'NF-e',
  NFCE: 'NFC-e',
  NFSE: 'NFS-e',
};
