import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { FirstDayOfMonth } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  AddFormButton,
  AddInputFld,
  AddLookupFld,
  AddSpacer,
} from '../../components/crud-form/crud-form-helper';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { AddPurchaseOrderComponent } from '../add-purchase-order/add-purchase-order.component';
import { formPOApproval, POReport } from './purchase-orders.settings';

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss'],
})
export class PurchaseOrdersComponent implements OnInit {
  @ViewChild('grdData') grdData: DataGridComponent;
  @ViewChild('tmplModal') tmplModal;

  public Products: any = [];
  public Users: any = [];

  public Filter = {
    FromDate: GetDate(),
    ToDate: GetDate(),
    Status: '0',
  };

  public flterForm = {
    title: '',
    table: '',
    columns: [
      AddInputFld('FromDate', 'From Date', 1, true, 'date'),
      AddInputFld('ToDate', 'To Date', 1, true, 'date'),
      AddLookupFld(
        'Status',
        'Status',
        '',
        'ID',
        'Status',
        2,
        [
          { ID: 0, Status: 'Not-Approved' },
          { ID: 1, Status: 'Approved' },
          { ID: -1, Status: 'Cancelled' },
        ],
        true,
        { type: 'list' }
      ),

      AddSpacer('4'),
      AddFormButton(
        'Filter',
        (r) => {
          this.FilterData();
        },
        2,
        'search',
        'primary'
      ),
      AddFormButton(
        'Print',
        (r) => {
          console.log(r);
        },
        2,
        'print',
        'primary'
      ),
    ],
  };

  public data: any = [];
  public POCols = POReport;
  public bsModalRef: BsModalRef;
  public frmApproval= formPOApproval

  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private bsService: BsModalService
  ) {}

  ngOnInit() {
    this.Filter.FromDate = FirstDayOfMonth();
    this.POCols[2].onClick =  this.Approval
    this.FilterData();
  }
  Approval(event): any {
    console.log(event);

  }
  FilterData() {
    let filter =
      "Date between '" +
      this.Filter.FromDate +
      "' and '" +
      this.Filter.ToDate +
      "'";

    if (!(this.Filter.Status === '' || this.Filter.Status === null)) {
      filter += ' and StatusID=' + this.Filter.Status;
    }
    this.http
      .getData('PurchaseOrders?filter=' + filter + '&orderby=OrderID')
      .then((r: any) => {
        this.data = r;
        this.grdData.SetDataSource(this.data);
      });
  }
  Clicked(e) {}
  Add(grn_data: any = {}, Etype = 1) {
    const options: ModalOptions = {
      initialState: { GrnData: grn_data, EType: Etype },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.bsService.show(AddPurchaseOrderComponent, options);
    this.bsModalRef.onHide?.subscribe((r) => {
      this.FilterData();
    });
  }

  Proceed(event) {
    // console.log(event);
    // let record: any = this.grdData.GetSelectedRecord();
    let po = event;
    if (
      po.ForwardedTo == this.http.getUserDept() ||
      this.http.IsDirectorDepartment()
    ) {

      this.bsModalRef = this.bsService.show(this.tmplModal)
    } else {
      this.alert.Error('Not Allowed', 'Error');
    }
  }

  async RowClickedEv(e) {

  }
  Cancel() {
    swal({
      text: 'Do you want to cancell this purchase order?',
      icon: 'warning',
      buttons: {
        cancel: true,
        confirm: true,
      },
    }).then((close) => {
      if (close) {
        let record: any = this.grdData.GetSelectedRecord();
        this.http
          .postData(`PurchaseOrders/${record[0].OrderID}`, {
            Status: -1,
          })
          .catch((r) => {
            this.FilterData();
          });
      }
    });
  }
}
