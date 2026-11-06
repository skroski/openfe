import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIconComponent } from '../../shared/components/icon.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

interface Step {
  icon: string;
  title: string;
  text: string;
  link: string;
  cta: string;
}

/**
 * Guia vivo do sistema: mostra, com os componentes reais, como tudo se organiza.
 * Serve para treinar pessoas novas e como referência de espaçamento e alinhamento.
 */
@Component({
  selector: 'app-guide',
  imports: [RouterLink, AppIconComponent, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <div class="flex flex-col gap-10">
      <app-page-header
        title="Guia do sistema"
        description="Como o OpenNFE está organizado e como cada peça da tela funciona. Pode ser consultado a qualquer momento."
        [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Guia do sistema' }]"
      />

      <section class="flex flex-col gap-4" aria-labelledby="g-passos">
        <h2 id="g-passos" class="text-xl font-bold">1. Do zero até a primeira nota</h2>
        <ol class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          @for (s of steps; track s.title; let i = $index) {
            <li class="card bg-base-100 border border-base-300 p-5 gap-2">
              <div class="flex items-center gap-3">
                <span class="w-9 h-9 rounded-full bg-primary text-primary-content font-bold flex items-center justify-center">{{ i + 1 }}</span>
                <app-icon [name]="s.icon" [size]="22" customClass="text-base-content/70"></app-icon>
              </div>
              <h3 class="font-bold">{{ s.title }}</h3>
              <p class="text-sm text-base-content/70 grow">{{ s.text }}</p>
              <a [routerLink]="s.link" class="btn btn-sm btn-outline self-start">{{ s.cta }}</a>
            </li>
          }
        </ol>
      </section>

      <section class="flex flex-col gap-4" aria-labelledby="g-tela">
        <h2 id="g-tela" class="text-xl font-bold">2. Como toda tela é organizada</h2>
        <p class="text-base-content/70 max-w-3xl">Todas as telas seguem a mesma ordem, de cima para baixo. Assim você sempre sabe onde olhar.</p>
        <div class="card bg-base-100 border border-base-300 p-4 sm:p-6 grid gap-3 text-sm">
          <div class="rounded-lg border-2 border-dashed border-secondary/50 bg-secondary/5 p-4"><strong>① Cabeçalho da página</strong> — trilha de navegação (“Início › Clientes”), título, explicação curta e, à direita, o botão principal.</div>
          <div class="rounded-lg border-2 border-dashed border-secondary/50 bg-secondary/5 p-4"><strong>② Ferramentas da lista</strong> — Buscar, filtros e “Exportar planilha”. “Limpar filtros” aparece quando há filtro ligado.</div>
          <div class="rounded-lg border-2 border-dashed border-secondary/50 bg-secondary/5 p-4"><strong>③ Tabela</strong> — clique no título de uma coluna para ordenar (1º clique: A→Z, 2º: Z→A, 3º: volta ao normal). Os botões de cada linha ficam na última coluna, à direita.</div>
          <div class="rounded-lg border-2 border-dashed border-secondary/50 bg-secondary/5 p-4"><strong>④ Rodapé da lista</strong> — quantos registros aparecem, quantas linhas por página e os botões de página.</div>
        </div>
      </section>

      <section class="flex flex-col gap-4" aria-labelledby="g-status">
        <h2 id="g-status" class="text-xl font-bold">3. Situações de uma nota</h2>
        <p class="text-base-content/70 max-w-3xl">Cada etiqueta tem cor, ícone e texto. Passe o mouse para ver a explicação.</p>
        <div class="card bg-base-100 border border-base-300 p-5 flex flex-row flex-wrap gap-3">
          @for (s of statuses; track s) { <app-status-badge [status]="s" /> }
        </div>
      </section>

      <section class="flex flex-col gap-4" aria-labelledby="g-btn">
        <h2 id="g-btn" class="text-xl font-bold">4. Botões</h2>
        <div class="card bg-base-100 border border-base-300 p-5 grid gap-5 md:grid-cols-2">
          <div class="flex flex-col gap-3">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" class="btn btn-primary">Principal</button>
              <button type="button" class="btn btn-outline">Secundário</button>
              <button type="button" class="btn btn-ghost">Discreto</button>
              <button type="button" class="btn btn-outline btn-error">Perigoso</button>
            </div>
            <p class="text-sm text-base-content/70">Cada tela tem <strong>um</strong> botão principal (laranja). Ações que cancelam ou apagam usam vermelho e sempre pedem confirmação.</p>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex flex-wrap items-center gap-3">
              <button type="button" class="btn btn-primary"><span class="loading loading-spinner loading-xs"></span> Salvando…</button>
              <button type="button" class="btn btn-primary" disabled>Desabilitado</button>
            </div>
            <p class="text-sm text-base-content/70">Enquanto algo está sendo feito, o botão mostra o círculo girando e fica travado para evitar clique duplo.</p>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-4" aria-labelledby="g-esp">
        <h2 id="g-esp" class="text-xl font-bold">5. Espaçamentos e alinhamento</h2>
        <div class="card bg-base-100 border border-base-300 p-5 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 class="font-bold mb-3">Escala de espaço (múltiplos de 4 px)</h3>
            <ul class="flex flex-col gap-2 text-sm">
              @for (sp of spacing; track sp.px) {
                <li class="flex items-center gap-3">
                  <span class="w-14 font-mono text-base-content/70">{{ sp.px }} px</span>
                  <span class="h-4 rounded-sm bg-secondary" [style.width.px]="sp.px"></span>
                  <span class="text-base-content/70">{{ sp.use }}</span>
                </li>
              }
            </ul>
          </div>
          <div>
            <h3 class="font-bold mb-3">Regras de alinhamento</h3>
            <ul class="flex flex-col gap-2 text-sm list-disc pl-5">
              <li><strong>Texto</strong> alinhado à esquerda.</li>
              <li><strong>Valores em dinheiro e quantidades</strong> alinhados à direita, com números do mesmo tamanho, para somar de cabeça.</li>
              <li><strong>Botões de ação</strong> da linha: sempre na última coluna, à direita.</li>
              <li><strong>Botão principal da página</strong>: canto superior direito do cabeçalho.</li>
              <li><strong>Formulários</strong>: rótulo acima do campo; erro e dica abaixo do campo.</li>
              <li><strong>Botões do formulário</strong>: “Cancelar” à esquerda de “Salvar”, no rodapé, à direita.</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-4" aria-labelledby="g-form">
        <h2 id="g-form" class="text-xl font-bold">6. Campos de formulário</h2>
        <div class="card bg-base-100 border border-base-300 p-5 grid gap-6 md:grid-cols-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold" for="g-ok">Nome completo <span class="text-error" aria-hidden="true">*</span></label>
            <input id="g-ok" class="input w-full" value="Maria da Silva" readonly />
            <p class="text-xs text-base-content/70">A dica fica aqui embaixo, em cinza.</p>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold" for="g-bad">CNPJ <span class="text-error" aria-hidden="true">*</span></label>
            <input id="g-bad" class="input input-error w-full" value="11.222.333/0001-99" readonly aria-invalid="true" />
            <p class="text-sm text-error" role="alert">CNPJ inválido. Confira os números digitados.</p>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold" for="g-sel">Estado (UF)</label>
            <select id="g-sel" class="select w-full"><option>SP</option></select>
            <p class="text-xs text-base-content/70">Erros só aparecem depois que você sai do campo.</p>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-4" aria-labelledby="g-amb">
        <h2 id="g-amb" class="text-xl font-bold">7. Ambiente de testes × produção</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="card bg-base-100 border border-warning p-5 gap-2">
            <span class="badge badge-warning gap-1 font-semibold self-start"><app-icon name="shield-check" [size]="12"></app-icon> HOMOLOGAÇÃO · só testes</span>
            <p class="text-sm">Notas não têm valor fiscal. Use para treinar e validar o certificado e o provedor. Pode errar à vontade.</p>
          </div>
          <div class="card bg-base-100 border border-error p-5 gap-2">
            <span class="badge badge-error gap-1 font-semibold self-start"><app-icon name="alert" [size]="12"></app-icon> PRODUÇÃO · valor fiscal real</span>
            <p class="text-sm">Cada nota autorizada é um documento oficial. O cancelamento tem prazo regular de 24 horas e exige motivo claro.</p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class GuideComponent {
  readonly statuses = ['DRAFT', 'QUEUED', 'PROCESSING', 'AUTHORIZED', 'REJECTED', 'DENIED', 'CANCELLED'];

  readonly steps: Step[] = [
    { icon: 'building-2', title: 'Cadastre sua empresa', text: 'Informe CNPJ, endereço e regime tributário. Comece em “Testes”.', link: '/empresas', cta: 'Ir para Empresas' },
    { icon: 'key', title: 'Envie o certificado A1', text: 'O certificado digital (.pfx) assina as notas. Configure também o provedor fiscal.', link: '/integracoes', cta: 'Ir para Integrações' },
    { icon: 'users', title: 'Cadastre clientes e produtos', text: 'Assim a nota é preenchida sozinha, com menos erro de digitação.', link: '/clientes', cta: 'Ir para Clientes' },
    { icon: 'file-plus-2', title: 'Veja como a nota fica', text: 'Exemplos de NF-e, NFC-e e NFS-e antes de emitir a primeira.', link: '/documentos/exemplo', cta: 'Ver exemplos de nota' },
  ];

  readonly spacing = [
    { px: 4, use: 'Entre ícone e texto' },
    { px: 8, use: 'Entre botões lado a lado' },
    { px: 16, use: 'Entre campos de um formulário' },
    { px: 24, use: 'Entre blocos da página (cabeçalho, lista, cartões)' },
    { px: 40, use: 'Entre seções grandes (como esta página)' },
  ];
}
