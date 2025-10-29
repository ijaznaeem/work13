import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ComboBoxAllModule,
  DropDownListAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QuillModule, QuillService } from 'ngx-quill';
import { ComponentsModule } from '../components/components.module';
import { AirlinesComponent } from './airlines/airlines.component';
import { AirportsComponent } from './airports/airports.component';
import { BranchesComponent } from './branches/branches.component';
import { TermsComponent } from './branches/terms/terms.component';
import { ExpenseheadComponent } from './expensehead/expensehead.component';
import { InvoiceStatusComponent } from './invoice-status/invoice-status.component';
import { NationalityComponent } from './nationality/nationality.component';
import { PackagesComponent } from './packages/packages.component';
import { PaymentModesComponent } from './payment-modes/payment-modes.component';
import { ProductRatesComponent } from './product-rates/product-rates.component';
import { ProductsComponent } from './products/products.component';
import { WarrantiesComponent } from './warranties/warranties.component';

const routes: any = [
  { path: '', redirectTo: 'depts', pathMatch: 'full' },
  {
    path: 'products',
    component: ProductsComponent,
    data: { breadcrumb: 'Manage Products' },
  },
  {
    path: 'product-rates',
    component: ProductRatesComponent,
    data: { breadcrumb: 'Manage Product Rates' },
  },
  {
    path: 'nationalities',
    component: NationalityComponent,
    data: { breadcrumb: 'Manage Nationalities' },
  },
  { path: 'packages', component: PackagesComponent, data: { breadcrumb: 'Manage Packages' }, },
  { path: 'airports', component: AirportsComponent, data: { breadcrumb: 'Airpost' }, },
  { path: 'airlines', component: AirlinesComponent, data: { breadcrumb: 'Air Lines' }, },
  { path: 'paymentmodes', component: PaymentModesComponent, data: { breadcrumb: 'Air Lines' }, },
  { path: 'inv-status', component: InvoiceStatusComponent, data: { breadcrumb: 'Invoice Status' }, },
  { path: 'exp-heads', component: ExpenseheadComponent, data: { breadcrumb: 'Expense Heads' }, },
  { path: 'branches', component: BranchesComponent, data: { breadcrumb: 'Branches' }, },
  { path: 'warranties', component: WarrantiesComponent, data: { breadcrumb: 'Branches' }, },


];

@NgModule({
  declarations: [
    ProductsComponent,
    ProductRatesComponent,
    NationalityComponent,
    PackagesComponent,
    AirlinesComponent,
    AirportsComponent,
    PaymentModesComponent,
    InvoiceStatusComponent,
    ExpenseheadComponent,
    BranchesComponent,
    WarrantiesComponent,
    TermsComponent

  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    TabsModule,
    TreeViewModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
    QuillModule.forRoot()
  ],
  providers:[
    QuillService
  ]
})
export class SettingsModule { }
