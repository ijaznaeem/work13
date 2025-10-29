import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { FutureTechLibModule } from "../../../../../../libs/future-tech-lib/src";
import { DashboardComponent } from "./dashboard.component";

export const routes:any = [
  { path: "", component: DashboardComponent, pathMatch: "full" },

];
// ---
@NgModule({
  imports: [
    CommonModule,
    FutureTechLibModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    NgxChartsModule,

  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule {}
