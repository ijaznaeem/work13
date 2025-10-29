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

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QuillModule } from 'ngx-quill';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { DeptsComponent } from './depts/depts.component';
import { FlocksComponent } from './flocks/flocks.component';
import { SalesmanComponent } from './salesman/salesman.component';
import { SetupsComponent } from './setups/setups.component';
import { GroupsComponent } from './usergroups/groups.component';



const routes: any = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'flock', component: FlocksComponent, data: { breadcrumb: 'Route List' }, },
  { path: 'grouprights', component: GroupsComponent, data: { breadcrumb: 'Bisiness Details' }, },
  { path: 'users', component: UsersListComponent, data: { breadcrumb: 'Expense Heads' }, },
  { path: 'sheds', component: SetupsComponent, data: { breadcrumb: 'Expense Heads' }, },

];

@NgModule({
  declarations: [
    DeptsComponent,
    GroupsComponent,
    UsersListComponent,
    SetupsComponent,
    FlocksComponent, SalesmanComponent,

  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    DropDownListAllModule,
    // ComponentsModule,
    NgbModule,
    TabsModule,
    ReactiveFormsModule,
    TreeViewModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
    QuillModule.forRoot(),
  ],
})
export class SettingsModule { }
