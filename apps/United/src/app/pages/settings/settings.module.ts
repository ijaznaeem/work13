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
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../components/components.module';
import { DeptsComponent } from './depts/depts.component';
import { UsergroupsComponent } from './usergroups/usergroups.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { StoresComponent } from './stores/stores.component';

const routes:any= [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, data: { breadcrumb: 'Manage Products' }, },
  { path: 'categories', component: CategoriesComponent, data: { breadcrumb: 'Product Categories' }, },
  { path: 'stores', component: StoresComponent, data: { breadcrumb: 'Stores' }, },
  { path: 'users', component: UsersListComponent, data: { breadcrumb: 'Users' }, },
  { path: 'usergroups', component: UsergroupsComponent, data: { breadcrumb: 'User Groups' }, },

];

@NgModule({
  declarations: [
    ProductsComponent,
    DeptsComponent,
    UsergroupsComponent,
    UsersListComponent,
    CategoriesComponent,
    StoresComponent

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
export class SettingsModule {}
