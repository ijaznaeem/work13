import { CtrlAcctsComponent } from './ctrlaccts/ctrlaccts.component';
import { UsersListComponent } from './users-list/users-list.component';
import { StoresComponent } from './stores/stores.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { UnitsComponent } from './units/units.component';
import { ComponentsModule } from '../components/components.module';
import { ExpenseheadComponent } from './expensehead/expensehead.component';
import { SetupsComponent } from './setups/setups.component';


const routes = [
  { path: '', redirectTo: 'ctrlaccts', pathMatch: 'full' },
  { path: 'ctrlaccts', component: CtrlAcctsComponent, data: { breadcrumb: 'Control Accts' } },
  { path: 'stores', component: StoresComponent, data: { breadcrumb: 'Manage Stores' } },
  { path: 'users', component: UsersListComponent, data: { breadcrumb: 'Users' } },
  { path: 'setups', component: SetupsComponent, data: { breadcrumb: 'Setups List' } },
];



@NgModule({
  declarations: [

    ProductsListComponent,
    CategoriesComponent,
    UnitsComponent,
    ExpenseheadComponent,
    StoresComponent,
    SetupsComponent,
    UsersListComponent,
    CtrlAcctsComponent

  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class SettingsModule { }
