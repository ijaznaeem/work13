import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  formatNumber,
  GetDateJSON,
  JSON2Date,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.scss'],
})
export class CashFlowComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  @ViewChild('cmbAcctType') cmbAcctType;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    AcctTypeID: '',
  };
  setting = {
    Checkbox: false,
    GroupBy: 'Type',
    Columns: [
      {
        label: 'Account Name',
        fldName: 'CustomerName',
      },

      {
        label: 'Address',
        fldName: 'Address',
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Amount']);
        },
      },
      {
        label: 'Debit/Credit',
        fldName: 'DtCr',
      },
    ],
    Actions: [],
    Data: [],
  };

  AcctTypes = this.cachedData.AcctTypes$;
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
    this.ps.PrintData.Title = 'Cash Flow Report - ' + this.cmbAcctType.text;
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    if (this.Filter.AcctTypeID == null || this.Filter.AcctTypeID == '') return;

    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    filter += ` and (AcctTypeID=${this.Filter.AcctTypeID})`;

    this.http
      .getData(
        'qryvouchers?flds=RefType,CustomerName, Address, sum(Debit - Credit) as Amount&' +
          'groupby=RefType,CustomerName,Address&filter=' +
          filter
      )
      .then((r: any) => {
        r = r.map((x: any) => {
          return {
            ...x,
            Type: x.RefType == 4 ? 'Transfer' : 'Cash',
            DtCr: x.Amount >= 0 ? 'Debit' : 'Credit',
          };
        });
        this.data = r;
      });
  }
}
