import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoCompleteModule, ComboBoxAllModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ComponentsModule } from '../components/components.module';
import { SupportTicketsHistoryComponent } from './support-tickets-history/support-tickets-history.component';
import { SupportTicketsListComponent } from './support-tickets-list/support-tickets-list.component';

const routes :any= [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {    path: 'list',    component: SupportTicketsListComponent,    data: { breadcrumb: 'SupportTickets' }},
  {    path: 'history/:id',    component: SupportTicketsHistoryComponent,    data: { breadcrumb: 'SupportTickets' }},
  {    path: 'history',    component: SupportTicketsHistoryComponent,    data: { breadcrumb: 'SupportTickets' }},
];

@NgModule({
  declarations: [
    SupportTicketsListComponent,
    SupportTicketsHistoryComponent

  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    NgxExtendedPdfViewerModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    AutoCompleteModule,
    TabsModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    FormsModule,

    RouterModule.forChild(routes),
  ],
})
export class SupportTicketsModule {}
