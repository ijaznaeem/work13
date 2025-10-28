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
import { ComponentsModule } from '../components/components.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PurchaseGrainComponent } from './purchase-grain/purchase-grain.component';
import { PurchasePaddyComponent } from './purchase-paddy/purchase-paddy.component';
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
    path: 'grain',
    component: PurchaseGrainComponent,
    data: { breadcrumb: 'Purchase Grain' },
  },
  {
    path: 'paddy',
    component: PurchasePaddyComponent,
    data: { breadcrumb: 'Purchase Paddy' },
  },
  {
    path: 'return/:EditID',
    component: PurchaseReturnComponent,
    data: { breadcrumb: 'Purchase Return Edit' },
  },
];

@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseReturnComponent,
    PurchaseInvoiceComponent,
    PurchaseGrainComponent,
    PurchasePaddyComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule ,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class PurchaseModule {}
