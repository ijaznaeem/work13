import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CrudListComponent } from './crud-list/crud-list.component';
import { CrudComponent } from './crud/crud.component';
import { CrudFormComponent } from './crud-form/crud-form.component';
import { DataTablesModule } from 'angular-datatables';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { MultiColComboboxComponent } from './multi-col-combobox/multi-col-combobox.component';
import { TestInputComponent } from './test-input/test-input.component';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { AutoCompleteAllModule, ComboBoxAllModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';


@NgModule({
  declarations: [
    CrudComponent,
    CrudFormComponent,
    CrudListComponent,
    ModalContainerComponent,
    DynamicTableComponent,
    MultiColComboboxComponent,
    TestInputComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ComboBoxAllModule,
    DropDownListAllModule,AutoCompleteAllModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
  ],
  exports: [
    DynamicTableComponent,
    CrudComponent,
    CrudListComponent,
    CrudFormComponent,
    MultiColComboboxComponent
  ]
})
export class ComponentsModule { }
