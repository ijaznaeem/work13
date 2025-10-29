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
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../components/components.module';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UsergroupsComponent } from './usergroups/usergroups.component';
import { DeptsComponent } from './depts/depts.component';
import { AddUserComponent } from './adduser/adduser.component';
import { DesignationsComponent } from './designations/designation.component';
import { EmployeeDocumentsComponent } from './documents/employee-documents.component';
import { EmployeeExperienceComponent } from './experience/employee-experience.component';

const routes: any = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: UsersListComponent, data: { breadcrumb: 'Users List' }, },
  {
    path: 'groups',
    component: UsergroupsComponent,
    data: { breadcrumb: 'Groups and Rights' },
  },
  { path: 'designations', component: DesignationsComponent, data: { breadcrumb: 'Manage Packages' }, },
  { path: 'depts', component: DeptsComponent, data: { breadcrumb: 'Manage Departments' }, },
 
   {
    path: 'users',
    component: UsersListComponent,
    data: { breadcrumb: 'Users' },
  },
  

];

@NgModule({
  declarations: [
    DeptsComponent,
    UsergroupsComponent,
    UsersListComponent,
    AddUserComponent,
    DesignationsComponent,
    EmployeeDocumentsComponent,
    EmployeeExperienceComponent

  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    NgbModule,
    TabsModule,
    TreeViewModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class EmployeesModule { }
