import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrintInvoiceComponent } from "./print-invoice/print-invoice.component";
import { PrintComponent } from "./print/print.component";
import { DirectivesModule } from "../../theme/directives/directives.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ComboBoxAllModule } from "@syncfusion/ej2-angular-dropdowns";
import {
  GridModule,
  EditService,
  ToolbarService,
  AggregateService,
  SearchService,
} from "@syncfusion/ej2-angular-grids";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { RouterModule } from "@angular/router";
import { WarrantyInvoiceComponent } from "./warranty-invoice/warranty-invoice.component";
import { QuotationComponent } from "./quotation/quotation.component";
import { NgxPrintModule } from "ngx-print";
import { PrintHtmlComponent } from "./print-html/print-html.component";
import { PrintCashInvoiceComponent } from "./printcashinvoice/printcashinvoice.component";
import { PrinVoucherComponent } from "./printvoucher/printvoucher.component";
import { PrintInvoiceAllComponent } from "./print-invoice-all/print-invoice.component";
import { PrintQuotationComponent } from "./print-quotation/print-quotation.component";
import { PrintDeliverychallanComponent } from "./deliverychallan/deliverychallan.component";
import { PrintPurchaseComponent } from "./print-purchase/print-purchase.component";
const routes = [
  { path: "printinvoice/:id", component: PrintInvoiceComponent },
  { path: "printinvoiceall/:id", component: PrintInvoiceAllComponent },
  { path: "printvoucher/:id", component: PrinVoucherComponent },
  { path: "printquotation/:id", component: PrintQuotationComponent },
  { path: "print", component: PrintComponent },
  { path: "print-html", component: PrintHtmlComponent },
  { path: "deliverychallan/:id", component: PrintDeliverychallanComponent },
  { path: "printpurchase/:id", component: PrintPurchaseComponent },
  { path: "printpurchase/:id", component: PrintPurchaseComponent },
];
@NgModule({
  declarations: [
    PrintInvoiceComponent,
    PrintDeliverychallanComponent,
    PrintInvoiceAllComponent,
    PrintComponent,
    PrintHtmlComponent,
    PrintCashInvoiceComponent,
    WarrantyInvoiceComponent,
    PrinVoucherComponent,
    PrintQuotationComponent,
    PrintDeliverychallanComponent,
    QuotationComponent,
    PrintPurchaseComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgxPrintModule,
    GridModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  providers: [EditService, ToolbarService, AggregateService, SearchService],
})
export class PrintingModule {}
