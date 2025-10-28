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
    path: 'customers',
    loadChildren: () =>
      import('../../pages/customers/customers.module').then(
        (m) => m.CustomersModule
      ),
  },
  {
    path: 'sale',
    loadChildren: () =>
      import('../../pages/sale/sale.module').then(
        (m) => m.SaleModule
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



];
