import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComboBoxAllModule, DropDownListAllModule } from "@syncfusion/ej2-angular-dropdowns";
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { FutureTechLibModule } from "../../../../../../libs/future-tech-lib/src";
import { OnlineAppointmentComponent } from "./add-appointment-online/appointment-online.component";
import { AddAppointmentComponent } from "./add-appointment/add-appointment.component";
import { AddBillComponent } from "./add-bill/add-bill.component";
import { AddPatientComponent } from "./add-patient/add-patient.component";
import { CashReportComponent } from "./cash-report/cash-report.component";
import { DoctorPrescriptionComponent } from "./doctor-prescription/doctor-prescription.component";
import { PatientAppoinmentComponent } from "./dr-appointments/patient-appointment.component";
import { FindPatientComponent } from "./find-patient/find-patient.component";
import { ItemsListComponent } from "./items/items-list.component";
import { LabBillComponent } from "./lab-bill/lab-bill.component";
import { LabReportComponent } from "./lab-report/lab-report.component";
import { PatientProfileComponent } from "./patient-profile/patient-profile.component";
import { PreviousPatientsComponent } from "./previous-patients/previous-patients.component";
import { NewAppointmentComponent } from "./reception-appts/new-appointment.component";
import { SendSMSComponent } from "./send-sms/send-sms.component";

const routes :any= [
  { path: "", redirectTo: "appointments", pathMatch: "full" },

  {
    path: "newappts",
    component: NewAppointmentComponent,
    data: { breadcrumb: "New Appointments" },
  },
  {
    path: "today",
    component: PatientAppoinmentComponent,
    data: { breadcrumb: "Appointments" },
  },
  {
    path: "prescription/:apptid",
    component: DoctorPrescriptionComponent,
    data: { breadcrumb: "Prescription" },
  },
  {
    path: "previous-record",
    component: PreviousPatientsComponent,
    data: { breadcrumb: "Previous record" },
  },
  {
    path: "add-appointment",
    component: AddAppointmentComponent,
    data: { breadcrumb: "Add Appointments" },
  },
  {
    path: "add-patient",
    component: AddPatientComponent,
    data: { breadcrumb: "Add Patient" },
  },
  {
    path: "find-patient",
    component: FindPatientComponent,
    data: { breadcrumb: "Find Patient" },
  },
  {
    path: "send-sms",
    component: SendSMSComponent,
    data: { breadcrumb: "Send Promotional SMS" },
  },
  {
    path: "cash-report",
    component: CashReportComponent,
    data: { breadcrumb: "Cash Report" },
  },
  {
    path: "lab-report",
    component: LabReportComponent,
    data: { breadcrumb: "Lab Report" },
  },
  {
    path: "lab-bill",
    component: LabBillComponent,
    data: { breadcrumb: "Lab Bill" },
  },
  {
    path: "patient-profile/:patient_id",
    component: PatientProfileComponent,
    data: { breadcrumb: "Patient Profile" },
  },

];

@NgModule({
  declarations: [
    PatientAppoinmentComponent,
    NewAppointmentComponent,
    DoctorPrescriptionComponent,
    PreviousPatientsComponent,
    AddAppointmentComponent,
    FindPatientComponent,
    AddPatientComponent,
    SendSMSComponent,
    LabReportComponent,
    PatientProfileComponent,
    CashReportComponent,
    AddBillComponent,
    LabBillComponent,
    ItemsListComponent,
    OnlineAppointmentComponent,

  ],
  imports: [
    CommonModule,
    // ComponentsModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    FutureTechLibModule,
    NgbModule,
    FormsModule,
    RichTextEditorAllModule,
    RouterModule.forChild(routes),
  ],
  providers: []
})
export class DoctorsModule { }
