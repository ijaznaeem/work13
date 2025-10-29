import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  GetDateJSON,
  JSON2Date
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-labour-report',
  templateUrl: './labour-report.component.html',
  styleUrls: ['./labour-report.component.scss'],
})
export class LabourReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),

    EmployeeID: '',
  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Employee',
        fldName: 'EmployeeName',
      },
      {
        label: 'Details',
        fldName: 'Description',
      },
      {
        label: 'Rate',
        fldName: 'Rate',
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

    ],
    Actions: [],
    Data: [],
  };

  public data: object[];
  public Accounts: any = [];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.http.getData('qryemployees').then((r: any) => {
      this.Accounts = r;
    });
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title =
      'Labour Report ' +
      (this.Filter.EmployeeID
        ? ' Employee: ' +
          this.Accounts.find((x) => x.EmployeeID == this.Filter.EmployeeID)
            .EmployeeName
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

    if (this.Filter.EmployeeID)
      filter += ' and EmployeeID=' + this.Filter.EmployeeID;

    this.http
      .getData(
        'qrylabour?filter=' +
          filter
      )
      .then((r: any) => {
        this.data = r;
      });
  }
  Clicked(e) {}
  RouteSelected(event) {
    if (event.itemData) {
      this.http.getCustList(event.itemData.RouteID).then((r: any) => {
        this.Accounts = r;
      });
    }
  }
}
