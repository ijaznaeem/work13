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
    canActivateChild: [AuthGuard],
    path: 'admin',
    loadChildren: () =>
      import('../../pages/admin/admin.module').then((m) => m.AdminMudule),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'procurement',
    loadChildren: () =>
      import('../../pages/procurement/procurement.module').then((m) => m.ProcurementModule),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'approvals',
    loadChildren: () =>
      import('../../pages/approval/approval.module').then((m) => m.ApprovalModule),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'employees',
    loadChildren: () =>
      import('../../pages/employees/employees.module').then((m) => m.EmployeesModule),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'stores',
    loadChildren: () =>
      import('../../pages/stores/stores.module').then((m) => m.StoresModule),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'sale',
    loadChildren: () =>
      import('../../pages/sales/sales.module').then((m) => m.SalesModule),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'purchase',
    loadChildren: () =>
      import('../../pages/purchase/purchase.module').then(
        (m) => m.PurchaseModule
      ),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'transfer',
    loadChildren: () =>
      import('../../pages/transfer/transfer.module').then(
        (m) => m.TransferModule
      ),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'cash',
    loadChildren: () =>
      import('../../pages/cash/cash.module').then((m) => m.CashModule),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'reports',
    loadChildren: () =>
      import('../../pages/reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'settings',
    loadChildren: () =>
      import('../../pages/settings/settings.module').then(
        (m) => m.SettingsModule
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
    canActivateChild: [AuthGuard],
    path: 'accounts',
    loadChildren: () =>
      import('../../pages/accounts/acounts.module').then(
        (m) => m.AccountsModule
      ),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'intimations-and-requisitions',
    loadChildren: () =>
      import('../../pages/intimations/intimations.module').then(
        (m) => m.IntimationsModule
      ),
  },
  {
    canActivateChild: [AuthGuard],
    path: 'budgeting',
    loadChildren: () =>
      import('../../pages/budget/budget.module').then(
        (m) => m.BudgetModule
      ),
  },
];
