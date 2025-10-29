import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  GetDateJSON,
  JSON2Date
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
@Component({
  selector: 'app-audit-report',
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.scss'],
})
export class AuditReportComponent implements OnInit {
  @ViewChild('cmbCat') cmbCat;
  public data: object[];
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    StoreID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Product Name',
        fldName: 'ProductName',
      },

      {
        label: 'Old Qty',
        fldName: 'OldQty',
      },
      {
        label: 'New Qty',
        fldName: 'NewQty',
      },
      {
        label: 'Diffirence',
        fldName: 'Diff',
      },
      {
        label: 'Remarks',
        fldName: 'Remarks',
      },
    ],
    Actions: [],
    Data: [],
  };

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "' and Status = 1";
    if (this.Filter.StoreID !== '')
      filter += ' AND StoreID=' + this.Filter.StoreID;

    this.http.getData('qryauditreport?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {}
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Audit Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
}
