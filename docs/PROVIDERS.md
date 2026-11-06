# OpenNFE — Especificação e Integração de Provedores Fiscais

## 1. Princípio Arquitetural
Nenhum módulo de regras de negócio, componente frontend ou tabela de domínio deve possuir acoplamento com fornecedores externos. Todo provedor externo é um **Adapter** que satisfaz o contrato do núcleo do OpenNFE.

---

## 2. Contrato Central (`FiscalProviderAdapter`)

```typescript
export interface FiscalProviderAdapter {
  readonly providerKey: string;
  readonly name: string;

  getCapabilities(): Promise<ProviderCapabilities>;

  testConnection(credentials: Record<string, string>, env: FiscalEnvironment): Promise<ConnectionTestResult>;

  submitDocument(request: FiscalSubmissionRequest): Promise<FiscalSubmissionResult>;

  getDocumentStatus(request: FiscalStatusRequest): Promise<FiscalStatusResult>;

  cancelDocument(request: FiscalCancellationRequest): Promise<FiscalCancellationResult>;

  sendCorrectionLetter?(request: FiscalCorrectionRequest): Promise<FiscalCorrectionResult>;

  inutilizeNumber?(request: FiscalInutilizationRequest): Promise<FiscalInutilizationResult>;

  getXml(request: FiscalFileRequest): Promise<FiscalFileResult>;

  getPdf(request: FiscalFileRequest): Promise<FiscalFileResult>;

  getEvents(request: FiscalEventsRequest): Promise<FiscalEventsResult>;

  handleWebhook(rawPayload: unknown, headers: Record<string, string>): Promise<NormalizedWebhookEvent>;
}
```

### 2.1 Capacidades do Provedor (`ProviderCapabilities`)
Cada adapter declara explicitamente o que suporta:
- `supportedDocumentTypes`: `['NFE', 'NFCE', 'NFSE']`
- `supportedEnvironments`: `['HOMOLOGATION', 'PRODUCTION']`
- `canEmit`: boolean
- `canCancel`: boolean
- `canCorrect`: boolean (CC-e)
- `canInutilize`: boolean
- `canFetchXml`: boolean
- `canFetchPdf`: boolean
- `supportsWebhooks`: boolean
- `supportsExternalReference`: boolean

---

## 3. Focus NFe Adapter

### 3.1 Fonte Oficial
Documentação oficial: https://doc.focusnfe.com.br/
Referência para LLMs: https://doc.focusnfe.com.br/llms.txt

### 3.2 Ambientes e Autenticação
- **Homologação**: `https://homologacao.focusnfe.com.br`
- **Produção**: `https://api.focusnfe.com.br`
- **Autenticação**: HTTP Basic Authentication, onde o **Username** é o Token de Acesso da empresa e a **Senha** é vazia (`base64(token + ':')`).

### 3.3 Emissão de NF-e
- **Endpoint**: `POST /v2/nfe?ref={referencia_interna}`
- A referência interna deve ser o `id` interno do OpenNFE para garantir idempotência.
- **Consulta de Status**: `GET /v2/nfe/{referencia_interna}?completa=1`
- **Cancelamento**: `DELETE /v2/nfe/{referencia_interna}` com payload `{ "justificativa": "..." }`
- **Carta de Correção**: `POST /v2/nfe/{referencia_interna}/carta_correcao` com `{ "correcao": "..." }`
- **Download XML**: `GET /v2/nfe/{referencia_interna}.xml`
- **Download DANFE (PDF)**: `GET /v2/nfe/{referencia_interna}.pdf`

### 3.4 Normalização de Status e Erros da Focus NFe
| Status Focus NFe | Status Interno OpenNFE | Descrição / Ação |
|---|---|---|
| `processando_autorizacao` | `PROCESSING` | Em processamento na SEFAZ. Aguardar polling ou webhook. |
| `autorizado` | `AUTHORIZED` | Nota autorizada com sucesso. Salvar chave, protocolo e datas. |
| `erro_autorizacao` | `REJECTED` | Rejeição pela SEFAZ. Extrair cStat e xMotivo normalizados. |
| `cancelado` | `CANCELLED` | Nota cancelada com sucesso. |
| `denegado` | `DENIED` | Nota denegada pela SEFAZ. |

---

## 4. Mock Fiscal Provider (Testes e Desenvolvimento)
Para garantir desenvolvimento seguro, isolado e execução de suítes de testes sem custos ou dependência de rede:
- Identificador: `MOCK_PROVIDER`.
- Simula respostas síncronas e assíncronas determinísticas baseadas em flags no rascunho:
  - Total = R$ 100,00 -> Autorização imediata com chave de teste fictícia válida estruturalmente.
  - Total = R$ 999,99 -> Simula Rejeição SEFAZ com cStat 204 (Duplicidade de NF-e).
  - Total = R$ 504,00 -> Simula Timeout e erro de comunicação.
  - Geração de XML e PDF sintéticos para validação de fluxo de download e armazenamento.

