import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { DashboardComponent } from "./dashboard.component";

export const routes:any = [
  { path: "", component: DashboardComponent, pathMatch: "full" },

];
// ---
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    FormsModule,
    NgxChartsModule,

  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule {}
