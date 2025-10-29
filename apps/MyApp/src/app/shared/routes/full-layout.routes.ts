import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: 'page',
    loadChildren: () => import('../../page/page.module').then(m => m.PageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('../../pages/settings/settings.module').then(m => m.SettingsModule)
  }
];
