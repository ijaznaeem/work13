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
import { SendSMSService } from '../../services/sms.service';
import { MyToastService } from '../../services/toaster.server';
import { CategoriesComponent } from './categories/categories.component';
import { CustomerAcctsComponent } from './customers/customer-accts/customer-accts.component';
import { CustomersComponent } from './customers/customers-list/customers.component';
import { InvoicesListComponent } from './invoices/invoice-list/invoices-list.component';
import { InvoiceComponent } from './invoices/invoice/invoice.component';
import { FilterProductsPipe } from './orders/filter-products/filter-products.pipe';
import { OrdersListComponent } from './orders/list/orders-list.component';
import { OrderComponent } from './orders/order/order.component';
import { ProductsComponent } from './products/products.component';


const routes:any = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, data: { breadcrumb: 'Products List' } },
  { path: 'categories', component: CategoriesComponent, data: { breadcrumb: 'Categories List' } },
  { path: 'customers', component: CustomersComponent, data: { breadcrumb: 'Customers List' } },
  { path: 'orders-list', component: OrdersListComponent, data: { breadcrumb: 'Orders List' } },
  { path: 'add-order', component: OrderComponent, data: { breadcrumb: 'Add Order' } },
  { path: 'invoices-list', component: InvoicesListComponent, data: { breadcrumb: 'Invoices List' } },
  { path: 'order', component: OrderComponent, data: { breadcrumb: 'Order Details' } },
  { path: 'order/:id', component: OrderComponent, data: { breadcrumb: 'Order Details' } },
  { path: 'invoice', component: InvoiceComponent, data: { breadcrumb: 'Invoice Details' } },
  { path: 'customer-accts', component: CustomerAcctsComponent, data: { breadcrumb: 'Customer Accounts' } },

];
@NgModule({
  declarations: [
  ProductsComponent,
  CategoriesComponent,
  CustomersComponent,
  OrdersListComponent,
  OrderComponent,
  InvoiceComponent,
  InvoicesListComponent,
  CustomerAcctsComponent,
  FilterProductsPipe
  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    NgSelectModule,
    Ng2SmartTableModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  providers: [
    MyToastService,
    SendSMSService
  ]
})
export class TasksModule { }
