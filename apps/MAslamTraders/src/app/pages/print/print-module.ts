import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreditInvoiceComponent } from './credit-invoice/credit-invoice.component';
import { EstimateInvoiceComponent } from "./print-estimate/estimate-invoice.component";
import { PrintGatepassComponent } from "./print-gate-pass/print-gatepass.component";
import { PrintHtmlComponent } from './print-html/print-html.component';
import { PrintPurchaseComponent } from "./print-purchase/print-purchase.component";
import { PrintReceiptComponent } from "./print-receipt/print-receipt.component";
import { PrintStockTransferComponent } from "./print-stock-transfer/print-stocktransfer.component";
import { ThermalInvoiceComponent } from "./print-thermal/thermal-invoice.component";
import { PrintTitleComponent } from './print-title/print-title.component';
import { PrintVoucherComponent } from "./print-voucher/print-voucher.component";

const routes:any = [
  { path: '', redirectTo: 'saleorder', pathMatch: 'full' },
  { path: 'print-gatepass/:invoiceID/:storeID', component: PrintGatepassComponent, data: { breadcrumb: 'Print' }, },
  { path: "printinvoice/:id", component: CreditInvoiceComponent ,data: { breadcrumb: 'Print' }},
  { path: "printthermal/:id", component: ThermalInvoiceComponent ,data: { breadcrumb: 'Print' }},
  { path: "gatepass/:id/:storeID", component: PrintGatepassComponent ,data: { breadcrumb: 'Print' }},
  { path: "printpurchase/:id", component: PrintPurchaseComponent, data: { breadcrumb: 'Print' } },
  { path: "stocktransfer/:id", component: PrintStockTransferComponent, data: { breadcrumb: 'Print' } },
  { path: "print-html", component: PrintHtmlComponent, data: { breadcrumb: 'Print' } },
  { path: "print-estimate", component: EstimateInvoiceComponent, data: { breadcrumb: 'Print' } },
  { path: "print-voucher/:VoucherID", component: PrintVoucherComponent, data: { breadcrumb: 'Print' } },
  { path: "print-receipt", component: PrintReceiptComponent, data: { breadcrumb: 'Print' } },
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
    PrintStockTransferComponent,
    PrintHtmlComponent,
    EstimateInvoiceComponent,
    PrintVoucherComponent,
    ThermalInvoiceComponent,
    PrintReceiptComponent
  ],
  providers: [],
})
export class PrintModule { }
