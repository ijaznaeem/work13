import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { AuditComponent } from './audit/audit.component';
import { ProductionPlanComponent } from './production-plan/production-plan.component';
import { ProductionInvoiceComponent } from './production/production-invoice.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { PurchaseComponent } from './purchase/purchase.component';

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
    path: 'production',
    component: ProductionInvoiceComponent,
    data: { breadcrumb: 'Production' },
  },
  {
    path: 'production-plan',
    component: ProductionPlanComponent,
    data: { breadcrumb: 'Production' },
  },
  {
    path: 'production/:EditID',
    component: ProductionInvoiceComponent,
    data: { breadcrumb: 'Production' },
  },
  {
    path: 'audit',
    component: AuditComponent,
    data: { breadcrumb: 'Audit' },
  },
];

@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseReturnComponent,
    PurchaseInvoiceComponent,
    ProductionInvoiceComponent,
    ProductionPlanComponent,
    AuditComponent,
  ],
  imports: [
    CommonModule,
    // ComponentsModule,
    Ng2SmartTableModule,
    FutureTechLibModule,
    ComboBoxAllModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class PurchaseModule {}
