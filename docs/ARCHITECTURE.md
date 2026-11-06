# OpenNFE — Arquitetura de Software

## 1. Princípios Fundamentais

O **OpenNFE** é estruturado sobre os conceitos de **Clean Architecture** e **Ports & Adapters (Hexagonal Architecture)** em um **Monorepo Nx**.

### 1.1 Regras Rígidas de Dependência
```
+-----------------------------------------------------------+
|                      User Interfaces                      |
|           apps/web (Angular 22 + DaisyUI 5)               |
+-----------------------------------------------------------+
                           |
                           v  (HTTP / REST / OpenAPI)
+-----------------------------------------------------------+
|                     Application API                       |
|           apps/api (NestJS) + apps/worker (BullMQ)        |
+-----------------------------------------------------------+
         |                                           |
         v                                           v
+-----------------------+                 +---------------------+
| Fiscal Domain & Ports | <-------------- |  Provider Adapters  |
|  (@opennfe/fiscal)    |  (Implements)   | Focus NFe / Mock    |
+-----------------------+                 +---------------------+
         ^
         | (Shared Entities & Rules)
+-----------------------------------------------------------+
|                  Shared Core & Database                   |
|     (@opennfe/shared, @opennfe/database - Prisma/Postgres)|
+-----------------------------------------------------------+
```

1. **O Domínio Fiscal desconhece provedores externos**:
   - Não há menção a "Focus NFe", "PlugNotas" ou formato SEFAZ específico dentro dos casos de uso ou entidades de domínio.
   - O domínio define as interfaces (Ports): `FiscalProviderAdapter`, `FiscalSubmissionRequest`, `FiscalSubmissionResult`, etc.
2. **Adapters implementam as Ports**:
   - `FocusNfeAdapter` implementa `FiscalProviderAdapter`.
   - `MockFiscalProvider` implementa `FiscalProviderAdapter`.
3. **Frontend independente**:
   - O frontend consome exclusivamente a API pública do OpenNFE (`/api/v1/...`).
   - O frontend nunca interage com URLs, chaves ou particularidades de provedores.

---

## 2. Estrutura do Monorepo Nx

```
openfe/
├── apps/
│   ├── web/               # SPA Angular 22 (Standalone, Signals, DaisyUI 5, Tailwind)
│   ├── api/               # API Principal NestJS (REST, OpenAPI, Auth, RBAC)
│   └── worker/            # Processador assíncrono NestJS/BullMQ (Emissão, Webhooks)
├── libs/
│   ├── shared/            # Modelos, DTOs compartilhados, enums, utilitários fiscais
│   ├── fiscal/            # Domínio fiscal (entidades, casos de uso, validações, ports)
│   ├── providers/         # Registry, Focus NFe adapter, Mock adapter, PlugNotas
│   ├── companies/         # Módulo de gestão de empresas e filiais
│   ├── customers/         # Módulo de destinatários
│   ├── products/          # Módulo de produtos, serviços e regras tributárias
│   ├── database/          # Prisma schema, migrations, repositórios com tenant isolation
│   └── ui/                # Componentes Angular reutilizáveis com DaisyUI 5
├── docs/                  # Especificações técnicas e manuais
└── docker/                # Compose com PostgreSQL 16 e Redis 7
```

---

## 3. Frontend: Angular com Signals e DaisyUI 5

### 3.1 Padrão de Componentes
- Angular v20+: Componentes são standalone por padrão — **não utilizar `standalone: true`** (conforme diretriz de projeto).
- **Angular Signals**: Utilizados para estado reativo local, visualização, paginação e filtros.
- **RxJS**: Utilizado exclusivamente para chamadas HTTP assíncronas, streams e operadores de debounce/switchMap.
- **DaisyUI 5 & Tailwind CSS**:
  - Tema customizado `opennfe` no Tailwind / DaisyUI.
  - Paleta baseada nos tokens visuais extraídos: amarelo/laranja de ação (`--brand-orange`, `--brand-yellow`), grafite escuro para navegação (`--graphite-800`), superfícies claras e neutras para formulários e tabelas.
- **Lucide Angular**: Conjunto padronizado de ícones.

---

## 4. Backend: NestJS, Prisma e BullMQ

### 4.1 Isolamento Multi-Tenant
- Cada requisição autenticada carrega o `tenant_id` assinado no JWT.
- Um interceptor ou middleware injeta o `TenantContext` no escopo da requisição.
- Os repositórios do Prisma filtram obrigatoriamente por `tenant_id`.

### 4.2 Pipeline de Emissão Assíncrona
```
[Client] ---> POST /api/v1/documents/:id/submit
   |
[API Controller]
   |--> Valida documento (Schema & Regras de Domínio)
   |--> Atualiza status para QUEUED
   |--> Adiciona Job na fila BullMQ: "fiscal-issuance" com idempotency_key
   |--> Retorna HTTP 202 Accepted { status: "QUEUED", trackingId }
   |
[Worker Queue Consumer]
   |--> Lock distribuído por documento
   |--> Consulta configuração do provedor ativo para a empresa
   |--> Factory instancia o adapter apropriado (Focus NFe ou Mock)
   |--> Adapter converte modelo interno -> payload externo
   |--> Transmite ao provedor e recebe resposta síncrona ou protocolo
   |--> Atualiza status no banco (PROCESSING ou AUTHORIZED ou REJECTED)
   |--> Dispara Webhook de saída para o cliente (se configurado)
```

---

## 5. Regras de Linters e Limites Nx (`nx.json` / eslint)
- `@opennfe/fiscal` **nunca** pode importar `@opennfe/providers` ou `@opennfe/database`.
- `@opennfe/providers` depende apenas de `@opennfe/fiscal` (para implementar as interfaces) e `@opennfe/shared`.
- `apps/web` **nunca** importa módulos do backend (`apps/api`, `apps/worker` ou libs com dependência Node/Prisma).

