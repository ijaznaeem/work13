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
import { DirectivesModule } from '../../theme/directives/directives.module';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';



const routes:any = [
  { path: '', redirectTo: 'purchase', pathMatch: 'full' },
  { path: 'purchase', component: PurchaseComponent, data: { breadcrumb: 'Purchase' } },
  { path: 'purchase/:EditID', component: PurchaseComponent, data: { breadcrumb: 'Purchase Edit' } },
  { path: 'purchasereturn', component: PurchaseReturnComponent, data: { breadcrumb: 'Purchase Return' } },
  { path: 'purchasereturn/:EditID', component: PurchaseReturnComponent, data: { breadcrumb: 'Purchase Return Edit' } },
];


@NgModule({
  declarations: [PurchaseComponent, PurchaseReturnComponent, PurchaseInvoiceComponent],
  imports: [
    CommonModule,
    DirectivesModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class PurchaseModule { }
