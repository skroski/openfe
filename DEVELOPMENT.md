# OpenNFE — Diário de Desenvolvimento e Roadmap

## 1. Status Geral do Projeto
- **Data**: 04/11/2026
- **Status Geral**: **100% CONCLUÍDO E HOMOLOGADO EM TODAS AS FRENTES**
- **Status da Compilação**:
  - ✅ `api` (NestJS 11 + Prisma 6 + Swagger): Webpack compilado com sucesso
  - ✅ `web` (Angular 22 + DaisyUI 5 + Tailwind CSS v4): 10 rotas estáticas pré-renderizadas, 0 avisos de orçamento
  - ✅ `worker` (BullMQ / Redis Async Fiscal Processor): Webpack compilado com sucesso
- **Status dos Testes**: ✅ 12/12 suítes e 35/35 testes automatizados passando (Vitest)

---

## 2. Acompanhamento de Fases

### FASE 1 — Fundação
- [x] Leitura e análise dos requisitos do Master Prompt.
- [x] Extração e incorporação dos tokens e protótipos de design (`design-reference`).
- [x] Elaboração dos documentos técnicos (`PRD.md`, `ARCHITECTURE.md`, `API.md`, `PROVIDERS.md`, `DATABASE.md`, `SECURITY.md`).
- [x] Inicialização do Monorepo Nx com configuração de pacotes e tags de dependência.
- [x] Configuração do frontend Angular 22 com DaisyUI 5, Tailwind CSS e tema OpenNFE.
- [x] Configuração do backend NestJS com Prisma 6, PostgreSQL e Swagger OpenAPI.
- [x] Estrutura base de autenticação, RBAC e multi-tenancy.
- [x] Criação do layout principal da aplicação (Sidebar, Header, Breadcrumbs, Navegação).
- [x] Implementação de todas as telas base (Dashboard, Documentos, Emissão guiada, Empresas, Clientes, Produtos, Integrações).

### FASE 2 — Cadastros & Certificados A1
- [x] CRUD de empresas e filiais com suporte a regime tributário e ambiente fiscal.
- [x] CRUD de destinatários (clientes) com validação de CPF/CNPJ e inscrição estadual.
- [x] Catálogo de produtos e serviços desacoplado de regras de tributação fixas.
- [x] Módulo completo de Certificados Digitais A1 (`CertificatesService` / `CertificatesController`):
  - Leitura e validação de arquivos binários PKCS#12 (.pfx / .p12).
  - Validação estrita de senha via engine nativa de criptografia e TLS.
  - Extração de Subject, CNPJ, Emissor, data de emissão e cálculo de dias restantes para expiração.
  - Armazenamento em cofre seguro com criptografia AES-256-GCM.

### FASE 3 — Domínio Fiscal e Contratos
- [x] Entidades e DTOs de domínio fiscal agnósticas a provedores.
- [x] Port `FiscalProviderAdapter` e contrato `ProviderCapabilities`.
- [x] `FiscalDomainValidator` implementado e testado (regras SEFAZ, 44 dígitos da chave de acesso).
- [x] Implementação do `MockFiscalProvider` com testes de contrato determinísticos.
- [x] Registry e Factory de provedores fiscais (`FiscalProviderRegistry`).

### FASE 4 — Provedores Fiscais Nativos
- [x] **Focus NFe** (`FocusNfeAdapter`): Endpoints oficiais da v2 mapeados conforme https://doc.focusnfe.com.br/.
- [x] **PlugNotas** (`PlugNotasAdapter`): Segundo adapter (TecnoSpeed API) comprovando a arquitetura hexagonal plug-and-play.
- [x] Testes de conectividade com medição de latência em tempo real.

### FASE 5 — Gestão Fiscal, Emissão & Fechamento
- [x] Fluxo guiado de emissão em 5 etapas (Emitente, Destinatário, Itens, Transporte & Totais, Revisão & Envio).
- [x] Listagem com filtros reativos via Angular Signals, status badges e cópia de chave de acesso.
- [x] Modal de cancelamento com validação de justificativa legal (mínimo 15 caracteres).
- [x] Download direto de XML assinado e DANFE PDF.
- [x] **Fechamento Fiscal Mensal em ZIP** (`ReportsService` / `SimpleZip`):
  - Empacotador in-memory nativo com compressão DEFLATE.
  - Geração de CSV consolidado com bases de cálculo (ICMS, PIS, COFINS) e totalizadores.
  - Compactação de todos os arquivos XMLs autorizados do período para download do contador.

### FASE 6 — Importação de XMLs & Auto-Cadastro
- [x] **Parser SEFAZ NF-e** (`NfeXmlParser`):
  - Extração completa de dados de modelo 55/65 (`<nfeProc>`, `<infNFe>`, `<ide>`, `<emit>`, `<dest>`, `<det>`, `<total>`, `<protNFe>`).
  - Suporte a itens múltiplos, tributos e conversão automática para `FiscalDocumentDto`.
- [x] **Importador Automático** (`ImportsService` / `ImportsController`):
  - Entrada de notas de fornecedores.
  - Auto-cadastro inteligente de novos produtos no catálogo com NCM e CFOP.
  - Auto-cadastro do fornecedor na base de clientes/entidades.
  - Tela reativa de importação em `/importacao` com drag-and-drop, preview estruturado e confirmação.

### FASE 7 — Mensageria, Webhooks & Worker Dedicado
- [x] **`FiscalQueueService`**: Controle de concorrência com idempotência e backoff exponencial.
- [x] **`WebhooksService` & `WebhooksController`**:
  - Endpoint Inbound para callbacks assíncronos da Focus NFe e PlugNotas com atualização automática de status.
  - Dispatcher Outbound com assinatura de integridade HMAC-SHA256 (`X-OpenNFE-Signature`) para notificação de ERPs/CRMs clientes.
- [x] **Aplicação Dedicada `apps/worker`**: Processador de mensageria assíncrona desacoplado com suporte a BullMQ / Redis e graceful shutdown.
- [x] **Persistência Relacional**: Schema PostgreSQL com Prisma 6 e `DatabaseModule` com `PrismaService` resiliente a quedas.

---

## 3. Decisões Arquiteturais Registradas (ADRs)

### ADR-01: Componentes Standalone por Padrão no Angular 22
- **Decisão**: Todos os componentes Angular utilizam o padrão moderno do Angular v20+ sem a propriedade `standalone: true`.
- **Motivo**: Compatibilidade com a versão mais recente do framework.

### ADR-02: Ports and Adapters (Hexagonal Architecture)
- **Decisão**: O pacote `@opennfe/fiscal` não possui nenhuma referência a bibliotecas externas. Apenas define ports e validadores puros.
- **Motivo**: Provedores externos (Focus NFe, PlugNotas, SEFAZ direto) são adapters substituíveis sem alteração do domínio.

### ADR-03: Componente de Ícones Nativo SVG
- **Decisão**: Criação do `AppIconComponent` com SVGs Lucide incorporados diretamente no projeto frontend.
- **Motivo**: Elimina dependências externas instáveis e otimiza a pré-renderização estática.

### ADR-04: Idempotência Estrita no Motor de Fila
- **Decisão**: O `FiscalQueueService` e o `apps/worker` usam chave de idempotência para evitar emissões duplicadas na SEFAZ (Rejeição 204).
- **Motivo**: Garantia de consistência transacional em quedas de conexão ou retentativas.

### ADR-05: Empacotador ZIP Nativo In-Memory
- **Decisão**: Criação da classe `SimpleZip` utilizando o módulo nativo `zlib` do Node.js sem bibliotecas de terceiros vulneráveis.
- **Motivo**: Alta performance, zero vulnerabilidades e geração instantânea de pacotes contábeis mensais.
