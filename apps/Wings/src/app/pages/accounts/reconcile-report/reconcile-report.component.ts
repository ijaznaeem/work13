import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ACTION_EDIT } from '../../../factories/static.data';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-reconcile-report',
  templateUrl: './reconcile-report.component.html',
  styleUrls: ['./reconcile-report.component.scss'],
})
export class ReconcileReportComponent implements OnInit {
  public data: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  setting = {
    Columns: [



      {
        label: 'Account',
        fldName: 'account_name',
      },

      {
        label: 'Start Date',
        fldName: 'start_date',
      },

      {
        label: 'End Date',
        fldName: 'end_date',

      },
      {
        label: 'Opening Balance',
        fldName: 'opening_balance',
      },
      {
        label: 'Closing Balance',
        fldName: 'closing_balance',
      },
      {
        label: 'Difference',
        fldName: 'diffirence',
      },

    ],
    Actions: [
      ACTION_EDIT
    ],
    Data: [],
  };



  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
this.FilterData()
  }

  FilterData() {
    let filter =`date between '${JSON2Date(this.Filter.FromDate)}' and '${JSON2Date(this.Filter.ToDate)}'`;

    this.http.getData('qrybankrecon?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }

  PrintReport() {

    this.ps.PrintData.Title = 'Recconcillation Report';
    this.ps.PrintData.SubTitle = 'From: ' + JSON2Date(this.Filter.FromDate) + " and " + JSON2Date(this.Filter.ToDate);
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }

  formatDate(d) {
    return JSON2Date(d);
  }

  AddReconcile() {
    this.router.navigateByUrl('/accounts/bank-reconciliation');
  }
  ActionClicked(e) {
    console.log(e);

    this.router.navigateByUrl('/accounts/bank-reconciliation/' + e.data.reconcile_id);
  }
}
