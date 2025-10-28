import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ModalModule } from "ngx-bootstrap/modal";
import { ComponentsModule } from "../components/components.module";
import { PrescriptionComponent } from "./prescription/prescription.component";
import { PrintHtmlComponent } from './print-html/print-html.component';
import { PrintLabReportComponent } from "./print-lab-report/print-lab-report.component";
import { PrintLabbillComponent } from "./print-labbill/print-labbill.component";
import { PrintPrescriptionComponent } from "./print-prescription/print-prescription.component";
import { PrintReceiptComponent } from "./print-receipt/print-receipt.component";
import { PrintComponent } from "./print/print.component";

const routes:any = [
  { path: '', redirectTo: 'print-html', pathMatch: 'full' },
   { path: "print-html", component: PrintHtmlComponent },
   { path: "prescription/:apptid", component: PrintPrescriptionComponent },
];


@NgModule({
  declarations: [

    PrintComponent,
    PrintHtmlComponent,
    PrintReceiptComponent,
    PrintLabbillComponent,
    PrintLabReportComponent,
    PrintPrescriptionComponent,
    PrescriptionComponent

  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
  ]
})
export class PrintModule { }
