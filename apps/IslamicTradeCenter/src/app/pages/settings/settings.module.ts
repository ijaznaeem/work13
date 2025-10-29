import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ComboBoxAllModule,
  DropDownListAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { UsersListComponent } from './users-list/users-list.component';

import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QuillModule } from 'ngx-quill';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { BillingTitlesComponent } from './billing-titles/billing-titles.component';
import { CompanyCatsComponent } from './company-cats/company-cats.component';
import { DeptsComponent } from './depts/depts.component';
import { ExpenseheadComponent } from './expensehead/expensehead.component';
import { RoutesComponent } from './routes/routes.component';
import { SalesmanComponent } from './salesman/salesman.component';
import { SalesmasRoutesComponent } from './salesmanroutes/salesmanroutes.component';
import { SetupsComponent } from './setups/setups.component';
import { StoresComponent } from './stores/stores.component';
import { GroupsComponent } from './usergroups/groups.component';
import { InvoiceTypesComponent } from './warranties/invoice-types.component';

const routes: any = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'routes',
    component: RoutesComponent,
    data: { breadcrumb: 'Route List' },
  },
  {
    path: 'salesman',
    component: SalesmanComponent,
    data: { breadcrumb: 'Salesman List' },
  },
  {
    path: 'smroutes',
    component: SalesmasRoutesComponent,
    data: { breadcrumb: 'Salesman Routes' },
  },
  {
    path: 'warranties',
    component: InvoiceTypesComponent,
    data: { breadcrumb: 'Warranties Setting' },
  },
  {
    path: 'business',
    component: SetupsComponent,
    data: { breadcrumb: 'Bisiness Details' },
  },
  {
    path: 'grouprights',
    component: GroupsComponent,
    data: { breadcrumb: 'Bisiness Details' },
  },
  {
    path: 'expheads',
    component: ExpenseheadComponent,
    data: { breadcrumb: 'Expense Heads' },
  },
  {
    path: 'billing-titles',
    component: BillingTitlesComponent,
    data: { breadcrumb: 'Expense Heads' },
  },
  {
    path: 'comp-cats',
    component: CompanyCatsComponent,
    data: { breadcrumb: 'Company Cats' },
  },
  // {
  //   path: 'dataentry',
  //   component: DataentryComponent,
  //   data: { breadcrumb: 'Data Entry' },
  // },
];

@NgModule({
  declarations: [
    DeptsComponent,
    GroupsComponent,
    UsersListComponent,
    StoresComponent,
    InvoiceTypesComponent,
    BillingTitlesComponent,
    SetupsComponent,
    RoutesComponent,
    SalesmanComponent,
    ExpenseheadComponent,
    SalesmasRoutesComponent,
    CompanyCatsComponent
  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    DropDownListAllModule,
    // ComponentsModule,
    NgbModule,
    GridAllModule ,
    TabsModule,
    ReactiveFormsModule,
    TreeViewModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
    QuillModule.forRoot(),
  ],
})
export class SettingsModule {}
