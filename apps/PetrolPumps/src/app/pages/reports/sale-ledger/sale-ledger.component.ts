import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  GetDateJSON,
  JSON2Date,
  formatNumber,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-sale-ledger',
  templateUrl: './sale-ledger.component.html',
  styleUrls: ['./sale-ledger.component.scss'],
})
export class SaleLedgerComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: '',
    RouteID: '',
    CompanyID: '',
    CustomerID: '',
  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Product Name',
        fldName: 'ProductName',
      },

      {
        label: 'Qty',
        fldName: 'Qty',
        sum: true,
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Amount']);
        },
      },
    ],
    Actions: [],
    Data: [],
  };

  public data: object[];
  public Accounts: any = [];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,

    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
    this.http.getAcctstList('').then((r: any) => {
      this.Accounts = r;
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title =
      'Sale Ledger ' +
      (this.Filter.CustomerID
        ? ' Customer: ' +
          this.Accounts.find((x) => x.CustomerID == this.Filter.CustomerID)
            .CustomerName
        : '');
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    if (this.Filter.CustomerID)
      filter += ' and CustomerID=' + this.Filter.CustomerID;

    this.http
      .getData(
        'qrysalereport?flds=ProductName,sum(Qty) as Qty, sum(Amount) as Amount&groupby=ProductName&filter=' +
          filter
      )
      .then((r: any) => {
        this.data = r;
      });
  }
  Clicked(e) {}
  RouteSelected(event) {
    if (event.itemData) {
    }
  }
}
