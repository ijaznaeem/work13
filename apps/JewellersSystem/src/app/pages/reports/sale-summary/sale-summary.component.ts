import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  GetDateJSON,
  JSON2Date,
  formatNumber,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-sale-summary',
  templateUrl: './sale-summary.component.html',
  styleUrls: ['./sale-summary.component.scss'],
})
export class SalesummaryComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    ProductID: '',
  };
  setting = {
    Checkbox: false,
    GroupBy: 'StoreName',
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
        label: 'Weight',
        fldName: 'Weight',
        sum: true,
      },
      {
        label: 'Polish',
        fldName: 'Polish',
        sum: true,
      },
      {
        label: 'Cutting',
        fldName: 'Cutting',
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
        label: 'Labour',
        fldName: 'Labour',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Labour']);
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
    Actions: [],
    Data: [],
  };
  sting = this.setting;
  public data: object[];
  public Products: any;
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {
    this.Products = this.cachedData.Products$;
  }

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Sale Summary Report';
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

    this.http
      .getData(
        'qrysalereport?flds=StoreName,ProductName,' +
          'sum(Qty) as Qty, sum(Weight) as Weight, sum(Polish) as Polish, sum(Cutting) as Cutting, sum(Amount) as Amount, sum(Labour) as Labour, sum(NetAmount) as NetAmount,&groupby=StoreName,' +
          'ProductName&filter=' +
          filter
      )
      .then((r: any) => {

        this.data = r;
      });
  }
}
