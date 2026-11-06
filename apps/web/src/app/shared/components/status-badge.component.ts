import { Component, computed, input } from '@angular/core';
import { AppIconComponent } from './icon.component';

interface StatusView {
  label: string;
  cls: string;
  icon: string;
  hint: string;
}

/** Mapa único de status fiscal → texto, cor e ícone (cor nunca é o único sinal). */
export const DOCUMENT_STATUS: Record<string, StatusView> = {
  DRAFT: { label: 'Rascunho', cls: 'badge-ghost', icon: 'pencil', hint: 'Ainda não foi enviada à SEFAZ. Pode ser editada.' },
  VALIDATED: { label: 'Validada', cls: 'badge-info badge-soft', icon: 'check', hint: 'Dados conferidos, pronta para enviar.' },
  QUEUED: { label: 'Na fila', cls: 'badge-info badge-soft', icon: 'clock', hint: 'Aguardando envio ao provedor fiscal.' },
  PROCESSING: { label: 'Processando', cls: 'badge-info badge-soft', icon: 'refresh', hint: 'Enviada. Aguardando resposta da SEFAZ.' },
  AUTHORIZED: { label: 'Autorizada', cls: 'badge-success badge-soft', icon: 'check', hint: 'Aprovada pela SEFAZ. Tem validade fiscal.' },
  REJECTED: { label: 'Rejeitada', cls: 'badge-error badge-soft', icon: 'alert', hint: 'A SEFAZ recusou. Corrija os dados e envie novamente.' },
  DENIED: { label: 'Denegada', cls: 'badge-error', icon: 'ban', hint: 'Uso denegado pela SEFAZ. Não pode ser reenviada.' },
  CANCELLED: { label: 'Cancelada', cls: 'badge-neutral badge-soft', icon: 'ban', hint: 'Cancelada junto à SEFAZ. Sem efeito fiscal.' },
};

@Component({
  selector: 'app-status-badge',
  imports: [AppIconComponent],
  template: `
    <span class="badge gap-1 whitespace-nowrap font-semibold" [class]="view().cls" [title]="view().hint">
      <app-icon [name]="view().icon" [size]="12"></app-icon>
      {{ view().label }}
    </span>
  `,
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();
  protected readonly view = computed<StatusView>(
    () =>
      DOCUMENT_STATUS[this.status()] ?? {
        label: this.status(),
        cls: 'badge-ghost',
        icon: 'info',
        hint: '',
      }
  );
}
