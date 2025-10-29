import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleReturnComponent } from './sale-return/sale-return.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';
import { ComponentsModule } from '../components/components.module';
import { CashSaleComponent } from './cash-sale/cash-sale.component';
import { CreditSaleComponent } from './sale/credit-sale.component';
import { SaleModalComponent } from './sale-modal/sale-modal.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductionComponent } from './production/production.component';
import { InvoiceCashComponent } from './invoice-cash/invoice-cash.component';
import { CashSaleReturnComponent } from './cashsale-return/cashsale-return.component';

const routes: any = [
  { path: '', redirectTo: 'invoice', pathMatch: 'full' },
  {
    path: 'invoice',
    component: CreditSaleComponent,
    data: { breadcrumb: 'Sale' },
  },
  {
    path: 'invoice/:EditID',
    component: CreditSaleComponent,
    data: { breadcrumb: 'Sale' },
  },
  {
    path: 'cashsale',
    component: CashSaleComponent,
    data: { breadcrumb: 'Cash Sale' },
  },
  {
    path: 'cashsalereturn',
    component: CashSaleReturnComponent,
    data: { breadcrumb: 'Cash Sale Return' },
  },
  {
    path: 'cashsale/:EditID',
    component: CashSaleComponent,
    data: { breadcrumb: 'Sale' },
  },


  {
    path: 'return',
    component: SaleReturnComponent,
    data: { breadcrumb: 'Sale Return' },
  },
  {
    path: 'return/:EditID',
    component: SaleReturnComponent,
    data: { breadcrumb: 'Sale Return' },
  },
  {
    path: 'production',
    component: ProductionComponent,
    data: { breadcrumb: 'Production' },
  },
  {
    path: 'production/:EditID',
    component: ProductionComponent,
    data: { breadcrumb: 'Production' },
  },
];

@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceCashComponent,
    CreditSaleComponent,
    CashSaleComponent,
    ProductionComponent,
    SaleReturnComponent,
    SaleModalComponent,
    CashSaleReturnComponent,
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    //BrowserAnimationsModule,
    NgxSpinnerModule,
    ComponentsModule,
    NgSelectModule,
    // FutureTechLibModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class SalesModule {}
