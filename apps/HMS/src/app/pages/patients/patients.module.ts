import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComboBoxAllModule } from "@syncfusion/ej2-angular-dropdowns";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ModalModule } from "ngx-bootstrap/modal";
import { FutureTechLibModule } from "../../../../../../libs/future-tech-lib/src";
import { ComponentsModule } from "../components/components.module";
import { PatientAppoinmentComponent } from "./appointments/patient-appointment.component";
import { FindADoctorComponent } from "./findadoctor/findadoctor.component";
import { PatientLabComponent } from "./lab/patient-lab.component";
import { PatientMedicineComponent } from "./medicines/patient-medicine.component";
import { PatientsComponent } from "./patients/patients.component";

const routes:any = [
  { path: "", redirectTo: "list", pathMatch: "full" },

  { path: "list", component: PatientsComponent, data: { breadcrumb: "List" } },
  {
    path: "finddr",
    component: FindADoctorComponent,
    data: { breadcrumb: "Find a Doctor" },
  },
  {
    path: "appointments",
    component: PatientAppoinmentComponent,
    data: { breadcrumb: "Appointments" },
  },
  {
    path: "lab",
    component: PatientLabComponent,
    data: { breadcrumb: "Lab" },
  },
  {
    path: "medicines",
    component: PatientMedicineComponent,
    data: { breadcrumb: "Medicines" },
  },
];

@NgModule({
  declarations: [
    FindADoctorComponent,
    PatientLabComponent,
    PatientAppoinmentComponent,
    PatientsComponent,
    PatientMedicineComponent,
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComponentsModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    NgbModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class PatientsModule {}
