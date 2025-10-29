import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AcctTypes } from '../../../factories/constants';
import {
  getCurDate,
  GetDateJSON,
  JSON2Date,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

class VoucherModel {
  Date: any = GetDateJSON(new Date(getCurDate()));

  AcctTypeID = '';
  CustomerID = '';
  RefID = '';
  Description = '';
  Debit = 0;
  Credit = 0;
  FinYearID = 0;
  RefType = 5;
  UserID = '';
  bid2 = '';
  CustomerID2 = '';
}

@Component({
  selector: 'app-internal-transfer',
  templateUrl: './internal-transfer.component.html',
  styleUrls: ['./internal-transfer.component.scss'],
})
export class InternalTransferComponent implements OnInit {
  @ViewChild('cmbCustomer') cmbCustomer;

  public Voucher = new VoucherModel();
  // public Voucher1 = new VoucherModel();
  Customers = [];
  Customers1 = [];
  bList: any = [];
  AcctTypes = AcctTypes;
  AcctTypeID = '';
  BusinessID = '';
  VouchersList: object[];
  curCustomer: any = {};
  curCustomer1: any = {};

  voucher: any;
  voucher1: any;
  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getData('blist').then((r) => {
      this.bList = r;
    });
  }

  LoadCustomer(event, v) {
    if (event.itemData.AcctTypeID !== '') {
      this.http
        .getCustByType(event.AcctTypeID)

        .then((r: any) => {
          if (v == 1) this.Customers = r;
          else this.Customers1 = r;
        });
    }
  }
  SaveData() {
    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    this.Voucher.UserID = this.http.getUserID();

    this.http.postTask('vouchers2', this.Voucher).then((r: any) => {
      this.alert.Sucess('Voucher Saved', 'Save', 1);
      this.Voucher = new VoucherModel();

      this.cmbCustomer.focusIn();
    }).catch((err) => {
      this.alert.Error('Error Saving Voucher', 'Save', 1);
      this.Voucher.Date = GetDateJSON(new Date(getCurDate()));
    });
  }
  GetCustomer(e, v) {
    console.log(e);
    if (e.value && e.value !== '') {
      this.http
        .getData('qrycustomers?filter=CustomerID=' + e.value, {
          bid: v == 1 ? this.http.getBusinessID() : this.voucher.bid2,
        })
        .then((r: any) => {
          if (v == 1) this.curCustomer = r[0];
          else this.curCustomer1 = r[0];
        });
    }
  }
  Round(amnt) {
    return Math.round(amnt);
  }

  LoadByBusiness(event) {
    console.log(event);

    if (event.value && event.value !== '') {
      this.http
        .getData(
          'customers?flds=CustomerName,Address, PhoneNo1, Balance,CustomerID&orderby=CustomerName',
          { bid: event.value }
        )
        .then((r: any) => {
          this.Customers1 = r;
          this.Voucher.CustomerID2 = ''
        });
    }
  }
}
