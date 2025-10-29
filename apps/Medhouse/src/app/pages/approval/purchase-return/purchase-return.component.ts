import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { FirstDayOfMonth } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { UserDepartments } from '../../../config/constants';
import {
  AddFormButton,
  AddInputFld,
  AddLookupFld,
  AddSpacer,
} from '../../components/crud-form/crud-form-helper';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { AddPurchaseReturnApprovalComponent } from '../add-purchase-return-approval/add-purchase-return-approval.component';
import { PurchaseReturnCols, formPurchaseReturnApproval } from './purchase-return.settings';
import { ReturnStatus } from '../constants';

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.scss'],
})
export class PurchaseReturnComponent implements OnInit {
  @ViewChild('grdData') grdData!: DataGridComponent;
  @ViewChild('tmplModal') tmplModal: any;

  public Filter = {
    FromDate: GetDate(),
    ToDate: GetDate(),
    Status: 'Pending',
  };

  public filterForm = {
    title: '',
    table: '',
    columns: [
      AddInputFld('FromDate', 'From Date', 1, true, 'date'),
      AddInputFld('ToDate', 'To Date', 1, true, 'date'),
      AddLookupFld(
        'Status',
        'Status',
        '',
        'Status',
        'Status',
        2, ReturnStatus
       ,
        true,
        { type: 'list' }
      ),
      AddSpacer('4'),
      AddFormButton(
        'Filter',
        (r: any) => {
          this.FilterData();
        },
        2,
        'search',
        'primary'
      ),
      AddFormButton(
        'Print',
        (r: any) => {
          this.PrintReport();
        },
        2,
        'print',
        'primary'
      ),
    ],
  };

  public data: any = [];
  public returnCols = PurchaseReturnCols;
  public selectedRemarks = '';
  public bsModalRef!: BsModalRef;
  public frmApproval = formPurchaseReturnApproval;

  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private bsService: BsModalService
  ) {}

  ngOnInit() {
    this.Filter.FromDate = FirstDayOfMonth();
    this.FilterData();
  }

  FilterData() {
    let filter = `Status = '${this.Filter.Status}'`;

    if (this.Filter.Status === 'Approved' || this.Filter.Status === 'Cancelled') {
      filter += ` AND Date BETWEEN '${this.Filter.FromDate}' AND '${this.Filter.ToDate}'`;
    }

    // Simulating the query from the VB6 code
    this.http
      .getData(`qryPReturnApprovals?filter=${filter}&orderby=Date DESC`)
      .then((r: any) => {
        this.data = r;
        if (this.grdData) {
          this.grdData.SetDataSource(this.data);
        }
      })
      .catch((error) => {
        console.error('Error loading purchase return approvals:', error);
        this.alert.Error('Error loading data', 'Error');
      });
  }

  AddApproval() {
    const options: ModalOptions = {
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.bsService.show(AddPurchaseReturnApprovalComponent, options);
    this.bsModalRef.onHide?.subscribe(() => {
      this.FilterData();
    });
  }

  ProceedApproval(approvalId: number) {
    const selectedRecord = this.data.find((item: any) => item.ApprovalID === approvalId);
    if (selectedRecord) {
      // Check department permissions similar to VB6 code
      const userDept = this.http.getUserDept();
      if (userDept === UserDepartments.grpAccounts || userDept === UserDepartments.grpCEO) {
        // Load return dialog
        this.alert.Info('Proceed with approval functionality to be implemented', 'Info');
      } else {
        this.alert.Error('Not authorized to proceed with this approval', 'Access Denied');
      }
    }
  }

  PrintReport() {
    const selectedRecord = this.grdData?.GetSelectedRecord();
    if (selectedRecord && selectedRecord.length > 0) {
      // Print report functionality
      this.alert.Info('Print report functionality to be implemented', 'Info');
    } else {
      this.alert.Warning('Please select a record to print', 'Warning');
    }
  }

  OnRowClick(event: any) {
    if (event && event.length > 0) {
      this.selectedRemarks = event[0].Remarks || '';
    }
  }

  OnSelectionChange(event: any) {
    if (event && event.length > 0) {
      this.selectedRemarks = event[0].Remarks || '';
    }
  }
}