import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ComboBoxAllModule,
  DropDownListAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ComponentsModule } from '../components/components.module';
import { AddUserComponent } from './adduser/adduser.component';
import { DeptsComponent } from './depts/depts.component';
import { DesignationsComponent } from './designations/designation.component';
import { EmployeeDocumentsComponent } from './documents/employee-documents.component';
import { EmployeeExperienceComponent } from './experience/employee-experience.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UsergroupsComponent } from './usergroups/usergroups.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes :any= [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: UsersListComponent, data: { breadcrumb: 'Users List' } },
  { path: 'groups', component: UsergroupsComponent, data: { breadcrumb: 'Groups and Rights' } },
  { path: 'designations', component: DesignationsComponent, data: { breadcrumb: 'Manage Packages' } },
  { path: 'depts', component: DeptsComponent, data: { breadcrumb: 'Manage Departments' } },
  { path: 'users', component: UsersListComponent, data: { breadcrumb: 'Users' } },
  { path: 'profile', component: UserSettingsComponent, data: { breadcrumb: 'Settings' } },
];

@NgModule({
  declarations: [
    DeptsComponent,
    UsergroupsComponent,
    UsersListComponent,
    AddUserComponent,
    DesignationsComponent,
    EmployeeDocumentsComponent,
    EmployeeExperienceComponent,
    UserSettingsComponent

  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    NgSelectModule,
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
