import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentStatus } from '../../../factories/static.data';
import {
  GetDateJSON,
  JSON2Date
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { InvoiceReportSettings } from './invoice-report.settings';

@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrls: ['./invoice-report.component.scss'],
})
export class InvoiceReportComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public Agents: any = [];
  public Data: any = [];
  public Settings = InvoiceReportSettings;
  public Status = PaymentStatus;
  public filterList: string = '1=2';
  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    agent_id: '',
  };
  constructor(
    private http: HttpBase  ) {}

  ngOnInit() {
    this.http.getAgents().then((r: any) => {
      this.Agents = r;
    });

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

    filter += ' and isposted =1';

    if (this.Filter.agent_id != '' || this.Filter.agent_id != null) {
      filter += ' and agent_id =' + this.Filter.agent_id;
    }
    this.http.getData('qryinvoices?filter=' + filter).then(r=>{
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
}
