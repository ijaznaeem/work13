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
    path: 'tasks',
    loadChildren: () =>
      import('../../pages/tasks/tasks.module').then((m) => m.TasksModule),
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('../../pages/accounts/accounts.module').then(
        (m) => m.AccountsModule
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('../../pages/reports/reports.module').then((m) => m.ReportsModule),
  },
];
