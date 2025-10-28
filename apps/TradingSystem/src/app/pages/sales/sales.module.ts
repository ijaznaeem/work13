import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { CashSaleComponent } from './cash-sale/cash-sale.component';
import { CommodityVoucherComponent } from './commodity-voucher/commodity-voucher.component';
import { CreditSaleComponent } from './credit-sale/credit-sale.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SearchStockComponent } from './search-stock/search-stock.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { TradingSaleComponent } from './trading-sale/trading-sale.component';

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
    path: 'credit',
    component: CreditSaleComponent,
    data: { breadcrumb: 'Sale Invoice' },
  },
  {
    path: 'credit/:EditID',
    component: CreditSaleComponent,
    data: { breadcrumb: 'Sale Invoice' },
  },
  {
    path: 'cash',
    component: CashSaleComponent,
    data: { breadcrumb: 'Cash Sale' },
  },
  {
    path: 'cash/:EditID',
    component: CashSaleComponent,
    data: { breadcrumb: 'Cash Sale' },
  },
  {
    path: 'trading',
    component: TradingSaleComponent,
    data: { breadcrumb: 'Stock Transfer' },
  },
  {
    path: 'trading/:EditID',
    component: TradingSaleComponent,
    data: { breadcrumb: 'Stock Transfer' },
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
    path: 'commodity',
    component: CommodityVoucherComponent,
    data: { breadcrumb: 'Commodity Voucher' },
  },
  {
    path: 'commodity/:EditID',
    component: CommodityVoucherComponent,
    data: { breadcrumb: 'Commodity Voucher' },
  },

];

@NgModule({
  declarations: [
    CreditSaleComponent,
    SearchStockComponent,
    StockTransferComponent,
    SaleOrderComponent,
    CashSaleComponent,
    TradingSaleComponent,
    CommodityVoucherComponent,

  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    // BrowserAnimationsModule,
    TabsModule,
    NgxSpinnerModule,
    BsDatepickerModule,

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
