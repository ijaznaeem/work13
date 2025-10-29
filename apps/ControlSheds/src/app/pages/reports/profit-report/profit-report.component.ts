import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  FindTotal,
  GetDateJSON,
  JSON2Date,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { PrintDataService } from '../../../services/print.data.services';
import { formatNumber } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
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
    FlockID: this.http.GetFlockID(),
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
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Amount']);
        },
      },
    ],
    Actions: [],
    Data: [],
  };

  public Flocks = this.cachedData.Flocks$;
  expenses: any = [];
  constructor(
    private cachedData: CachedDataService,
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
    this.ps.PrintData.SubTitle = '';

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    this.http.getData('profitreport/' + this.Filter.FlockID).then((r: any) => {
      this.data = r;
    });
  }
  FindTotal(d, fld) {
    return FindTotal(d, fld);
  }
}
