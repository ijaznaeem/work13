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

import { ExpenseheadComponent } from './expensehead/expensehead.component';
import { SetupsComponent } from './setups/setups.component';
import { UnitsComponent } from './units/units.component';
import { GroupsComponent } from './usergroups/groups.component';

const routes: any = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  {
    path: 'users',
    component: UsersListComponent,
    data: { breadcrumb: 'Users List' },
  },
  {
    path: 'units',
    component: UnitsComponent,
    data: { breadcrumb: 'Units List' },
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
  // {
  //   path: 'dataentry',
  //   component: DataentryComponent,
  //   data: { breadcrumb: 'Data Entry' },
  // },
];

@NgModule({
  declarations: [
    GroupsComponent,
    UsersListComponent,
    UnitsComponent,
    SetupsComponent,
    ExpenseheadComponent,
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
