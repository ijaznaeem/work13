import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../gaurds/auth.guard';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  { canActivateChild: [AuthGuard],
    path: '',
    loadChildren: () =>
      import('../../pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    pathMatch: 'full',
  },
  { canActivateChild: [AuthGuard],
    path: 'dashboard',
    loadChildren: () =>
      import('../../pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  { canActivateChild: [AuthGuard],
    path: 'sales',
    loadChildren: () =>
      import('../../pages/sales/Sales.Module').then(
        (m) => m.SalesModule
      ),
  },
  { canActivateChild: [AuthGuard],
    path: 'operations',
    loadChildren: () =>
      import('../../pages/operations/Operations.Module').then(
        (m) => m.OperationsModule
      ),
  },
  { canActivateChild: [AuthGuard],
    path: 'cash',
    loadChildren: () =>
      import('../../pages/cash/Cash.Module').then(
        (m) => m.CashModule
      ),
  },
  { canActivateChild: [AuthGuard],
    path: 'reports',
    loadChildren: () =>
      import('../../pages/reports/reports.module').then(
        (m) => m.ReportsModule
      ),
  },
  { canActivateChild: [AuthGuard],
    path: 'settings',
    loadChildren: () =>
      import('../../pages/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
  },
  { canActivateChild: [AuthGuard],
    path: 'accounts',
    loadChildren: () =>
      import('../../pages/accounts/Account.Module').then(
        (m) => m.AccountModule
      ),
  },
  { canActivateChild: [AuthGuard],
    path: 'employees',
    loadChildren: () =>
      import('../../pages/employees/employees.module').then(
        (m) => m.EmployeesModule
      ),
  },
  
  { canActivateChild: [AuthGuard],
    path: 'support',
    loadChildren: () =>
      import('../../pages/support-tickets/supporttickets.module').then(
        (m) => m.SupportTicketsModule
      ),
  },
  {

    path: 'not-allowed',
    loadChildren: () =>
      import('../../pages/not-allowed/not-allowed.module').then(
        (m) => m.NotAllowedModule
      ),
  },
];
