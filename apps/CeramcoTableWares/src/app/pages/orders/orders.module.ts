import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { OrderComponent } from './order/order.component';
import { OrdersListComponent } from './orders-list/orders.list.component';



const routes :any= [
  { path: '', redirectTo: 'add', pathMatch: 'full' },
  { path: 'add', component: OrderComponent, data: { breadcrumb: 'Sale' } },
  { path: 'add/:EditID', component: OrderComponent, data: { breadcrumb: 'Sale' } },
  { path: 'list', component: OrdersListComponent, data: { breadcrumb: 'Product Processing' } },

];


@NgModule({
  declarations: [
    OrderComponent,
  OrdersListComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    ComponentsModule,
    // FutureTechLibModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class OrdersModule { }
