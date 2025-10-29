import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SaleOrderPrintComponent } from './sale-order/sale-order-print.component';
import { RouterModule } from '@angular/router';
import { PrintInvoiceComponent } from "./print-invoice/print-invoice.component";
import { PrintPurchaseComponent } from "./print-purchase/print-purchase.component";
import { WarrantyInvoiceComponent } from './warranty-invoice/warranty-invoice.component';
import { PrintHtmlComponent } from './print-html/print-html.component';
import { PrintTitleComponent } from './print-title/print-title.component';

const routes:any = [
  { path: '', redirectTo: 'saleorder', pathMatch: 'full' },
  { path: 'saleorder/:id', component: SaleOrderPrintComponent, data: { breadcrumb: 'Print' }, },
  { path: "printinvoice/:id", component: PrintInvoiceComponent ,data: { breadcrumb: 'Print' }},
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
    SaleOrderPrintComponent,
    PrintTitleComponent,
    PrintInvoiceComponent,
    PrintPurchaseComponent,
    WarrantyInvoiceComponent,
    PrintHtmlComponent,
  ],
  providers: [],
})
export class PrintModule { }
