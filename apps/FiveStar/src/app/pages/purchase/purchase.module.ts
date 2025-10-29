import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { PurchaseComponent } from './purchase/purchase.component';


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
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class PurchaseModule { }
