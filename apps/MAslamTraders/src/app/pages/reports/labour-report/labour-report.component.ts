import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../../../../../../libs/future-tech-lib/src/lib/components/services/modal.service';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { LabourRptStngs } from './labour-report.settings';

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

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private modalSrvc: ModalService,
    private router: Router
  ) {}

  ngOnInit() {

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
    let filter =` Labour > 0 and Date between '${JSON2Date(this.Filter.FromDate)}' and '${JSON2Date(this.Filter.ToDate)}'`

    this.http.getData('qryinvoices?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }

}
