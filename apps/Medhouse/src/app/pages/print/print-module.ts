import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreditInvoiceComponent } from './credit-invoice/credit-invoice.component';
import { PrintGatepassComponent } from "./print-gate-pass/print-gatepass.component";
import { PrintHtmlComponent } from './print-html/print-html.component';
import { PrintPurchaseComponent } from "./print-purchase/print-purchase.component";
import { PrintTitleComponent } from './print-title/print-title.component';

const routes:any = [
  { path: '', redirectTo: 'saleorder', pathMatch: 'full' },
  { path: 'print-gatepass/:invoiceID/:storeID', component: PrintGatepassComponent, data: { breadcrumb: 'Print' }, },
  { path: "printinvoice/:id", component: CreditInvoiceComponent ,data: { breadcrumb: 'Print' }},
  { path: "printpurchase/:id", component: PrintPurchaseComponent, data: { breadcrumb: 'Print' } },
  { path: "print-html", component: PrintHtmlComponent, data: { breadcrumb: 'Print' } },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  declarations: [
    PrintGatepassComponent,
    PrintTitleComponent,
    PrintPurchaseComponent,
    CreditInvoiceComponent,
    PrintHtmlComponent,
  ],
  providers: [],
})
export class PrintModule { }
