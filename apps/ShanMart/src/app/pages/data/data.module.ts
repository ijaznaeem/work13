import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { ContactsComponent } from './contacts/contacts.component';
import { BispComponent } from './bisp/bisp.component';
import { UsersListComponent } from './users-list/users-list.component';
import { SendsmsComponent } from './sendsms/sendsms.component';


const routes:any = [
  { path: '', redirectTo: 'contacts', pathMatch: 'full' },
  { path: 'contacts', component: ContactsComponent, data: { breadcrumb: 'Contacts List' } },
  { path: 'bisp', component: BispComponent, data: { breadcrumb: 'Contacts List' } },
  { path: 'users', component: UsersListComponent, data: { breadcrumb: 'Users List' } },

];
@NgModule({
  declarations: [
  ContactsComponent,
  SendsmsComponent,
  BispComponent, UsersListComponent
  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    ComponentsModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class DataModule { }
