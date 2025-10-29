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
import { ProcessComponent } from './processing/processing.component';
import { CashSaleComponent } from './cash-sale/cash-sale.component';
import { CreditSaleComponent } from './sale/credit-sale.component';
import { SaleModalComponent } from './sale-modal/sale-modal.component';



const routes :any= [
  { path: '', redirectTo: 'sale', pathMatch: 'full' },
  { path: 'creditsale', component: CreditSaleComponent, data: { breadcrumb: 'Sale' } },
  { path: 'creditsale/:EditID', component: CreditSaleComponent, data: { breadcrumb: 'Sale' } },
  { path: 'cashsale', component: CashSaleComponent, data: { breadcrumb: 'Sale' } },
  { path: 'cashsale/:EditID', component: CashSaleComponent, data: { breadcrumb: 'Sale' } },
  { path: 'salereturn', component: SaleReturnComponent, data: { breadcrumb: 'Sale Return' } },
  { path: 'salereturn/:EditID', component: SaleReturnComponent, data: { breadcrumb: 'Sale Return' } },
  { path: 'process', component: ProcessComponent, data: { breadcrumb: 'Product Processing' } },
  { path: 'process/:EditID', component: ProcessComponent, data: { breadcrumb: 'Product Processing' } },

];


@NgModule({
  declarations: [
    InvoiceComponent,
    CreditSaleComponent,
    CashSaleComponent,
    SaleReturnComponent,
    ProcessComponent,
    SaleModalComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    ComponentsModule,
    // FutureTechLibModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class SalesModule { }
