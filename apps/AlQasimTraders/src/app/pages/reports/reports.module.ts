import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CustomerAccReportComponent } from "./customer-acc-report/customer-acc-report.component";
import { ProfitreportComponent } from "./profitreport/profitreport.component";
import { ExpenseReport } from "./expensereport/expensereport.component";
import { CashBookComponent } from "./cashbook/cashbook.component";
import { CreditReportComponent } from "./creditreport/creditreport.component";
import { NgxPrintModule } from "ngx-print";
import { BalanceSheetComponent } from "./balance-sheet/balance-sheet.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComboBoxModule } from "@syncfusion/ej2-angular-dropdowns";
import { ModalModule } from "ngx-bootstrap/modal";

export const routes:any = [
  { path: "", redirectTo: "add", pathMatch: "full" },
  {
    path: "customeracct",
    component: CustomerAccReportComponent,
    data: { breadcrumb: "Account Report" }
  },
  {
    path: "profit",
    component: ProfitreportComponent,
    data: { breadcrumb: "Profit Report" }
  },
  {
    path: "cahsbook",
    component: CashBookComponent,
    data: { breadcrumb: "Cash Book" }
  },
  {
    path: "balancesheet",
    component: BalanceSheetComponent,
    data: { breadcrumb: "Balance Sheet" }
  },
  {
    path: "creditreport",
    component: CreditReportComponent,
    data: { breadcrumb: "Credit report" }
  }
];

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxPrintModule,
    NgbModule,
    ComboBoxModule,
    ModalModule
  ],
  exports: [],

  declarations: [
    CustomerAccReportComponent,
    ProfitreportComponent,
    ExpenseReport,
    CashBookComponent,
    CreditReportComponent,
    BalanceSheetComponent
  ]
})
export class ReportModule { }
