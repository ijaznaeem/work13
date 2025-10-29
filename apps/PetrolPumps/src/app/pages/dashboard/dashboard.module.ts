import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FutureTechLibModule } from '../../../../../../libs/future-tech-lib/src';
import { DashboardComponent } from './dashboard.component';

export const routes: any = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  
];
// ---
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FutureTechLibModule,
    FormsModule,
    Ng2SmartTableModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    NgxChartsModule,
  ],
  declarations: [DashboardComponent, ],
})
export class DashboardModule {}
