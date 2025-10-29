import { Component, OnInit, ViewChild } from '@angular/core';
import { JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';
import { MyToastService } from '../../../services/toaster.server';
import { VoucherModel } from '../voucher.model';

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.scss'],
})
export class JournalvoucherComponent implements OnInit {
  @ViewChild('cmbCustomer') cmbCustomer;
  public Voucher = new VoucherModel();
  public Voucher1 = new VoucherModel();
  Customers = [];
  Customers1 = [];
  AcctTypes = [];
  AcctTypeID = '';
  AcctTypeID1 = '';
  VouchersList: object[];
  curCustomer: any = {};
  curCustomer1: any = {};

  voucher: any;
  voucher1: any;
  Products: any = [];
  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getData('accttypes?bid=0').then((r: any) => {
      this.AcctTypes = r;
    });
  }

  LoadCustomer(event, v) {
    if (event.itemData.AcctTypeID !== '') {
      this.http
        .getData(
          'customers?flds=CustomerName,CustomerID&orderby=CustomerName' +
            '&filter=AcctTypeID=' +
            event.itemData.AcctTypeID
        )
        .then((r: any) => {
          if (v == 1) this.Customers = r;
          else this.Customers1 = r;
        });
    }
  }
  SaveData() {
    this.Voucher1.PrevBalance = this.curCustomer1.Balance;
    this.Voucher1.Date = JSON2Date(this.Voucher1.Date);
    this.Voucher1.FlockID = this.http.GetFlockID();
    this.Voucher1.ClosingID = this.http.getClosingID();
    this.Voucher1.UserID = this.http.getUserID();
    
    this.Voucher.PrevBalance = this.curCustomer.Balance;
    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    this.Voucher.UserID = this.http.getUserID();
    this.Voucher.FlockID = this.http.GetFlockID();
    this.Voucher.ClosingID = this.http.getClosingID();

    this.Voucher.RefID = '0';
    this.Voucher.RefType = 4;
    this.http.postTask('vouchers', this.Voucher).then((r: any) => {
      this.Voucher1.RefID = r.id;
      this.Voucher1.RefType = 4;
      this.http.postTask('vouchers', this.Voucher1).then((r1) => {
        this.alert.Sucess('Voucher Saved', 'Save', 1);
        this.Voucher = new VoucherModel();
        this.Voucher1 = new VoucherModel();

        this.cmbCustomer.focusIn();
      });
    });
  }
  GetCustomer(e, v) {
    console.log(e);
    if (e.itemData.CustomerID !== '') {
      this.http
        .getData('qrycustomers?filter=CustomerID=' + e.itemData.CustomerID)
        .then((r: any) => {
          if (v == 1) this.curCustomer = r[0];
          else this.curCustomer1 = r[0];
        });
    }
  }
  Round(amnt) {
    return Math.round(amnt);
  }
}
