import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPrintModule } from 'ngx-print';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { AdvancePaymentComponent } from './add-advance/advance-payment.component';
import { DesignationsComponent } from './designations/designations.component';
import { EmployeeAcctsComponent } from './employee-accts/employee-accts.component';
import { EmployeeSalarysheetComponent } from './employee-salarysheet/employee-salarysheet.component';
import { EmployeesComponent } from './employees/employees.component';



const routes:any = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeesComponent, data: { breadcrumb: 'Employees List' } },
  { path: 'dsignations', component: DesignationsComponent, data: { breadcrumb: 'Designations List' } },
  { path: 'accounts', component: EmployeeAcctsComponent, data: { breadcrumb: 'Employees Accounts' } },
  { path: 'advance', component: AdvancePaymentComponent, data: { breadcrumb: 'Advance Payment' } },
  { path: 'salary', component: EmployeeSalarysheetComponent, data: { breadcrumb: 'Salary Sheet' } },


];
@NgModule({
  declarations: [
    EmployeesComponent,
    DesignationsComponent,
    EmployeeAcctsComponent,
    AdvancePaymentComponent,
    EmployeeSalarysheetComponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    NgxPrintModule,
    NgSelectModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class EmployeesModule { }
