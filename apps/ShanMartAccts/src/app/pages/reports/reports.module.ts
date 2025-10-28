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
import { DayBookComponent } from './day-book/day-book.component';
//import { ComponentsModule } from '../components/components.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridAllModule, PdfExportService, SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { UsersListComponent } from '../users-list/users-list.component';
import { AccountLedgerComponent } from './account-ledger/account-ledger.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { JournalComponent } from './journal/journal.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';


const routes:any= [
  { path: '', redirectTo: 'daybook', pathMatch: 'full' },
  { path: 'daybook', component: DayBookComponent, data: { breadcrumb: 'Day Book' } },
  { path: 'account-ledger', component: AccountLedgerComponent, data: { breadcrumb: 'Account Ledger' } },
  { path: 'trial-balance', component: TrialBalanceComponent, data: { breadcrumb: 'Trial Balancer' } },
  { path: 'journal', component: JournalComponent, data: { breadcrumb: 'Journal' } },
  { path: 'balance-sheet', component: BalanceSheetComponent, data: { breadcrumb: 'Balance Sheet' } },
  { path: 'profit-report', component: ProfitReportComponent, data: { breadcrumb: 'Profit Report' } },
  { path: 'userslist', component: UsersListComponent, data: { breadcrumb: 'Users' } },


];
@NgModule({
  declarations: [
    DayBookComponent,
    FilterProductPipe,
    AccountLedgerComponent,
    TrialBalanceComponent,
    BalanceSheetComponent,
    ProfitReportComponent,
    JournalComponent,
    UsersListComponent,

  ],

  imports: [
    CommonModule,
    FutureTechLibModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    DataTablesModule,
    NgxPrintModule,
    NgSelectModule,
    GridAllModule,
    NgbModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ], providers: [SearchService, PdfExportService,  ToolbarService]
})
export class ReportsModule { }
