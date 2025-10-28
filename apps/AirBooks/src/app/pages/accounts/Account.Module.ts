import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ComboBoxAllModule,
  DropDownListAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComponentsModule } from '../components/components.module';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccountsLedgerComponent } from './accounts-ledger/accounts-ledger.component';
import { BankReconciliationComponent } from './bank-reconciliation/bank-reconciliation.component';
import { CashAccountsComponent } from './cashaccounts/cashaccounts.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomersAddComponent } from './customers-add/customers-add.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { ReconcileReportComponent } from './reconcile-report/reconcile-report.component';
import { SuppliersComponent } from './suppliers/suppliers.component';

const routes: any = [
  { path: '', redirectTo: 'suppliers', pathMatch: 'full' },
  {
    path: 'suppliers',
    component: SuppliersComponent,
    data: { breadcrumb: 'Suppliers' },
  },
  {
    path: 'cashaccts',
    component: CashAccountsComponent,
    data: { breadcrumb: 'Cash and Banks' },
  },
  {
    path: 'customers',
    component: CustomersListComponent,
    data: { breadcrumb: 'Customers' },
  },
  {
    path: 'ledger',
    component: AccountsLedgerComponent,
    data: { breadcrumb: 'Accounts Ledger' },
  },
  {
    path: 'bank-reconciliation',
    component: BankReconciliationComponent,
    data: { breadcrumb: 'Bank Reconciliation' },
  },
  {
    path: 'bank-reconciliation/:editID',
    component: BankReconciliationComponent,
    data: { breadcrumb: 'Bank Reconciliation' },
  },
  {
    path: 'bank-recon-report',
    component: ReconcileReportComponent,
    data: { breadcrumb: 'Bank Reconciliation Report' },
  },
];

@NgModule({
  declarations: [
    SuppliersComponent,
    CashAccountsComponent,
    AccountsLedgerComponent,
    CustomersListComponent,
    CustomersAddComponent,
    CustomerDetailsComponent,
    BankReconciliationComponent,
    ReconcileReportComponent
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
export class AccountModule {}
