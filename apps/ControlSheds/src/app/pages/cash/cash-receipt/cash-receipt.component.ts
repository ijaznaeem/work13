import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { JSON2Date, GetDateJSON } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MyToastService } from '../../../services/toaster.server';
import { VoucherModel } from '../voucher.model';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cash-receipt',
  templateUrl: './cash-receipt.component.html',
  styleUrls: ['./cash-receipt.component.scss'],
})
export class CashReceiptComponent implements OnInit {
  @ViewChild('cmbCustomer') cmbCustomer;
  public Voucher = new VoucherModel();
  Customers = [];
  AcctTypes = [];
  @Input() EditID = '';

  curCustomer: any = {};
  Products: any = [];
  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private bsModelRef: BsModalRef
  ) {}

  ngOnInit() {
    this.http.getData('accttypes?bid=0').then((r: any) => {
      this.AcctTypes = r;
    });

    if (this.EditID != '') {
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
    if (event.AcctTypeID !== '') {
      this.http
        .getData(
          'customers?flds=CustomerName,CustomerID&orderby=CustomerName' +
            '&filter=AcctTypeID=' +
            event.AcctTypeID
        )
        .then((r: any) => {
          this.Customers = r;
        });
    }
  }
  SaveData() {
    let voucherid = '';
    this.Voucher.PrevBalance = this.curCustomer.Balance;
    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    this.Voucher.FlockID = this.http.GetFlockID();
    this.Voucher.ClosingID = this.http.getClosingID();

    if (this.EditID != '') {
      voucherid = '/' + this.EditID;
    }

    console.log(this.Voucher);
    this.http.postTask('vouchers' + voucherid, this.Voucher).then((r) => {
      this.alert.Sucess('Receipt Saved', 'Save', 1);
      if (this.EditID != '') {
        this.EditID = ''
        this.bsModelRef.hide();
      } else {
        this.Voucher = new VoucherModel();
        this.cmbCustomer.focusIn();
      }
    });
  }
  GetCustomer(CustomerID) {
    console.log(CustomerID);

    if (CustomerID && CustomerID !== '') {
      this.http
        .getData('qrycustomers?filter=CustomerID=' + CustomerID)
        .then((r: any) => {
          this.curCustomer = r[0];
        });
    }
  }
  Round(amnt) {
    return Math.round(amnt);
  }
}
