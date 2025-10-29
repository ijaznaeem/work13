import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
// import { ComponentsModule } from '../components/components.module';
// import { FutureTechLibModule } from 'projects/future-tech-lib/src/public-api';
import { NgSelectModule } from '@ng-select/ng-select';
import { StockTransferComponent } from './stock-tranfser/stock-transfer.component';


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
    path: 'transfer',
    component: StockTransferComponent,
    data: { breadcrumb: 'Stock Transfer' },
  },
  {
    path: 'transfer/:EditID',
    component: StockTransferComponent,
    data: { breadcrumb: 'Stock Transfer Edit' },
  },
];

@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseReturnComponent,
    PurchaseInvoiceComponent,
    StockTransferComponent
  ],
  imports: [
    CommonModule,
    // ComponentsModule,
    FutureTechLibModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class PurchaseModule {}
