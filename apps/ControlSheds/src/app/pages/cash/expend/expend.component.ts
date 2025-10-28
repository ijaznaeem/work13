import { Component, OnInit, ViewChild } from '@angular/core';
import {
  JSON2Date,
  GetDateJSON,
  getYMDDate,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';
import { MyToastService } from '../../../services/toaster.server';
import { VoucherModel } from '../voucher.model';
import { CachedDataService } from '../../../services/cacheddata.service';

class ExpenseModel {
  Date: any = GetDateJSON();
  HeadID = '';
  Description = '';
  Amount = 0;
  BusinessID = '';
  ClosingID = '';
  FlockID = '';
}
@Component({
  selector: 'app-expend',
  templateUrl: './expend.component.html',
  styleUrls: ['./expend.component.scss'],
})
export class ExpendComponent implements OnInit {
  @ViewChild('cmbHeads') cmbHeads;
  public ExpVoucher = new ExpenseModel();
  public Voucher = new VoucherModel();
  accounts = this.cached.Account$;
  ExpenseHeads = [];
  Accounts: any = [];
  CustomerID = '';
  curCustomer: any = {};
  constructor(
    private cached: CachedDataService,
    private http: HttpBase,
    private alert: MyToastService
  ) {}

  ngOnInit() {
    this.ExpVoucher.ClosingID = this.http.getClosingID();

    this.http.getData('expenseheads').then((r: any) => {
      this.ExpenseHeads = r;
    });
    this.http
      .getData(
        "qrycustomers?flds=CustomerID, CustomerName, AcctType&filter=AcctType like '%Par%'"
      )
      .then((x: any) => {
        this.Accounts = x;
      });
  }
  SaveData() {
    this.ExpVoucher.Date = JSON2Date(this.ExpVoucher.Date);
    this.ExpVoucher.BusinessID = this.http.getBusinessID();
    this.ExpVoucher.FlockID = this.http.GetFlockID();

    this.http.postData('expend', this.ExpVoucher).then((r) => {
      this.Voucher.Date = JSON2Date(this.ExpVoucher.Date);
      this.Voucher.Description = this.ExpVoucher.Description;
      this.Voucher.Credit = this.ExpVoucher.Amount;
      this.Voucher.Debit = 0;
      this.Voucher.ClosingID = this.http.getClosingID();
      this.Voucher.FlockID = this.http.GetFlockID();

      if (!(this.Voucher.CustomerID == '' || this.Voucher.CustomerID == null)) {
        this.http.postTask('vouchers', this.Voucher).then((a) => {
          this.Saved();
        });
      } else {
        this.Saved();
      }
    });
  }
  Saved() {
    this.alert.Sucess('Expense Saved', 'Save', 1);
    this.ExpVoucher = new ExpenseModel();
    this.cmbHeads.focusIn();
  }
  Round(amnt) {
    return Math.round(amnt);
  }
}
