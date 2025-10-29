import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { TotalSaleComponent } from "./total-sale/total-sale.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NewsaleComponent } from "./newsale/newsale.component";
import { NeworderComponent } from "./new-order/neworder.component";
import { OrderReportComponent } from "./order-report/order-report.component";
import { CashsaleComponent } from "./cashsale/cashsale.component";
import { DynamicTableComponent } from "./dynamic-table/dynamic-table.component";
import { SiteSaleComponent } from "./site-sale/site-sale.component";
import { ComboBoxAllModule } from "@syncfusion/ej2-angular-dropdowns";
import { ComponentsModule } from "../components/components.module";
import { UserSaleComponent } from "./user-sale/user-sale.component";

export const routes:any = [
  { path: "", redirectTo: "newsale", pathMatch: "full" },
  {
    path: "totalsale",
    component: TotalSaleComponent,
    data: { breadcrumb: "Total Sale" }
  },
  {
    path: "sitesale",
    component: SiteSaleComponent,
    data: { breadcrumb: "Site Sale" }
  },
  {
    path: "newsale",
    component: NewsaleComponent,
    data: { breadcrumb: "Sale" }
  },

  {
    path: "cashsale",
    component: CashsaleComponent,
    data: { breadcrumb: "Cash Sale" }
  },

  {
    path: "neworder",
    component: NeworderComponent,
    data: { breadcrumb: "New Order" }
  },
  {
    path: "newsale/:editID=0/:orderID=0",
    component: NeworderComponent,
    data: { breadcrumb: "Edit Order" }
  },
  {
    path: "orderreport",
    component: OrderReportComponent,
    data: { breadcrumb: "Order Report" }
  },
  {
    path: "usersale",
    component: UserSaleComponent,
    data: { breadcrumb: "User Sale report" }
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComboBoxAllModule,
    ComponentsModule,
    NgbModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule.forChild(routes),
    NgbModule,

  ],
  declarations: [
    TotalSaleComponent,
    NeworderComponent,
    SiteSaleComponent,
    NewsaleComponent,
    DynamicTableComponent,
    OrderReportComponent,
    CashsaleComponent,
    UserSaleComponent
  ]
})
export class SaleModule {}
