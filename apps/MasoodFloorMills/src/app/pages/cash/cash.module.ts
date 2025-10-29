import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashPaymentComponent } from './cash-payment/cash-payment.component';
import { CashReceiptComponent } from './cash-receipt/cash-receipt.component';
import { ExpendComponent } from './expend/expend.component';
import { AddRecoveryComponent } from './add-recovery/add-recovery.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ComponentsModule } from '../components/components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { JournalvoucherComponent } from './journalvoucher/journal-voucher.component';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { BankReceiptComponent } from './bank-receipt/bank-receipt.component';
import { BankPaymentComponent } from './bank-payment/bank-payment.component';



const routes:any = [
  { path: '', redirectTo: 'custoemerslist', pathMatch: 'full' },
  { path: 'cashpayment', component: CashPaymentComponent, data: { breadcrumb: 'Cash Payments' } },
  { path: 'cashpayment/:EditID', component: CashPaymentComponent, data: { breadcrumb: 'Cash Payments' } },
  { path: 'bankpayment', component: BankPaymentComponent, data: { breadcrumb: 'Cash Payments' } },
  { path: 'bankpayment/:EditID', component: CashPaymentComponent, data: { breadcrumb: 'Cash Payments' } },
  { path: 'cashreceipt', component: CashReceiptComponent, data: { breadcrumb: 'Cash Reciepts' } },
  { path: 'cashreceipt/:EditID', component: CashReceiptComponent, data: { breadcrumb: 'Bank Reciepts' } },
  { path: 'bankreceipt', component: BankReceiptComponent, data: { breadcrumb: 'Bank Reciepts' } },
  { path: 'bankreceipt/:EditID', component: BankReceiptComponent, data: { breadcrumb: 'Cash Reciepts' } },
  { path: 'expense', component: ExpendComponent, data: { breadcrumb: 'Add Expense' } },
  { path: 'recovery', component: AddRecoveryComponent, data: { breadcrumb: 'Add Recovery' } },
  { path: 'smexpense', component: AddExpenseComponent, data: { breadcrumb: 'Add Expense' } },
  { path: 'journalvoucher', component: JournalvoucherComponent, data: { breadcrumb: 'Add Expense' } },

];

@NgModule({
  declarations: [
    CashPaymentComponent,
    CashReceiptComponent,
    ExpendComponent,
    AddRecoveryComponent,
    AddExpenseComponent,
    JournalvoucherComponent,
    BankReceiptComponent,
    BankPaymentComponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    ComponentsModule,
    FutureTechLibModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class CashModule {}
