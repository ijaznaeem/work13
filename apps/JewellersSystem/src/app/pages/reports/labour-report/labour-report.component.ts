import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDateJSON, JSON2Date, getCurDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { LabourAddForm, LabourRptStngs } from './labour-report.settings';

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

    HeadID: '',
  };
  LabourHaeds: any = [];
  public data: object[];
  settings = LabourRptStngs;
  addform = LabourAddForm;

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
    this.ps.PrintData.Title = 'Labour Report';
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
      filter += " and TotalLabour > 0";


    this.http.getData('qryInvoices', {filter}).then((r: any) => {
      this.data = r;
    });
  }
  AddLabour() {
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
