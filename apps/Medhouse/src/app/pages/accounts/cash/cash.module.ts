import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import { NgSelectModule } from '@ng-select/ng-select';
import { CashReceivedComponent } from './cash-received/cash-received.component';
import { SupplierPaymentComponent } from './supplier-payment/supplier-payment.component';
import { CashTransferComponent } from './cash-transfer/cash-transfer.component';
import { OtherIncomeReportComponent } from './other-income-report/other-income-report.component';
import { RecoveryByDivisionComponent } from './recovery-by-division/recovery-by-division.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';

const routes: any = [
  { path: '', redirectTo: 'recovery', pathMatch: 'full' },
  {
    path: 'recovery',
    component: CashReceivedComponent,
    data: { breadcrumb: 'Cash Received' },
  },
  {
    path: 'payment-to-suppliers',
    component: SupplierPaymentComponent,
    data: { breadcrumb: 'Supplier Payment' },
  },
  {
    path: 'bank-cash-transfer',
    component: CashTransferComponent,
    data: { breadcrumb: 'Cash Transfer' },
  },
  {
    path: 'other-income-report',
    component: OtherIncomeReportComponent,
    data: { breadcrumb: 'Other Income Report' },
  },
  {
    path: 'recovery-by-division',
    component: RecoveryByDivisionComponent,
    data: { breadcrumb: 'Recovery by Division' },
  },
  {
    path: 'payment-report',
    component: PaymentReportComponent,
    data: { breadcrumb: 'Payment Report' },
  },
  {
    path: 'trial-balance',
    component: TrialBalanceComponent,
    data: { breadcrumb: 'Trial Balance' },
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('../account-list/account-list.module').then(
        (m) => m.AccountListModule
      ),
    data: { breadcrumb: 'Account Management' },
  },
];
@NgModule({
  declarations: [
    CashReceivedComponent,
    SupplierPaymentComponent,
    CashTransferComponent,
    OtherIncomeReportComponent,
    RecoveryByDivisionComponent,
    PaymentReportComponent,
    TrialBalanceComponent,
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    NgxPrintModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class CashModule {}
