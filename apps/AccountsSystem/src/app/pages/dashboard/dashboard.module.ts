import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from "./dashboard.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { DashboardService } from "../../services/dashboard.service";

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
    NgbModule,

  ],
  declarations: [
    DashboardComponent,
  ],
  providers: [
    DashboardService,
  ]
})
export class DashboardModule {}
