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

@Component({
  selector: 'app-vouchers-report',
  templateUrl: './vouchers-report.component.html',
  styleUrls: ['./vouchers-report.component.scss'],
})
export class VouchersReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: '',
    RouteID: '',
  };
  Salesman;
  public Routes;
  public data: object[];

  setting = {
    Checkbox: false,
    crud: true,
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Customer Name',
        fldName: 'CustomerName',
      },
      {
        label: 'Address',
        fldName: 'Address',
      },
      {
        label: 'City',
        fldName: 'City',
      },
      {
        label: 'Debit',
        fldName: 'Debit',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Debit']);
        },
      },
      {
        label: 'Credit',
        fldName: 'Credit',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Credit']);
        },
      },
    ],
    Actions: [


    ],
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router
  ) {
    this.Salesman = this.cachedData.Salesman$;
    this.Routes = this.cachedData.routes$;
  }

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Vouchers Report';
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
    if (this.Filter.RouteID && this.Filter.RouteID != '')
      filter += ' and Routeid = ' + this.Filter.RouteID;
    if (this.Filter.SalesmanID && this.Filter.SalesmanID != '')
      filter += ' and SalesmanID = ' + this.Filter.SalesmanID;

    this.http.getData('qryvouchers?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {

  }
}
