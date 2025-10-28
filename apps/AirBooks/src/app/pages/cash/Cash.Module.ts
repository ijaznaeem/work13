import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComponentsModule } from '../components/components.module';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { CashPaymentComponent } from './cashpayment/cash-payment.component';
import { CashReceivedComponent } from './cashreceived/cash-received.component';
import { DrCrVouchersComponent } from './drcr-vouchers/drcr-vouchers.component';
import { AccrualExpensesComponent } from './expenses-accrual/accrual-expenses.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { JournalVoucherComponent } from './journal-voucher/journal-voucher.component';
import { SalarySheetomponent } from './salary-sheet/salary-sheet.component';



const routes:any = [
  { path: '', redirectTo: 'cashrecvd', pathMatch: 'full' },
  {
    path: 'cashrecvd',
    component: CashReceivedComponent,
    data: { breadcrumb: 'Cash Receipt' },
  },
  {
    path: 'payment',
    component: CashPaymentComponent,
    data: { breadcrumb: 'Cash Payment' },
  },
  {
    path: 'jv',
    component: JournalVoucherComponent,
    data: { breadcrumb: 'Journal Voucher' },
  },
  {
    path: 'drcrvoucher',
    component: DrCrVouchersComponent,
    data: { breadcrumb: 'Debit/Credit Notes Voucher' },
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
    data: { breadcrumb: 'Expenses' },
  },
  {
    path: 'accrual-expenses',
    component: AccrualExpensesComponent,
    data: { breadcrumb: 'Expenses' },
  },
  {
    path: 'salary-sheet',
    component: SalarySheetomponent,
    data: { breadcrumb: 'Expenses' },
  },

];

@NgModule({
  declarations: [
    CashReceivedComponent,
    CashPaymentComponent,
    ExpensesComponent,
    JournalVoucherComponent,
    AccrualExpensesComponent,
    DrCrVouchersComponent, SalarySheetomponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    NgbModule,
    TabsModule,
    ReactiveFormsModule,
    FormsModule,

    RouterModule.forChild(routes),
  ],
})
export class CashModule {}
