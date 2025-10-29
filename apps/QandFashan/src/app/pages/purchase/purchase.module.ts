import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
// import { ComponentsModule } from '../components/components.module';
// import { FutureTechLibModule } from 'projects/future-tech-lib/src/public-api';
import { NgSelectModule } from '@ng-select/ng-select';
import { StockTransferComponent } from './stock-tranfser/stock-transfer.component';
import { StockIssueComponent } from './stock-issue/stock-issue.component';
import { IssueReportComponent } from './issue-report/issue-report.component';
import { ProductionComponent } from '../production/production/production.component';
import { MilkProcessingComponent } from './milk-processing.component.ts/milk-processing.component';


const routes: any = [
  { path: '', redirectTo: 'purchase', pathMatch: 'full' },
  {
    path: 'invoice',
    component: PurchaseComponent,
    data: { breadcrumb: 'Purchase' },
  },
  {
    path: 'invoice/:EditID',
    component: PurchaseComponent,
    data: { breadcrumb: 'Purchase Edit' },
  },
  {
    path: 'return',
    component: PurchaseReturnComponent,
    data: { breadcrumb: 'Purchase Return' },
  },
  {
    path: 'return/:EditID',
    component: PurchaseReturnComponent,
    data: { breadcrumb: 'Purchase Return Edit' },
  },
  {
    path: 'issue',
    component: StockIssueComponent,
    data: { breadcrumb: 'Stock Issue' },
  },
  {
    path: 'issuerpt',
    component: IssueReportComponent,
    data: { breadcrumb: 'Stock Issue Report' },
  },
  {
    path: 'production',
    component: ProductionComponent,
    data: { breadcrumb: 'Production' },
  },
  {
    path: 'transfer/:EditID',
    component: StockTransferComponent,
    data: { breadcrumb: 'Stock Transfer Edit' },
  },
  {
    path: 'transfer',
    component: StockTransferComponent,
    data: { breadcrumb: 'Stock Transfer' },
  },
  {
    path: 'milkprocessing',
    component: MilkProcessingComponent,
    data: { breadcrumb: 'Milk Processing' },
  },
];

@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseReturnComponent,
    PurchaseInvoiceComponent,
    StockTransferComponent,
    StockIssueComponent,
    ProductionComponent, 
    IssueReportComponent,
    MilkProcessingComponent

  ],
  imports: [
    CommonModule,
    // ComponentsModule,
    FutureTechLibModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class PurchaseModule {}
