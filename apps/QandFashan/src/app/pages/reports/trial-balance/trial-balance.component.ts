import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss'],
})
export class TrialBalanceComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  setting = {
    Columns: [
      {
        label: 'Code',
        fldName: 'AcctCode',
      },
      {
        label: 'Account Name',
        fldName: 'AccountName',
      },
      
      {
        label: 'Opening Debit',
        fldName: 'OpeningDebit',
        sum: true,
      },
      {
        label: 'Opening Credit',
        fldName: 'OpeningCredit',
        sum: true,
      },
      {
        label: 'Debit',
        fldName: 'TotalDebit',
        sum: true,
      },
      {
        label: 'Credit',
        fldName: 'TotalCredit',
        sum: true,
      },
      {
        label: 'Closing Denit',
        fldName: 'ClosingDebit',
        sum: true,
      },
      {
        label: 'Closing Credit',
        fldName: 'ClosingCredit',
        sum: true,
      },
    ],
    Actions: [],
    Data: [],
  };

  $Categories = this.cachedData.Categories$;

  public data: object[];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Trial Balance';
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

    this.http.getData('trialbalance/'+ JSON2Date(this.Filter.FromDate) + "/" + JSON2Date(this.Filter.ToDate) ).then((r: any) => {
      
      
      this.data = r.filter(x=>(x.TotalCredit * 1 >0 || x.TotalDebit * 1 >0));

    });
  }
  Clicked(e) {
    console.log(e);
  }
}
