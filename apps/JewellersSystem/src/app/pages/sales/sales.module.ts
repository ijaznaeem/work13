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
import { AdvancePaidComponent } from './advance-paid/advance-paid.component';
import { AdvanceReceivedComponent } from './advance-recieved/advance-received.component';
import { CashPaidComponent } from './cash-paid/cash-paid.component';
import { CashReceiptComponent } from './cash-receipt/cash-receipt.component';
import { ChandiTransactionComponent } from './chandi-transaction/chandi-transaction.component';
import { GoldConvertComponent } from './gold-convert/gold-convert.component';
import { GoldTransactionComponent } from './gold-transaction/gold-transaction.component';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SearchStockComponent } from './search-stock/search-stock.component';
import { WagesPaidComponent } from './wages-paid/wages-paid.component';

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
    component: SaleInvoiceComponent,
    data: { breadcrumb: 'Sale Invoice' },
  },
  {
    path: 'invoice/:EditID',
    component: SaleInvoiceComponent,
    data: { breadcrumb: 'Sale Invoice' },
  },

  {
    path: 'gold',
    component: GoldTransactionComponent,
    data: { breadcrumb: 'Gold Transaction' },
  },
  {
    path: 'gold/:EditID',
    component: GoldTransactionComponent,
    data: { breadcrumb: 'Gold Transaction' },
  },
  {
    path: 'chandi',
    component: ChandiTransactionComponent,
    data: { breadcrumb: 'Chandi Transaction' },
  },
  {
    path: 'chandi/:EditID',
    component: ChandiTransactionComponent,
    data: { breadcrumb: 'Chandi Transaction' },
  },
  {
    path: 'goldconvert',
    component: GoldConvertComponent,
    data: { breadcrumb: 'Gold Convert' },
  },
  {
    path: 'goldconvert/:EditID',
    component: GoldConvertComponent,
    data: { breadcrumb: 'Gold Convert' },
  },
  {
    path: 'cash-receipt',
    component: CashReceiptComponent,
    data: { breadcrumb: 'Cash Receipt' },
  },
  {
    path: 'cash-receipt/:EditID',
    component: CashReceiptComponent,
    data: { breadcrumb: 'Cash Receipt' },
  },
  {
    path: 'cash-paid',
    component: CashPaidComponent,
    data: { breadcrumb: 'Cash Paid' },
  },
  {
    path: 'cash-paid/:EditID',
    component: CashPaidComponent,
    data: { breadcrumb: 'Cash Paid' },
  },
  {
    path: 'wages-paid',
    component: WagesPaidComponent,
    data: { breadcrumb: 'Cash Paid' },
  },
  {
    path: 'wages-paid/:EditID',
    component: WagesPaidComponent,
    data: { breadcrumb: 'Cash Paid' },
  },
  {
    path: 'advance-paid',
    component: AdvancePaidComponent,
    data: { breadcrumb: 'Advance Paid' },
  },
  {
    path: 'advance-paid/:EditID',
    component: AdvancePaidComponent,
    data: { breadcrumb: 'Advance Paid' },
  },
  {
    path: 'advance-receipt',
    component: AdvanceReceivedComponent,
    data: { breadcrumb: 'Advance Receipt' },
  },
  {
    path: 'advance-receipt/:EditID',
    component: AdvanceReceivedComponent,
    data: { breadcrumb: 'Advance Received' },
  },

];

@NgModule({
  declarations: [
    SearchStockComponent,
    SaleOrderComponent,
    SaleInvoiceComponent,
    GoldTransactionComponent,
    ChandiTransactionComponent,
    GoldConvertComponent,
    CashReceiptComponent, CashPaidComponent,
    WagesPaidComponent,
    AdvancePaidComponent,
    AdvanceReceivedComponent

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
