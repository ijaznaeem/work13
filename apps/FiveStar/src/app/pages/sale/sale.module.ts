import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../components/components.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { SaleReturnComponent } from './sale-return/sale-return.component';
import { SaleInvoiceComponent } from './sale/sale-invoice.component';

const routes:any = [
  { path: '', redirectTo: 'sale', pathMatch: 'full' },
  { path: 'sale', component: SaleInvoiceComponent, data: { breadcrumb: 'Sale' } },
  { path: 'sale/:EditID', component: SaleInvoiceComponent, data: { breadcrumb: 'Sale' } },
  { path: 'salereturn', component: SaleReturnComponent, data: { breadcrumb: 'Sale Return' } },
  { path: 'salereturn/:EditID', component: SaleReturnComponent, data: { breadcrumb: 'Sale Return' } },

];


@NgModule({
  declarations: [
    InvoiceComponent,
    SaleInvoiceComponent,
    SaleReturnComponent
  ],

  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    ComponentsModule,
    DropDownListModule,
    // FutureTechLibModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class SaleModule { }
