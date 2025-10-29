import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { SendSMSService } from '../../services/sms.service';
import { MyToastService } from '../../services/toaster.server';
import { ComponentsModule } from '../components/components.module';
import { AccountsComponent } from './accounts/accounts.component';
import { CashTransferComponent } from './cash-transfer/cash-transfer.component';
import { DonarsComponent } from './donars/donars.component';
import { DonationComponent } from './donation/donation.component';
import { ExpenseComponent } from './expense/expense.component';

const routes: any = [
  { path: '', redirectTo: 'accounts', pathMatch: 'full' },
  { path: 'accounts', component: AccountsComponent, data: { breadcrumb: 'Accounts List' } },
  { path: 'donar', component: DonarsComponent, data: { breadcrumb: 'Accounts List' } },
  { path: 'donation', component: DonationComponent, data: { breadcrumb: 'Accounts List' } },
  { path: 'donation/:id', component: DonationComponent, data: { breadcrumb: 'Accounts List' } },
  { path: 'expense', component: ExpenseComponent, data: { breadcrumb: 'Accounts List' } },
  { path: 'expense/:id', component: ExpenseComponent, data: { breadcrumb: 'Accounts List' } },
  { path: 'cashtransfer', component: CashTransferComponent, data: { breadcrumb: 'Accounts List' } },
  { path: 'cashtransfer/:id', component: CashTransferComponent, data: { breadcrumb: 'Accounts List' } },
];
@NgModule({
  declarations: [
    AccountsComponent,
    DonarsComponent,
    DonationComponent,
    ExpenseComponent,
    CashTransferComponent,
  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    ComponentsModule,
    // FutureTechLibModule,
    NgxDatatableModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  providers: [MyToastService, SendSMSService],
})
export class TasksModule {}
