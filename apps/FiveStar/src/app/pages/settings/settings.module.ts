import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ComponentsModule } from '../components/components.module';
import { SalesmanComponent } from './Accounttypes/accounttypes.component';
import { CategoriesComponent } from './categories/categories.component';
import { CompaniesComponent } from './companies/companies.component';
import { ExpenseheadComponent } from './expensehead/expensehead.component';
import { ProductsComponent } from './products/products.component';
import { RoutesComponent } from './routes/routes.component';
import { SetupsComponent } from './setups/setups.component';
import { UnitsComponent } from './units/units.component';
import { UsersListComponent } from './users-list/users-list.component';


const routes:any = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, data: { breadcrumb: 'Products List' } },
  { path: 'companies', component: CompaniesComponent, data: { breadcrumb: 'Companies' } },
  { path: 'units', component: UnitsComponent, data: { breadcrumb: 'Units' } },
  { path: 'routes', component: RoutesComponent, data: { breadcrumb: 'Routes' } },
  { path: 'categories', component: CategoriesComponent, data: { breadcrumb: 'Categories' } },
  { path: 'salesman', component: SalesmanComponent, data: { breadcrumb: 'Categories' } },
  { path: 'expensheads', component: ExpenseheadComponent, data: { breadcrumb: 'Expense Heads' } },
  { path: 'users', component: UsersListComponent, data: { breadcrumb: 'Setups List' } },
];




@NgModule({
  declarations: [
    ProductsComponent,
    CompaniesComponent,
    CategoriesComponent,
    SalesmanComponent,
    UnitsComponent,
    RoutesComponent,
    ExpenseheadComponent,
    SetupsComponent,
    UsersListComponent

  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    ComponentsModule,
    NgxDropzoneModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class SettingsModule { }
