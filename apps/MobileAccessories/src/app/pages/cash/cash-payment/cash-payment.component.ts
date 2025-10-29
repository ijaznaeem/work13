import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { MyToastService } from '../../../services/toaster.server';
import { VoucherModel } from '../voucher.model';

@Component({
  selector: 'app-cash-payment',
  templateUrl: './cash-payment.component.html',
  styleUrls: ['./cash-payment.component.scss'],
})
export class CashPaymentComponent implements OnInit {
  @ViewChild('cmbCustomer') cmbCustomer;
  public Voucher = new VoucherModel();

  Customers = [];
  AcctTypes = [];
  @Input() EditID = '';
  public Ino = '';
  private AcctTypeID = '';
  curCustomer: any = {};
  Products: any = [];
  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private bsModalRef: BsModalRef,
    private bill: PrintBillService
  ) {}

  ngOnInit() {
    // this.http.getData('accttypes').then((r: any) => {
    //   this.AcctTypes = r;
    // });
    this.LoadCustomer('');

    if (this.EditID != '') {
      this.Ino = this.EditID;
      this.http
        .getData('qryvouchers?filter=VoucherID=' + this.EditID)
        .then((r: any) => {
          this.Voucher = r[0];
          this.Voucher.Date = GetDateJSON(new Date(r[0].Date));
          this.LoadCustomer({ AcctTypeID: r[0].AcctTypeID });
          this.GetCustomer(this.Voucher.CustomerID);
        });
    }
  }

  LoadCustomer(event) {
    this.http
      .getData(
        'qrycustomers?flds=CustomerName,Address, Balance, CustomerID&orderby=CustomerName'
      )
      .then((r: any) => {
        this.Customers = r;
      });
  }
  SaveData() {
    let voucherid = '';
    this.Voucher.PrevBalance = this.curCustomer.Balance;
    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    if (this.EditID != '') {
      voucherid = '/' + this.EditID;
    }
    this.AcctTypeID = this.Voucher.AcctTypeID;
    console.log(this.Voucher);
    this.http
      .postTask('vouchers' + voucherid, this.Voucher)
      .then((r) => {
        this.alert.Sucess('Payment Saved', 'Save', 1);
        this.bill.PrintVoucher(r);
        this.Voucher = new VoucherModel();
        this.cmbCustomer.focus();
      })
      .catch((err) => {
        this.Voucher.Date = GetDateJSON();
        console.log(err);

        this.alert.Error(err.error.message, 'Error', 1);
      });
  }
  GetCustomer(CustomerID) {
    console.log(CustomerID);

    if (CustomerID && CustomerID !== '') {
      this.http
        .getData('qrycustomers?filter=CustomerID=' + CustomerID)
        .then((r: any) => {
          this.curCustomer = r[0];
          this.Voucher.AcctTypeID = this.curCustomer.AcctTypeID;
        });
    }
  }
  Round(amnt) {
    return Math.round(amnt);
  }

  Cancel() {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
    this.Voucher = new VoucherModel();
  }
}
