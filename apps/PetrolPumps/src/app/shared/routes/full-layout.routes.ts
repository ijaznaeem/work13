import { Routes } from '@angular/router';
import { AuthGuard } from '../../gaurds/auth.guard';

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
    canActivate: [AuthGuard],
    path: 'orders',
    loadChildren: () =>
      import('../../pages/orders/orders.module').then((m) => m.OrdersModule),
  },
  {
    canActivate: [AuthGuard],
    path: 'sales',
    loadChildren: () =>
      import('../../pages/sales/sales.module').then((m) => m.SalesModule),
  },
  {
    canActivate: [AuthGuard],
    path: 'purchase',
    loadChildren: () =>
      import('../../pages/purchase/purchase.module').then(
        (m) => m.PurchaseModule
      ),
  },
  {
    canActivate: [AuthGuard],
    path: 'transfer',
    loadChildren: () =>
      import('../../pages/transfer/transfer.module').then(
        (m) => m.TransferModule
      ),
  },
  {
    canActivate: [AuthGuard],
    path: 'cash',
    loadChildren: () =>
      import('../../pages/cash/cash.module').then((m) => m.CashModule),
  },
  {
    canActivate: [AuthGuard],
    path: 'reports',
    loadChildren: () =>
      import('../../pages/reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    canActivate: [AuthGuard],
    path: 'settings',
    loadChildren: () =>
      import('../../pages/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
  },
  {
    canActivate: [AuthGuard],
    path: 'products',
    loadChildren: () =>
      import('../../pages/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },
  {
    path: 'not-allowed',
    loadChildren: () =>
      import('../../pages/not-allowed/not-allowed.module').then(
        (m) => m.NotAllowedModule
      ),
  },
  {
    canActivate: [AuthGuard],
    path: 'accounts',
    loadChildren: () =>
      import('../../pages/accounts/acounts.module').then(
        (m) => m.AccountsModule
      ),
  },
];
