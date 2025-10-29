import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import {
  FindTotal,
  GetDateJSON,
  JSON2Date,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { DonationForm } from '../../tasks/donation/donation.settings';

@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.scss'],
})
export class CashBookComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  public data: any = [];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  setting = {
    Checkbox: false,
    Columns: [
      { label: 'Date', fldName: 'Date' },
      { label: 'Type', fldName: 'Type' },

      { label: 'Account Name', fldName: 'AccountName' },
      { label: 'Description', fldName: 'Description' },
      { label: 'Head', fldName: 'Head' },
      {
        label: 'Debit',
        fldName: 'Debit',
        sum: true,
      },
      {
        label: 'Credit',
        fldName: 'Credit',
        sum: true,
      },
      {
        label: 'Status',
        fldName: 'Status',
        align: 'center',
      },
    ],
    Actions: [
      {
        title: 'Post',
        icon: 'check',
        class: 'success',
        action: 'post',
      },
      {
        title: 'Edit',
        icon: 'edit',
        class: 'warning',
        action: 'edit',
      },
      {
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
        action: 'delete',
      },
    ],
    Data: [],
    GroupBy: 'Type',
  };

  open_balance = 0;
  form: any = DonationForm;
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Cash Report';
    this.ps.PrintData.SubTitle =
      'Date :' +
      JSON2Date(this.Filter.FromDate) +
      ' To ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date Between '" +
      JSON2Date(this.Filter.FromDate) +
      "' And '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    this.http.getData('qryvouchers?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }

  FindBalance() {
    if (this.data.length == 0) return 0;

    return FindTotal(this.data, 'Credit') - FindTotal(this.data, 'Debit');
  }

  onClickAction(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('vouchers/' + e.data.VoucherID).then((r: any) => {
        if (r && r.Type == '1' && r.Credit > 0) {
          this.router.navigateByUrl('/tasks/donation/' + e.data.VoucherID);
        } else if (r && r.Type == '2' && r.Debit > 0) {
          this.router.navigateByUrl('/tasks/expense/' + e.data.VoucherID);
        } else if (
          (r && r.Type == '3' && r.Credit > 0) ||
          (r && r.Type == '4' && r.Debit > 0)
        ) {
          this.router.navigateByUrl('/tasks/cashtransfer/' + e.data.VoucherID);
        } else {
          swal('Error!', 'Invalid Voucher Type', 'error');
        }
      });
    } else if (e.action === 'delete') {
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((close) => {
        if (close) {
          this.http
            .Delete('vouchers', e.data.VoucherID)
            .then((r) => {
              swal('success!', 'Voucher deleted', 'success');
              this.FilterData();
            })
            .catch((er) => {
              swal('Oops!', 'Error while deleting voucher', 'error');
            });
        }
      });
    } else if (e.action === 'post') {
      swal({
        title: 'Are you sure?',
        text: 'You want to post voucher!',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((close) => {
        if (close) {
          this.http
            .postData('postvouchers/' + e.data.VoucherID, {})
            .then((r) => {
              swal('success!', 'Voucher Posted', 'success');
              this.FilterData();
            })
            .catch((er) => {
              swal('Oops!', 'Error while posting voucher', 'error');
            });
        }
      });
    }
  }

  openModal(Component, InitState: any = {}) {
    let bsModalRef: any;

    const initialState: ModalOptions = {
      initialState: InitState,
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    return this.modalService.show(Component, initialState);
  }
}
