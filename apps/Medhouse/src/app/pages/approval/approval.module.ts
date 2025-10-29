import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ComboBoxAllModule,
  DropDownListAllModule,
} from '@syncfusion/ej2-angular-dropdowns';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../components/components.module';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { AddPurchaseReturnApprovalComponent } from './add-purchase-return-approval/add-purchase-return-approval.component';
import { DispatchApprovalsComponent } from './dispatch-approvals/dispatch-approvals.component';
import { InvoiceApprovalsComponent } from './invoice-approvals/invoice-approvals.component';
import { InvoiceApprovalFormComponent } from './invoice-approval-form/invoice-approval-form.component';
import { AddImagesComponent } from './recall-approvals/add-images/add-images.component';
import { AddRecallCommentComponent } from './recall-approvals/add-recall-comment/add-recall-comment.component';
import { AddRecallComponent } from './recall-approvals/add-recall/add-recall.component';
import { RecallApprovalsComponent } from './recall-approvals/list-recalls/recall-approvals.component';
import { AmendmentApprovalsComponent } from './ammendment-approvals/amendment-approvals/amendment-approvals.component';
import { AddAmendmentDialogComponent } from './ammendment-approvals/add-amendment-dialog/add-amendment-dialog.component';
import { InvoiceReturnApprovalsComponent } from './invoice-return-approvals/invoice-return-approvals.component';
import { CashTransferApprovalsComponent } from './cash-transfer-approvals/cash-transfer-approvals.component';

const routes: any = [
  { path: '', redirectTo: 'purchase-return', pathMatch: 'full' },
  { path: 'purchase-return', component: PurchaseReturnComponent },
  { path: 'dispatch-approvals', component: DispatchApprovalsComponent },
  { path: 'recall-approvals', component: RecallApprovalsComponent },
  { path: 'amendment-approvals', component: AmendmentApprovalsComponent },
  { path: 'invoice-approvals', component: InvoiceApprovalsComponent },
  { path: 'invoice-return-approvals', component: InvoiceReturnApprovalsComponent },
  { path: 'cash-transfer-approval', component: CashTransferApprovalsComponent },
];

@NgModule({
  declarations: [
    PurchaseReturnComponent,
    AddPurchaseReturnApprovalComponent,
    DispatchApprovalsComponent,
    RecallApprovalsComponent,
    AddRecallComponent,
    AddRecallCommentComponent,
    AddImagesComponent,
    AmendmentApprovalsComponent,
    AddAmendmentDialogComponent,
    InvoiceApprovalsComponent,
    InvoiceApprovalFormComponent,
    InvoiceReturnApprovalsComponent,
    CashTransferApprovalsComponent,
  ],
  imports: [
    CommonModule,
    ComboBoxAllModule,
    DropDownListAllModule,
    ComponentsModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
})
export class ApprovalModule { }