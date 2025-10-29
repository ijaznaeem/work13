import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComboBoxAllModule } from "@syncfusion/ej2-angular-dropdowns";
import { GridModule } from "@syncfusion/ej2-angular-grids";
import { DataTablesModule } from "angular-datatables";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ModalModule } from "ngx-bootstrap/modal";
import { NgxPrintModule } from "ngx-print";
import { FilterProductPipe } from "../../pipes/filter-product.pipe";
import { BalanceSheetComponent } from "./balance-sheet/balance-sheet.component";
import { BillSummaryComponent } from "./bill-summary/bill-summary.component";
import { CloseAccountComponent } from "./close-account/close-account.component";
import { DayBookComponent } from "./day-book/day-book.component";
import { ExpenseReportComponent } from "./expense-report/expense-report.component";
import { PurchaseReportComponent } from "./purchase-report/purchase-report.component";
import { RecoveryReportComponent } from "./recovery-report/recovery-report.component";
import { SaleReportComponent } from "./sale-report/sale-report.component";
import { SaleSummryComponent } from "./sale-summry/sale-summry.component";
import { StockAcctsComponent } from "./stock-accts/stock-accts.component";
import { StockReportComponent } from "./stock-report/stock-report.component";
import { StockSMComponent } from "./stock-sm/stock-sm.component";
// import { FutureTechLibModule } from 'projects/future-tech-lib';
import { FormsModule } from "@angular/forms";
import { FutureTechLibModule } from "../../../../../../libs/future-tech-lib/src";
import { CashReportComponent } from "./cash-report/cash-report.component";
import { CurrentBalanceComponent } from "./current-balance/current-balance.component";
import { ExpReportComponent } from "./expreport/expreport.component";
import { FrenchiserReportComponent } from "./frenchiser-report/frenchiser-report.component";
import { NoBusinessComponent } from "./nobusiness/no-business.component";
import { ProfitReportComponent } from "./profit-report/profit-report.component";
import { SmsReportComponent } from "./sms-report/sms-report.component";
import { TaxReportComponent } from "./tax-report/tax-report.component";

const routes:any = [
  { path: "", redirectTo: "daybook", pathMatch: "full" },
  { path: "daybook", component: DayBookComponent, data: { breadcrumb: "Day Book" } },
  { path: "salereport", component: SaleReportComponent, data: { breadcrumb: "Sale Report" } },
  { path: "smsreport", component: SmsReportComponent, data: { breadcrumb: "SMS Report" } },
  { path: "cashreport", component: CashReportComponent, data: { breadcrumb: "Sale Report" } },
  { path: "salesumry", component: SaleSummryComponent, data: { breadcrumb: "Sale Summary" } },
  { path: "purchasereport", component: PurchaseReportComponent, data: { breadcrumb: "Purchase Report" } },
  { path: "stockreport", component: StockReportComponent, data: { breadcrumb: "Stock Report" } },
  { path: "stocksm", component: StockSMComponent, data: { breadcrumb: "Stock Salesman" } },
  { path: "creditreport", component: RecoveryReportComponent, data: { breadcrumb: "Credit Report" } },
  { path: "expensereport", component: ExpenseReportComponent, data: { breadcrumb: "Expense Report" } },
  { path: "closeaccount", component: CloseAccountComponent, data: { breadcrumb: "Close Account" } },
  { path: "recoverysheet", component: BillSummaryComponent, data: { breadcrumb: "Recovery Sheet" } },
  { path: "balancesheet", component: BalanceSheetComponent, data: { breadcrumb: "Balance Sheet" } },
  { path: "stockaccts", component: StockAcctsComponent, data: { breadcrumb: "Stock Accts" } },
  { path: "profit", component: ProfitReportComponent, data: { breadcrumb: "Profit Report" } },
  { path: "frenchiser", component: FrenchiserReportComponent, data: { breadcrumb: "Frenchiser Report" } },
  { path: "expreport", component: ExpReportComponent, data: { breadcrumb: "Frenchiser Report" } },
  { path: "currentbalance", component: CurrentBalanceComponent, data: { breadcrumb: "Current Balance " } },
  { path: "nobusiness", component: NoBusinessComponent, data: { breadcrumb: "Current Balance " } },
];
@NgModule({
  declarations: [
    SaleReportComponent,
    PurchaseReportComponent,
    SaleSummryComponent,
    StockReportComponent,
    RecoveryReportComponent,
    ExpenseReportComponent,
    TaxReportComponent,
    CashReportComponent,
    SmsReportComponent,
    StockSMComponent,
    CloseAccountComponent,
    BillSummaryComponent,
    DayBookComponent,
    ExpReportComponent,
    BalanceSheetComponent,
    StockAcctsComponent,
    FilterProductPipe,
    ProfitReportComponent,
    FrenchiserReportComponent,
    CurrentBalanceComponent,
    NoBusinessComponent
  ],

  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    GridModule,
    DataTablesModule,
    NgxPrintModule,
    FutureTechLibModule,

    NgbModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  providers: [],
})
export class ReportsModule {}
