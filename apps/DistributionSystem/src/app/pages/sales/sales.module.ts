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
import { CashSaleComponent } from './cash-sale/cash-sale.component';
import { SaleModalComponent } from './sale-modal/sale-modal.component';
import { CreditSaleComponent } from './sale/credit-sale.component';
import { SearchStockComponent } from './search-stock/search-stock.component';

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
    path: 'retail',
    component: CashSaleComponent,
    data: { breadcrumb: 'Whole Sale' },
  },
  {
    path: 'retail/:EditID',
    component: CashSaleComponent,
    data: { breadcrumb: 'Whole Sale' },
  },
];

@NgModule({
  declarations: [
    CreditSaleComponent,
    CashSaleComponent,
    SearchStockComponent,
    SaleModalComponent,
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
