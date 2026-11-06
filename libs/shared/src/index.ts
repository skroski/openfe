// Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  ACCOUNTANT = 'ACCOUNTANT',
  VIEWER = 'VIEWER',
}

export enum FiscalEnvironment {
  HOMOLOGATION = 'HOMOLOGATION',
  PRODUCTION = 'PRODUCTION',
}

export enum TaxRegime {
  SIMPLES_NACIONAL = 'SIMPLES_NACIONAL',
  SIMPLES_EXCESSO = 'SIMPLES_EXCESSO',
  LUCRO_PRESUMIDO = 'LUCRO_PRESUMIDO',
  LUCRO_REAL = 'LUCRO_REAL',
}

export enum DocumentType {
  NFE = 'NFE',
  NFCE = 'NFCE',
  NFSE = 'NFSE',
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  VALIDATED = 'VALIDATED',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  AUTHORIZED = 'AUTHORIZED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  DENIED = 'DENIED',
}

export enum OperationType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

// User & Auth Interfaces
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  organizationId: string;
  organizationName: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  user: AuthUser;
}

// Company Interfaces
export interface CompanyDto {
  id: string;
  organizationId: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  stateRegistration?: string | null;
  municipalRegistration?: string | null;
  cnae?: string | null;
  taxRegime: TaxRegime;
  environment: FiscalEnvironment;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  cityCode: string;
  cityName: string;
  state: string;
  zipCode: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Customer Interfaces
export interface CustomerDto {
  id: string;
  organizationId: string;
  documentType: 'CPF' | 'CNPJ';
  documentNumber: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  ie?: string | null;
  ieIndicator: string; // 1, 2, 9
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  cityCode: string;
  cityName: string;
  state: string;
  zipCode: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Product Interfaces
export interface ProductDto {
  id: string;
  organizationId: string;
  code: string;
  description: string;
  ncm: string;
  cest?: string | null;
  cfopDefault: string;
  unit: string;
  unitPrice: number;
  origin: string;
  cstIcms?: string | null;
  csosn?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Fiscal Document & Item Interfaces
export interface FiscalDocumentItemDto {
  id?: string;
  itemOrder: number;
  code: string;
  description: string;
  ncm: string;
  cfop: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  icmsCst?: string | null;
  icmsBase?: number;
  icmsRate?: number;
  icmsValue?: number;
  pisValue?: number;
  cofinsValue?: number;
}

export interface FiscalDocumentDto {
  id: string;
  organizationId: string;
  companyId: string;
  companyName?: string;
  customerId?: string | null;
  customerName?: string | null;
  customerDocument?: string | null;
  documentType: DocumentType;
  status: DocumentStatus;
  environment: FiscalEnvironment;
  series: number;
  number?: number | null;
  accessKey?: string | null;
  protocolNumber?: string | null;
  authorizedAt?: string | Date | null;
  operationNature: string;
  operationType: OperationType;
  totalProducts: number;
  totalDiscount: number;
  totalIcms: number;
  totalIpi: number;
  totalPis: number;
  totalCofins: number;
  totalShipping: number;
  totalDocument: number;
  providerKey?: string | null;
  externalReference?: string | null;
  externalId?: string | null;
  xmlUrl?: string | null;
  pdfUrl?: string | null;
  rejectionCode?: string | null;
  rejectionReason?: string | null;
  items?: FiscalDocumentItemDto[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Utilities & Validators
export function formatCnpj(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, '');
  if (clean.length !== 14) return cnpj;
  return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export function formatCpf(cpf: string): string {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return cpf;
  return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function isValidCnpj(cnpj: string): boolean {
  const b = cnpj.replace(/\D/g, '');
  if (b.length !== 14 || /^(\d)\1+$/.test(b)) return false;
  let size = b.length - 2;
  let numbers = b.substring(0, size);
  const digits = b.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(0))) return false;
  size = size + 1;
  numbers = b.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === Number(digits.charAt(1));
}


export function isValidCpf(cpf: string): boolean {
  const b = cpf.replace(/\D/g, '');
  if (b.length !== 11 || /^(\d)\1+$/.test(b)) return false;
  const digit = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(b[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return digit(9) === Number(b[9]) && digit(10) === Number(b[10]);
}
