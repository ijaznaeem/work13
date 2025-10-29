import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { ShopVoucher } from '../shopvoucher.model';

@Component({
  selector: 'app-shop-payment',
  templateUrl: './shop-payment.component.html',
  styleUrls: ['./shop-payment.component.scss']
})
export class ShopPaymentComponent implements OnInit {
  @ViewChild('cmbCustomer') cmbCustomer;
  public Voucher = new ShopVoucher();
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
        params.EditID

      this.http.getData('vouchers/' + this.EditID).then((r:any)=>{
        this.Voucher = r;
        this.Voucher.Date = GetDateJSON(new Date(r.Date));
        this.LoadCustomer({AcctTypeID: r.AcctTypeID})
      })
    } else {
      this.EditID = '';
    }
      console.log(this.EditID);
    });

  }
  LoadCustomer(event) {
    if (event.AcctTypeID !== '') {
      this.http.getData('customers?flds=CustomerName,CustomerID&orderby=CustomerName' +
        '&filter=AcctTypeID=' + event.AcctTypeID)
        .then((r: any) => {
          this.Customers = r;
        });
    }
  }
  SaveData() {
    let voucherid = '';

    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    if (this.EditID != '') {
      voucherid = '/' + this.EditID;
    }

    console.log(this.Voucher);
    this.http.postTask('vouchers' + voucherid, this.Voucher).then(r => {
      this.alert.Sucess('Payment Saved', 'Save', 1);
      if (this.EditID != '') {
        this.router.navigateByUrl('/shop/shoppayment/');
      } else {
        this.Voucher = new ShopVoucher();
        this.cmbCustomer.focusIn();
      }
    });
  }


  GetCustomer(e) {
    console.log(e);
    if (e.itemData.CustomerID !== '') {
      this.http.getData('qrycustomers?filter=CustomerID=' + e.itemData.CustomerID).then((r: any) => {
        this.curCustomer = r[0];
      });

    }

  }
  Round(amnt) {
    return Math.round(amnt);
  }
}
