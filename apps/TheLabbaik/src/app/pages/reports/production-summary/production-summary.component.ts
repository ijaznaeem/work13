import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-production-summary',
  templateUrl: './production-summary.component.html',
  styleUrls: ['./production-summary.component.scss'],
})
export class ProductionsummaryComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),

    StoreID: '',
  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Type',
        fldName: 'ProductionType',
      },
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
    ],
    Actions: [],
    Data: [],
  };

  public data: object[];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Production Summary Report';
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
      .getData('qryproductionreport', {
        flds: 'Date,ProductName,ProductionType, Qty, PackingWght, Weight',
        filter: filter,
      })
      .then((r: any) => {
        this.data = r;
      });
  }
  Clicked(e) {}
}
