import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StockinComponent } from './stockin/stockin.component';
import { StockReportComponent } from './stockreport/stockreport.component';
import { ShortStockComponent } from './shortstock/shortstock.component';
import { StockReport2Component } from './stockreport2/stockreport2.component';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { ModalModule } from 'ngx-bootstrap/modal';

export const routes:any = [
  { path: '', redirectTo: 'stockreport', pathMatch: 'full' },
  { path: 'stockreport', component: StockReportComponent, data: { breadcrumb: 'Stock Report' } },
  { path: 'stockreport2', component: StockReport2Component, data: { breadcrumb: 'Stock Report' } },
  { path: 'shortstock', component: ShortStockComponent, data: { breadcrumb: 'Short Stock Report' } },

];

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ComboBoxModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule, ModalModule
  ],
  declarations: [StockinComponent, StockReportComponent, StockReport2Component, ShortStockComponent
  ]
})
export class StockModule { }
