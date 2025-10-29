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
    path: 'data',
    loadChildren: () =>
      import('../../pages/data/data.module').then(
        (m) => m.DataModule
      ),
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('../../pages/tasks/tasks.module').then(
        (m) => m.TasksModule
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
    path: 'report',
    loadChildren: () =>
      import('../../pages/reports/reports.module').then(
        (m) => m.ReportsModule
      ),
  },



];
