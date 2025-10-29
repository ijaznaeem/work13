import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutoCompleteAllModule, ComboBoxModule, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { QuillModule } from 'ngx-quill';
import { PipeModule } from '../../shared/pipes/pipe.module';
import { CrudFormComponent } from './crud-form/crud-form.component';
import { CrudListComponent } from './crud-list/crud-list.component';
import { CrudComponent } from './crud/crud.component';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { FtDataTableComponent } from './ft-data-table/ft-data-table.component';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { MultiColComboboxComponent } from './multi-col-combobox/multi-col-combobox.component';
import { FilterPipe } from './table-filter-pipe/table-filter.pipe';
import { TestInputComponent } from './test-input/test-input.component';

@NgModule({
  declarations: [
    CrudComponent,
    CrudFormComponent,
    CrudListComponent,
    ModalContainerComponent,
    DynamicTableComponent,
    MultiColComboboxComponent,
    DynamicTableComponent,
    FtDataTableComponent,
    TestInputComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    DropDownListModule,
    HttpClientModule,
    ComboBoxModule,
    PipeModule,
    NgSelectModule,
    AutoCompleteAllModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    NgxDropzoneModule,
    ModalModule.forRoot(),
    QuillModule.forRoot(),
  ],
  exports: [
    DynamicTableComponent,
    CrudComponent,
    CrudListComponent,
    CrudFormComponent,
    DynamicTableComponent,
    MultiColComboboxComponent,
    FtDataTableComponent
  ]
})
export class ComponentsModule { }
