import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

/** Avisos curtos no canto da tela. Somem sozinhos; erros ficam mais tempo. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  readonly toasts = signal<Toast[]>([]);

  success(message: string): void {
    this.push('success', message, 4000);
  }
  error(message: string): void {
    this.push('error', message, 8000);
  }
  info(message: string): void {
    this.push('info', message, 5000);
  }
  warning(message: string): void {
    this.push('warning', message, 6000);
  }

  dismiss(id: number): void {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }

  private push(kind: ToastKind, message: string, ms: number): void {
    const id = this.nextId++;
    this.toasts.update((t) => [...t, { id, kind, message }]);
    setTimeout(() => this.dismiss(id), ms);
  }
}
