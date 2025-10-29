import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { BookingReportsComponent } from './booking/booking-reports.component';
import { LabObsComponent } from './lab-obs/lab-obs.component';
import { LabreportTemplatesComponent } from './lab-report-templates/labreport-templates.component';
import { LabTestGroupsComponent } from './lab-tests-groups/lab-test-groups.component';
import { LabTestsComponent } from './lab-tests/lab-tests.component';
import { NewLabReportComponent } from './new-labreport/new-labreport.component';
import { PreviouseReportsComponent } from './previous-reports/previouse-reports.component';

const routes: any = [
  { path: '', redirectTo: 'booking-report', pathMatch: 'full' },

  {
    path: 'make-report',
    component: NewLabReportComponent,
    data: { breadcrumb: 'Mak Report' },
  },
  {
    path: 'make-report/:invoice_id',
    component: NewLabReportComponent,
    data: { breadcrumb: 'Mak Report' },
  },
  {
    path: 'booking-report',
    component: BookingReportsComponent,
    data: { breadcrumb: 'Booking Report' },
  },
  {
    path: 'previous-reports',
    component: PreviouseReportsComponent,
    data: { breadcrumb: 'Previouse Report' },
  },
  {
    path: 'tests',
    component: LabTestsComponent,
    data: { breadcrumb: 'Lab Tests List' },
  },
  {
    path: 'obs',
    component: LabObsComponent,
    data: { breadcrumb: 'Lab Tests Obs' },
  },
  {
    path: 'profiles',
    component: LabTestGroupsComponent,
    data: { breadcrumb: 'Test Profiles' },
  },
  {
    path: 'templates',
    component: LabreportTemplatesComponent,
    data: { breadcrumb: 'Report Templates' },
  },
];

@NgModule({
  declarations: [
    NewLabReportComponent,
    PreviouseReportsComponent,
    LabTestsComponent,
    LabTestGroupsComponent,
    BookingReportsComponent,
    LabObsComponent,
    LabreportTemplatesComponent,
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxAllModule,
    FutureTechLibModule,
    NgbModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class LabModule {}
