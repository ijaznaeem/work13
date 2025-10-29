import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPrintModule } from 'ngx-print';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { AccttypesComponent } from './acct-type/acct-types.component';
import { CustomerAcctdetailsComponent } from './customer-acctdetails/customer-acctdetails.component';
import { CustomerAcctsComponent } from './customer-accts/customer-accts.component';
import { CustomersComponent } from './customers/customers.component';


const routes:any = [
  { path: '', redirectTo: 'accounts', pathMatch: 'full' },
  { path: 'accounts', component: CustomersComponent, data: { breadcrumb: 'Customer List' } },
  { path: 'accountledger', component: CustomerAcctsComponent, data: { breadcrumb: 'Customer Accounts' } },
  { path: 'accountdetails/:dte1/:dte2/:id', component: CustomerAcctdetailsComponent, data: { breadcrumb: 'Customer Accounts' } },
  { path: 'accountdetails', component: CustomerAcctdetailsComponent, data: { breadcrumb: 'Customer Accounts' } },
  { path: 'accttypes', component: AccttypesComponent, data: { breadcrumb: 'Accounts Types' } },

];
@NgModule({
  declarations: [
    CustomersComponent,
    CustomerAcctsComponent,
    CustomerAcctdetailsComponent,
    AccttypesComponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    FutureTechLibModule,
    NgSelectModule,
    NgxPrintModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  exports: [
    CustomerAcctsComponent,
    CustomerAcctdetailsComponent
  ]
})
export class AccountsModule { }
