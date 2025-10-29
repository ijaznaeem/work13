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
    path: 'doctor',
    loadChildren: () =>
      import('../../pages/doctors/doctors.module').then(
        (m) => m.DoctorsModule
      ),
  },
  {
    path: 'patient',
    loadChildren: () =>
      import('../../pages/patients/patients.module').then(
        (m) => m.PatientsModule
      ),
  },
  {
    path: 'lab',
    loadChildren: () =>
      import('../../pages/laboratory/Lab.Module').then(
        (m) => m.LabModule
      ),
  },



];
