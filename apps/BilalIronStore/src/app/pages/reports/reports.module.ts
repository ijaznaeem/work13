import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DataTablesModule } from 'angular-datatables';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPrintModule } from 'ngx-print';
import { FilterProductPipe } from '../../pipes/filter-product.pipe';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { BillSummaryComponent } from './bill-summary/bill-summary.component';
import { CashBookComponent } from './cash-book/cash-book.component';
import { CloseAccountComponent } from './close-account/close-account.component';
import { DayBookComponent } from './day-book/day-book.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { ProfitReportComponent } from "./profit-report/profit-report.component";
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { RecoveryReportComponent } from './recovery-report/recovery-report.component';
import { SaleReportComponent } from './sale-report/sale-report.component';
import { StockAcctsComponent } from './stock-accts/stock-accts.component';
import { StockReportComponent } from './stock-report/stock-report.component';
//import { ComponentsModule } from '../components/components.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { AuditReportComponent } from './audit-report/audit-report.component';
import { CreditlistComponent } from './credit-list/credit-list.component';
import { DeliveryReportComponent } from './delivery-report/delivery-report.component';
import { GatepassReportComponent } from './gatepass-report/gatepass-report.component';
import { LabourReportComponent } from './labour-report/labour-report.component';
import { OrderReportComponent } from './order-report/order-report.component';
import { ProfitByBillComponent } from './profit-bybill/profit-bybill.component';
import { PurchaseBystoreComponent } from './purchase-bystore/purchase-bystore.component';
import { PurchaseLedgerComponent } from './purchase-ledger/purchase-ledger.component';
import { PurchasesummaryComponent } from './purchse-summary/purchase-summary.component';
import { SaleLedgerComponent } from './sale-ledger/sale-ledger.component';
import { SalesummaryComponent } from './sale-summary/sale-summary.component';
import { StockByDateComponent } from './stock-bydate/stock-bydate.component';
import { TransferReportComponent } from './transfer-report/transfer-report.component';


const routes:any= [
  { path: '', redirectTo: 'daybook', pathMatch: 'full' },
  { path: 'daybook', component: DayBookComponent, data: { breadcrumb: 'Day Book' } },
  { path: 'salesummay', component: SalesummaryComponent, data: { breadcrumb: 'Sale Summary' } },
  { path: 'purchasesummay', component: PurchasesummaryComponent, data: { breadcrumb: 'Purchase Summary' } },
  { path: 'salereport', component: SaleReportComponent, data: { breadcrumb: 'Sale Report' } },
  { path: 'orderreport', component: OrderReportComponent, data: { breadcrumb: 'Order Report' } },
  { path: 'labourreport', component: LabourReportComponent, data: { breadcrumb: 'Labour Report' } },
  { path: 'delivery-report', component: DeliveryReportComponent, data: { breadcrumb: 'Delivery Report' } },
  { path: 'purchasereport', component: PurchaseReportComponent, data: { breadcrumb: 'Purchase Report' } },
  { path: 'stockreport', component: StockReportComponent, data: { breadcrumb: 'Stock Report' } },
  { path: 'stock-transfer', component: TransferReportComponent, data: { breadcrumb: ' Transfer Report' } },
  { path: 'creditlist', component: CreditlistComponent, data: { breadcrumb: 'Credit Report' } },
  { path: 'expensereport', component: ExpenseReportComponent, data: { breadcrumb: 'Expense Report' } },
  { path: 'closeaccount', component: CloseAccountComponent, data: { breadcrumb: 'Close Account' } },
  { path: 'recoverysheet', component: BillSummaryComponent, data: { breadcrumb: 'Recovery Sheet' } },
  { path: 'cashbook', component: CashBookComponent, data: { breadcrumb: 'Cash Book' } },
  { path: 'balancesheet', component: BalanceSheetComponent, data: { breadcrumb: 'Balance Sheet' } },
  { path: 'stockaccts', component: StockAcctsComponent, data: { breadcrumb: 'Stock Accts' } },
  { path: 'profit', component: ProfitReportComponent, data: { breadcrumb: 'Profit Report' } },
  { path: 'profitbybill', component: ProfitByBillComponent, data: { breadcrumb: 'Profit By Bill' } },
  { path: 'sale-ledger', component: SaleLedgerComponent, data: { breadcrumb: 'Sale Ledger' } },
  { path: 'purchase-ledger', component: PurchaseLedgerComponent, data: { breadcrumb: 'Purchase Ledger' } },
  { path: 'purchase-bystore', component: PurchaseBystoreComponent, data: { breadcrumb: 'Purchase Ledger' } },
  { path: 'stock-bydate', component: StockByDateComponent, data: { breadcrumb: 'Stock By Date' } },
  { path: 'audit-report', component:AuditReportComponent  , data: { breadcrumb: 'Audit Report' } },


];
@NgModule({
  declarations: [
    SaleReportComponent,
    OrderReportComponent,
    GatepassReportComponent,
    SalesummaryComponent,
    PurchaseReportComponent,
    StockReportComponent,
    RecoveryReportComponent,
    ExpenseReportComponent,
    CloseAccountComponent,
    BillSummaryComponent,
    AuditReportComponent,
    DayBookComponent,
    CashBookComponent,
    BalanceSheetComponent,
    StockAcctsComponent,
    FilterProductPipe,
    ProfitReportComponent,
    CreditlistComponent,
    SaleLedgerComponent,
    ProfitByBillComponent,
    TransferReportComponent,
    LabourReportComponent,
    DeliveryReportComponent,
    PurchaseLedgerComponent,
    PurchasesummaryComponent,
    PurchaseBystoreComponent,
    StockByDateComponent,
  ],

  imports: [
    CommonModule,
    FutureTechLibModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    DataTablesModule,
    NgxPrintModule,
    NgSelectModule,
    NgbModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ], providers: []
})
export class ReportsModule { }
