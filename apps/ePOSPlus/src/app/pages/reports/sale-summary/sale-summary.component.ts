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
  selector: 'app-sale-summary',
  templateUrl: './sale-summary.component.html',
  styleUrls: ['./sale-summary.component.scss'],
})
export class SalesummaryComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),

    CategoryID: ''
  };
  setting = {
    GroupBy: 'CategoryName',
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

      },
      {
        label: 'Discount',
        fldName: 'Discount',
        sum: true,

      },

      {
        label: 'Net Amount',
        fldName: 'NetAmount',
        sum: true,

      },

    ],
    Actions: [

    ],
    Data: [],
  };

  $Categories = this.cachedData.Categories$

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
    this.ps.PrintData.Title = 'Sale Summary';
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
    if (this.Filter.CategoryID) filter += ' and CategoryID=' + this.Filter.CategoryID


    this.http.getData('qrysalereport?flds=CategoryName, ProductName,sum(TotPcs) as Qty, sum(Amount) as Amount, '
      + 'sum(Discount) as Discount, Sum(NetAmount) as NetAmount&groupby=CategoryName,ProductName&orderby=CategoryName,ProductName&filter=' + filter).then((r: any) => {
        this.data = r;
      });
  }
  Clicked(e) {
    console.log(e);

  }
}
