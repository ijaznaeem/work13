import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { DeliveryRptStngs } from './delivery-report.settings';

@Component({
  selector: 'app-delivery-report',
  templateUrl: './delivery-report.component.html',
  styleUrls: ['./delivery-report.component.scss'],
})
export class DeliveryReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),

    What: '1',
  };
  DeliveryHaeds: any = [];
  public data: object[];
  settings = DeliveryRptStngs;

  public toolbarOptions: object[];
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
    this.ps.PrintData.Title = 'Delivery Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    let filter = `Date Between '${JSON2Date(
      this.Filter.FromDate
    )}' and  '${JSON2Date(this.Filter.ToDate)}'`;

    this.settings = JSON.parse(JSON.stringify(DeliveryRptStngs));

    this.http
      .getData('qrydelivery', {
        flds: 'Date,InvoiceID,CustomerName,Transporters,DeliveryCharges',
        filter: filter,
      })
      .then((r: any) => {
        let i = 1;
        this.data = r.map((x) => {
          return {
            ...x,
            SNo: i++,
          };
        });
      });
  }
}
