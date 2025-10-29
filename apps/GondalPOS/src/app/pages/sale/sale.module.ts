import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleReturnComponent } from './sale-return/sale-return.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { SaleInvoiceComponent } from './sale/sale-invoice.component';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { SaleModalComponent } from './sale-modal/sale-modal.component';
import { OrderComponent } from './order/order.component';
import { ComponentsModule } from '../components/components.module';
import { OrdersListComponent } from './orders-list/orders.list.component';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import {QuotationComponent} from './quotation/quotation.component';
const routes:any = [
  { path: '', redirectTo: 'sale', pathMatch: 'full' },
  { path: 'sale', component: SaleInvoiceComponent, data: { breadcrumb: 'Sale' } },
  { path: 'sale/:EditID', component: SaleInvoiceComponent, data: { breadcrumb: 'Sale' } },
  { path: 'quotation', component: QuotationComponent, data: { breadcrumb: 'Quotation' } },
  { path: 'quotation/:EditID', component: QuotationComponent, data: { breadcrumb: 'Quotation' } },
  { path: 'salereturn', component: SaleReturnComponent, data: { breadcrumb: 'Sale Return' } },
  { path: 'salereturn/:EditID', component: SaleReturnComponent, data: { breadcrumb: 'Sale Return' } },
  { path: 'order', component: OrderComponent, data: { breadcrumb: 'New Order' } },
  { path: 'orderslist', component: OrdersListComponent, data: { breadcrumb: 'Orders List' } },
];


@NgModule({
  declarations: [
    InvoiceComponent,
    SaleInvoiceComponent,
    OrderComponent,
    SaleReturnComponent,
    QuotationComponent,
    OrdersListComponent,
    SaleModalComponent],
  imports: [
    CommonModule,
    DirectivesModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    ComponentsModule,
    FutureTechLibModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class SaleModule { }
