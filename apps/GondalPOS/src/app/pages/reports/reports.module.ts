import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleReportComponent } from './sale-report/sale-report.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { SaleSummryComponent } from './sale-summry/sale-summry.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { DayBookComponent } from './day-book/day-book.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxPrintModule } from 'ngx-print';
import { RecoveryReportComponent } from './recovery-report/recovery-report.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { CloseAccountComponent } from './close-account/close-account.component';
import { BillSummaryComponent } from './bill-summary/bill-summary.component';
import { CashBookComponent } from './cash-book/cash-book.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { StockSMComponent } from './stock-sm/stock-sm.component';
import { StockAcctsComponent } from './stock-accts/stock-accts.component';
import { FilterProductPipe } from '../../pipes/filter-product.pipe';
import {QuotationReportComponent} from '../reports/quotation-report/quotation-report.component';
// import { FutureTechLibModule } from 'projects/future-tech-lib';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';

import { FormsModule } from '@angular/forms';
import { ProfitReportComponent } from "./profit-report/profit-report.component";
import { FrenchiserReportComponent } from './frenchiser-report/frenchiser-report.component';
import { ExpReportComponent } from './expreport/expreport.component';
import { TaxReportComponent } from './tax-report/tax-report.component';



const routes:any = [
  { path: '', redirectTo: 'daybook', pathMatch: 'full' },
  { path: 'daybook', component: DayBookComponent, data: { breadcrumb: 'Day Book' } },
  { path: 'salereport', component: SaleReportComponent, data: { breadcrumb: 'Sale Report' } },
  { path: 'salesumry', component: SaleSummryComponent, data: { breadcrumb: 'Sale Summary' } },
  { path: 'purchasereport', component: PurchaseReportComponent, data: { breadcrumb: 'Purchase Report' } },
  { path: 'stockreport', component: StockReportComponent, data: { breadcrumb: 'Stock Report' } },
  { path: 'stocksm', component: StockSMComponent, data: { breadcrumb: 'Stock Salesman' } },
  { path: 'creditreport', component: RecoveryReportComponent, data: { breadcrumb: 'Credit Report' } },
  { path: 'expensereport', component: ExpenseReportComponent, data: { breadcrumb: 'Expense Report' } },
  { path: 'closeaccount', component: CloseAccountComponent, data: { breadcrumb: 'Close Account' } },
  { path: 'recoverysheet', component: BillSummaryComponent, data: { breadcrumb: 'Recovery Sheet' } },
  { path: 'cashbook', component: CashBookComponent, data: { breadcrumb: 'Cash Book' } },
  { path: 'balancesheet', component: BalanceSheetComponent, data: { breadcrumb: 'Balance Sheet' } },
  { path: 'stockaccts', component: StockAcctsComponent, data: { breadcrumb: 'Stock Accts' } },
  { path: 'profit', component: ProfitReportComponent, data: { breadcrumb: 'Profit Report' } },
  { path: 'frenchiser', component: FrenchiserReportComponent, data: { breadcrumb: 'Frenchiser Report' } },
  { path: 'expreport', component: ExpReportComponent, data: { breadcrumb: 'Frenchiser Report' } },
 { path: 'quotationreport', component: QuotationReportComponent, data: { breadcrumb: 'Quotation Report' } },
 { path: 'taxreport', component: TaxReportComponent, data: { breadcrumb: 'Tax Report' } },

];
@NgModule({
  declarations: [
    SaleReportComponent,
    PurchaseReportComponent,
    SaleSummryComponent,
    StockReportComponent,
    RecoveryReportComponent,
    QuotationReportComponent,
    ExpenseReportComponent,
    TaxReportComponent,
    
    StockSMComponent,
    CloseAccountComponent, BillSummaryComponent,
    DayBookComponent,
    ExpReportComponent,
    CashBookComponent,
    BalanceSheetComponent,
    StockAcctsComponent,
    FilterProductPipe,
    ProfitReportComponent, FrenchiserReportComponent
  ],

  imports: [
    CommonModule,
    DirectivesModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    GridModule,
    DataTablesModule,
    NgxPrintModule,
    FutureTechLibModule,
    
    NgbModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ], providers: []
})
export class ReportsModule { }
