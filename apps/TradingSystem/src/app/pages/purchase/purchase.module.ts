import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { PurchaseComponent } from './purchase/purchase.component';
// import { FutureTechLibModule } from 'projects/future-tech-lib/src/public-api';

const routes: any = [
  { path: '', redirectTo: 'purchase', pathMatch: 'full' },
  {
    path: 'invoice',
    component: PurchaseInvoiceComponent,
    data: { breadcrumb: 'Purchase' },
  },
  {
    path: 'invoice/:EditID',
    component: PurchaseInvoiceComponent,
    data: { breadcrumb: 'Purchase Edit' },
  },
  {
    path: 'order/:EditID',
    component: PurchaseOrderComponent,
    data: { breadcrumb: 'Purchase Edit' },
  },
  {
    path: 'order',
    component: PurchaseOrderComponent,
    data: { breadcrumb: 'Purchase Edit' },
  },

];

@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseReturnComponent,
    PurchaseInvoiceComponent,
    PurchaseOrderComponent,

  ],
  imports: [
    CommonModule,
    FutureTechLibModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgbModule,
    BsDatepickerModule,
    ReactiveFormsModule,
    NgSelectModule ,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class PurchaseModule {}
