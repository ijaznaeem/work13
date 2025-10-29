import { UsersListComponent } from './users-list/users-list.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ComboBoxAllModule,
  DropDownListAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../components/components.module';
import { SalesmanComponent } from './salesman/salesman.component';
import { GroupsComponent } from './usergroups/groups.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ExpenseheadComponent } from './expensehead/expensehead.component';
import { RawProductsComponent } from './raw-products/raw-products.component';
import { AddRawProductComponent } from './raw-products/addproducts/add-raw-product.component';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { RawCategoriesComponent } from './raw-categories/raw-categories.component';
import { ProductsComboComponent } from './product-combo/products-combo.component';
import { CtrlAcctsComponent } from '../products/ctrl-accts/ctrl-accts.component';
import { SetupsComponent } from './setups/setups.component';

const routes: any = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'rawproducts', component: RawProductsComponent, data: { breadcrumb: 'Raw Products' }, },
  { path: 'rawcategories', component: RawCategoriesComponent, data: { breadcrumb: 'Raw Categories' }, },
  { path: 'salesman', component: SalesmanComponent, data: { breadcrumb: 'Salesman List' }, },
  { path: 'expheads', component: ExpenseheadComponent, data: { breadcrumb: 'Expense Heads' }, },
  { path: 'grouprights', component: GroupsComponent, data: { breadcrumb: 'User Groups k u' }, },
  { path: 'users', component: UsersListComponent, data: { breadcrumb: 'Users List' }, },
  { path: 'ctrlaccts', component: CtrlAcctsComponent, data: { breadcrumb: 'Control Accounts' }, },
  { path: 'productscombo', component: ProductsComboComponent, data: { breadcrumb: 'Combo Products' }, },
  { path: 'branches', component: SetupsComponent, data: { breadcrumb: 'Branch Management' }, },

];

@NgModule({
  declarations: [
    GroupsComponent,
    UsersListComponent,
    ExpenseheadComponent,
    RawProductsComponent,
    RawCategoriesComponent,
    SalesmanComponent,
    AddRawProductComponent,
    ProductsComboComponent,
    CtrlAcctsComponent,
    SetupsComponent

  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    //ComponentsModule,
    FutureTechLibModule,
    DropDownListAllModule,
 
    NgbModule,
    TabsModule,
    ReactiveFormsModule,
    TreeViewModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class SettingsModule { }
