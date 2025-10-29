import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import swal from 'sweetalert';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { PrintDataService } from '../../../services/print.data.services';
import { CashPaymentComponent } from '../cash-payment/cash-payment.component';
import { CashReceiptComponent } from '../cash-receipt/cash-receipt.component';
import { VoucherSetting } from './vouchers.settings';

@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styleUrls: ['./vouchers-list.component.scss'],
})
export class VouchersListComponent implements OnInit {
  public data: object[];
  public Customers: Observable<any[]>;

  public settings = VoucherSetting;
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SearchText: '',
    Status: '',
  };
  nWhat = '1';
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router,
    private bill: PrintBillService,
    private bsModal: BsModalService
  ) {}

  ngOnInit() {

    this.FilterData();
  }

  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "' ";

    if (!(this.Filter.Status === '' || this.Filter.Status === null)) {
      filter += ' and IsPosted=' + this.Filter.Status;
    }

    this.http.getData('qryvouchers', { filter: filter }).then((r: any) => {
      r.map((x) => {
        x.IsPosted == '1' ? (x.Posted = 'Posted') : (x.Posted = 'Un Posted');
      });
      this.data = r;
    });
  }
  Clicked(e) {
    let table: any = {};
    let url = '';
    console.log(e);
     if (e.action === 'print') {
      this.bill.PrintVoucher(e.data);
    }
  }
  TypeChange(e) {
    this.FilterData();
  }

  CloseAccounts() {
    swal({
      text: 'Account will be closed, Continue ??',
      icon: 'warning',
      buttons: {
        cancel: true,
        confirm: true,
      },
    }).then((close) => {
      if (close) {
        this.http
          .postTask('CloseAccount/' + this.http.getBusinessID(), {
            ClosingID: this.http.getClosingID(),
          })
          .then((r) => {
            swal(
              'Close Account!',
              'Account was successfully closed, Login to next date',
              'success'
            );
            this.router.navigateByUrl('/auth/login');
          })
          .catch((er) => {
            swal('Oops!', 'Error while clsoing account', 'error');
          });
      }
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Voucherslist Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    if (this.nWhat === '1') {
      this.ps.PrintData.Title += ' - Sale Report';
    } else if (this.nWhat === '2') {
      this.ps.PrintData.Title += ' - Purchase Report';
    } else if (this.nWhat === '3') {
      this.ps.PrintData.Title += ' - Voucher Report';
    }

    this.router.navigateByUrl('/print/print-html');
  }
  AddVoucher(type) {
    if (type == 'Receipt') {
      this.OpenVoucher(CashReceiptComponent, '');
    } else if (type == 'Payment') {
      this.OpenVoucher(CashPaymentComponent, '');
    }
  }
  OpenVoucher(voucher, EditID) {
    const bsModal: BsModalRef = this.bsModal.show(voucher, {
      class: 'modal-lg',
      initialState: {
        EditID: EditID
      }
    });
    bsModal.onHide?.subscribe((res) => {
      if (res) {
        this.FilterData();
      }
    });
  }
}
