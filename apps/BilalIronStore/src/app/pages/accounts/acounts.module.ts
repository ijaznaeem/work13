import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPrintModule } from 'ngx-print';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { AccttypesComponent } from './acct-type/acct-types.component';
import { CitiesComponent } from './cities/cities.component';
import { CustomerAcctdetailsComponent } from './customer-acctdetails/customer-acctdetails.component';
import { CustomerAcctsComponent } from './customer-accts/customer-accts.component';
import { CustomerCategoriesComponent } from './customer-categories/customer-categories.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomersComponent } from './customers/customers.component';



const routes:any = [
  { path: '', redirectTo: 'accounts', pathMatch: 'full' },
  { path: 'accounts', component: CustomersListComponent, data: { breadcrumb: 'Customer List' } },
  { path: 'accountledger', component: CustomerAcctsComponent, data: { breadcrumb: 'Customer Accounts' } },
  { path: 'accountdetails/:dte1/:dte2/:id', component: CustomerAcctdetailsComponent, data: { breadcrumb: 'Customer Accounts' } },
  { path: 'accountdetails', component: CustomerAcctdetailsComponent, data: { breadcrumb: 'Customer Accounts' } },
  { path: 'accttypes', component: AccttypesComponent, data: { breadcrumb: 'Accounts Types' } },
  { path: 'custcats', component: CustomerCategoriesComponent, data: { breadcrumb: 'Customer Categories' } },
  { path: 'cities', component: CitiesComponent, data: { breadcrumb: 'Cities' } },
  { path: 'customer', component: CustomersComponent, data: { breadcrumb: 'Customer' } },

];
@NgModule({
  declarations: [
    CustomerAcctsComponent,
    CustomerAcctdetailsComponent,
    AccttypesComponent,
    CustomerCategoriesComponent,
    CitiesComponent, CustomersListComponent,
    CustomersComponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    NgxPrintModule,
    NgSelectModule,
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
