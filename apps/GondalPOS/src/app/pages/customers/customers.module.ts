import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAcctsComponent } from './customer-accts/customer-accts.component';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { CustomersComponent } from './customers/customers.component';
import { NgxPrintModule } from 'ngx-print';


const routes:any = [
  { path: '', redirectTo: 'custoemerslist', pathMatch: 'full' },
  { path: 'custoemerslist', component: CustomersComponent, data: { breadcrumb: 'Customer List' } },
  { path: 'customeraccts', component: CustomerAcctsComponent, data: { breadcrumb: 'Customer Accounts' } },

];
@NgModule({
  declarations: [
    CustomersComponent,
    CustomerAcctsComponent,
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    ComponentsModule,
    NgxPrintModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class CustomersModule { }
