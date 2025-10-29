import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SaleOrderPrintComponent } from './sale-order/sale-order-print.component';
import { RouterModule } from '@angular/router';
import { PrintInvoiceComponent } from "./print-invoice/print-invoice.component";
import { PrintPurchaseComponent } from "./print-purchase/print-purchase.component";
import { WarrantyInvoiceComponent } from './warranty-invoice/warranty-invoice.component';
import { PrintHtmlComponent } from './print-html/print-html.component';
import { PrintTitleComponent } from './print-title/print-title.component';
import { PrintStockIssueComponent } from './print-stock-issue/print-stock-issue.component';
import { PrintStockTransferComponent } from './print-stock-transfer/print-stock-transfer.component';
import { PrintVoucherComponent } from './printvoucher/printvoucher.component';

const routes:any = [
  { path: '', redirectTo: 'saleorder', pathMatch: 'full' },
  { path: 'stockissue/:id', component: PrintStockIssueComponent  },
  { path: 'stocktransfer/:id', component: PrintStockTransferComponent  },
  { path: "printinvoice/:id", component: PrintInvoiceComponent },
  { path: "printpurchase/:id", component: PrintPurchaseComponent },
  { path: "print-html", component: PrintHtmlComponent },
  { path: "printvoucher/:id", component: PrintVoucherComponent },
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
    PrintStockIssueComponent,
    PrintStockTransferComponent,
    PrintVoucherComponent
  ],
  providers: [],
})
export class PrintModule { }
