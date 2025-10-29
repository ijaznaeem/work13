import { UsersListComponent } from './users-list/users-list.component';
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

import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../components/components.module';
import { DeptsComponent } from './depts/depts.component';
import { StoresComponent } from './stores/stores.component';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { SetupsComponent } from './setups/setups.component';
import { RoutesComponent } from './routes/routes.component';
import { SalesmanComponent } from './salesman/salesman.component';
import { WarrantiesComponent } from './warranties/warranties.component';
import { GroupsComponent } from './usergroups/groups.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ExpenseheadComponent } from './expensehead/expensehead.component';

const routes: any = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'salesman', component: SalesmanComponent, data: { breadcrumb: 'Salesman List' }, },
  { path: 'expheads', component: ExpenseheadComponent, data: { breadcrumb: 'Expense Heads' }, },
  { path: 'grouprights', component: GroupsComponent, data: { breadcrumb: 'User Groups k u' }, },
  { path: 'users', component: UsersListComponent, data: { breadcrumb: 'Users List' }, },

];

@NgModule({
  declarations: [
    DeptsComponent,
    GroupsComponent,
    UsersListComponent,
    ExpenseheadComponent,
    StoresComponent,WarrantiesComponent,
    SetupsComponent, RoutesComponent, SalesmanComponent

  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    DropDownListAllModule,
    ComponentsModule,
    NgbModule,
    TabsModule,
    ReactiveFormsModule,
    TreeViewModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class SettingsModule { }
