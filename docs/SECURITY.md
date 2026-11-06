# OpenNFE — Diretrizes de Segurança e Proteção de Dados (LGPD)

## 1. Proteção de Credenciais e Certificados Digitais

### 1.1 Certificados A1 (.pfx)
- O upload é processado em memória temporária.
- O certificado é criptografado utilizando o algoritmo padrão do setor **AES-256-GCM** antes de qualquer persistência no PostgreSQL.
- O Initialization Vector (IV) e Auth Tag são armazenados em colunas dedicadas.
- A chave de criptografia de aplicação (`APP_ENCRYPTION_KEY`) é fornecida via variável de ambiente, nunca commitada no repositório.
- A senha do certificado nunca é salva em texto puro e nunca é retornada para o cliente/frontend.

### 1.2 Tokens e Credenciais de Provedores Fiscais
- Tokens de acesso a provedores externos (Focus NFe, etc.) são armazenados criptografados com a mesma camada AES-256-GCM.
- O frontend apenas recebe máscaras ou status de configuração (`isConfigured: true`, `tokenPreview: "tok_...3f"`).

---

## 2. Isolamento de Tenants e Prevenção de Acesso Cruzado

1. **Validação no Backend**: Toda consulta SQL/Prisma deve incluir `WHERE tenant_id = :authenticatedTenantId`.
2. **Contexto Confiável**: O `tenant_id` é extraído exclusivamente do token JWT assinado ou da chave de API autenticada. Parâmetros de rota ou corpo como `tenant_id` não são aceitos para definir a identidade de acesso.
3. **Controle de Acesso Baseado em Papéis (RBAC)**:
   - `SUPER_ADMIN`: Gestão global do sistema e saúde da plataforma.
   - `TENANT_ADMIN`: Gestão completa da organização, certificados, usuários e chaves de API.
   - `MANAGER`: Gerenciamento de empresas, clientes e emissões.
   - `OPERATOR`: Criação e emissão de notas fiscais, visualização de cadastros.
   - `ACCOUNTANT`: Apenas consulta, auditoria e download de XML/PDF e relatórios fiscais.
   - `VIEWER`: Apenas visualização restrita sem ações de mutação.

---

## 3. Conformidade com LGPD
- Anonimização e expurgo seguro sob demanda.
- Minimização de dados pessoais em logs de auditoria e depuração (sanitização de CPFs, nomes e chaves de certificado nos loggers estruturados).

