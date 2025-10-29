import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomerpayComponent } from './customerpay/customerpay.component';
import { RecieptsComponent } from './reciepts/reciepts.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { VoucherListComponent } from './voucherlist/voucherlist.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';


export const routes:any = [
  { path: '', redirectTo: 'add', pathMatch: 'full' },
  { path: 'customerpay', component: CustomerpayComponent, data: { breadcrumb: 'Payments' } },
  { path: 'Reciepts', component: RecieptsComponent, data: { breadcrumb: 'Reciepts' } },
  { path: 'voucherlist', component: VoucherListComponent, data: { breadcrumb: 'Voucher List' } },
  { path: 'customerpay/:editID', component: CustomerpayComponent, data: { breadcrumb: 'Edit In Payments' } },
  { path: 'Reciepts/:editID', component: RecieptsComponent, data: { breadcrumb: 'Edit In Reciepts' } },

];

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    FormsModule, ReactiveFormsModule,

    RouterModule.forChild(routes),

    NgbModule,  ComboBoxModule, ModalModule
  ], exports: [

  ],

  declarations: [
    CustomerpayComponent,
    RecieptsComponent,
    VoucherListComponent

  ]
})
export class PaymentsModule { }
