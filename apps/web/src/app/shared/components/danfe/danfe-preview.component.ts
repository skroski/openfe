import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { CompanyDto, CustomerDto, FiscalDocumentDto } from '@opennfe/shared';
import { formatDocument, formatNcm } from '../../../core/utils/br';

/**
 * Prévia visual da nota (DANFE da NF-e, cupom da NFC-e e espelho da NFS-e).
 * É uma representação para conferência — o documento oficial é o XML autorizado.
 */
@Component({
  selector: 'app-danfe-preview',
  imports: [CurrencyPipe, DatePipe, DecimalPipe],
  styles: `
    :host { display: block; }
    .sheet { font-family: 'Arial Narrow', Arial, sans-serif; color: #111; background: #fff; }
    .box { border: 1px solid #222; padding: 4px 6px; }
    .lbl { font-size: 8px; text-transform: uppercase; letter-spacing: .03em; color: #444; display: block; }
    .val { font-size: 11px; font-weight: 600; word-break: break-word; }
    .sec { font-size: 9px; font-weight: 700; text-transform: uppercase; margin: 6px 0 2px; }
    table.items { width: 100%; border-collapse: collapse; font-size: 10px; }
    table.items th { font-size: 8px; text-transform: uppercase; border: 1px solid #222; padding: 3px 4px; background: #eee; text-align: left; }
    table.items td { border: 1px solid #222; padding: 3px 4px; vertical-align: top; }
    .r { text-align: right !important; }
    .watermark { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 1; overflow: hidden; }
    .watermark span { transform: rotate(-28deg); font-size: clamp(28px, 7vw, 64px); font-weight: 800; letter-spacing: .08em; color: rgba(192, 57, 43, .13); white-space: nowrap; }
  `,
  template: `
    <div class="sheet relative shadow-md border border-base-300 mx-auto" [class]="isNfce() ? 'max-w-[22rem] p-4' : 'max-w-[56rem] p-4 sm:p-6'">
      @if (noFiscalValue()) {
        <div class="watermark" aria-hidden="true"><span>SEM VALOR FISCAL</span></div>
      }

      @if (isNfce()) {
        <!-- ========== NFC-e: cupom do consumidor ========== -->
        <div class="text-center">
          <div class="val text-sm">{{ company()?.legalName }}</div>
          <div class="text-[10px]">CNPJ {{ company()?.cnpj }} · IE {{ company()?.stateRegistration || 'ISENTO' }}</div>
          <div class="text-[10px]">{{ company()?.street }}, {{ company()?.number }} - {{ company()?.neighborhood }} - {{ company()?.cityName }}/{{ company()?.state }}</div>
          <div class="sec border-y border-dashed border-black py-1 mt-2 text-center">DANFE NFC-e — Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica</div>
        </div>
        <table class="items mt-2" style="border: 0;">
          <thead><tr><th style="border:0;background:none">Item</th><th class="r" style="border:0;background:none">Qtd × Unit.</th><th class="r" style="border:0;background:none">Total</th></tr></thead>
          <tbody>
            @for (it of doc().items ?? []; track it.itemOrder) {
              <tr>
                <td style="border:0">{{ it.itemOrder }}. {{ it.description }}</td>
                <td class="r" style="border:0">{{ it.quantity }} {{ it.unit }} × {{ it.unitPrice | number: '1.2-2' : 'pt-BR' }}</td>
                <td class="r" style="border:0">{{ it.totalPrice | number: '1.2-2' : 'pt-BR' }}</td>
              </tr>
            }
          </tbody>
        </table>
        <div class="border-t border-dashed border-black mt-2 pt-2 text-[11px] space-y-0.5">
          <div class="flex justify-between"><span>Qtd. total de itens</span><span>{{ doc().items?.length ?? 0 }}</span></div>
          <div class="flex justify-between font-bold text-sm"><span>VALOR TOTAL R$</span><span>{{ doc().totalDocument | number: '1.2-2' : 'pt-BR' }}</span></div>
        </div>
        <div class="border-t border-dashed border-black mt-2 pt-2 text-center text-[10px]">
          <div class="font-bold">Consulte pela Chave de Acesso em www.nfce.fazenda.gov.br</div>
          <div class="font-mono break-all mt-1">{{ keyGroups() }}</div>
          <div class="mt-2">
            <strong>CONSUMIDOR:</strong>
            {{ doc().customerName ? doc().customerName + ' — ' + customerDoc() : 'NÃO IDENTIFICADO' }}
          </div>
          <div>NFC-e nº {{ doc().number ?? '—' }} · Série {{ doc().series }} · {{ issuedAt() | date: 'dd/MM/yyyy HH:mm:ss' }}</div>
          <div>Protocolo de autorização: {{ doc().protocolNumber || '—' }}</div>
          <svg class="mx-auto mt-3" width="120" height="120" viewBox="0 0 21 21" shape-rendering="crispEdges" role="img" aria-label="QR Code de consulta (ilustrativo)">
            <rect width="21" height="21" fill="#fff" />
            @for (c of qrCells(); track $index) { <rect [attr.x]="c.x" [attr.y]="c.y" width="1" height="1" fill="#000" /> }
          </svg>
        </div>
      } @else if (isNfse()) {
        <!-- ========== NFS-e: espelho de serviço ========== -->
        <div class="box flex flex-wrap items-center justify-between gap-2">
          <div>
            <div class="val text-base">NOTA FISCAL DE SERVIÇOS ELETRÔNICA — NFS-e</div>
            <div class="text-[10px]">Prefeitura de {{ company()?.cityName }}/{{ company()?.state }}</div>
          </div>
          <div class="text-right">
            <span class="lbl">Número da nota</span><span class="val">{{ doc().number ?? 'Sem número' }}</span>
            <span class="lbl mt-1">Emissão</span><span class="val">{{ issuedAt() | date: 'dd/MM/yyyy HH:mm' }}</span>
          </div>
        </div>
        <div class="sec">Prestador de serviços</div>
        <div class="box grid grid-cols-2 gap-x-4 gap-y-1">
          <div class="col-span-2"><span class="lbl">Razão social</span><span class="val">{{ company()?.legalName }}</span></div>
          <div><span class="lbl">CNPJ</span><span class="val">{{ company()?.cnpj }}</span></div>
          <div><span class="lbl">Inscrição municipal</span><span class="val">{{ company()?.municipalRegistration || '—' }}</span></div>
          <div class="col-span-2"><span class="lbl">Endereço</span><span class="val">{{ company()?.street }}, {{ company()?.number }} - {{ company()?.neighborhood }} - {{ company()?.cityName }}/{{ company()?.state }}</span></div>
        </div>
        <div class="sec">Tomador de serviços</div>
        <div class="box grid grid-cols-2 gap-x-4 gap-y-1">
          <div class="col-span-2"><span class="lbl">Nome / Razão social</span><span class="val">{{ doc().customerName || '—' }}</span></div>
          <div><span class="lbl">CPF/CNPJ</span><span class="val">{{ customerDoc() }}</span></div>
          <div><span class="lbl">E-mail</span><span class="val">{{ customer()?.email || '—' }}</span></div>
        </div>
        <div class="sec">Discriminação dos serviços</div>
        <table class="items">
          <thead><tr><th>Descrição</th><th class="r">Qtd</th><th class="r">Valor unit.</th><th class="r">Valor</th></tr></thead>
          <tbody>
            @for (it of doc().items ?? []; track it.itemOrder) {
              <tr><td>{{ it.description }}</td><td class="r">{{ it.quantity }} {{ it.unit }}</td><td class="r">{{ it.unitPrice | number: '1.2-2' : 'pt-BR' }}</td><td class="r">{{ it.totalPrice | number: '1.2-2' : 'pt-BR' }}</td></tr>
            }
          </tbody>
        </table>
        <div class="box mt-2 flex justify-between items-center">
          <span class="lbl">Valor total da nota</span>
          <span class="val text-base">{{ doc().totalDocument | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}</span>
        </div>
        <div class="text-[9px] mt-2 text-neutral-600">Código de verificação: {{ doc().protocolNumber || '—' }} · Documento ilustrativo para conferência.</div>
      } @else {
        <!-- ========== NF-e: DANFE ========== -->
        <div class="grid grid-cols-12 gap-0">
          <div class="box col-span-12 sm:col-span-5">
            <span class="lbl">Identificação do emitente</span>
            <div class="val text-sm">{{ company()?.legalName }}</div>
            <div class="text-[10px] leading-tight mt-1">
              {{ company()?.street }}, {{ company()?.number }}<br />
              {{ company()?.neighborhood }} — {{ company()?.cityName }}/{{ company()?.state }}<br />
              CEP {{ company()?.zipCode }} · {{ company()?.phone }}
            </div>
          </div>
          <div class="box col-span-12 sm:col-span-2 text-center">
            <div class="val text-base">DANFE</div>
            <div class="text-[8px] leading-tight">Documento Auxiliar da Nota Fiscal Eletrônica</div>
            <div class="text-[10px] mt-1">0 - ENTRADA<br />1 - SAÍDA &nbsp;<span class="box inline-block px-2 font-bold">{{ doc().operationType === 'INBOUND' ? 0 : 1 }}</span></div>
            <div class="val mt-1">Nº {{ doc().number ?? '—' }}</div>
            <div class="text-[10px]">Série {{ doc().series }}</div>
          </div>
          <div class="box col-span-12 sm:col-span-5">
            <svg class="w-full h-10" viewBox="0 0 200 40" preserveAspectRatio="none" role="img" aria-label="Código de barras da chave de acesso (ilustrativo)">
              @for (b of barcode(); track $index) { <rect [attr.x]="b.x" y="0" [attr.width]="b.w" height="40" fill="#000" /> }
            </svg>
            <span class="lbl mt-1">Chave de acesso</span>
            <span class="val font-mono text-[10px]">{{ keyGroups() }}</span>
            <div class="text-[8px] mt-1">Consulta de autenticidade no portal nacional da NF-e (www.nfe.fazenda.gov.br/portal)</div>
          </div>
        </div>
        <div class="grid grid-cols-12">
          <div class="box col-span-12 sm:col-span-7"><span class="lbl">Natureza da operação</span><span class="val">{{ doc().operationNature }}</span></div>
          <div class="box col-span-12 sm:col-span-5"><span class="lbl">Protocolo de autorização de uso</span><span class="val">{{ doc().protocolNumber ? doc().protocolNumber + ' — ' + (doc().authorizedAt | date: 'dd/MM/yyyy HH:mm:ss') : 'Aguardando autorização' }}</span></div>
          <div class="box col-span-6 sm:col-span-4"><span class="lbl">Inscrição estadual</span><span class="val">{{ company()?.stateRegistration || 'ISENTO' }}</span></div>
          <div class="box col-span-6 sm:col-span-4"><span class="lbl">CNPJ</span><span class="val">{{ company()?.cnpj }}</span></div>
          <div class="box col-span-12 sm:col-span-4"><span class="lbl">Ambiente</span><span class="val">{{ doc().environment === 'PRODUCTION' ? 'Produção' : 'Homologação (testes)' }}</span></div>
        </div>

        <div class="sec">Destinatário / Remetente</div>
        <div class="grid grid-cols-12">
          <div class="box col-span-12 sm:col-span-6"><span class="lbl">Nome / Razão social</span><span class="val">{{ doc().customerName || 'Consumidor não identificado' }}</span></div>
          <div class="box col-span-6 sm:col-span-3"><span class="lbl">CNPJ / CPF</span><span class="val">{{ customerDoc() }}</span></div>
          <div class="box col-span-6 sm:col-span-3"><span class="lbl">Data da emissão</span><span class="val">{{ issuedAt() | date: 'dd/MM/yyyy' }}</span></div>
          <div class="box col-span-12 sm:col-span-6"><span class="lbl">Endereço</span><span class="val">{{ customer() ? customer()!.street + ', ' + customer()!.number + ' - ' + customer()!.neighborhood : '—' }}</span></div>
          <div class="box col-span-6 sm:col-span-3"><span class="lbl">Município</span><span class="val">{{ customer()?.cityName || '—' }}</span></div>
          <div class="box col-span-3 sm:col-span-1"><span class="lbl">UF</span><span class="val">{{ customer()?.state || '—' }}</span></div>
          <div class="box col-span-3 sm:col-span-2"><span class="lbl">CEP</span><span class="val">{{ customer()?.zipCode || '—' }}</span></div>
        </div>

        <div class="sec">Cálculo do imposto</div>
        <div class="grid grid-cols-2 sm:grid-cols-6">
          <div class="box"><span class="lbl">Base de cálc. ICMS</span><span class="val">{{ icmsBase() | number: '1.2-2' : 'pt-BR' }}</span></div>
          <div class="box"><span class="lbl">Valor do ICMS</span><span class="val">{{ doc().totalIcms | number: '1.2-2' : 'pt-BR' }}</span></div>
          <div class="box"><span class="lbl">Valor do frete</span><span class="val">{{ doc().totalShipping | number: '1.2-2' : 'pt-BR' }}</span></div>
          <div class="box"><span class="lbl">Desconto</span><span class="val">{{ doc().totalDiscount | number: '1.2-2' : 'pt-BR' }}</span></div>
          <div class="box"><span class="lbl">Total dos produtos</span><span class="val">{{ doc().totalProducts | number: '1.2-2' : 'pt-BR' }}</span></div>
          <div class="box bg-neutral-100"><span class="lbl">Valor total da nota</span><span class="val text-sm">{{ doc().totalDocument | number: '1.2-2' : 'pt-BR' }}</span></div>
        </div>

        <div class="sec">Dados dos produtos / serviços</div>
        <div class="overflow-x-auto">
          <table class="items">
            <thead>
              <tr><th>Cód.</th><th>Descrição</th><th>NCM</th><th>CFOP</th><th>Un.</th><th class="r">Qtd</th><th class="r">Vl. unit.</th><th class="r">Vl. total</th></tr>
            </thead>
            <tbody>
              @for (it of doc().items ?? []; track it.itemOrder) {
                <tr>
                  <td>{{ it.code }}</td><td>{{ it.description }}</td><td>{{ ncm(it.ncm) }}</td><td>{{ it.cfop }}</td><td>{{ it.unit }}</td>
                  <td class="r">{{ it.quantity | number: '1.0-4' : 'pt-BR' }}</td>
                  <td class="r">{{ it.unitPrice | number: '1.2-2' : 'pt-BR' }}</td>
                  <td class="r">{{ it.totalPrice | number: '1.2-2' : 'pt-BR' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="sec">Dados adicionais</div>
        <div class="box text-[10px] min-h-10">{{ extraInfo() }}</div>
      }
      <p class="mt-3 text-center text-[9px] text-neutral-600 border-t border-neutral-300 pt-1">
        Prévia para conferência — não substitui o DANFE oficial nem o XML autorizado.
      </p>
    </div>
  `,
})
export class DanfePreviewComponent {
  readonly doc = input.required<FiscalDocumentDto>();
  readonly company = input<CompanyDto | null | undefined>(null);
  readonly customer = input<CustomerDto | null | undefined>(null);
  /** Força a marca d'água (ex.: exemplos e modo demonstração). */
  readonly forceWatermark = input(false);

  protected readonly isNfce = computed(() => this.doc().documentType === 'NFCE');
  protected readonly isNfse = computed(() => this.doc().documentType === 'NFSE');
  protected readonly noFiscalValue = computed(
    () => this.forceWatermark() || this.doc().environment === 'HOMOLOGATION' || this.doc().status !== 'AUTHORIZED'
  );
  protected readonly issuedAt = computed(() => this.doc().authorizedAt ?? this.doc().createdAt);
  protected readonly customerDoc = computed(() => formatDocument(this.doc().customerDocument) || 'Não informado');

  protected readonly keyGroups = computed(() => {
    const k = this.doc().accessKey;
    return k ? k.replace(/(\d{4})(?=\d)/g, '$1 ') : 'Chave gerada após a autorização';
  });

  /** Texto legal só aparece para empresas do Simples Nacional. */
  protected readonly extraInfo = computed(() =>
    this.company()?.taxRegime?.startsWith('SIMPLES')
      ? 'Documento emitido por ME ou EPP optante pelo Simples Nacional. Não gera direito a crédito fiscal de IPI.'
      : ''
  );

  protected readonly icmsBase = computed(() => (this.doc().items ?? []).reduce((s, i) => s + (i.icmsBase ?? 0), 0));

  protected ncm(v: string): string {
    return formatNcm(v);
  }

  /** Barras ilustrativas derivadas dos dígitos da chave (não é um código lido por leitor). */
  protected readonly barcode = computed(() => {
    const digits = (this.doc().accessKey ?? '0123456789').replace(/\D/g, '');
    const bars: { x: number; w: number }[] = [];
    let x = 2;
    for (const ch of digits) {
      const n = Number(ch);
      const w = 0.8 + (n % 3) * 0.5;
      bars.push({ x, w });
      x += w + 0.9 + (n % 2) * 0.6;
      if (x > 196) break;
    }
    return bars;
  });

  protected readonly qrCells = computed(() => {
    const seed = (this.doc().accessKey ?? '1').replace(/\D/g, '');
    const cells: { x: number; y: number }[] = [];
    const finder = (ox: number, oy: number) => {
      for (let i = 0; i < 7; i++)
        for (let j = 0; j < 7; j++)
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) cells.push({ x: ox + i, y: oy + j });
    };
    finder(0, 0);
    finder(14, 0);
    finder(0, 14);
    for (let y = 0; y < 21; y++)
      for (let x = 0; x < 21; x++) {
        const inFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
        if (inFinder) continue;
        if (Number(seed[(x * 7 + y * 13) % seed.length]) % 2 === (x + y) % 2) cells.push({ x, y });
      }
    return cells;
  });
}
