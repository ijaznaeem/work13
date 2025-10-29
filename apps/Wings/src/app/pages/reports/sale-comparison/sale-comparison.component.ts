import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentStatus } from '../../../factories/static.data';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { SaleReporByAgentsSettings } from './sale-comparison.settings';

@Component({
  selector: 'app-sale-comparison',
  templateUrl: './sale-comparison.component.html',
  styleUrls: ['./sale-comparison.component.scss'],
})
export class SaleComparisonComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public Agents: any = [];
  public Data: any = [];
  public processedData: any = [];
  public uniqueMonths: any = [];
  public grandTotal: any = {
    total_invoices: 0,
    total_sale: 0,
    total_profit: 0
  };
  public Settings = SaleReporByAgentsSettings;
  public Status = PaymentStatus;
  public filterList: string = '1=2';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  public isAgent = false;

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


    this.http
      .postData(
        `user_sales_by_month`, {
          FromDate: JSON2Date(this.Filter.FromDate),
          ToDate: JSON2Date(this.Filter.ToDate),
        }
      )
      .then((r: any) => {
        this.Data = r;
        this.processDataForCrossTab();
      });
  }

  processDataForCrossTab() {
    if (!this.Data || this.Data.length === 0) {
      this.processedData = [];
      this.uniqueMonths = [];
      this.grandTotal = { total_invoices: 0, total_sale: 0, total_profit: 0 };
      return;
    }

    // Get unique months
    const monthsSet = new Set();
    this.Data.forEach(item => {
      monthsSet.add(item.month);
    });

    this.uniqueMonths = Array.from(monthsSet).map(month => {
      const item = this.Data.find(d => d.month === month);
      return {
        month: month as string,
        month_name: item.month_name
      };
    }).sort((a, b) => a.month.localeCompare(b.month));

    // Group data by agent
    const agentMap = new Map();

    this.Data.forEach(item => {
      if (!agentMap.has(item.agent_name)) {
        agentMap.set(item.agent_name, {
          agent_name: item.agent_name,
          total_invoices: 0,
          total_sale: 0,
          total_profit: 0,
          monthlyData: new Map()
        });
      }

      const agent = agentMap.get(item.agent_name);
      agent.total_invoices += parseInt(item.total_invoices) || 0;
      agent.total_sale += parseFloat(item.net_amount) || 0;
      agent.total_profit += parseFloat(item.profit) || 0;

      agent.monthlyData.set(item.month, {
        net_amount: parseFloat(item.net_amount) || 0,
        profit: parseFloat(item.profit) || 0,
        total_invoices: parseInt(item.total_invoices) || 0
      });
    });

    this.processedData = Array.from(agentMap.values());

    // Calculate grand totals
    this.grandTotal = {
      total_invoices: this.processedData.reduce((sum, agent) => sum + agent.total_invoices, 0),
      total_sale: this.processedData.reduce((sum, agent) => sum + agent.total_sale, 0),
      total_profit: this.processedData.reduce((sum, agent) => sum + agent.total_profit, 0)
    };
  }

  getMonthData(agent: any, month: string) {
    return agent.monthlyData.get(month);
  }

  getGrandTotalForMonth(month: string, field: string) {
    return this.processedData.reduce((sum, agent) => {
      const monthData = agent.monthlyData.get(month);
      return sum + (monthData ? monthData[field] : 0);
    }, 0);
  }

  Clicked(e) {
    console.log(e);


  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Sale Comparison Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
}
