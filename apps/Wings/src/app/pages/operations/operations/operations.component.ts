import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import {
  GetDateJSON,
  JSON2Date,
  getYMDDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { DocumentAttachComponent } from '../../sales/documents-attach/document-attach.component';
import { ProcessProductComponent } from '../process-product/process-product.component';
import { OperationsListTicket, OperationsListVisa } from './operations.setting';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
})
export class OperationsComponent implements OnInit {
  @ViewChild('dataList') dataList;
  public visaSettings = OperationsListVisa;
  public ticketSettings = OperationsListTicket;
  public Settings = OperationsListTicket;

  public Filter = {
    dept_id: '0',
    date: GetDateJSON(),
    item_status: '0',
    remarks: '',
  };
  DeptType = -1;
  filterList = 'dept_id=0';
  Dept: any = {};
  bsModalRef: any;
  InvStatus: any = [];
  data: any = [];
  constructor(
    private http: HttpBase,
    private modalService: BsModalService,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.http.getData('inv_status').then((r: any) => {
      this.InvStatus = r;
    });

    this.http.getData('depts/' + this.http.getUserDeptID()).then((r: any) => {
      this.Dept = r;
      if (
        this.Dept.dept_name.toLowerCase().includes('visa') ||
        this.Dept.dept_name.toLowerCase().includes('holiday')
      ) {
        this.DeptType = 1;
        this.Settings = OperationsListVisa
      } else if (this.Dept.dept_name.toLowerCase().indexOf('general') >= 0) {
        this.DeptType = -1;
        this.Settings = OperationsListTicket
      } else {
        this.DeptType = 2;
        this.Settings = OperationsListTicket

      }

      this.Settings.Columns[0].button.callback = (d) => {
        this.Clicked({
          action: 'process',
          data: d,
        });
      };

      (this.Settings.Columns.find(
        (x) => x.fldName == 'status'
      ).button.callback = (d) => {
        this.Clicked({
          action: 'status',
          data: d,
        });
      });
    });
    this.FilterData();


  }

  FilterData() {
    this.filterList = `isposted = 1 and item_status = ${
      this.Filter.item_status
    } and  post_date <= '${JSON2Date(this.Filter.date)}' `;

    if (this.Filter.remarks != ''){
      this.filterList += " and (status = '" + this.Filter.remarks + "')"
    }

    if (!this.http.isMaster())
      this.filterList += ' and dept_id=' + this.http.getUserDeptID();

    this.http.getData('qryoperations?orderby=date desc, detailid desc &filter=' + this.filterList).then((d) => {
      this.data = d;
    });
  }
  Clicked(e) {
    console.log(e.data);

    if (e.action === 'process') {
      if (e.data.status_id== 1){
        this.myToaster.Error(
          'Can\'t process posted item ',
          'Process Error'
        );
        return;
      }
    const initialState: ModalOptions = {
        initialState: {
          data: e.data,
        },
        class: 'modal-lg',
        backdrop: true,
        ignoreBackdropClick: true,
      };
      this.bsModalRef = this.modalService.show(
        ProcessProductComponent,
        initialState
      );

      this.bsModalRef.onHide.subscribe((reason: string | any) => {
        this.FilterData();
      });
    } else if (e.action === 'documents') {
      this.http.openAsDialog(DocumentAttachComponent, {
        invoice_id: e.data.invoice_id,
        type: 1,
      });
    } else if (e.action === 'status') {
      this.http
        .openForm(
          {
            title: 'Change Status',
            tableName: 'invoicedetails',
            pk: 'detailid',
            columns: [
              {
                fldName: 'remarks',
                control: 'select',
                type: 'lookup',
                label: 'Status',
                listTable: 'qryinvstatus',
                lisData: [],
                valueFld: 'remarks',
                displayFld: 'remarks',
                required: true,
                size: 6,
                placeHolder: 'Select Status',
              },
            ],
          },
          {
            remarks: e.data.status,
            detailid: e.data.detailid,
          }
        )
        .then(() => {
          this.FilterData();
        });
    } else if (e.action === 'objections') {
      this.http
        .openForm(
          {
            title: 'Invoice Objectins',
            tableName: 'invoice_objections',
            pk: 'id',
            columns: [
              {
                fldName: 'remarks',
                control: 'textarea',
                label: 'Objection Details',
                required: true,
                size: 12,
              },
            ],
          },
          {
            invoice_id: e.data.invoice_id,
            user_id: this.http.getUserID(),
            date: getYMDDate(new Date()),
            dept_id: this.http.getUserDeptID(),
          }
        )
        .then((r) => {
          if (r == 'save') {
            this.http.postData('invoices/' + e.data.invoice_id, {
              isposted: '0',
              status_id: '2',
            });
            this.myToaster.Sucess('objection added', '');
          }
        });
    } else if (e.action == 'post') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You really post this invoice!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          if (e.data.supplier == null) {
              this.myToaster.Error(
              'Can\'t post without processing ',
              'Post Error'
            );
            return;
          }

          this.http
            .postData('invoicedetails/' + e.data.detailid, {
              status_id: 1,
            })
            .then((r) => {
              Swal.fire('Posted', 'Invoice is posted !!', 'info');
              this.FilterData();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Invoice is not posted !!', 'warning');
        }
      });
    }
  }
}
