import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ComponentsModule } from '../components/components.module';
import { InvoiceReportComponent } from './invoice-report/invoice-report.component';
import { LogReportComponent } from './log-report/log-report.component';
import { SaleReporAdminComponent } from './sale-report-admin/sale-report-admin.component';
import { SaleReporByAgentsComponent } from './sale-report-byagets/sale-report-byagents.component';
import { SaleReportBytemitemComponent } from './sale-report-byitem/salereport-byitem.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';


const routes:any = [
  { path: '', redirectTo: 'sale-report', pathMatch: 'full' },
  { path: 'sale-report', component: InvoiceReportComponent, data: { breadcrumb: 'Sale Report' }, },
  { path: 'sale-byagents', component: SaleReporByAgentsComponent, data: { breadcrumb: 'Sale Report by Agents' }, },
  { path: 'trial-balance', component: TrialBalanceComponent, data: { breadcrumb: 'Sale Report by Agents' }, },
  { path: 'salereport-admin', component: SaleReporAdminComponent, data: { breadcrumb: 'Sale Report for Admin' }, },
  { path: 'salreport-byitem', component: SaleReportBytemitemComponent, data: { breadcrumb: 'Sale Report by Item' }, },
  { path: 'log-report', component: LogReportComponent, data: { breadcrumb: 'Sale Report by Item' }, },


];

@NgModule({
  declarations: [
    InvoiceReportComponent,
    SaleReporByAgentsComponent,
    SaleReporAdminComponent,
    TrialBalanceComponent,
    SaleReportBytemitemComponent,
    LogReportComponent,
  ],
  imports: [
    CommonModule,
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
export class ReportsModule {}
