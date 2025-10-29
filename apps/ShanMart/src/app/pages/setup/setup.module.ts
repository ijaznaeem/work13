import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UnitsComponent } from './units/units.component';
import { CashTypesComponent } from './cashtypes/cashtypes.component';
import { AcctTypesComponent } from './accttypes/accttypes.component';
import { SalesmanComponent } from './salemans/salemans.component';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { ComponentsModule } from '../components/components.module';
import { CustomersComponent } from './customers/customers.component';
import { UsersComponent } from './users/users.component';
import { AccountProfileComponent } from './accountprofile/accountprofile.component';

export const routes: any = [
  { path: '', redirectTo: 'units', pathMatch: 'full' },
  { path: 'units', component: UnitsComponent, data: { breadcrumb: 'Units' } },
  { path: 'customers', component: CustomersComponent, data: { breadcrumb: 'Units' } },
  {
    path: 'cashtypes',
    component: CashTypesComponent,
    data: { breadcrumb: 'Cash Types' },
  },
  {
    path: 'acctypes',
    component: AcctTypesComponent,
    data: { breadcrumb: 'Acct Types' },
  },
  {
    path: 'salesman',
    component: SalesmanComponent,
    data: { breadcrumb: 'Sales Man' },
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { breadcrumb: 'Users List' },
  },
  {
    path: 'profile',
    component: AccountProfileComponent,
    data: { breadcrumb: 'Users Profile' },
  },
];

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    UnitsComponent,
    CashTypesComponent,
    AcctTypesComponent,
    SalesmanComponent,
    CustomersComponent,
    UsersComponent,
    AccountProfileComponent
  ],
})
export class SetupModule {}
