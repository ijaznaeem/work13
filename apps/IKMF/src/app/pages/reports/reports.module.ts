import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DataTablesModule } from 'angular-datatables';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPrintModule } from 'ngx-print';
import { FilterProductPipe } from '../../pipes/filter-product.pipe';

//import { ComponentsModule } from '../components/components.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { AccountLedgerComponent } from './account-ledger/account-ledger.component';
import { CashBookComponent } from './cash-book/cash-book.component';
import { DonationRemindersComponent } from './donation-reminders/donation-reminders.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';



const routes:any= [
  { path: '', redirectTo: 'cashbook', pathMatch: 'full' },
  { path: 'cashbook', component: CashBookComponent, data: { breadcrumb: 'Day Book' } },
  { path: 'account-ledger', component: AccountLedgerComponent, data: { breadcrumb: 'Day Book' } },
  { path: 'donation-reminders', component: DonationRemindersComponent, data: { breadcrumb: 'Donation Reminder' } },
  { path: 'expense-report', component: ExpenseReportComponent, data: { breadcrumb: 'Donation Reminder' } },



];
@NgModule({
  declarations: [
    CashBookComponent,
    FilterProductPipe,
    AccountLedgerComponent,
    DonationRemindersComponent,
    ExpenseReportComponent,
  ],

  imports: [
    CommonModule,
    FutureTechLibModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    DataTablesModule,
    NgxPrintModule,
    NgSelectModule,
    NgbModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ], providers: []
})
export class ReportsModule { }
