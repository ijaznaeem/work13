import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
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
  EditID = '';
  voucher: any;
  voucher1: any;
  Products: any = [];
  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.http.getData('accttypes').then((r: any) => {
      this.AcctTypes = r;
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        this.http
          .getData('qryvouchers?filter=VoucherID=' + this.EditID)
          .then((r: any) => {
            this.Voucher1 = r[0];
            this.Voucher1.Date = GetDateJSON(new Date(this.Voucher1.Date));
            this.LoadCustomer({ AcctTypeID: this.Voucher1.AcctTypeID }, 2);
            this.GetCustomer({ CustomerID: this.Voucher1.CustomerID }, 2);
            console.log(this.Voucher1);
            this.http
              .getData('qryvouchers?filter=VoucherID=' + this.Voucher1.RefID)
              .then((r2: any) => {
                this.Voucher = r2[0];
                this.Voucher.Date = GetDateJSON(new Date(this.Voucher.Date));
                this.LoadCustomer({ AcctTypeID: this.Voucher.AcctTypeID }, 1);
                this.GetCustomer({ CustomerID: this.Voucher.CustomerID }, 1);
                console.log(this.Voucher);
              });
          });
      } else {
        this.EditID = '';
      }
    });
  }
  LoadCustomer(e, v) {
    console.log(e);

    if (e.AcctTypeID !== '') {
      this.http
        .getData(
          'qrycustomers?flds=CustomerName,Address, Balance, CustomerID&orderby=CustomerName' +
            '&filter=AcctTypeID=' +
            e.AcctTypeID
        )
        .then((r: any) => {
          if (v == 1) this.Customers = r;
          else this.Customers1 = r;
        });
    }
  }
  SaveData() {
    this.Voucher.PrevBalance = this.curCustomer.Balance;
    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    this.Voucher1.Date = JSON2Date(this.Voucher1.Date);
    this.Voucher.RefID = '0';
    this.Voucher.RefType = 4;
    this.http.postTask('vouchers' + (this.Voucher.VoucherID !=''? '/' + this.Voucher.VoucherID: ''), this.Voucher).then((r: any) => {
      this.Voucher1.RefID = r.id;
      this.Voucher1.RefType = 4;
      this.Voucher1.Debit = this.Voucher.Credit;
      this.Voucher1.Credit = 0;
      this.http.postTask('vouchers' + (this.Voucher1.VoucherID !=''? '/' + this.Voucher1.VoucherID: ''), this.Voucher1).then((r1) => {
        this.alert.Sucess('Voucher Saved', 'Save', 1);
        this.Voucher = new VoucherModel();
        this.Voucher1 = new VoucherModel();

        this.cmbCustomer.focusIn();
      });
    });
  }
  GetCustomer(e, v) {
    console.log(e);
    if (e) {
      this.http
        .getData('qrycustomers?filter=CustomerID=' + e.CustomerID)
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
