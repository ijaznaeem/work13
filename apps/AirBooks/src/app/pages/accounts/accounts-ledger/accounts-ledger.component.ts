import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComboBoxComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-accounts-ledger',
  templateUrl: './accounts-ledger.component.html',
  styleUrls: ['./accounts-ledger.component.scss'],
})
export class AccountsLedgerComponent implements OnInit {
  @ViewChild('cmbAccount') cmbAccount: ComboBoxComponent;
  public data: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    AccountID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'date',
      },
      {
        label: 'Ref No',
        fldName: 'ref_id',
      },
      {
        label: 'Ref Type',
        fldName: 'ref_type',
      },

      {
        label: 'Customer',
        fldName: 'customer_name',
      },
      {
        label: 'Book Ref No',
        fldName: 'book_ref',
      },
      {
        label: 'Ticket No',
        fldName: 'ticket_no',
      },
      {
        label: 'PPT',
        fldName: 'ppt',
      },
      {
        label: 'Description',
        fldName: 'description',
      },

      {
        label: 'Debit',
        fldName: 'debit',
        sum: true,
      },
      {
        label: 'Credit',
        fldName: 'credit',
        sum: true,
      },
      {
        label: 'Balance',
        fldName: 'balance',
      },
    ],
    Actions: [],
    Data: [],
  };

  public toolbarOptions: object[];
  Accounts: any;
  account: any = {};

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.loadAccount('1');
  }
  loadAccount(v) {
    console.log(v);

    if (v == '1') {
      this.http.getData('qrysuppliers').then((r: any) => {
        this.Accounts = r;
      });
    } else if (v == '2') {
      this.http.getData('qrycashaccts').then((r: any) => {
        this.Accounts = r;
      });
    } else if (v == '3') {
      this.http.getData('qrycustomer_accounts').then((r: any) => {
        this.Accounts = r;
      });
    } else if (v == '4') {
      this.http.getData('expheadslist').then((r: any) => {
        this.Accounts = r;
      });
    } else if (v == '5') {
      this.http.getData('qryacctlist?filter=account_type=' + v).then((r: any) => {
        this.Accounts = r;
      });
    }
  }
  FilterData() {
    let filter =
      this.Filter.AccountID +
      '/' +
      JSON2Date(this.Filter.FromDate) +
      '/' +
      JSON2Date(this.Filter.ToDate);

    this.http.getData('accountledger/' + filter).then((r: any) => {
      this.data = r;
    });
  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = this.cmbAccount.text;
    this.ps.PrintData.SubTitle =
      'From Date: ' +
      JSON2Date(this.Filter.FromDate) +
      ' To ' +
      JSON2Date(this.Filter.ToDate);
    this.router.navigateByUrl('/print/print-html');
  }
  AccountSelected(e) {
    if (e.itemData) {
      this.http.getData('accounts/' + e.itemData.account_id).then((r) => {
        this.account = r;
      });
    }
  }
  formatDate(d) {
    if (d) return JSON2Date(d);
    else return '';
  }
}
