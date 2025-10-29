import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ComboBoxAllModule,
  DropDownListAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../components/components.module';
import { AddPurchaseOrderComponent } from './add-purchase-order/add-purchase-order.component';
import { PurchaseOrdersComponent } from './pourchase-orders/purchase-orders.component';


const routes: any = [
  { path: '', redirectTo: 'purchaseorders', pathMatch: 'full' },
  { path: 'purchaseorders', component: PurchaseOrdersComponent, },
];

@NgModule({
  declarations: [
    AddPurchaseOrderComponent,
    PurchaseOrdersComponent
  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],

})
export class ProcurementModule { }
