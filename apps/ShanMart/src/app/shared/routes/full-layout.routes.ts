import { Routes, RouterModule } from '@angular/router';

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
    path: 'sale',
    loadChildren: () =>
      import('../../pages/sale/sitessale.module').then(
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
    path: 'transfer',
    loadChildren: () =>
      import('../../pages/transfer/transfer.module').then(
        (m) => m.TransferModule
      ),
  },
  {
    path: 'payments',
    loadChildren: () =>
      import('../../pages/payments/payments.module').then(
        (m) => m.PaymentsModule
      ),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('../../pages/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },
  {
    path: 'setup',
    loadChildren: () =>
      import('../../pages/setup/setup.module').then(
        (m) => m.SetupModule
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('../../pages/reports/reports.module').then(
        (m) => m.ReportModule
      ),
  },
  {
    path: 'stock',
    loadChildren: () =>
      import('../../pages/stock/stock.module').then(
        (m) => m.StockModule
      ),
  },



];
