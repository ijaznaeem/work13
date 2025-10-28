import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import swal from 'sweetalert';
import { PrintDataService } from '../../../services/print.data.services';
import { formatNumber } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';

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
    CompanyID: ''
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
      {
        label: 'Discount',
        fldName: 'Discount',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Discount']);
        },
      },

      {
        label: 'Net Amount',
        fldName: 'NetAmount',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['NetAmount']);
        },
      },

    ],
    Actions: [

    ],
    Data: [],
  };

  Salesman = this.cachedData.Salesman$;
  $Companies = this.cachedData.Companies$
  public Routes = this.cachedData.routes$
  public data: object[];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Sale Ledger';
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
    if (this.Filter.SalesmanID) filter += ' and SalesmanID=' + this.Filter.SalesmanID
    if (this.Filter.RouteID) filter += ' and RouteID=' + this.Filter.RouteID
    if (this.Filter.CompanyID) filter += ' and CompanyID=' + this.Filter.CompanyID


    this.http.getData('qrysalereport?flds=ProductName,sum(Qty) as Qty, sum(Amount) as Amount, '
      + 'sum(Discount) as Discount, Sum(NetAmount) as NetAmount&groupby=ProductName&filter=' + filter).then((r: any) => {
        this.data = r;
      });
  }
  Clicked(e) {

  }
}
