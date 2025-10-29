import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  GetDateJSON,
  JSON2Date
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-log-report',
  templateUrl: './log-report.component.html',
  styleUrls: ['./log-report.component.scss'],
})
export class LogReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SearchText: '',

  };
  public Transporters: any = [];
  public data: object[];

  setting = {
    Checkbox: false,
    Columns: [

      {
        label: 'Date',
        fldName: 'ActionDate',
      },
      {
        label: 'Invoice No',
        fldName: 'InvoiceID',
      },
      {
        label: 'Action',
        fldName: 'ActionType',
      },
      {
        label: 'Customer Name',
        fldName: 'CustomerName',
      },

      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,

      },
      {
        label: 'User Name',
        fldName: 'UserName',

      },
    ],
    Actions: [

    ],
    Data: [],

  };

  public toolbarOptions: object[];
  public Users: any = [];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router,
    private bill: PrintBillService
  ) {}

  ngOnInit() {


    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Log Report';
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
      "   Date(ActionDate)  between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    this.http.getData('qrylogreport', {
      filter: filter,
      orderby: 'ActionDate desc',
    }).then((r: any) => {
      this.data = r;
    });
  }

}
