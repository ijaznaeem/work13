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
import { ProductsComponent } from './products/products.component';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { CategoriesComponent } from './categories/categories.component';

const routes: any = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, data: { breadcrumb: 'Manage Products' }, },
  { path: 'categories', component: CategoriesComponent, data: { breadcrumb: 'Product Categories' }, },

];

@NgModule({
  declarations: [
    ProductsComponent,
    CategoriesComponent

  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    FutureTechLibModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class ProductsModule { }
