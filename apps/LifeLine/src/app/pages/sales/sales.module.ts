import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ComponentsModule } from '../components/components.module';
import { CashSaleComponent } from './cash-sale/cash-sale.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { SaleModalComponent } from './sale-modal/sale-modal.component';
import { SaleReturnComponent } from './sale-return/sale-return.component';
import { CreditSaleComponent } from './sale/credit-sale.component';



const routes :any= [
  { path: '', redirectTo: 'invoice', pathMatch: 'full' },
  { path: 'invoice', component: CreditSaleComponent, data: { breadcrumb: 'Sale' } },
  { path: 'invoice/:EditID', component: CreditSaleComponent, data: { breadcrumb: 'Sale' } },
  { path: 'return', component: SaleReturnComponent, data: { breadcrumb: 'Sale Return' } },
  { path: 'return/:EditID', component: SaleReturnComponent, data: { breadcrumb: 'Sale Return' } },

];


@NgModule({
  declarations: [
    InvoiceComponent,
    CreditSaleComponent,
    CashSaleComponent,

    SaleReturnComponent,
    SaleModalComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    //BrowserAnimationsModule,
    NgxSpinnerModule,
    ComponentsModule,
    NgSelectModule,
    // FutureTechLibModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class SalesModule { }
