import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ComboBoxAllModule
} from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../components/components.module';
import { ProductionComponent } from './production/production.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { PurchaseComponent } from './purchase/purchase.component';
// import { FutureTechLibModule } from 'projects/future-tech-lib/src/public-api';

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
    component: ProductionComponent,
    data: { breadcrumb: 'Production' },
  },
  {
    path: 'production/:EditID',
    component: ProductionComponent,
    data: { breadcrumb: 'Production Edit' },
  },
];

@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseReturnComponent,
    PurchaseInvoiceComponent,
    ProductionComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    Ng2SmartTableModule,
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
