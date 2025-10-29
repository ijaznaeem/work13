import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ComboBoxAllModule,
  DropDownListAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { FormulationListComponent } from './formulation-list/formulation-list.component';
import { FormulationComponent } from './formulation/formulation.component';
import { ProductsComponent } from './products/products.component';
import { RawProductsComponent } from './rawproducts/rawproducts.component';

const routes: any = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, data: { breadcrumb: 'Manage Products' }, },
  { path: 'raw', component: RawProductsComponent, data: { breadcrumb: 'Raw Products' }, },
  { path: 'formulation', component: FormulationComponent, data: { breadcrumb: 'Formulation of Products' }, },

];

@NgModule({
  declarations: [
    ProductsComponent,
    RawProductsComponent,
    FormulationComponent,
    FormulationListComponent

  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    FutureTechLibModule,
    NgbModule,
    Ng2SmartTableModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class ProductsModule { }
