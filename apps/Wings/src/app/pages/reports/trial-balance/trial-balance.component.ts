import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss'],
})
export class TrialBalanceComponent implements OnInit {
  public data: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Search: '',
    AccountID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'date',
      },
      {
        label: 'Ref No',
        fldName: 'ref_id',
      },
      {
        label: 'Ref Type',
        fldName: 'ref_type',
      },

      {
        label: 'Account',
        fldName: 'account_name',
      },

      {
        label: 'Description',
        fldName: 'description',
      },

      {
        label: 'Debit',
        fldName: 'debit',
        sum: true,
      },
      {
        label: 'Credit',
        fldName: 'credit',
        sum: true,
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
      JSON2Date(this.Filter.FromDate) + '/' + JSON2Date(this.Filter.ToDate);

    this.http.getData('trialbalance/' + filter).then((r: any) => {
      this.data = r;
    });
  }

  PrintReport() {
    this.ps.PrintData.Title = 'Trial Balance';
    this.ps.PrintData.SubTitle =
      'From: ' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }

  formatDate(d) {
    return JSON2Date(d);
  }
}
