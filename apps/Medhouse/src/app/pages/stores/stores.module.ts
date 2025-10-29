import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ComponentsModule } from '../components/components.module';
import { GrnAddComponent } from './grn-add/grn-add.component';
import { GrnReportComponent } from './grn-report/grn-report.component';

const routes:any = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'grn-report', component: GrnReportComponent, },
  { path: 'grn-add', component: GrnAddComponent, },

];
@NgModule({
  declarations: [
    GrnReportComponent,
    GrnAddComponent
  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    TabsModule,
    // FutureTechLibModule,
    GridAllModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ]
})
export class StoresModule { }
