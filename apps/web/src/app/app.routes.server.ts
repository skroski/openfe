import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Painel autenticado e orientado a dados: renderizado no navegador.
 * Pré-renderizar só geraria telas vazias (sem API no build) e quebraria rotas com parâmetro.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
