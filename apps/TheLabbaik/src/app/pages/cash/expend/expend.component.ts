import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

class ExpenseModel {
  Date: any = GetDateJSON();
  HeadID = '';
  Description = '';
  Amount = 0;
  BusinessID = '';
  ClosingID = JSON.parse(localStorage.getItem('currentUser') || '{}').closingid;
}
@Component({
  selector: 'app-expend',
  templateUrl: './expend.component.html',
  styleUrls: ['./expend.component.scss'],
})
export class ExpendComponent implements OnInit {
  @ViewChild('cmbHeads') cmbHeads;
  public EditID = '';
  public Voucher = new ExpenseModel();

  ExpenseHeads = [];

  curCustomer: any = {};
  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.http.getData('expensehead').then((r: any) => {
      this.ExpenseHeads = r;
    });

    this.activatedRoute.params.subscribe((params: Params) => {


      if (params.EditID) {
        console.log('param',params);
        this.EditID = params.EditID;
        this.http
          .getData('expenses?filter=ExpendID=' + this.EditID)
          .then((r: any) => {
            this.Voucher = r[0];
            this.Voucher.Date = GetDateJSON(new Date(r[0].Date));
          });
      } else {
        this.EditID = '';
      }
      console.log(this.EditID);
    });
  }
  SaveData() {
    let voucherid = '';
    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    if (this.EditID != '') {
      voucherid = '/' + this.EditID;
    }
    this.Voucher.BusinessID = this.http.getBusinessID();

    console.log(this.Voucher);
    this.http.postData('expenses' + voucherid, this.Voucher).then((r) => {
      this.alert.Sucess('Expense Saved', 'Save', 1);

      this.router.navigateByUrl('/cash/expense');
      this.Voucher = new ExpenseModel();
      this.cmbHeads.focusIn();
    });
  }

  Round(amnt) {
    return Math.round(amnt);
  }
}
