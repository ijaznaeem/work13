import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  AutoCompleteAllModule,
  ComboBoxModule,
  DropDownListModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { QuillModule } from 'ngx-quill';
import { CrudFormComponent } from './crud-form/crud-form.component';
import { CrudListComponent } from './crud-list/crud-list.component';
import { CrudComponent } from './crud/crud.component';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { FtDataTableComponent } from './ft-data-table/ft-data-table.component';
// import { FtDatePickerComponent } from './ft-date-picker/ft-date-picker.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { MultiColComboboxComponent } from './multi-col-combobox/multi-col-combobox.component';
import { FilterPipe } from './table-filter-pipe/table-filter.pipe';
import { TableWithGroupComponent } from './table-with-group/table-with-group.component';
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
    FilterPipe,
    TableWithGroupComponent
    // FtDatePickerComponent,
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    DropDownListModule,
    HttpClientModule,
    ComboBoxModule,
    NgxDropzoneModule,
    AutoCompleteAllModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    NgxDatatableModule,
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
    FtDataTableComponent,
    FilterPipe,
    TableWithGroupComponent
    // FtDatePickerComponent,
  ],
})
export class ComponentsModule {}
