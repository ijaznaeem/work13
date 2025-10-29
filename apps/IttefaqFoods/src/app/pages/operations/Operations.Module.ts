import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AutoCompleteModule, ComboBoxAllModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ComponentsModule } from '../components/components.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { OperationsComponent } from './operations/operations.component';
import { ProcessProductComponent } from './process-product/process-product.component';



const routes :any= [
  { path: '', redirectTo: 'invoices', pathMatch: 'full' },
  {
    path: 'invoices',
    component: OperationsComponent,
    data: { breadcrumb: 'Invoices List' },
  },

];

@NgModule({
  declarations: [
    OperationsComponent,
    ProcessProductComponent
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
