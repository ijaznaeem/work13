import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { AuthGuard } from './gaurds/auth.guard';

export const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: PagesComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./pages/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
        data: { breadcrumb: "Dashboard" },
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./pages/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
        data: { breadcrumb: "Dashboard" },
      },
      {
        path: "settings",
        loadChildren: () =>
          import("./pages/settings/settings.module").then(
            (m) => m.SettingsModule
          ),
        data: { breadcrumb: "Settings" },
      },
      {
        path: "purchase",
        loadChildren: () =>
          import("./pages/purchase/purchase.module").then(
            (m) => m.PurchaseModule
          ),
        data: { breadcrumb: "Purchase" },
      },
      {
        path: "sale",
        loadChildren: () =>
          import("./pages/sale/sale.module").then((m) => m.SaleModule),
        data: { breadcrumb: "Sale" },
      },
      {
        path: "cash",
        loadChildren: () =>
          import("./pages/cash/cash.module").then((m) => m.CashModule),
        data: { breadcrumb: "Cash" },
      },
      {
        path: "reports",
        loadChildren: () =>
          import("./pages/reports/reports.module").then((m) => m.ReportsModule),
        data: { breadcrumb: "Reports" },
      },
      {
        path: "customers",
        loadChildren: () =>
          import("./pages/customers/customers.module").then(
            (m) => m.CustomersModule
          ),
        data: { breadcrumb: "Customers" },
      },
      {
        path: "suppliers",
        loadChildren: () =>
          import("./pages/suppliers/suppliers.module").then(
            (m) => m.SuppliersModule
          ),
        data: { breadcrumb: "Suppliers" },
      },
      {
        path: "users",
        loadChildren: () =>
          import("./pages/users/users.module").then((m) => m.UsersModule),
        data: { breadcrumb: "Users" },
      },
    ],
  },
  {
    path: "print",
    loadChildren: () =>
      import("./pages/printing/printing.module").then((m) => m.PrintingModule),
    data: { breadcrumb: "Print" },
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./pages/signup/signup.module").then((m) => m.SignupModule),
  },
  { path: "**", component: NotFoundComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  // preloadingStrategy: PreloadAllModules,  // <- comment this line for enable lazy load
  useHash: true
});
