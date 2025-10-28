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
import { ComponentsModule } from '../components/components.module';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';

// import { FutureTechLibModule } from 'projects/future-tech-lib/src/public-api';

const routes: any = [
  { path: '', redirectTo: 'purchase', pathMatch: 'full' },
  {
    path: 'invoice',
    component: PurchaseInvoiceComponent,
    data: { breadcrumb: 'Purchase' },
  },
  {
    path: 'invoice/:EditID',
    component: PurchaseInvoiceComponent,
    data: { breadcrumb: 'Purchase Edit' },
  },

];

@NgModule({
  declarations: [
    PurchaseInvoiceComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgbModule,
    FutureTechLibModule,
    ReactiveFormsModule,
    NgSelectModule ,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class PurchaseModule {}
