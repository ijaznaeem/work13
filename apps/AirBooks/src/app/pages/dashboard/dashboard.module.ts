import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { DashboardComponent } from "./dashboard.component";
import { GradientCardComponent } from "./gradient-card/gradient-card.component";

export const routes:any = [
  { path: "", component: DashboardComponent, pathMatch: "full" },

];
// ---
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    NgxChartsModule,

  ],
  declarations: [
    DashboardComponent,
    GradientCardComponent
  ],
})
export class DashboardModule {}
