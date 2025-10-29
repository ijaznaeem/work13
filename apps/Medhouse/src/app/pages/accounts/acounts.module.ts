import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAcctsComponent } from './customer-accts/customer-accts.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { NgxPrintModule } from 'ngx-print';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { AccttypesComponent } from './acct-type/acct-types.component';
import { PurchaseInvoiceFgComponent } from './purchase-invoice-fg/purchase-invoice-fg.component';
import { AuthGuard } from '../../gaurds/auth.guard';


const routes:any = [
  { path: '', redirectTo: 'accounts', pathMatch: 'full' },
  { path: 'accounts', component: CustomersComponent, data: { breadcrumb: 'Customer List' } },
  { path: 'accountledger', component: CustomerAcctsComponent, data: { breadcrumb: 'Customer Accounts' } },
  { path: 'accttypes', component: AccttypesComponent, data: { breadcrumb: 'Accounts Types' } },
  { path: 'purchase-invoice-fg', component: PurchaseInvoiceFgComponent, data: { breadcrumb: 'Purchase Invoice FG' } },
  { path: 'purchase-invoice-fg/:id', component: PurchaseInvoiceFgComponent, data: { breadcrumb: 'Purchase Invoice FG Edit' } },
  { canActivateChild: [AuthGuard],
      path: 'cash',
      loadChildren: () =>
        import('./cash/cash.module').then(
          (m) => m.CashModule
        ),},
  { canActivateChild: [AuthGuard],
      path: 'account-list',
      loadChildren: () =>
        import('./account-list/account-list.module').then(
          (m) => m.AccountListModule
        ),
      data: { breadcrumb: 'Account Management' }},

];
@NgModule({
  declarations: [
    CustomersComponent,
    CustomerAcctsComponent,
    AccttypesComponent,
    PurchaseInvoiceFgComponent,
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    NgxPrintModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class AccountsModule { }
