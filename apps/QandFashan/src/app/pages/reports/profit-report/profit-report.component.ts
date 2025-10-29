import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GroupBy } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import {
  FindTotal,
  GetDateJSON,
  JSON2Date,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
@Component({
  selector: 'app-profit-report',
  templateUrl: './profit-report.component.html',
  styleUrls: ['./profit-report.component.scss'],
})
export class ProfitReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  public data: any = [];
  public Salesman: any = [];
  public Routes: any = [];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Type',
        fldName: 'Type',
      },
      {
        label: 'Description',
        fldName: 'Description',
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true
      },
    ],
    Actions: [],
    Data: [],
  };
  expenses: any = [];
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
    this.ps.PrintData.Title = 'Profit Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    this.http
      .getData(
        'profitreport/' +
          JSON2Date(this.Filter.FromDate) +
          '/' +
          JSON2Date(this.Filter.ToDate)
      )
      .then((r: any) => {
        this.data = GroupBy(r, 'Type');
        console.log(this.data);

      });
  }
  FindTotal(d, fld) {
    return FindTotal(d, fld);
  }
}
