import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrintHtmlComponent } from './print-html/print-html.component';
import { PrintInvoiceComponent } from "./print-invoice/print-invoice.component";
import { PrintPurchaseComponent } from "./print-purchase/print-purchase.component";
import { SaleOrderPrintComponent } from './sale-order/sale-order-print.component';
import { WarrantyInvoiceComponent } from './warranty-invoice/warranty-invoice.component';

const routes:any = [
  { path: '', redirectTo: 'saleorder', pathMatch: 'full' },
  { path: 'saleorder/:id', component: SaleOrderPrintComponent, data: { breadcrumb: 'Sale Order Print' }, },
  { path: "printinvoice/:id", component: PrintInvoiceComponent },
  { path: "printpurchase/:id", component: PrintPurchaseComponent },
  { path: "print-html", component: PrintHtmlComponent },
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
    PrintPurchaseComponent,
    WarrantyInvoiceComponent
  ],
  providers: [],
})
export class PrintModule { }
