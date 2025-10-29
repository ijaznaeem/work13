import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrintHtmlComponent } from './print-html/print-html.component';
import { PrintInvoiceComponent } from "./print-invoice/print-invoice.component";
import { PrintPurchaseComponent } from "./print-purchase/print-purchase.component";
import { PrintStockTransferComponent } from './print-stock-transfer/print-stock-transfer.component';
import { PrintTitleComponent } from './print-title/print-title.component';
import { SaleOrderPrintComponent } from './sale-order/sale-order-print.component';
import { WarrantyInvoiceComponent } from './warranty-invoice/warranty-invoice.component';

const routes:any = [
  { path: '', redirectTo: 'saleorder', pathMatch: 'full' },
  { path: 'saleorder/:id', component: SaleOrderPrintComponent, data: { breadcrumb: 'Print' }, },
  { path: "printinvoice/:id", component: PrintInvoiceComponent ,data: { breadcrumb: 'Print' }},
  { path: "printpurchase/:id", component: PrintPurchaseComponent, data: { breadcrumb: 'Print' } },
  { path: "print-html", component: PrintHtmlComponent, data: { breadcrumb: 'Print' } },
  { path: 'stocktransfer/:id', component: PrintStockTransferComponent  },
  
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
    PrintStockTransferComponent,
    PrintPurchaseComponent,
    WarrantyInvoiceComponent,
    PrintHtmlComponent,
  ],
  providers: [],
})
export class PrintModule { }
