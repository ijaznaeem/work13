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
import { UsersListComponent } from './users-list/users-list.component';


const routes:any = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersListComponent, data: { breadcrumb: 'Contacts List' } },

];
@NgModule({
  declarations: [
    UsersListComponent],
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
export class SettingsModule { }
