import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { TabDirective } from '../../services/tab.directive';
import { CashSaleComponent } from './cash-sale/cash-sale.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { RetailSaleComponent } from './retail-invoice/retail-sale.component';
import { SaleModalComponent } from './sale-modal/sale-modal.component';
import { SearchStockComboboxComponent } from './search-stock-combobox/search-stock-combobox.component';
import { SearchStockComponent } from './search-stock/search-stock.component';

const routes: any = [
  { path: '', redirectTo: 'invoice', pathMatch: 'full' },
  {
    path: 'retail',
    component: RetailSaleComponent,
    data: { breadcrumb: 'Sale' },
  },
  {
    path: 'retail/:EditID',
    component: RetailSaleComponent,
    data: { breadcrumb: 'Sale' },
  },
  {
    path: 'wholesale',
    component: CashSaleComponent,
    data: { breadcrumb: 'Whole Sale' },
  },
  {
    path: 'wholesale/:EditID',
    component: CashSaleComponent,
    data: { breadcrumb: 'Whole Sale' },
  },

];

@NgModule({
  declarations: [
    RetailSaleComponent,
    CashSaleComponent,
    SearchStockComponent,
    SaleModalComponent,
    TabDirective,
    NavigatorComponent,
    CashSaleComponent,
    SearchStockComboboxComponent,
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    TabsModule,
    // BrowserAnimationsModule,
    NgxSpinnerModule,
    NgbAlertModule,
    NgxDatatableModule,
    //ComponentsModule,
    NgSelectModule,
    FutureTechLibModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class SalesModule {}
