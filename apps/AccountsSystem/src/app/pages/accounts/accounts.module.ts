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
import { AccountCategoriesComponent } from './account-categories/account-categories.component';
import { AccountChartComponent } from './account-chart/account-chart.component';
import { AccountTypesComponent } from './account-types/account-types.component';
import { AccountsComponent } from './accounts/accounts.component';


const routes:any = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: AccountsComponent, data: { breadcrumb: 'Contacts List' } },
  { path: 'categories', component: AccountCategoriesComponent, data: { breadcrumb: 'Contacts List' } },
  { path: 'accountchart', component: AccountChartComponent, data: { breadcrumb: 'Char of Account' } },
  { path: 'types', component: AccountTypesComponent, data: { breadcrumb: 'Char of Account' } },

];
@NgModule({
  declarations: [
    AccountsComponent,
    AccountCategoriesComponent,
    AccountChartComponent,
    AccountTypesComponent
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
export class AccountsModule { }
