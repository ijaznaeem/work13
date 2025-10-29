import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { SendSMSService } from '../../services/sms.service';
import { MyToastService } from '../../services/toaster.server';
import { BankPaymentComponent } from './bank-payment/bank-payment.component';
import { BankReceiptComponent } from './bank-receipt/bank-receipt.component';
import { CashPaymentComponent } from './cash-payment/cash-payment.component';
import { CashReceiptComponent } from './cash-receipt/cash-receipt.component';
import { JournalvoucherComponent } from './journal-voucher.component/journal-voucher.component';
import { SearchAccountComponent } from './search-account/search-account.component';


const routes:any = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'cashreceipt', component: CashReceiptComponent, data: { breadcrumb: 'Cash Receipt' } },
  { path: 'cashreceipt/:EditID', component: CashReceiptComponent, data: { breadcrumb: 'Cash Receipt' } },
  { path: 'cashpayment', component: CashPaymentComponent, data: { breadcrumb: 'Cash Payment' } },
  { path: 'cashpayment/:EditID', component: CashPaymentComponent, data: { breadcrumb: 'Cash Payment' } },
  { path: 'bankreceipt', component: BankReceiptComponent, data: { breadcrumb: 'Bank Receipt' } },
  { path: 'bankreceipt/:EditID', component: BankReceiptComponent, data: { breadcrumb: 'Bank Receipt' } },
  { path: 'bankpayment', component: BankPaymentComponent, data: { breadcrumb: 'Bank Payment' } },
  { path: 'bankpayment/:EditID', component: BankPaymentComponent, data: { breadcrumb: 'Bank Payment' } },
  { path: 'jv', component: JournalvoucherComponent, data: { breadcrumb: 'JV' } },
  { path: 'jv/:EditID', component: JournalvoucherComponent, data: { breadcrumb: 'JV' } },


];
@NgModule({
  declarations: [
    CashReceiptComponent,
    SearchAccountComponent,
    CashPaymentComponent,
    BankReceiptComponent,
    BankPaymentComponent,
    JournalvoucherComponent
  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    //ComponentsModule,
    FutureTechLibModule,

    NgxDatatableModule,
    NgSelectModule,
    NgbModule, ReactiveFormsModule,
    FormsModule, ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  providers: [
    MyToastService,
    SendSMSService
  ]
})
export class TasksModule { }
