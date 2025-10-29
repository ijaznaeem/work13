import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-issue-report',
  templateUrl: './issue-report.component.html',
  styleUrls: ['./issue-report.component.scss'],
})
export class IssueReportComponent implements OnInit {
  public data: object[];
  public Salesman: object[];
  public Customers: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    CustomerID: '',
  };
  setting = {
    crud: true,
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Time',
        fldName: 'Time',
      },
      {
        label: 'Description',
        fldName: 'Description',
      },

      {
        label: 'User',
        fldName: 'UserName',
      },
    ],
    Actions: [
      {
        title: 'Print',
        icon: 'print',
        class: 'primary',
        action: 'print',
      },
    ],
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getCustList().then((r: any) => {
      this.Customers = r;
    });
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Raw Material Issue Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    this.http.getData('qrystockissue?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    if (e.action =='print'){
      this.router.navigateByUrl('print/stockissue/' + e.data.IssueID);
    }
  }
}
