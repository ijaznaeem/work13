import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../components/components.module';
import { CashPaymentComponent } from './cash-payment/cash-payment.component';
import { CashReceiptComponent } from './cash-receipt/cash-receipt.component';
import { CashTransferComponent } from './cash-transfer/cash-transfer.component';
import { ExpendComponent } from './expend/expend.component';
import { JournalvoucherComponent } from './journalvoucher/journal-voucher.component';

const routes:any = [
  { path: '', redirectTo: 'custoemerslist', pathMatch: 'full' },
  { path: 'cashpayment', component: CashPaymentComponent, data: { breadcrumb: 'Cash Payments' } },
  { path: 'cashpayment/:EditID', component: CashPaymentComponent, data: { breadcrumb: 'Cash Payments' } },
  { path: 'cashreceipt', component: CashReceiptComponent, data: { breadcrumb: 'Cash Reciepts' } },
  { path: 'cashreceipt/:EditID', component: CashReceiptComponent, data: { breadcrumb: 'Cash Reciepts' } },
  { path: 'expense', component: ExpendComponent, data: { breadcrumb: 'Add Expense' } },
  { path: 'expense/:EditID', component: ExpendComponent, data: { breadcrumb: 'Edit Expense' } },
  { path: 'transfer', component: JournalvoucherComponent, data: { breadcrumb: 'Cash Transfer' } },

];

@NgModule({
  declarations: [
    CashPaymentComponent,
    CashReceiptComponent,
    ExpendComponent,
    CashTransferComponent,
    JournalvoucherComponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    ComponentsModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class CashModule {}
