import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleReportComponent } from './sale-report/sale-report.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { DayBookComponent } from './day-book/day-book.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxPrintModule } from 'ngx-print';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { CashBookComponent } from './cash-book/cash-book.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { StockAcctsComponent } from './stock-accts/stock-accts.component';
import { FilterProductPipe } from '../../pipes/filter-product.pipe';
import { FormsModule } from '@angular/forms';
import { ProfitReportComponent } from "./profit-report/profit-report.component";
//import { ComponentsModule } from '../components/components.module';
import { SalesummaryComponent } from './sale-summary/sale-summary.component';
import { CreditlistComponent } from './credit-list/credit-list.component';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { ProfitByBillComponent } from './profit-bybill/profit-bybill.component';
import { StockUsedReportComponent } from './stock-used-report/stock-used-report.component';
import { ChickenSaleReportComponent } from './chicken-sale-report/chicken-sale-report.component';


const routes:any= [
  { path: '', redirectTo: 'daybook', pathMatch: 'full' },
  { path: 'daybook', component: DayBookComponent, data: { breadcrumb: 'Day Book' } },
  // { path: 'salesummay', component: SalesummaryComponent, data: { breadcrumb: 'Sale Summary' } },
  { path: 'salereport', component: ChickenSaleReportComponent, data: { breadcrumb: 'Chicken Sale Report' } },
  { path: 'purchasereport', component: PurchaseReportComponent, data: { breadcrumb: 'Purchase Report' } },
  { path: 'stockused', component: StockUsedReportComponent, data: { breadcrumb: 'Stock Used Report' } },
  { path: 'stockreport', component: StockReportComponent, data: { breadcrumb: 'Stock Report' } },
  { path: 'creditlist', component: CreditlistComponent, data: { breadcrumb: 'Credit Report' } },
  { path: 'expensereport', component: ExpenseReportComponent, data: { breadcrumb: 'Expense Report' } },
  { path: 'cashbook', component: CashBookComponent, data: { breadcrumb: 'Cash Book' } },
  { path: 'balancesheet', component: BalanceSheetComponent, data: { breadcrumb: 'Balance Sheet' } },
  { path: 'stockaccts', component: StockAcctsComponent, data: { breadcrumb: 'Stock Accts' } },
  { path: 'flockreport', component: ProfitReportComponent, data: { breadcrumb: 'Flock Report' } },
  { path: 'flockprofit', component: ProfitByBillComponent, data: { breadcrumb: 'Profit By Flock' } },


];
@NgModule({
  declarations: [
    SaleReportComponent,
    SalesummaryComponent,
    PurchaseReportComponent,
    ChickenSaleReportComponent,
    StockReportComponent,
    StockUsedReportComponent,
    ExpenseReportComponent,
    DayBookComponent,
    CashBookComponent,
    BalanceSheetComponent,
    StockAcctsComponent,
    FilterProductPipe,
    ProfitReportComponent,
    CreditlistComponent,
    ProfitByBillComponent
  ],

  imports: [
    CommonModule,
    FutureTechLibModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    DataTablesModule,
    NgxPrintModule,
    NgbModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ], providers: []
})
export class ReportsModule { }
