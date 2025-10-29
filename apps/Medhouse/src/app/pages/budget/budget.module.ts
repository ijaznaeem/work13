import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { BudgetManagementComponent } from './budget-management/budget-management.component';
import { BudgetDetailsComponent } from './budget-details/budget-details.component';
import { BudgetTransferComponent } from './budget-transfer/budget-transfer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'manage-budget-heads',
    pathMatch: 'full',
  },
  {
    path: 'manage-budget-heads',
    component: BudgetManagementComponent,
    data: {
      title: 'Budget Management Heads',
    },
  },
  {
    path: 'budget-details/:id',
    component: BudgetDetailsComponent,
    data: {
      title: 'Budget Details',
    },
  },
  {
    path: 'budget-transfer',
    component: BudgetTransferComponent,
    data: {
      title: 'Budget Transfer',
    },
  },
];

@NgModule({
  declarations: [
    BudgetManagementComponent,
    BudgetDetailsComponent,
    BudgetTransferComponent,
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
  exports: [BudgetManagementComponent, BudgetDetailsComponent, BudgetTransferComponent],
})
export class BudgetModule {}