import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrintDetailedInvoiceComponent } from "./print-detailed-invoice/print-detailed-invoice.component";
import { PrintDetailsComponent } from './print-details/print-details.component';
import { PrintHtmlComponent } from "./print-html/print-html.component";
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { SalarySlipComponent } from "./salary-slip/salary-slip.component";
import { SaleOrderPrintComponent } from './sale-order/sale-order-print.component';


const routes:any = [
  { path: '', redirectTo: 'saleorder', pathMatch: 'full' },
  { path: 'saleorder/:id', component: SaleOrderPrintComponent, data: { breadcrumb: 'Sale Order Print' },   },
  { path: 'saleinvoice/:id', component: PrintInvoiceComponent, data: { breadcrumb: 'Sale Invoice Print' },  },
  { path: 'invoice-detailed/:id', component: PrintDetailedInvoiceComponent, data: { breadcrumb: 'Sale Invoice Print' },  },
  { path: "print-html", component: PrintHtmlComponent, data: { breadcrumb: 'Print' } },
  { path: "salary-slips/:month/:year", component: SalarySlipComponent, data: { breadcrumb: 'Print' } },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  declarations: [
    SaleOrderPrintComponent,
    PrintInvoiceComponent,
    PrintDetailsComponent,
    SalarySlipComponent,
    PrintHtmlComponent, PrintDetailedInvoiceComponent
  ],
  providers: [],
})
export class PrintModule { }
