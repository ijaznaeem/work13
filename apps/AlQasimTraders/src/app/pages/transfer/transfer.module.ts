import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TransferItemComponent } from './transferitems/transferitems.component';
import { TransferlistComponent, } from './transferlist/transferlist.component';
import { PendingComponent } from './transferitems/pending.component';
import { PendingReportComponent } from './transferitems/pendingreport.component';
import { ComboBoxAllModule, ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


export const routes:any = [
  { path: '', redirectTo: 'transferitems', pathMatch: 'full' },
  { path: 'transferitems', component: TransferItemComponent, data: { breadcrumb: 'Transfer Items' } },
  { path: 'transferlist', component: TransferlistComponent, data: { breadcrumb: 'Transfer Item List' } },
  { path: 'transferitems/:editID', component: TransferItemComponent, data: { breadcrumb: 'Edit In Transfer Items' } },
  { path: 'pending', component: PendingComponent, data: { breadcrumb: 'Pending Gatepass' } },
  { path: 'pendingreport', component: PendingReportComponent, data: { breadcrumb: 'Pending Report' } },

];

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule, ComboBoxModule, ComboBoxAllModule, ModalModule
  ],

  declarations: [TransferItemComponent,
    TransferlistComponent, PendingComponent, PendingReportComponent
  ]
})
export class TransferModule { }
