import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ComboBoxAllModule
} from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { LabourComponent } from './labour/labour.component';
import { ProductionComponent } from './production/production.component';
// import { FutureTechLibModule } from 'projects/future-tech-lib/src/public-api';

const routes: any = [
  { path: '', redirectTo: 'production', pathMatch: 'full' },

  {
    path: 'production',
    component: ProductionComponent,
    data: { breadcrumb: 'Production' },
  },
  {
    path: 'production/:EditID',
    component: ProductionComponent,
    data: { breadcrumb: 'Production Edit' },
  },
  {
    path: 'labour',
    component: LabourComponent,
    data: { breadcrumb: 'Labour' },
  },
  {
    path: 'labour/:EditID',
    component: LabourComponent,
    data: { breadcrumb: 'Labour Edit' },
  },
];

@NgModule({
  declarations: [
    LabourComponent,
    ProductionComponent,
  ],
  imports: [
    CommonModule,
    // ComponentsModule,
    FutureTechLibModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class ProductionModule {}
