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
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchComponent } from './search/search.component';
import { SearchGridComponent } from './search-grid/search-grid.component';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { HttpClientModule } from '@angular/common/http';
import { StockReceiveComponent } from './stockr-receive/stock-receive.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DiscountSetupComponent } from './discount-setup/discount-setup.component';
import { SearchStockComponent } from './search-stock/search-stock.component';

const routes :any= [
  { path: '', redirectTo: 'cash', pathMatch: 'full' },

  { path: 'cash', component: CashSaleComponent, data: { breadcrumb: 'Cash Sale' } },
  { path: 'invoice', component: CreditSaleComponent, data: { breadcrumb: 'Credit Sale' } },
  { path: 'return', component: SaleReturnComponent, data: { breadcrumb: 'Sale Return' } },
  { path: 'search', component: SearchComponent, data: { breadcrumb: 'Sale Return' } },
  { path: 'search2', component: SearchGridComponent, data: { breadcrumb: 'Sale Return' } },
  { path: 'stock-receive', component: StockReceiveComponent, data: { breadcrumb: 'Stock Receive' } },
  { path: 'discount-setup', component: DiscountSetupComponent, data: { breadcrumb: 'Discount Setup' } },


];


@NgModule({
  declarations: [
    InvoiceComponent,
    CreditSaleComponent,
    CashSaleComponent,
    SearchComponent,
    SearchGridComponent,
    StockReceiveComponent,
    SaleReturnComponent,
    DiscountSetupComponent,
    SearchStockComponent,
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgxSpinnerModule,
    TabsModule,
    // ComponentsModule,
    GridModule ,
    FutureTechLibModule,
    HttpClientModule,
    NgSelectModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class SalesModule { }
