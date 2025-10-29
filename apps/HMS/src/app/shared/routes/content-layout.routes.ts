import { Routes } from '@angular/router';
import { AuthGuard } from '../../gaurds/auth.guard';

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const CONTENT_ROUTES: Routes = [
     { path: 'auth', loadChildren: () => import('../../pages/content-pages/content-pages.module').then(m => m.ContentPagesModule) },
     { path: 'print',  canActivate: [AuthGuard],  loadChildren: () => import('../../pages/printing/print-module').then(m => m.PrintModule), },

];
