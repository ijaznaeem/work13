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
import { OrdersListComponent } from './sale-order/orders-list/orders-list.component';
import { SaleOrderComponent } from './sale-order/sale-order-add/sale-order.component';
import { SearchStockComponent } from './search-stock/search-stock.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { SaleAddComponent } from './sugar-sale/sale-add/sale-add.component';
import { SalesComponent } from './sugar-sale/sales/sales.component';
import { InvoicesComponent } from './trolla-sale/invoices/invoices.component';
import { SaleInvoiceComponent } from './trolla-sale/sale-invoice/sale-invoice.component';

const routes: any = [
  { path: '', redirectTo: 'sales', pathMatch: 'full' },

  {
    path: 'add',
    component: SaleAddComponent,
    data: { breadcrumb: 'Sale' },
  },
  {
    path: 'add/:EditID',
    component: SaleAddComponent,
    data: { breadcrumb: 'Sale' },
  },
  {
    path: 'sales',
    component: SalesComponent,
    data: { breadcrumb: 'Sale' },
  },
  {
    path: 'invoices',
    component: InvoicesComponent,
    data: { breadcrumb: 'Sale' },
  },
  {
    path: 'invoice',
    component: SaleInvoiceComponent,
    data: { breadcrumb: 'Sale' },
  },

  {
    path: 'transfer',
    component: StockTransferComponent,
    data: { breadcrumb: 'Stock Transfer' },
  },
  {
    path: 'transfer/:EditID',
    component: StockTransferComponent,
    data: { breadcrumb: 'Stock Transfer' },
  },
  {
    path: 'orders-list',
    component: OrdersListComponent,
    data: { breadcrumb: 'Sale Orders' },
  },
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
];

@NgModule({
  declarations: [
    SaleInvoiceComponent,
    SearchStockComponent,
    StockTransferComponent,
    TabDirective,
    SaleOrderComponent,
    SalesComponent,
    SaleAddComponent,
    InvoicesComponent,
    OrdersListComponent,
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
