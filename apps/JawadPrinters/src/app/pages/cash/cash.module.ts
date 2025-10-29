import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { SendSMSService } from '../../services/sms.service';
import { MyToastService } from '../../services/toaster.server';
import { ExpenselistComponent } from './expense/expense-list.component';
import { IncomelistComponent } from './income/income-list.component';

const routes: any = [
  { path: '', redirectTo: 'income', pathMatch: 'full' },
  { path: 'expense', component: ExpenselistComponent },
  { path: 'income', component: IncomelistComponent },
];
@NgModule({
  declarations: [ ExpenselistComponent, IncomelistComponent],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    NgxDatatableModule,
    FutureTechLibModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  providers: [MyToastService,
    DatePipe,
    SendSMSService],
})
export class CashModule {}
