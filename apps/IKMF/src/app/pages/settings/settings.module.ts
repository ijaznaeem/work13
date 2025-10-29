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
import { ComponentsModule } from '../components/components.module';
import { ExpenseHeadsComponent } from './expense-heads/expense-heads.component';
import { GroupsComponent } from './usergroups/groups.component';

const routes: any = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'grouprights',
    component: GroupsComponent,
    data: { breadcrumb: 'Bisiness Details' },
  },

  {
    path: 'users',
    component: UsersListComponent,
    data: { breadcrumb: 'Users List' },
  },
  {
    path: 'expenseheads',
    component: ExpenseHeadsComponent,
    data: { breadcrumb: 'Users List' },
  },
];

@NgModule({
  declarations: [UsersListComponent, GroupsComponent, ExpenseHeadsComponent],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    NgbModule,
    GridAllModule,
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
