import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SendSMSService } from '../../services/sms.service';
import { MyToastService } from '../../services/toaster.server';
import { ComponentsModule } from '../components/components.module';
import { UsersListComponent } from '../settings/users-list/users-list.component';
import { BispComponent } from './bisp/bisp.component';
import { ContactsComponent } from './contacts/contacts.component';
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
    NgxDatatableModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  providers: [
    MyToastService,
    SendSMSService
  ]
})
export class DataModule { }
