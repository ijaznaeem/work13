import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { VoucherModel } from '../voucher.model';

@Component({
  selector: 'app-cash-payment',
  templateUrl: './cash-payment.component.html',
  styleUrls: ['./cash-payment.component.scss']
})
export class CashPaymentComponent implements OnInit {
  @ViewChild('cmbCustomer') cmbCustomer;
  public Voucher = new VoucherModel();
  Customers = [];
  AcctTypes = [];
  EditID = ""
  curCustomer: any = {};
  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.http.getData('accttypes').then((r: any) => {
      this.AcctTypes = r;
    });

    this.activatedRoute.params.subscribe((params: Params) => {

      if (params.EditID) {
        this.EditID = params.EditID

        this.http.getData('qryvouchers?filter=VoucherID=' + this.EditID).then((r: any) => {
          this.Voucher = r[0];
          this.Voucher.Date = GetDateJSON(new Date(r[0].Date));
          this.LoadCustomer({ AcctTypeID: r[0].AcctTypeID })
          this.GetCustomer(this.Voucher.CustomerID);
        })
      } else {
        this.EditID = '';
      }
      console.log(this.EditID);
    });

  }
  LoadCustomer(event) {
    if (event.AcctTypeID !== '') {
      this.http.getData('customers?flds=CustomerName,Address, Balance, CustomerID&orderby=CustomerName' +
        '&filter=AcctTypeID=' + event.AcctTypeID)
        .then((r: any) => {
          this.Customers = r;
        });
    }
  }
  SaveData() {
    let voucherid = '';
    this.Voucher.PrevBalance = this.curCustomer.Balance;
    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    if (this.EditID != '') {
      voucherid = '/' + this.EditID;
    }

    console.log(this.Voucher);
    this.http.postTask('vouchers' + voucherid, this.Voucher).then(r => {
      this.alert.Sucess('Payment Saved', 'Save', 1);
      if (this.EditID != '') {
        this.router.navigateByUrl('/cash/cashpayment/');
      } else {
        this.Voucher = new VoucherModel();
        this.cmbCustomer.focusIn();
      }
    });
  }
  GetCustomer(CustomerID) {
    console.log(CustomerID);
    if (CustomerID && CustomerID !== '') {
      this.http.getData('qrycustomers?filter=CustomerID=' + CustomerID).then((r: any) => {
        this.curCustomer = r[0];
      });

    }

  }
  Round(amnt) {
    return Math.round(amnt);
  }
}
