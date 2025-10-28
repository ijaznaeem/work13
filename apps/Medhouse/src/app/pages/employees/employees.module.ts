import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../components/components.module';
import { AddEmployeesComponent } from './add-employees/add-employees.component';
import { EmployeeAcctsComponent } from './employee-accts/employee-accts.component';
import { EmployeesComponent } from './employees/employees.component';


const routes:any = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: EmployeesComponent, data: { breadcrumb: 'Employees List' } },
  { path: 'accts', component: EmployeeAcctsComponent, data: { breadcrumb: 'Employees Accounts' } },

];
@NgModule({
  declarations: [
    EmployeesComponent,
    AddEmployeesComponent,
    EmployeeAcctsComponent
  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    // FutureTechLibModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ]
})
export class EmployeesModule { }
