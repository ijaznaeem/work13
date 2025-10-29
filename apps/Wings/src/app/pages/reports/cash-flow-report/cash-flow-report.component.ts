import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GroupBy } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDateJSON, JSON2Date, RoundTo2 } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-cash-flow-report',
  templateUrl: './cash-flow-report.component.html',
  styleUrls: ['./cash-flow-report.component.scss'],
})
export class CashFlowReportComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public Agents: any = [];
  public Data: any = [];
  public filterList: string = '1=2';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    agent_id: '',
  };
  groupkeys = [
    { ref_type: 'RECEIPT', description: 'Receipt' },
    { ref_type: 'PAYMENT', description: 'Payment' },
    { ref_type: 'EXPENSE', description: 'Expense' },
    { ref_type: 'jv', description: 'Journal Voucher' },
    { ref_type: 'DRCRNotes', description: 'Debit/Credit Notes' },

  ];
  constructor(
    private ps: PrintDataService,
    private router: Router,
    private http: HttpBase
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.FilterData();
  }
  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";
    this.http
      .postData('cashflow', {
        from_date: JSON2Date(this.Filter.FromDate),
        to_date: JSON2Date(this.Filter.ToDate),
      })
      .then((r: any) => {
        this.Data = GroupBy(r, 'ref_type');
        console.log(this.Data);
      });
  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Cash Flow Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  getCashOutTotal(key){
    return RoundTo2(this.Data[key]?.reduce((sum, item) => sum + (Number(item.cash_out) || 0), 0));
  }
  getCashInTotal(key){
    return RoundTo2(this.Data[key]?.reduce((sum, item) => sum + (Number(item.cash_in) || 0), 0));
  }
  getGrandCashInTotal() {
    return Object.keys(this.Data).reduce((total, key) => {
      return RoundTo2( total + this.getCashInTotal(key));
    }, 0);
  }

  getGrandCashOutTotal() {
    return Object.keys(this.Data).reduce((total, key) => {
      return RoundTo2( total + this.getCashOutTotal(key));
    }, 0);
  }
}
