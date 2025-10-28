import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { FirstDayOfMonth } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { UserDepartments } from '../../../config/constants';
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
import { GrnAddComponent } from '../grn-add/grn-add.component';
import { CommentsCol, GRNReport } from './grn-report.settings';

@Component({
  selector: 'app-grn-report',
  templateUrl: './grn-report.component.html',
  styleUrls: ['./grn-report.component.scss'],
})
export class GrnReportComponent implements OnInit {
  @ViewChild('grdData') grdData: DataGridComponent;
  @ViewChild('grdHistory') grdHistory: DataGridComponent;
  public Products: any = [];
  public Users: any = [];

  public Filter = {
    FromDate: GetDate(),
    ToDate: GetDate(),
    Status: '',
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
          { ID: 0, Status: 'In Process' },
          { ID: 1, Status: 'Completed' },
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
  public grnComments: any = [];

  grnCols = GRNReport;
  comentCols = CommentsCol;

  public bsModalRef: BsModalRef;

  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router,
    private bsService: BsModalService
  ) {}

  ngOnInit() {
    this.grnCols[2].onClick = this.Proceed;
    this.Filter.FromDate = FirstDayOfMonth();
    this.FilterData();
  }
  FilterData() {
    let filter =
      "GrnDate between '" +
      this.Filter.FromDate +
      "' and '" +
      this.Filter.ToDate +
      "'";

    if (!(this.Filter.Status === '' || this.Filter.Status === null)) {
      filter += ' and Status=' + this.Filter.Status;
    }
    this.http
      .getData('qryGRNReport?filter=' + filter + '&orderby=DetailID')
      .then((r: any) => {
        this.data = r;
        this.grdData.SetDataSource(this.data);
        this.grdHistory.SetDataSource([]);
      });
  }
  Clicked(e) {}
  GRNAdd(grn_data: any = {}, Etype = 1) {
    const options: ModalOptions = {
      initialState: { GrnData: grn_data, EType: Etype },
      class: 'modal-xl',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.bsService.show(GrnAddComponent, options);
    this.bsModalRef.onHide?.subscribe((r) => {
      this.FilterData();

    });
  }

  // GRNEdit() {
  //   let record: any = this.grdData.GetSelectedRecord();
  //   if (record && record.length > 0) {
  //     this.http.getData('GRNPurchase/' + record[0].DetailID).then((r: any) => {
  //       if (
  //         r.ForwardedTo == this.http.getUserDept() ||
  //         this.http.IsDirectorDepartment()
  //       ) {
  //         this.GRNAdd(r, this.grdHistory.GetTotalrecord() <= 5 ? 1 : 2);
  //       } else {
  //         this.alert.Error('Not Allowed', 'Error');
  //       }
  //     });
  //   }
  // }
  Proceed(event) {
    // console.log(event);
    // let record: any = this.grdData.GetSelectedRecord();

    this.http.getData('GRNPurchase/' + event.DetailID).then(async (r: any) => {
      if (
        r.ForwardedTo == this.http.getUserDept() ||
        this.http.IsDirectorDepartment()
      ) {
        if (
          this.grdHistory.GetTotalrecord() == 2 &&
          r.ForwardedTo == UserDepartments.grpCommercial
        ) {
          await this.http.postData('GRNPurchase/' + r.DetailID, {
            ForwardedTo: UserDepartments.grpQC,
          });

          let data: any = {
            GrnID: r.DetailID,
            DepartmentID: this.http.getUserDept(),
            UserID: this.http.getUserID(),
            Remarks: 'Forwarded to QC',
          };

          await this.http.postData('addgrnremarks', data);
          this.alert.Sucess('GRN forwaded to qc', 'Success');
          this.FilterData();
          return;
        } else         if (
          this.grdHistory.GetTotalrecord() == 4 &&
          r.ForwardedTo == UserDepartments.grpCommercial
        ) {
          await this.http.postData('GRNPurchase/' + r.DetailID, {
            ForwardedTo: UserDepartments.grpProcurement,
            StoreRemarks: 'Forwarded to Procurement'
          });

          let data: any = {
            GrnID: r.DetailID,
            DepartmentID: this.http.getUserDept(),
            UserID: this.http.getUserID(),
            Remarks: 'Forwarded to Procurement',
          };

          await this.http.postData('addgrnremarks', data);
          this.alert.Sucess('Forwarded to Procurement', 'Success');
          this.FilterData();
          return;
        } else if (r.ForwardedTo == UserDepartments.grpProcurement) {
          this.GRNAdd(r,  1 );
          this.FilterData();
          return;
        } else if (r.ForwardedTo == UserDepartments.grpQC) {

        }
      } else {
        this.alert.Error('Not Allowed', 'Error');
      }
    });
  }

  async RowClickedEv(e) {
    console.log(e);
    try {
      let data = await this.http.getData(
        'qrygrnlog?filter=GrnID=' + e.data.DetailID
      );
      this.grdHistory.SetDataSource(data);
    } catch (error) {
      this.alert.Error('Error while loadingdata', 'Error');
    }
  }
  CancelGrn() {
    swal({
      text: 'Do you want to cancell this grn ??',
      icon: 'warning',
      buttons: {
        cancel: true,
        confirm: true,
      },
    }).then((close) => {
      if (close) {
        let record: any = this.grdData.GetSelectedRecord();
        this.http
          .postData(`GRNPurchase/${record[0].DetailID}`, {
            Status: -1,
          })
          .catch((r) => {
            this.FilterData();
          });
      }
    });
  }
}
