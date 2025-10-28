import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { TabDirective } from '../../services/tab.directive';
import { PendingInvoiceComponent } from './pending-invoice/pending-invoice.component';
import { CashSaleComponent } from './sale-invoice/sale-invoice.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SearchStockComponent } from './search-stock/search-stock.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';

const routes: any = [
  { path: '', redirectTo: 'invoice', pathMatch: 'full' },

  {
    path: 'order',
    component: SaleOrderComponent,
    data: { breadcrumb: 'Sale Order' },
  },
  {
    path: 'order/:EditID',
    component: SaleOrderComponent,
    data: { breadcrumb: 'Sale Order' },
  },
  {
    path: 'invoice',
    component: CashSaleComponent,
    data: { breadcrumb: 'Sale' },
  },
  {
    path: 'invoice/:EditID',
    component: CashSaleComponent,
    data: { breadcrumb: 'Sale' },
  },

  {
    path: 'pending',
    component: PendingInvoiceComponent,
    data: { breadcrumb: 'Pedning Stock' },
  },
  {
    path: 'pending/:EditID',
    component: PendingInvoiceComponent,
    data: { breadcrumb: 'Pedning Stock' },
  },
];

@NgModule({
  declarations: [
    CashSaleComponent,
    SearchStockComponent,
    StockTransferComponent,
    TabDirective,
    PendingInvoiceComponent,
    SaleOrderComponent,
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    // BrowserAnimationsModule,
    TabsModule,
    NgxSpinnerModule,
    NgbAlertModule,
    FutureTechLibModule,
    // ComponentsModule,
    NgxSpinnerModule,
    NgSelectModule,
    FutureTechLibModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class SalesModule {}
