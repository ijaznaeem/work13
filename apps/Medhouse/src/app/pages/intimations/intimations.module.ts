import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { IntimationFormComponent } from './intimation-form/intimation-form.component';
import { IntimationListComponent } from './intimation-list/intimation-list.component';
import { IntimationViewComponent } from './intimation-view/intimation-view.component';
import { ComponentsModule } from '../components/components.module';
import { RequisitionListComponent } from './requisition-list/requisition-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'intimation-documents',
    pathMatch: 'full',
  },
  {
    path: 'intimation-documents',
    component: IntimationListComponent,
    data: {
      title: 'Intimation Letters',
    },
  },
  {
    path: 'add-intimation',
    component: IntimationFormComponent,
    data: {
      title: 'New Intimation Letter',
    },
  },
  {
    path: 'edit-intimation/:id',
    component: IntimationFormComponent,
    data: {
      title: 'Edit Intimation Letter',
    },
  },
  {
    path: 'view-intimation/:id',
    component: IntimationViewComponent,
    data: {
      title: 'View Intimation Letter',
    },
  },
  {
    path: 'requisitions',
    component: RequisitionListComponent,
    data: {
      title: 'Requisitions List',
    },
  },
];

@NgModule({
  declarations: [
    IntimationListComponent,
    IntimationFormComponent,
    IntimationViewComponent,
    RequisitionListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
  exports: [IntimationFormComponent, IntimationViewComponent],
})
export class IntimationsModule {}
