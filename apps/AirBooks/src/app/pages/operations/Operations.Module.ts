import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {
  AutoCompleteModule,
  ComboBoxAllModule,
  DropDownListAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { ComponentsModule } from '../components/components.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { OperationsComponent } from './operations/operations.component';
import { ProcessProductComponent } from './process-product/process-product.component';
import { SuppliersBillComponent } from './suppliers-bill/suppliers-bill.component';
import { VisaTrackingComponent } from './visa-trackingg/visa-tracking/visa-tracking.component';
import { AddVisaTrackingComponent } from './visa-trackingg/add-visatracking/add-visatracking.component';
import { VisaTrackingAlertComponent } from './visa-trackingg/visa-tracking-alert/visa-tracking-alert.component';
import { SaleReturnComponent } from './sale-returm/sale-return.component';
import { DrCrNoteComponent } from './drcr-note/drcr-note.component';
import { DrCrNotesListComponent } from './drcr-noteslist/drcr-noteslist.component';


const routes: any = [
  { path: '', redirectTo: 'invoices', pathMatch: 'full' },
  {
    path: 'invoices',
    component: OperationsComponent,
    data: { breadcrumb: 'Invoices List' },
  },
  {
    path: 'bills',
    component: SuppliersBillComponent,
    data: { breadcrumb: 'Suppliers Bill' },
  },
  {
    path: 'visa-tracking',
    component: VisaTrackingComponent,
    data: { breadcrumb: 'Visa Tracking' },
  },
  {
    path: 'visa-alert',
    component: VisaTrackingAlertComponent,
    data: { breadcrumb: 'Visa Tracking Alert' },
  },
  {
    path: 'salereturn',
    component: SaleReturnComponent,
    data: { breadcrumb: 'Sale Return' },
  },
  {
    path: 'noteslist',
    component: DrCrNotesListComponent,
    data: { breadcrumb: 'Debit/Credit Notes' },
  },
];

@NgModule({
  declarations: [
    OperationsComponent,
    ProcessProductComponent,
    SuppliersBillComponent,
    VisaTrackingComponent,
    AddVisaTrackingComponent,
    VisaTrackingAlertComponent,
    SaleReturnComponent, 
    DrCrNoteComponent,
    DrCrNotesListComponent
  ],

  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    AutoCompleteModule,
    NgbModule,
    TabsModule,
    ReactiveFormsModule,
    FormsModule,

    RouterModule.forChild(routes),
  ],
})
export class OperationsModule {}
