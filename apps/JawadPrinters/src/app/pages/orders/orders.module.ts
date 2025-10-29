import { CommonModule } from '@angular/common';
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
import { NewOrderComponent } from './new-order/new-order.component';
import { CompletedOrdersComponent } from './orders-completed/orders-completed.component';
import { OrdersListComponent } from './orders-list/orderlist.component';
import { ProfitByBillComponent } from './profitbybill/profit-bybill.component';
import { ProfitReportComponent } from './profitreport/profit-report.component';

const routes: any = [
  { path: '', redirectTo: 'new', pathMatch: 'full' },
  { path: 'new', component: NewOrderComponent },
  { path: 'new/:ID', component: NewOrderComponent },
  { path: 'list', component: OrdersListComponent },
  { path: 'completed', component: CompletedOrdersComponent },
  { path: 'profitby-job', component: ProfitByBillComponent },
  { path: 'profit-report', component: ProfitReportComponent },
];
@NgModule({
  declarations: [
    NewOrderComponent,
    OrdersListComponent,
    CompletedOrdersComponent,
    ProfitByBillComponent,
    ProfitReportComponent
  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,

    // ComponentsModule,
    NgxDatatableModule,
    FutureTechLibModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  providers: [MyToastService, SendSMSService],
})
export class OrdersModule {}
