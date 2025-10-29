import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDateJSON, JSON2Date, getCurDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { PolishAddForm, PolishRptStngs } from './polish-report.settings';

@Component({
  selector: 'app-polish-report',
  templateUrl: './polish-report.component.html',
  styleUrls: ['./polish-report.component.scss'],
})
export class PolishReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),

    HeadID: '',
  };
  PolishHaeds: any = [];
  public data: object[];
  settings = PolishRptStngs;
  addform = PolishAddForm;

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;

    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Polish Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =  "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) + "'";
      filter += " and TotalPolish > 0";


    this.http.getData('qryInvoices', {filter}).then((r: any) => {
      this.data = r;
    });
  }
  AddPolish() {
    this.http
      .openForm(this.addform, {
        Date: GetDate(new Date(getCurDate())),
      })
      .then((r: any) => {
        if (r == 'save') {
          this.FilterData();
        }
      });
  }
}
