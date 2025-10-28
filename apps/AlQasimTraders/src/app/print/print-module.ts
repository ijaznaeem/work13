import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { PrintHtmlComponent } from './print-html/print-html.component';
import { PrintComponent } from './print/print.component';
import { PrintInvoiceComponent } from './printinvoice/printinvoice.component';
import { PrintDataService } from '../services/print.data.services';
import { FormsModule } from '@angular/forms';
import { PrintCashInvoiceComponent } from './printcashinvoice/printcashinvoice.component';


const routes:any = [
  { path: '', redirectTo: 'print', pathMatch: 'full' },
  { path: "print", component: PrintComponent },
  { path: "printinvoice/:id", component:PrintInvoiceComponent },
  { path: "printinvoice", component:PrintInvoiceComponent },
  { path: "print-html", component: PrintHtmlComponent },
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  declarations: [
    PrintInvoiceComponent,
    PrintHtmlComponent,
    PrintComponent,
    PrintCashInvoiceComponent
  ],
  providers: [
    PrintDataService,
  ],
})
export class PrintModule { }
