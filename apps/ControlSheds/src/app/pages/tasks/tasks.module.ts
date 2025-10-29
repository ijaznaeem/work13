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

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QuillModule } from 'ngx-quill';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { ChickenSaleComponent } from './chicken-sale/chicken-sale.component';
import { AddMortalityComponent } from './mortality/add-mortality.component';
import { StockConsumedComponent } from './stock-consumed/stock-consumed.component';



const routes: any = [
  { path: '', redirectTo: 'sale', pathMatch: 'full' },
  { path: 'addmortality', component: AddMortalityComponent, data: { breadcrumb: 'Add Mortality' }, },
  { path: 'stockconsumed', component: StockConsumedComponent, data: { breadcrumb: 'Stock Consumed' }, },
  { path: 'sale', component: ChickenSaleComponent, data: { breadcrumb: 'Chicken Sale' }, },
  
 
];

@NgModule({
  declarations: [
   
    AddMortalityComponent,
    ChickenSaleComponent,
    StockConsumedComponent
  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    DropDownListAllModule,
    Ng2SmartTableModule,
    NgbModule,
    TabsModule,
    ReactiveFormsModule,
    TreeViewModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
    QuillModule.forRoot(),
  ],
})
export class TasksModule { }
