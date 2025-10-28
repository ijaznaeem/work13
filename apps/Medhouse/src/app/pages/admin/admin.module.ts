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
import { AccountsPartenersComponent } from './accounts-parteners/accounts-parteners.component';
import { AccountsTargetComponent } from './accounts-target/accounts-target.component';
import { AccountsTypeComponent } from './accounts-type/accounts-type.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AddAccountsComponent } from './add-accounts/add-accounts.component';
import { CategoriesComponent } from './categories/categories.component';
import { DepartmentMenuAccessComponent } from './department-menu-access/department-menu-access.component';
import { EventsComponent } from './events/events.component';
import { ProductPriceManagementComponent } from './price-management/product-price-management.component';
import { ProductBonusSlabsComponent } from './product-bonus-slabs/product-bonus-slabs.component';
import { ProductDedicationReportComponent } from './product-dedication-report/product-dedication-report.component';
import { ProductDedicationComponent } from './product-dedication/product-dedication.component';
import { ProductsMasterComponent } from './products-master/products-master.component';
import { ProductsRawComponent } from './products-raw/products-raw.component';
import { ProductsComponent } from './products/products.component';
import { RegionsComponent } from './regions/regions.component';
import { RemindersComponent } from './reminder/reminders.component';
import { UnitsComponent } from './units/units.component';
import { VacantProdutcsReportComponent } from './vacant-products-report/vacant-products-report.component';

const routes: any = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, data: { breadcrumb: 'Finish Products' }, },
  { path: 'products-raw', component: ProductsRawComponent, data: { breadcrumb: 'Raw Products' }, },
  { path: 'products-master', component: ProductsMasterComponent, data: { breadcrumb: 'Master Products' }, },
  { path: 'products-categories', component: CategoriesComponent, data: { breadcrumb: 'Products Categories' }, },
  { path: 'products-dedication', component: ProductDedicationComponent, data: { breadcrumb: 'Products Dedication' }, },
  { path: 'products-dedication-rpt', component: ProductDedicationReportComponent, data: { breadcrumb: 'Products Dedication Report' }, },
  { path: 'regions', component: RegionsComponent, data: { breadcrumb: 'Regions' }, },
  { path: 'vacant-products', component: VacantProdutcsReportComponent, data: { breadcrumb: 'Vacant Products' }, },
  { path: 'reminders', component: RemindersComponent, data: { breadcrumb: 'Reminders' }, },
  { path: 'events', component: EventsComponent, data: { breadcrumb: 'Reminders' }, },
  { path: 'products-bonusslabs', component: ProductBonusSlabsComponent, data: { breadcrumb: 'Bonus Slabs' }, },
  { path: 'price-management', component: ProductPriceManagementComponent, data: { breadcrumb: 'Product Price Management' }, },
  { path: 'accounts', component: AccountsComponent, data: { breadcrumb: 'Accounts List' }, },
  { path: 'accounts-type', component: AccountsTypeComponent, data: { breadcrumb: 'Accounts Type' }, },
  { path: 'units', component: UnitsComponent, data: { breadcrumb: 'Units' }, },
  { path: 'menu-access', component: DepartmentMenuAccessComponent, data: { breadcrumb: 'Menu Access' }, },

];

@NgModule({
  declarations: [
    ProductsComponent,
    ProductsRawComponent,
    ProductsMasterComponent,
    CategoriesComponent,
    RegionsComponent,
    ProductDedicationComponent,
    ProductDedicationReportComponent,
    VacantProdutcsReportComponent,
    RemindersComponent,
    EventsComponent,
    ProductBonusSlabsComponent,
    ProductPriceManagementComponent,
    AccountsComponent,
    AddAccountsComponent,
    AccountsPartenersComponent,
    AccountsTargetComponent,
    AccountsTypeComponent,
    UnitsComponent,
    DepartmentMenuAccessComponent

  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    // FutureTechLibModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],

})
export class AdminMudule { }
