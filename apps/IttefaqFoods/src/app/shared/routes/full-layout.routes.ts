import { Routes } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../../pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../../pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('../../pages/sales/sales.module').then(
        (m) => m.SalesModule
      ),
  },
  {
    path: 'wastage',
    loadChildren: () =>
      import('../../pages/wastage/wastage.module').then(
        (m) => m.WastageModule
      ),
  },
  {
    path: 'purchase',
    loadChildren: () =>
      import('../../pages/purchase/purchase.module').then(
        (m) => m.PurchaseModule
      ),
  },
  {
    path: 'transfer',
    loadChildren: () =>
      import('../../pages/transfer/transfer.module').then(
        (m) => m.TransferModule
      ),
  },
  {
    path: 'cash',
    loadChildren: () =>
      import('../../pages/cash/cash.module').then(
        (m) => m.CashModule
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('../../pages/reports/reports.module').then(
        (m) => m.ReportsModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('../../pages/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('../../pages/accounts/acounts.module').then(
        (m) => m.AccountsModule
      ),
  },

];
