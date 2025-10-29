import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule, ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { ComponentsModule } from '../components/components.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { StockReceiveComponent } from './stockr-receive/stock-receive.component';
// import { FutureTechLibModule } from 'projects/future-tech-lib/src/public-api';

const routes: any = [
  { path: '', redirectTo: 'purchase', pathMatch: 'full' },
  {
    path: 'invoice',
    component: PurchaseComponent,
    data: { breadcrumb: 'Purchase' },
  },
  {
    path: 'invoice/:EditID',
    component: PurchaseComponent,
    data: { breadcrumb: 'Purchase Edit' },
  },
  {
    path: 'return',
    component: PurchaseReturnComponent,
    data: { breadcrumb: 'Purchase Return' },
  },
  {
    path: 'return/:EditID',
    component: PurchaseReturnComponent,
    data: { breadcrumb: 'Purchase Return Edit' },
  },
  {
    path: 'stock-receive',
    component: StockReceiveComponent,
    data: { breadcrumb: 'Stock Receive' },
  },
];

@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseReturnComponent,
    PurchaseInvoiceComponent,
    StockReceiveComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule ,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class PurchaseModule {}
