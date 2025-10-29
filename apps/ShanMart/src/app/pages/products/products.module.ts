import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategorieslistComponent } from './categories/categorieslist/categorieslist.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProductlistComponent } from './productlist/productlist.component';
import { ProductDefinationComponent } from './productdefination/productdefination.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { ComponentsModule } from '../components/components.module';
import { OrderslistComponent } from './orderslist/orderslist.component';

export const routes: any = [
  { path: '', redirectTo: 'add', pathMatch: 'full' },
  {
    path: 'add',
    component: ProductDefinationComponent,
    data: { breadcrumb: 'Product Defination' },
  },
  {
    path: 'add/:editID',
    component: ProductDefinationComponent,
    data: { breadcrumb: 'Edit Product Defination' },
  },
  {
    path: 'productlist',
    component: ProductlistComponent,
    data: { breadcrumb: 'Product List' },
  },
  {
    path: 'categories',
    component: CategorieslistComponent,
    data: { breadcrumb: 'Categories' },
  },
  {
    path: 'orderslist',
    component: OrderslistComponent,
    data: { breadcrumb: 'Orders List' },
  },
];

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    ComboBoxModule,
    ModalModule,
  ],

  declarations: [
    ProductDefinationComponent,
    CategorieslistComponent,
    ProductlistComponent,
    OrderslistComponent,
  ],
})
export class ProductsModule {}
