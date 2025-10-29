import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-account-ledger',
  templateUrl: './account-ledger.component.html',
  styleUrls: ['./account-ledger.component.scss']
})
export class AccountLedgerComponent implements OnInit {

  public data: object[];
  public Products: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    AccountID: '',
    ProductID: ''
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date'
      },
      {
        label: 'Voucher No',
        fldName: 'VoucherNo'
      },
      {
        label: 'Description',
        fldName: 'Description'
      },

      {
        label: 'Debit',
        fldName: 'Debit',
        sum: true
      },
      {
        label: 'Credit',
        fldName: 'Credit',
        sum: true
      },
      {
        label: 'Balance',
        fldName: 'Balance',
      },

    ],
    Actions: [

    ],
    Data: []
  };


  Accounts: any = [];
  Account: any = {};

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private toaster: MyToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http.getData('accounts').then((r: any) => {
      this.Accounts = r;
    });



    this.FilterData();

  }

  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "Date between '" + JSON2Date(this.Filter.FromDate) +
      '\' and \'' + JSON2Date(this.Filter.ToDate) + '\'';


    if (!(this.Filter.AccountID === '' || this.Filter.AccountID === null)) {
      filter += ' and AccountID=' + this.Filter.AccountID;
    } else {
      filter += ' and AccountID=-1';
    }




    this.http.getData('qryacctdetails?filter=' + filter + '&orderby=Date').then((r: any) => {
      this.data = r;
    }).catch(e=>{
      this.toaster.Error(e.error.message, 'Error');
    });
  }

  Clicked(e) {

  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }
  AccountSelected(e) {
    if (e.AccountID) {
      this.http.getData('accounts/' + e.AccountID).then(r => {
        this.Account = r;
      });
    }
  }
  formatDate(d) {
    return JSON2Date(d);
  }
}
