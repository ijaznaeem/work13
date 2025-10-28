import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutoCompleteModule, ComboBoxAllModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ComponentsModule } from '../components/components.module';
import { SmartTableDatepickerComponent } from './custom-date-picker/smart-table-datepicker.component';
import { DocumentAttachComponent } from './documents-attach/document-attach.component';
import { DocumentViewComponent } from './documents-view/document-view.component';
import { InquiryComponent } from './inquiry/inquiry.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { PDFViewComponent } from './pdf-viewer/pdf-view.component';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { OrdersListComponent } from './sale-orders/orders-list/orders-list.component';
import { SaleOrdersComponent } from './sale-orders/sale-orders/sale-orders.component';

const routes :any= [
  { path: '', redirectTo: 'inquiry', pathMatch: 'full' },
  {
    path: 'sale-invoice',
    component: SaleInvoiceComponent,
    data: { breadcrumb: 'Sale Order' },
  },
  {
    path: 'sale-invoice/:EditID',
    component: SaleInvoiceComponent,
    data: { breadcrumb: 'Sale Order' },
  },

  {
    path: 'sale-list',
    component: InvoiceListComponent,
    data: { breadcrumb: 'Sale Order' },
  },
  {
    path: 'orders-list',
    component: OrdersListComponent,
    data: { breadcrumb: 'Sale Order' },
  },
  {
    path: 'saleorder',
    component: SaleOrdersComponent,
    data: { breadcrumb: 'Sale Order' },
  },
  {
    path: 'saleorder/:EditID/:enq_no',
    component: SaleOrdersComponent,
    title: 'Edit Sale Order',
    data: { breadcrumb: 'Sale Order' },
  },
  {
    path: 'saleorder/:EditID',
    title: 'Edit Sale Order',
    component: SaleOrdersComponent,
    data: { breadcrumb: 'Sale Order' },
  },

  {
    path: 'inquiry',
    component: InquiryComponent,
    data: { breadcrumb: 'Inquiries' },
  },

  {
    path: 'documents/:InvoiceID',
    component: DocumentAttachComponent,
    data: { breadcrumb: 'Invoice Documents' },
  },
  {
    path: 'pdf',
    component: PDFViewComponent,
    data: { breadcrumb: 'Invoice Documents' },
  },
];

@NgModule({
  declarations: [
    InquiryComponent,
    PDFViewComponent,
    InvoiceListComponent,
    SaleInvoiceComponent,
    OrdersListComponent,
    SaleOrdersComponent,
    DocumentAttachComponent,
    DocumentViewComponent,
    SmartTableDatepickerComponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    NgxExtendedPdfViewerModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    AutoCompleteModule,
    NgbModule,
    TabsModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    FormsModule,

    RouterModule.forChild(routes),
  ],
})
export class SalesModule {}
