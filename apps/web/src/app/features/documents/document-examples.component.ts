import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FiscalDocumentDto } from '@opennfe/shared';
import { buildDemoDocuments, DEMO_COMPANIES, DEMO_CUSTOMERS } from '../../core/data/demo-data';
import { DanfePreviewComponent } from '../../shared/components/danfe/danfe-preview.component';
import { AppIconComponent } from '../../shared/components/icon.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

interface Example {
  type: 'NFE' | 'NFCE' | 'NFSE';
  title: string;
  when: string;
  who: string;
}

const EXAMPLES: Example[] = [
  { type: 'NFE', title: 'NF-e', when: 'Venda de produtos para empresas ou pessoas, dentro ou fora do estado.', who: 'Comércio, indústria, distribuidoras' },
  { type: 'NFCE', title: 'NFC-e', when: 'Venda no balcão para o consumidor final (cupom).', who: 'Varejo, lojas, restaurantes' },
  { type: 'NFSE', title: 'NFS-e', when: 'Prestação de serviços. O modelo varia por prefeitura.', who: 'Consultorias, clínicas, escritórios' },
];

/** Página de exemplos: mostra como cada tipo de nota ficará, sem depender da API. */
@Component({
  selector: 'app-document-examples',
  imports: [RouterLink, AppIconComponent, DanfePreviewComponent, PageHeaderComponent],
  template: `
    <div class="flex flex-col gap-6">
      <app-page-header
        title="Exemplos de nota fiscal"
        description="Veja como cada tipo de nota fica depois de autorizada. Os dados abaixo são fictícios e servem apenas para visualização."
        [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Notas fiscais', link: '/documentos' }, { label: 'Exemplos' }]"
      >
        <a routerLink="/emissao" class="btn btn-primary"><app-icon name="file-plus-2" [size]="18"></app-icon> Emitir uma nota de verdade</a>
      </app-page-header>

      <div role="tablist" class="tabs tabs-box w-fit max-w-full overflow-x-auto no-print" aria-label="Tipo de nota">
        @for (e of examples; track e.type) {
          <button type="button" role="tab" class="tab" [class.tab-active]="selected() === e.type" [attr.aria-selected]="selected() === e.type" (click)="selected.set(e.type)">
            {{ e.title }}
          </button>
        }
      </div>

      <div class="alert alert-info alert-soft text-sm no-print">
        <app-icon name="info" [size]="18"></app-icon>
        <div>
          <strong>Quando usar:</strong> {{ current().when }}
          <span class="block text-base-content/70">Quem costuma usar: {{ current().who }}</span>
        </div>
      </div>

      <app-danfe-preview [doc]="doc()" [company]="company()" [customer]="customer()" [forceWatermark]="true" />
    </div>
  `,
})
export class DocumentExamplesComponent {
  readonly examples = EXAMPLES;
  readonly selected = signal<Example['type']>('NFE');
  private readonly docs = buildDemoDocuments();

  protected readonly current = computed(() => EXAMPLES.find((e) => e.type === this.selected())!);
  protected readonly doc = computed<FiscalDocumentDto>(
    () => this.docs.find((d) => d.documentType === this.selected() && d.status === 'AUTHORIZED' && (d.items?.length ?? 0) >= 2 && d.customerName) ??
      this.docs.find((d) => d.documentType === this.selected() && d.status === 'AUTHORIZED') ?? this.docs[0]
  );
  protected readonly company = computed(() => DEMO_COMPANIES.find((c) => c.id === this.doc().companyId));
  protected readonly customer = computed(() => DEMO_CUSTOMERS.find((c) => c.id === this.doc().customerId));
}
