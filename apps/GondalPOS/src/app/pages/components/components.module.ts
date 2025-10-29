import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from '../reports/dynamic-table/dynamic-table.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule, AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CrudListComponent } from './crud-list/crud-list.component';
import { CrudComponent } from './crud/crud.component';
import { CrudFormComponent } from './crud-form/crud-form.component';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { DataTablesModule } from 'angular-datatables';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { MultiColComboboxComponent } from './multi-col-combobox/multi-col-combobox.component';
import { TestInputComponent } from './test-input/test-input.component';


@NgModule({
  declarations: [
    CrudComponent,
    CrudFormComponent,
    CrudListComponent,
    DynamicTableComponent,
    ModalContainerComponent,
    MultiColComboboxComponent,
    TestInputComponent],
  imports: [
    CommonModule,
    DirectivesModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    DataTablesModule,
    NgxDropzoneModule,
    AutoCompleteModule,
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
