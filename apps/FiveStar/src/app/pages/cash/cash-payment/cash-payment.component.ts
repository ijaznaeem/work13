import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AcctTypes } from '../../../factories/constants';
import { GetDateJSON, GetProps, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
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
  AcctTypes = AcctTypes;
  EditID = '';
  bList = [];
  BusinessID = '';
  curCustomer: any = {};
  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.http.getData('blist').then((r: any) => {
      this.bList = r;
    });
    this.BusinessID = this.http.getBusinessID();

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
      }

      if (this.EditID !== '') {
        this.http
          .getData('qryvouchers?filter=VoucherID=' + this.EditID)
          .then((r: any) => {
            this.BusinessID = r[0].CBID;
            this.LoadCustomer(this.BusinessID, r[0].AcctTypeID);
            setTimeout(() => {
              this.Voucher = GetProps(
                r[0],
                Object.getOwnPropertyNames(new VoucherModel())
              );
              console.log(this.Voucher);
              this.Voucher.Date = GetDateJSON(new Date(r[0].Date));
            }, 1000);
          });
      }
    });
  }
  LoadCustomer(bid, AcctTypeID) {
    this.http
      .getData('qrycustomers', {
        flds: 'CustomerName,Address, PhoneNo1,MBalance, Balance,CustomerID',
        orderby: 'CustomerName',
        filter: `AcctTypeID=${AcctTypeID}`,
        bid: bid,
      })
      .then((response: any) => {
        this.Customers = response;
      });
  }
  SaveData() {
    let voucherid = '';
    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    if (this.EditID != '') {
      voucherid = '/' + this.EditID;
    }

    console.log(this.Voucher);
    this.http.postTask('vouchers' + voucherid, this.Voucher).then(
      () => {
        this.alert.Sucess('Receipt Saved', 'Save', 1);

        this.Voucher = Object.assign(new VoucherModel(), {
          AcctTypeID: this.Voucher.AcctTypeID,
        });
        this.cmbCustomer.focusIn();
        this.curCustomer = {};
      },
      (err) => {
        this.alert.Error(err.error.message, 'Error', 2);
        console.log(err);
        this.Voucher.Date = GetDateJSON();
      }
    );
  }

  GetCustomer(e) {
    console.log(e);
    if (e.itemData.CustomerID !== '') {
      this.http
        .getData('qrycustomers?filter=CustomerID=' + e.itemData.CustomerID)
        .then((r: any) => {
          this.curCustomer = r[0];
        });
    }
  }
  Round(amnt) {
    return Math.round(amnt);
  }
}
