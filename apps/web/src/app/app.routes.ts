import { Route } from '@angular/router';
import { AppLayoutComponent } from './core/layout/app-layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'documentos',
        loadComponent: () =>
          import('./features/documents/documents.component').then(
            (m) => m.DocumentsComponent
          ),
      },
      {
        path: 'emissao',
        loadComponent: () =>
          import('./features/issuance/issuance.component').then(
            (m) => m.IssuanceComponent
          ),
      },
      {
        path: 'importacao',
        loadComponent: () =>
          import('./features/imports/imports.component').then(
            (m) => m.ImportsComponent
          ),
      },
      {
        path: 'empresas',
        loadComponent: () =>
          import('./features/companies/companies.component').then(
            (m) => m.CompaniesComponent
          ),
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/customers/customers.component').then(
            (m) => m.CustomersComponent
          ),
      },
      {
        path: 'produtos',
        loadComponent: () =>
          import('./features/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: 'relatorios',
        loadComponent: () =>
          import('./features/reports/reports.component').then(
            (m) => m.ReportsComponent
          ),
      },
      {
        path: 'integracoes',
        loadComponent: () =>
          import('./features/integrations/integrations.component').then(
            (m) => m.IntegrationsComponent
          ),
      },
      {
        path: 'configuracoes',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
