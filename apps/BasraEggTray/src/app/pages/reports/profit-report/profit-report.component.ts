

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FindTotal, GetDateJSON, JSON2Date, RoundTo2, formatNumber } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
@Component({
  selector: "app-profit-report",
  templateUrl: "./profit-report.component.html",
  styleUrls: ["./profit-report.component.scss"],
})
export class ProfitReportComponent implements OnInit {
  @ViewChild("RptTable") RptTable;
  public data:any= [];
  public Salesman:any=[];
  public Routes:any=[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: "Product Name",
        fldName: "ProductName",
      },
      {
        label: "Avg Price",
        fldName: "AvgPrice",
      },
      {
        label: "Qty Sold",
        fldName: "QtySold",
      },
      {
        label: "Amount",
        fldName: "Amount",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["Amount"]);
        },
      },

    ],
    Actions: [],
    Data: [],
  };
  expenses: any = [];
  purchases: any=[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

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
        this.data = r;
      });

    this.http
      .getData(
        "qrypurchasereport?flds=ProductName,  Sum(Amount)/Sum(Qty)  as AvgRate, Sum(Qty) as Qty, Sum(Amount) as Amount&groupby=ProductName&filter=Date Between '" +
          JSON2Date(this.Filter.FromDate) +
          "' and '" +
          JSON2Date(this.Filter.ToDate) + "'"
      )
      .then((r: any) => {
        this.purchases = r;
      });
    this.http
      .getData(
        "qryexpenses?flds=HeadName,Sum(Amount) as Amount&groupby=HeadName&filter=Date Between '" +
          JSON2Date(this.Filter.FromDate) +
          "' and '" +
          JSON2Date(this.Filter.ToDate) + "'"
      )
      .then((r: any) => {
        this.expenses = r;
      });
  }
  FindTotal(d, fld){
      return RoundTo2( FindTotal(d,fld));
  }
  RoundIt(v){
    return RoundTo2(v);
  }
}
