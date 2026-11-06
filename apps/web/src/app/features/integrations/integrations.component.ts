import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FiscalEnvironment } from '@opennfe/shared';
import { FiscalApiService } from '../../core/services/fiscal-api.service';
import { ToastService } from '../../core/services/toast.service';
import { AppIconComponent } from '../../shared/components/icon.component';
import { FormFieldComponent } from '../../shared/components/form-field.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

interface CertStatus {
  exists?: boolean;
  subject?: string;
  issuer?: string;
  validTo?: string;
  daysRemaining?: number;
  [k: string]: unknown;
}

const PROVIDERS = [
  { key: 'FOCUS_NFE', name: 'Focus NFe', tag: 'Recomendado', text: 'Emite NF-e, NFC-e e NFS-e e conversa com a SEFAZ e prefeituras por você.', needsToken: true },
  { key: 'PLUGNOTAS', name: 'PlugNotas (TecnoSpeed)', tag: '', text: 'Alternativa ao Focus NFe, com as mesmas funções principais.', needsToken: true },
  { key: 'MOCK_PROVIDER', name: 'Simulador (testes)', tag: 'Sem custo', text: 'Finge ser a SEFAZ, sem internet. Ótimo para treinar. R$ 100,00 autoriza; R$ 999,99 é rejeitada.', needsToken: false },
] as const;

@Component({
  selector: 'app-integrations',
  imports: [FormsModule, AppIconComponent, FormFieldComponent, PageHeaderComponent],
  template: `
    <div class="flex flex-col gap-8">
      <app-page-header
        title="Integrações"
        description="Para emitir notas de verdade, o sistema precisa de duas coisas: o certificado digital da empresa e um provedor fiscal que fala com a SEFAZ."
        [crumbs]="[{ label: 'Início', link: '/dashboard' }, { label: 'Integrações' }]"
      />

      <!-- CERTIFICADO -->
      <section class="card bg-base-100 border border-base-300 p-5 sm:p-6 flex flex-col gap-5" aria-labelledby="i-cert">
        <div>
          <h2 id="i-cert" class="text-lg font-bold flex items-center gap-2"><app-icon name="shield" [size]="20"></app-icon> 1. Certificado digital A1</h2>
          <p class="text-sm text-base-content/70">Arquivo <strong>.pfx</strong> ou <strong>.p12</strong> da empresa. Ele é guardado criptografado e usado só para assinar as notas.</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <app-form-field label="Empresa" for="i-comp">
            <select id="i-comp" class="select w-full" [ngModel]="companyId()" (ngModelChange)="companyId.set($event)">
              <option value="">Escolha a empresa…</option>
              @for (c of api.companies(); track c.id) { <option [value]="c.id">{{ c.tradeName }} — {{ c.state }}</option> }
            </select>
          </app-form-field>

          <div class="flex flex-col gap-1.5" aria-live="polite">
            <span class="text-sm font-semibold">Situação atual</span>
            @if (!companyId()) {
              <p class="text-sm text-base-content/70 min-h-11 flex items-center">Escolha uma empresa para ver.</p>
            } @else if (certLoading()) {
              <span class="loading loading-spinner loading-sm"></span>
            } @else if (cert(); as c) {
              @if (c.exists === false || !c.subject) {
                <span class="badge badge-warning badge-soft gap-1 font-semibold self-start"><app-icon name="alert" [size]="12"></app-icon> Nenhum certificado enviado</span>
              } @else {
                <span class="badge badge-success badge-soft gap-1 font-semibold self-start"><app-icon name="check" [size]="12"></app-icon> Certificado enviado</span>
                <p class="text-sm">{{ c.subject }}</p>
                @if (c.daysRemaining !== undefined) {
                  <p class="text-sm" [class.text-error]="c.daysRemaining < 30">
                    {{ c.daysRemaining > 0 ? 'Vence em ' + c.daysRemaining + ' dias' : 'Vencido' }}
                  </p>
                }
              }
            } @else {
              <p class="text-sm text-base-content/70">Não foi possível consultar o certificado agora.</p>
            }
          </div>

          <app-form-field label="Arquivo do certificado (.pfx)" for="i-file" [required]="true">
            <input id="i-file" type="file" accept=".pfx,.p12" class="file-input w-full" (change)="onFile($event)" />
          </app-form-field>
          <app-form-field label="Senha do certificado" for="i-pass" [required]="true" hint="Usada uma única vez para validar o arquivo. Não é exibida depois.">
            <input id="i-pass" type="password" class="input w-full" autocomplete="off" [ngModel]="passphrase()" (ngModelChange)="passphrase.set($event)" />
          </app-form-field>
        </div>

        <div class="flex justify-end">
          <button type="button" class="btn btn-primary" [disabled]="!canUpload() || uploading()" (click)="upload()">
            @if (uploading()) { <span class="loading loading-spinner loading-xs"></span> } @else { <app-icon name="upload" [size]="18"></app-icon> }
            Enviar certificado
          </button>
        </div>
      </section>

      <!-- PROVEDORES -->
      <section class="flex flex-col gap-4" aria-labelledby="i-prov">
        <div>
          <h2 id="i-prov" class="text-lg font-bold flex items-center gap-2"><app-icon name="sliders" [size]="20"></app-icon> 2. Provedor fiscal</h2>
          <p class="text-sm text-base-content/70">Use “Testar conexão” para confirmar que a chave (token) está correta antes de emitir.</p>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          @for (p of providers; track p.key) {
            <article class="card bg-base-100 border border-base-300 p-5 gap-4">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-bold text-lg">{{ p.name }}</h3>
                  @if (p.tag) { <span class="badge badge-primary badge-soft font-semibold">{{ p.tag }}</span> }
                </div>
                <p class="text-sm text-base-content/70 mt-1">{{ p.text }}</p>
              </div>

              @if (p.needsToken) {
                <app-form-field label="Token de acesso" [for]="'tok-' + p.key" hint="Fica guardado criptografado no servidor.">
                  <input [id]="'tok-' + p.key" type="password" class="input w-full font-mono" autocomplete="off" [ngModel]="tokens()[p.key] ?? ''" (ngModelChange)="setToken(p.key, $event)" />
                </app-form-field>
                <app-form-field label="Ambiente" [for]="'env-' + p.key">
                  <select [id]="'env-' + p.key" class="select w-full" [ngModel]="envs()[p.key] ?? 'HOMOLOGATION'" (ngModelChange)="setEnv(p.key, $event)">
                    <option value="HOMOLOGATION">Testes (sem valor fiscal)</option>
                    <option value="PRODUCTION">Produção (valor fiscal real)</option>
                  </select>
                </app-form-field>
              }

              <button type="button" class="btn btn-outline mt-auto" [disabled]="testing() === p.key || (p.needsToken && !(tokens()[p.key] ?? '').trim())" (click)="test(p.key, p.needsToken)">
                @if (testing() === p.key) { <span class="loading loading-spinner loading-xs"></span> } @else { <app-icon name="refresh" [size]="16"></app-icon> }
                Testar conexão
              </button>
            </article>
          }
        </div>

        @if (result(); as r) {
          <div class="alert" [class]="r.success ? 'alert-success alert-soft' : 'alert-error alert-soft'" role="status">
            <app-icon [name]="r.success ? 'check' : 'alert'" [size]="18"></app-icon>
            <span><strong>{{ r.message }}</strong> @if (r.latencyMs) { · resposta em {{ r.latencyMs }} ms }</span>
          </div>
        }

        <p class="text-sm text-base-content/70">
          <app-icon name="info" [size]="14" customClass="inline mr-1"></app-icon>
          Salvar o token por empresa depende do endpoint de configuração do provedor da API (já existe em <code>PUT /companies/:id/provider-config</code>) e será ligado a esta tela em seguida.
        </p>
      </section>
    </div>
  `,
})
export class IntegrationsComponent {
  readonly api = inject(FiscalApiService);
  private readonly toast = inject(ToastService);

  readonly providers = PROVIDERS;
  readonly companyId = signal('');
  readonly cert = signal<CertStatus | null>(null);
  readonly certLoading = signal(false);
  readonly file = signal<File | null>(null);
  readonly passphrase = signal('');
  readonly uploading = signal(false);

  readonly tokens = signal<Record<string, string>>({});
  readonly envs = signal<Record<string, string>>({});
  readonly testing = signal<string | null>(null);
  readonly result = signal<{ success: boolean; message: string; latencyMs?: number } | null>(null);

  readonly canUpload = computed(() => !!this.companyId() && !!this.file() && this.passphrase().length > 0);

  constructor() {
    // Consulta o certificado sempre que a empresa muda.
    effect(() => {
      const id = this.companyId();
      this.cert.set(null);
      if (!id || this.api.demoMode()) return;
      this.certLoading.set(true);
      this.api
        .getCertificateStatus(id)
        .then((c) => this.cert.set(c))
        .catch(() => this.cert.set(null))
        .finally(() => this.certLoading.set(false));
    });
  }

  setToken(key: string, v: string): void {
    this.tokens.update((t) => ({ ...t, [key]: v }));
  }
  setEnv(key: string, v: string): void {
    this.envs.update((t) => ({ ...t, [key]: v }));
  }

  onFile(event: Event): void {
    this.file.set((event.target as HTMLInputElement).files?.[0] ?? null);
  }

  async upload(): Promise<void> {
    const file = this.file();
    if (!file) return;
    if (this.api.demoMode()) {
      this.toast.warning('Modo demonstração: o certificado não foi enviado a nenhum servidor.');
      return;
    }
    this.uploading.set(true);
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      let bin = '';
      buf.forEach((b) => (bin += String.fromCharCode(b)));
      await this.api.uploadCertificate(this.companyId(), btoa(bin), this.passphrase());
      this.passphrase.set('');
      this.file.set(null);
      this.toast.success('Certificado validado e guardado com segurança.');
      const id = this.companyId();
      this.companyId.set('');
      this.companyId.set(id);
    } catch (e) {
      this.toast.error(this.api.errorMessage(e, 'Não foi possível validar o certificado. Confira o arquivo e a senha.'));
    } finally {
      this.uploading.set(false);
    }
  }

  async test(key: string, needsToken: boolean): Promise<void> {
    this.testing.set(key);
    this.result.set(null);
    try {
      if (this.api.demoMode()) {
        this.result.set({ success: key === 'MOCK_PROVIDER', message: key === 'MOCK_PROVIDER' ? 'Simulador respondeu (modo demonstração).' : 'Modo demonstração: sem conexão real com o provedor.', latencyMs: key === 'MOCK_PROVIDER' ? 12 : undefined });
        return;
      }
      const res = await this.api.testProviderConnection(
        key,
        needsToken ? { token: (this.tokens()[key] ?? '').trim() } : {},
        (this.envs()[key] ?? 'HOMOLOGATION') as FiscalEnvironment
      );
      this.result.set(res);
    } catch (e) {
      this.result.set({ success: false, message: this.api.errorMessage(e, 'Falha ao testar a conexão.') });
    } finally {
      this.testing.set(null);
    }
  }
}
