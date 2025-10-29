import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountTypes } from '../../../factories/static.data';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-account-ledger',
  templateUrl: './account-ledger.component.html',
  styleUrls: ['./account-ledger.component.scss'],
})
export class AccountLedgerComponent implements OnInit {
  @ViewChild('Account') Account;
  public data: any = [];
  public Products: object[];
  public Users: object[];
  public AcctTypes: any = AccountTypes;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    AccountID: '',
    AcctTypeID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Ref No',
        fldName: 'RefID',
      },

      {
        label: 'Description',
        fldName: 'Description',
      },
      {
        label: 'Exp Head',
        fldName: 'Headname',
      },
      {
        label: 'Donar Name',
        fldName: 'DonarName',
      },

      {
        label: 'Debit',
        fldName: 'Debit',
        sum: true,
      },
      {
        label: 'Credit',
        fldName: 'Credit',
        sum: true,
      },
      {
        label: 'Balance',
        fldName: 'Balance',
        type: 'number',
      },
    ],
    Actions: [],
    Data: [],
  };

  account: any = {};
  Accounts: any;

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;

    // this.Accounts = this.cache.Accounts$;
    this.FilterData();
  }
  Accountselected(e) {
    if (e.itemData) {
      this.http.getData('accounts/' + e.itemData.AccountID).then((r) => {
        this.account = r;
        this.account.OpenBalance = 0;
        this.account.CloseBalance = 0;
      });
    }
  }
  TypeSelected(e) {
    if (e.itemData) {
      this.http.getData('accounts?filter=TypeID=' + e.itemData.id).then((r) => {
        this.Accounts = r;
      });
    }
  }
  FilterData() {
    // tslint:disable-next-line:quotemark

    this.http
      .postData('acctdetails', {
        from_date: JSON2Date(this.Filter.FromDate),
        to_date: JSON2Date(this.Filter.ToDate),
        account_id: this.Filter.AccountID,
        type: this.Filter.AcctTypeID,
      })
      .then((r: any) => {
        this.data = r;
        if (this.data.length > 0) {
          this.account.OpenBalance =
            Number(this.data[0].Balance) +
            Number(this.data[0].Debit) -
            Number(this.data[0].Credit) * 1;
          this.account.CloseBalance = this.data[this.data.length - 1].Balance;

          this.data.unshift({
            Date: this.data[0].Date,
            Description: 'Opeing Balance ...',
            Debit: 0,
            Credit: 0,
            Balance: this.account.OpenBalance,
          });
        }
      });
  }

  Clicked(e) {}
  PrintReport() {

    console.log(this.account);

    this.ps.PrintData.Title = 'Accounts Report : ' + this.account.AccountName;
    this.ps.PrintData.SubTitle = 'From: ' + JSON2Date(this.Filter.FromDate);
    this.ps.PrintData.SubTitle += ' To: ' + JSON2Date(this.Filter.ToDate);

    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }
  DetailReport() {
    this.router.navigateByUrl(
      '/accounts/accountdetails/' +
        JSON2Date(this.Filter.FromDate) +
        '/' +
        JSON2Date(this.Filter.ToDate) +
        '/' +
        this.Filter.AccountID
    );
  }

  formatDate(d) {
    return JSON2Date(d);
  }
}
