

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FindTotal, GetDateJSON, groupby, JSON2Date, RoundTo2 } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { PrintDataService } from '../../../services/print.data.services';
import { formatNumber } from '../../../factories/utilities';
@Component({
  selector: "app-profit-report",
  templateUrl: "./profit-report.component.html",
  styleUrls: ["./profit-report.component.scss"],
})
export class ProfitReportComponent implements OnInit {
  @ViewChild("RptTable") RptTable;
  public data = [];
  public Salesman: object[];
  public Routes: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };

  expenses: any;
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) { }

  ngOnInit() {

    this.FilterData();
  }
  PrintReport() {

    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Profit Report";
    this.ps.PrintData.SubTitle =
      "From :" +
      JSON2Date(this.Filter.FromDate) +
      " To: " +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl("/print/print-html");
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    this.http
      .getData(
        "profitreport/" +
        JSON2Date(this.Filter.FromDate) +
        "/" +
        JSON2Date(this.Filter.ToDate)
      )
      .then((r: any) => {
        this.data = groupby(r, 'Type');

      });

  }
  FindTotal(d, fld) {
    return RoundTo2(FindTotal(d, fld));
  }
  format() {
    return formatNumber(null);
  }
}
