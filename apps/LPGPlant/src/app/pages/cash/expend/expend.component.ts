import { Component, OnInit, ViewChild } from '@angular/core';
import { JSON2Date, GetDateJSON } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  @ViewChild('cmbHeads') cmbHeads: any;
  public Voucher = new ExpenseModel();
  ExpenseHeads = [];
  EditID = '';
  public Ino = '';
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
        this.EditID = params.EditID;
        this.http
          .getData('expenses/' + this.EditID)
          .then((r: any) => {
            this.Voucher = r;
            this.Voucher.Date = GetDateJSON(new Date(r.Date));
          });
      } else {
        this.EditID = '';
      }
    });
  }
  SaveData() {
    let url = 'expenses/';
    if (this.EditID != '') {
      url += this.EditID;
    } 


    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    this.Voucher.BusinessID = this.http.getBusinessID();
    console.log(this.Voucher);
    this.http.postData(url, this.Voucher).then((r) => {
      this.alert.Sucess('Expense Saved', 'Save', 1);
      this.Voucher = new ExpenseModel();
      this.cmbHeads.focusIn();
      this.router.navigate(['/cash/expense']);
    });
  }

  Round(amnt: number): number {
    return Math.round(amnt);
  }
}
