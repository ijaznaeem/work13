import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RoundTo } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { PaymentStatus } from '../../../factories/static.data';
import {
  GetDateJSON,
  JSON2Date
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { SaleReporAdminSettings } from './sale-report-admin.settings';

@Component({
  selector: 'app-sale-report-admin',
  templateUrl: './sale-report-admin.component.html',
  styleUrls: ['./sale-report-admin.component.scss'],
})
export class SaleReporAdminComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public Agents: any = [];
  public Data: any = [];
  public Settings = SaleReporAdminSettings;
  public Status = PaymentStatus;
  public filterList: string = '1=2';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    agent_id: '',
  };
  public isAgent=false;

  constructor(
    private ps: PrintDataService,
    private router: Router,
    private http: HttpBase  ) {}

  ngOnInit() {
    this.http.getAgents().then((r: any) => {
      this.Agents = r;
      this.Agents.unshift({
        full_name: '--All--', userid: ''
      })

      let u = this.Agents.find(x=>{
        return x.userid == this.http.getUserID()
      })
      console.log(u);

      if (u){
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
    if (this.Filter.agent_id != '' && this.Filter.agent_id != null) {
      filter += ' and agent_id =' + this.Filter.agent_id;
    }

    this.http.getData('qryinvoices?filter=' + filter).then((r:any)=>{
      r = r.map(x=>{
        return {
          ...x,
          profit: x.net_amount - x.cost,
          percentage: RoundTo((x.net_amount - x.cost)/x.cost * 100,2)
        }
      })
      this.Data = r;
    })

  }
  Clicked(e) {
console.log(e);

     if (e.action === 'print') {

      // this.http.openAsDialog(PrintInvoiceComponent, {invoice_id: e.data.invoice_id})
      window.open('/#/print/saleinvoice/' + e.data.invoice_id);
    }
  }
  PrintReport(){
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
