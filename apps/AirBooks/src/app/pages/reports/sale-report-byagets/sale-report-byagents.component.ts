import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentStatus } from '../../../factories/static.data';
import { GetDateJSON, JSON2Date, RoundTo2 } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { SaleReporByAgentsSettings } from './sale-report-byagents.settings';

@Component({
  selector: 'app-sale-report-byagents',
  templateUrl: './sale-report-byagents.component.html',
  styleUrls: ['./sale-report-byagents.component.scss'],
})
export class SaleReporByAgentsComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public Agents: any = [];
  public Data: any = [];
  public Settings = SaleReporByAgentsSettings;
  public Status = PaymentStatus;
  public filterList: string = '1=2';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    agent_id: '',
  };
  public isAgent = false;

  constructor(
    private ps: PrintDataService,
    private router: Router,
    private http: HttpBase
  ) {}

  ngOnInit() {
    this.http.getAgents().then((r: any) => {
      this.Agents = r;
      this.Agents.unshift({
        full_name: '--All--',
        userid: '',
      });

      let u = this.Agents.find((x) => {
        return x.userid == this.http.getUserID();
      });

      if (u) {
        this.Filter.agent_id = u.userid;
        this.isAgent = true;
      }
      this.FilterData();
    });

    this.Filter.FromDate.day = 1;
  }
  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";
    filter += ' and isposted =1';
    let agent_id = 0;
    if (this.Filter.agent_id != '' && this.Filter.agent_id != null) {
      agent_id = +this.Filter.agent_id;
    }

    this.http
      .getData(
        `salereport/${JSON2Date(
          this.Filter.FromDate)}/${JSON2Date(
          this.Filter.ToDate
        )}/${agent_id}`
      )
      .then((r: any) => {
        r = r.map((x) => {
          return {
            ...x,
            net_sale: x.net_amount - x.return_amount,
            profit: RoundTo2( (x.net_amount - x.return_amount) - x.staff_cost),

          };
        });
        this.Data = r;
      });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'print') {
      // this.http.openAsDialog(PrintInvoiceComponent, {invoice_id: e.data.invoice_id})
      window.open('/#/print/saleinvoice/' + e.data.invoice_id);
    }
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Sale Report by Agents';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
}
