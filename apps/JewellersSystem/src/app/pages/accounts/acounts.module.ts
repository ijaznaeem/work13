import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPrintModule } from 'ngx-print';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { CustomerAcctsComponent } from './accounts-bydate/customer-accts.component';
import { AccountsDetailComponent } from './accounts-details/accounts-detail.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AccttypesComponent } from './acct-type/acct-types.component';
import { CustomerAcctdetailsComponent } from './customer-acctdetails/customer-acctdetails.component';
import { AccountGroupsComponent } from './groups/account-groups.component';

const routes: any = [
  { path: '', redirectTo: 'accounts', pathMatch: 'full' },
  {
    path: 'accounts',
    component: AccountsComponent,
    data: { breadcrumb: 'Customer List' },
  },
  {
    path: 'accountledger',
    component: CustomerAcctsComponent,
    data: { breadcrumb: 'Customer Accounts' },
  },
  {
    path: 'accountdetails/:dte1/:dte2/:id',
    component: CustomerAcctdetailsComponent,
    data: { breadcrumb: 'Customer Accounts' },
  },
  {
    path: 'accountdetails',
    component: CustomerAcctdetailsComponent,
    data: { breadcrumb: 'Customer Accounts' },
  },
  {
    path: 'accttypes',
    component: AccttypesComponent,
    data: { breadcrumb: 'Accounts Types' },
  },
  {
    path: 'groups',
    component: AccountGroupsComponent,
    data: { breadcrumb: 'Accounts Groups' },
  },
];
@NgModule({
  declarations: [
    AccountsComponent,
    CustomerAcctdetailsComponent,
    AccttypesComponent,
    AccountGroupsComponent,
    AccountsDetailComponent,
    CustomerAcctsComponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    NgxPrintModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  exports: [AccountsDetailComponent, CustomerAcctdetailsComponent],
})
export class AccountsModule {}
