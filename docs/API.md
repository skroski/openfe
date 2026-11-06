# OpenNFE — Especificação da API REST v1

## 1. Visão Geral e Autenticação

A API do OpenNFE é versionada sob o prefixo `/api/v1`.

### 1.1 Headers Padrão
- `Authorization: Bearer <JWT_OU_API_KEY>`
- `Content-Type: application/json`
- `X-Idempotency-Key: <UUID>` (obrigatório em operações de mutação fiscal)

---

## 2. Endpoints

### 2.1 Autenticação e Organização (`/api/v1/auth`)
- `POST /api/v1/auth/login`: Autentica usuário com e-mail e senha. Retorna JWT com claims de `tenant_id`, `user_id`, `role` e lista de empresas acessíveis.
- `POST /api/v1/auth/refresh`: Renova o token de acesso.
- `GET /api/v1/auth/me`: Retorna o perfil do usuário logado e dados do tenant atual.

### 2.2 Gestão de Empresas (`/api/v1/companies`)
- `GET /api/v1/companies`: Lista empresas do tenant atual.
- `POST /api/v1/companies`: Cadastra nova empresa/filial.
- `GET /api/v1/companies/:id`: Detalha empresa.
- `PUT /api/v1/companies/:id`: Atualiza dados cadastrais.
- `POST /api/v1/companies/:id/certificate`: Upload do certificado A1 (.pfx) com senha criptografada.
- `GET /api/v1/companies/:id/provider-config`: Obtém configuração do provedor fiscal da empresa.
- `PUT /api/v1/companies/:id/provider-config`: Altera ou parametriza o provedor fiscal (Focus NFe, Mock, etc.).

### 2.3 Destinatários e Clientes (`/api/v1/customers`)
- `GET /api/v1/customers`: Lista clientes com suporte a filtros por CPF/CNPJ, nome e paginação.
- `POST /api/v1/customers`: Cadastra novo cliente.
- `GET /api/v1/customers/:id`: Detalha cliente.
- `PUT /api/v1/customers/:id`: Atualiza cliente.

### 2.4 Produtos e Serviços (`/api/v1/products`)
- `GET /api/v1/products`: Lista produtos do tenant.
- `POST /api/v1/products`: Cadastra novo produto com parâmetros tributários padrão.
- `GET /api/v1/products/:id`: Detalha produto.
- `PUT /api/v1/products/:id`: Atualiza produto.

### 2.5 Documentos Fiscais (`/api/v1/documents`)
- `GET /api/v1/documents`: Lista documentos fiscais com filtros por empresa, período, status, tipo de documento e busca de destinatário.
- `POST /api/v1/documents`: Cria novo documento em rascunho (`DRAFT`).
- `GET /api/v1/documents/:id`: Detalhes completos do documento, itens, impostos e histórico de eventos.
- `PUT /api/v1/documents/:id`: Atualiza rascunho de documento.
- `POST /api/v1/documents/:id/validate`: Executa validação de regras de domínio sem transmitir.
- `POST /api/v1/documents/:id/submit`: Transmite o documento para autorização (assíncrono, aceita `X-Idempotency-Key`).
- `POST /api/v1/documents/:id/cancel`: Solicita cancelamento do documento autorizado junto à SEFAZ (requer justificativa).
- `POST /api/v1/documents/:id/correction`: Envia Carta de Correção Eletrônica (CC-e).
- `GET /api/v1/documents/:id/xml`: Retorna o XML assinado/autorizado.
- `GET /api/v1/documents/:id/pdf`: Retorna o arquivo binário do DANFE em PDF.
- `GET /api/v1/documents/:id/events`: Retorna a lista de eventos fiscais vinculados ao documento.

### 2.6 Provedores Fiscais (`/api/v1/providers`)
- `GET /api/v1/providers`: Lista provedores disponíveis no sistema e suas capacidades (`capabilities`).
- `POST /api/v1/providers/test-connection`: Testa conectividade e credenciais com o provedor (ex: Focus NFe em homologação).

### 2.7 Webhooks (`/api/v1/webhooks`)
- `POST /api/v1/webhooks/incoming/:providerKey`: Endpoint de entrada para notificações enviadas pelos provedores fiscais (ex: Focus NFe).
- `GET /api/v1/webhooks/outgoing`: Lista webhooks de saída cadastrados pelo usuário.
- `POST /api/v1/webhooks/outgoing`: Cadastra novo webhook de saída com URL de destino e secret de assinatura HMAC.

