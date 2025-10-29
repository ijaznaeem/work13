import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { DashboardComponent } from "./dashboard.component";

import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ComponentsModule } from "../components/components.module";
import { DoctorDashboardComponent } from "./doctor/doctor-dashboard.component";
import { PatientDashboardComponent } from "./patient/patient.dashboard.component";
import { ReceptionDashboardComponent } from "./reception/reception-dashboard.component";

export const routes :any= [
  { path: "", component: DashboardComponent, pathMatch: "full" },
];
// ---
@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    NgxChartsModule,
    // FutureTechLibModule,
  ],
  declarations: [
    DashboardComponent,
    DoctorDashboardComponent,
    PatientDashboardComponent,
    ReceptionDashboardComponent
  ],
})
export class DashboardModule {}
