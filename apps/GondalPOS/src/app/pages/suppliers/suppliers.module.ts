import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuppliersListComponent } from './suppliers-list/suppliers-list.component';
import { SupplierAcctsComponent } from './supplier-accts/supplier-accts.component';
import { SupplierPaymentsComponent } from './supplier-payments/supplier-payments.component';
import { ComponentsModule } from '../components/components.module';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';


const routes:any = [
  { path: '', redirectTo: 'supplier', pathMatch: 'full' },
  { path: 'list', component: SuppliersListComponent, data: { breadcrumb: 'Suppliers List' } },
  { path: 'accts', component: SupplierAcctsComponent, data: { breadcrumb: 'Customer Accounts' } },
  { path: 'payment', component: SupplierPaymentsComponent, data: { breadcrumb: 'Customer Payments' } },

];

@NgModule({
  declarations: [SuppliersListComponent, SupplierAcctsComponent, SupplierPaymentsComponent],
  imports: [
    CommonModule,

    DirectivesModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    ComponentsModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),

    RouterModule.forChild(routes)
  ]
})
export class SuppliersModule { }
