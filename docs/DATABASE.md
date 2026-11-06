# OpenNFE — Modelagem do Banco de Dados Relacional (PostgreSQL + Prisma)

## 1. Princípios de Isolamento e Integridade

1. **Multi-Tenancy por Coluna Discriminadora**: Todas as tabelas que pertencem ao escopo da conta do usuário possuem `tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE`.
2. **Índices Compostos de Isolamento**: Consultas e índices únicos incluem sempre `tenant_id` (ex: `UNIQUE (tenant_id, document_number, series)`).
3. **Auditoria Transacional**: Registro de criação (`created_at`), atualização (`updated_at`) e logs de eventos imutáveis com `fiscal_events`.

---

## 2. Entidades Principais e Esquema

### 2.1 Organizações e Usuários
- `organizations`: `id, name, slug, created_at, updated_at`
- `users`: `id, email, password_hash, full_name, is_active, created_at, updated_at`
- `organization_members`: `id, tenant_id, user_id, role (SUPER_ADMIN, TENANT_ADMIN, MANAGER, OPERATOR, ACCOUNTANT, VIEWER), created_at`
- `api_keys`: `id, tenant_id, name, key_hash, key_prefix, scopes, is_active, last_used_at, expires_at, created_at`

### 2.2 Empresas e Certificados
- `companies`:
  - `id, tenant_id, legal_name, trade_name, cnpj, state_registration, municipal_registration, cnae, tax_regime, environment`
  - Endereço fiscal estruturado: `street, number, complement, neighborhood, city_code, city_name, state, zip_code`
  - Contato: `email, phone`
  - `is_active, created_at, updated_at`
- `company_certificates`:
  - `id, tenant_id, company_id, encrypted_data, encryption_iv, encryption_auth_tag, valid_from, valid_to, issuer, subject_cnpj, created_at, updated_at`
- `company_provider_configs`:
  - `id, tenant_id, company_id, provider_key, environment, encrypted_credentials, is_active, created_at, updated_at`

### 2.3 Cadastros Base
- `customers`:
  - `id, tenant_id, document_type (CPF/CNPJ), document_number, name, email, phone, ie, ie_indicator, street, number, complement, neighborhood, city_code, city_name, state, zip_code, created_at, updated_at`
- `products`:
  - `id, tenant_id, code, description, ncm, cest, cfop_default, unit, unit_price, origin, cst_icms, csosn, created_at, updated_at`

### 2.4 Documentos Fiscais
- `fiscal_documents`:
  - `id, tenant_id, company_id, customer_id, document_type (NFE, NFCE, NFSE), status (DRAFT, VALIDATED, QUEUED, PROCESSING, AUTHORIZED, REJECTED, CANCELLED, DENIED)`
  - Numeração e Série: `series, number, access_key, protocol_number, authorized_at`
  - Natureza da Operação: `operation_nature, operation_type (INBOUND, OUTBOUND)`
  - Valores Totais: `total_products, total_discount, total_icms, total_ipi, total_pis, total_cofins, total_shipping, total_document`
  - Provedor Utilizado: `provider_key, external_reference, external_id`
  - Arquivos: `xml_url, pdf_url, rejection_code, rejection_reason`
  - `created_at, updated_at`
- `fiscal_document_items`:
  - `id, tenant_id, document_id, product_id, item_order, code, description, ncm, cfop, unit, quantity, unit_price, total_price, icms_cst, icms_base, icms_rate, icms_value, pis_value, cofins_value`
- `fiscal_document_events`:
  - `id, tenant_id, document_id, event_type (ISSUANCE_SUBMITTED, AUTHORIZED, REJECTED, CANCELLATION_REQUESTED, CANCELLED, CORRECTION_LETTER), payload, external_protocol, created_at`
- `fiscal_submissions`:
  - `id, tenant_id, document_id, idempotency_key (UNIQUE), provider_key, attempt_count, status, last_error, request_payload, response_payload, created_at, updated_at`

