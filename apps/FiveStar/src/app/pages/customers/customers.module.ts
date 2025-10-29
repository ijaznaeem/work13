import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPrintModule } from 'ngx-print';
import { ComponentsModule } from '../components/components.module';
import { CustomerAcctsComponent } from './customer-accts/customer-accts.component';
import { CustomersComponent } from './customers/customers.component';


const routes:any = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', component: CustomersComponent, data: { breadcrumb: 'Customer List' } },
  { path: 'customeraccts', component: CustomerAcctsComponent, data: { breadcrumb: 'Customer Accounts' } },

];
@NgModule({
  declarations: [
    CustomersComponent,
    CustomerAcctsComponent,
  ],
  imports: [
    CommonModule,
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
