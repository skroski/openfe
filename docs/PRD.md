# OpenNFE — Product Requirements Document (PRD)

## 1. Visão Geral do Produto
O **OpenNFE** é uma plataforma SaaS independente, moderna e extensível para emissão, gestão, guarda e auditoria de documentos fiscais eletrônicos brasileiros (NF-e modelo 55, NFC-e modelo 65 e NFS-e).

O principal diferencial arquitetural do OpenNFE é o desacoplamento absoluto em relação aos provedores de mensageria e transmissão fiscal (SEFAZ autorizadoras, prefeituras municipais e agregadores como Focus NFe, PlugNotas, etc.). A lógica de negócios, cálculo e validação fiscal, bem como os contratos públicos da API e a interface de usuário pertencem estritamente ao OpenNFE.

---

## 2. Personas e Casos de Uso

### 2.1 Personas
1. **Contador / Escritório Contábil**: Gerencia múltiplos clientes (empresas), audita notas fiscais autorizadas, canceladas e cartas de correção, exporta XMLs e SPED em lote.
2. **Operador Fiscal / Faturamento**: Emite notas fiscais de venda, devolução e remessa rapidamente, acompanha o status de autorização em tempo real e reage a eventuais rejeições da SEFAZ com orientações claras.
3. **Desenvolvedor / Integrador (API)**: Conecta sistemas ERP, e-commerces e plataformas de PDV ao OpenNFE via API REST e Webhooks para emissão assíncrona com idempotência.
4. **Administrador da Organização (Tenant Admin)**: Configura certificados digitais A1, cadastra filiais/empresas, gerencia usuários e permissões RBAC e define o provedor de mensageria ativo.

---

## 3. Requisitos Funcionais

### RF-01: Multi-tenancy e Isolamento
- Cada organização contratante é um **Tenant** independente.
- Um Tenant pode possuir múltiplas **Empresas** (matriz e filiais com CNPJs distintos).
- Todos os dados (clientes, produtos, notas fiscais, certificados) possuem chave de partição obrigatória de Tenant e validação estrita a nível de backend e banco de dados.

### RF-02: Gestão de Empresas e Certificados Digitais
- Cadastro de Razão Social, Nome Fantasia, CNPJ, IE, IM, CNAE, Regime Tributário (Simples Nacional, Lucro Presumido, Lucro Real) e Endereço fiscal.
- Suporte a Certificados Digitais A1 (.pfx / .p12):
  - Armazenamento criptografado (AES-256-GCM) em repouso.
  - Extração de metadados: validade, data de expiração, CNPJ emissor e autoridade certificadora.
  - Alertas preventivos de vencimento em 30, 15 e 7 dias.
  - Proibição de exposição do arquivo bruto ou senha para o frontend.

### RF-03: Cadastros Base de Emissão
- **Destinatários (Clientes / Fornecedores)**: PF (CPF) ou PJ (CNPJ), Inscrição Estadual, Indicador de IE (Contribuinte, Isento, Não Contribuinte), endereço com código IBGE de município e contatos.
- **Produtos e Serviços**: Descrição, código interno, NCM, CEST, CFOP padrão por operação, unidade de medida comercial e tributável, valor unitário.
- **Regras Fiscais**: Desacopladas do cadastro fixo do produto, permitindo parametrização por tipo de operação (venda estadual, interestadual, devolução, bonificação).

### RF-04: Emissão e Ciclo de Vida de NF-e (Modelo 55)
- **Status do Documento**: Rascunho, Validado, Enfileirado, Processando, Autorizado, Rejeitado, Cancelado, Denegado.
- **Ações Fiscais**:
  - Emissão com validação de regras de negócios antes do envio.
  - Cancelamento dentro do prazo legal com justificativa (mínimo 15 caracteres).
  - Carta de Correção Eletrônica (CC-e) quando suportada pelo provedor.
  - Inutilização de numeração para quebras de sequência.
  - Consulta de status de processamento e recuperação de chave de acesso (44 dígitos) e protocolo de autorização.
  - Download e visualização do XML assinado/autorizado e do DANFE em PDF.

### RF-05: Processamento Assíncrono e Resiliência
- Emissões fiscais despachadas via fila com worker dedicado (BullMQ + Redis).
- Proteção por chave de idempotência para evitar duplicidade de notas na SEFAZ em caso de instabilidade de rede ou retentativas.
- Fallback e tolerância a timeouts sem reemissão cega.

### RF-06: Webhooks e Notificações
- Recepção de webhooks de provedores para atualização em tempo real do status das emissões.
- Envio de webhooks de saída assinados com HMAC-SHA256 para aplicações integradas.

---

## 4. Requisitos Não Funcionais

- **RNF-01 Performance**: Emissão e validação no backend em menos de 150ms antes do enfileiramento; interface com renderização ágil via Angular Signals.
- **RNF-02 Segurança**: Criptografia de dados sensíveis (certificados e senhas de API), isolamento estrito entre tenants, RBAC baseado em JWT, sem dados confidenciais em logs.
- **RNF-03 Confiabilidade & Idempotência**: Nenhuma nota fiscal pode ser transmitida mais de uma vez para a mesma operação de emissão.
- **RNF-04 Aderência Visual**: Design System próprio com DaisyUI 5 e Tailwind CSS, conforme especificações e tokens visuais do OpenNFE.
- **RNF-05 Extensibilidade**: Novos provedores fiscais adicionados apenas implementando a interface `FiscalProviderAdapter`, sem alterar regras de domínio ou UI.

