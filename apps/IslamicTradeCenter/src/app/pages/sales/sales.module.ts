import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TabDirective } from '../../services/tab.directive';
import { ComponentsModule } from '../components/components.module';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { SaleReturnComponent } from './sale-return/sale-return.component';
import { SaleComponent } from './sale/sale.component';
import { SearchStockComponent } from './search-stock/search-stock.component';

const routes: any = [
  { path: '', redirectTo: 'invoice', pathMatch: 'full' },
  {
    path: 'invoice',
    component: SaleComponent,
    data: { breadcrumb: 'Sale' },
  },
  {
    path: 'invoice/:EditID',
    component: SaleComponent,
    data: { breadcrumb: 'Sale' },
  },
  {
    path: 'return',
    component: SaleReturnComponent,
    data: { breadcrum: 'Sale Return' },
  },
  {
    path: 'return/:EditID',
    component: SaleReturnComponent,
    data: { breadcrumb: 'Sale Return' },
  },
];

@NgModule({
  declarations: [
    SaleComponent,
    SaleReturnComponent,
    SearchStockComponent,
    SaleInvoiceComponent,
    TabDirective
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    // BrowserAnimationsModule,
    NgxSpinnerModule,
    NgbAlertModule,
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
