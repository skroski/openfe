# Guia de UI — OpenNFE (web)

Stack: Angular 22 (standalone, signals, Signal Forms) + Tailwind 4 + daisyUI 5, tema `opennfe`.
A versão em linguagem simples para usuários está em **/guia** dentro do sistema.

## Componentes compartilhados (`apps/web/src/app/shared`)

| Componente | Para quê |
|---|---|
| `app-page-header` | Cabeçalho de toda página: trilha, título, descrição e botão principal à direita |
| `app-data-grid` | **Toda lista do sistema.** Busca, filtros, ordenação, paginação e exportar CSV |
| `app-status-badge` | Situação de nota (texto + ícone + cor; nunca só cor) |
| `app-modal` | Diálogo padrão (Esc, X e clique fora fecham) |
| `app-form-field` | Rótulo acima, dica/erro abaixo, `*` de obrigatório |
| `app-danfe-preview` | Prévia de NF-e (DANFE), NFC-e (cupom) e NFS-e |
| `ToastService` | Avisos curtos (sucesso 4 s, erro 8 s) |

### `app-data-grid`

```html
<app-data-grid
  label="Clientes" [rows]="rows()" [columns]="columns" [filters]="filters"
  [searchText]="searchText" [initialSort]="{ key: 'name', direction: 'asc' }"
  exportName="clientes" emptyTitle="…" emptyHint="…">
  <ng-template appGridCell="status" let-row>…célula customizada…</ng-template>
  <ng-template appGridActions let-row>…botões da linha…</ng-template>
</app-data-grid>
```

- **Ordenação**: clique no cabeçalho (A→Z, Z→A, sem ordem). `aria-sort` em cada coluna. Textos usam collator `pt-BR` com números naturais; vazios vão para o fim.
- **Filtros**: busca sem acento/caixa + selects (`GridFilter`). “Limpar filtros” aparece quando há filtro ativo. Mudar filtro volta à página 1.
- **Paginação**: 10/25/50/100 linhas, primeira/anterior/números/próxima/última, “Mostrando 1–10 de 42 (filtrado de 120)”.
- **Exportar planilha**: CSV (`;`, UTF-8 com BOM) do que está filtrado.
- Estados: carregando (skeleton), vazio e “nenhum resultado”.

## Espaçamento e alinhamento

Escala de 4 px: `4` ícone↔texto · `8` entre botões · `16` entre campos · `24` entre blocos da página · `40` entre seções grandes.
Texto à esquerda; valores e quantidades à direita com `tabular-nums`; botões da linha na última coluna; botão principal no canto superior direito; formulário com rótulo acima e Cancelar à esquerda de Salvar.

## Acessibilidade (decisões)

- Texto de botão primário é escuro (`#1f1f1f` sobre laranja) — branco não atinge 4,5:1.
- Bordas de campos com contraste ≥ 3:1; foco visível de 3 px; alvos ≥ 44 px; `prefers-reduced-motion` respeitado.
- O tema custom precisa das variáveis `--border`, `--depth`, `--noise`, `--size-*` (daisyUI 5), senão campos ficam sem borda.

## Modo demonstração

Se nenhuma chamada à API responde, `FiscalApiService.demoMode` liga e o sistema usa `core/data/demo-data.ts` (empresas, clientes, produtos e 42 notas com CNPJ/CPF/chave com dígitos válidos). Criar, editar, enviar e cancelar funcionam só em memória. Há faixa laranja fixa avisando.

## Regras de negócio aplicadas na tela

- CPF/CNPJ validados (dígitos verificadores) e sem duplicidade; IE obrigatória só para CNPJ contribuinte (indicador 1); pessoa física é sempre indicador 9.
- Endereço completo + código IBGE de 7 dígitos (exigido na nota). Sem endereço padrão “São Paulo”.
- NCM com 8 dígitos; CFOP de venda `[567]xxx`; preço > 0; código de produto único.
- Empresa nova nasce em **Homologação**; produção exibe alerta em vermelho. Empresa inativa não emite.
- Emissão: NF-e exige cliente cadastrado; NFC-e aceita consumidor não identificado; NFS-e exige Inscrição Municipal; NF-e/NFC-e exigem IE da empresa.
- CFOP muda sozinho 5xxx ↔ 6xxx conforme UF da empresa × UF do cliente; desconto ≤ total dos produtos; total > 0; frete só em NF-e.
- Cancelamento: somente notas autorizadas, motivo ≥ 15 caracteres, aviso se passou de 24 h da autorização.

## Pendências de API (a tela já está pronta)

| Tela | O que falta na API |
|---|---|
| Clientes / Produtos / Empresas — Editar | `PUT /customers/:id`, `/products/:id`, `/companies/:id` (a tela já envia; sem o endpoint aparece aviso amigável) |
| Integrações — salvar token | ligar a tela a `PUT /companies/:id/provider-config` |
| Configurações | CRUD de chaves de API e de webhooks de saída |
| Relatórios | endpoint de inutilizações e de apuração separada |
| Cabeçalho | usuário/organização (`GET /auth/me`) — hoje não há login no front |
| Clientes (API) | `POST /customers` preenche endereço “São Paulo / Rua Principal / 3550308” quando falta algo — remover esses padrões e validar no servidor (a tela já exige tudo) |
| Notas rejeitadas | “Reenviar” manda os mesmos dados; falta `PUT /documents/:id` (corrigir rascunho/rejeitada) ou “duplicar como rascunho” |
| Cancelamento | prazo de 24 h está só como aviso na tela; NFC-e/NFS-e variam por estado/município — confirmar regra com o contador e validar no servidor |
| Listas | paginação/ordenação **no servidor** quando o volume crescer (hoje é no cliente; `GET /documents` devolve tudo) |
| Prévia/DANFE | `GET /documents/:id` precisa devolver `items`; ICMS/PIS/COFINS por item para o quadro de impostos |

> Ambiente local: `baseUrl` do front é `http://localhost:3000/api/v1`. Se o servidor de desenvolvimento do web também subir na porta 3000, as chamadas batem no próprio front e o sistema cai em modo demonstração — use portas diferentes (API 3000, web 4200).
