import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GetDateJSON, JSON2Date, formatNumber } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { PrintDataService } from "../../../services/print.data.services";
import { MyToastService } from "../../../services/toaster.server";

@Component({
  selector: "app-current-balance",
  templateUrl: "./current-balance.component.html",
  styleUrls: ["./current-balance.component.scss"],
})
export class CurrentBalanceComponent implements OnInit {
  public data = [];
  public Salesman: any;
  public Routes: any;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  setting = {
    Columns: [
      {
        label: "Type",
        fldName: "AcctType",
      },
      {
        label: "Customer Name",
        fldName: "CustomerName",
      },
      {
        label: "Address",
        fldName: "Address",
      },
      {
        label: "PhoneNo",
        fldName: "PhoneNo1",
      },
      {
        label: "Balance",
        fldName: "Balance",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["Balance"]);
        },
      },
    ],
    Actions: [],
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(private http: HttpBase, private ps: PrintDataService, private myToaster: MyToastService, private router: Router) {}

  ngOnInit() {

    this.Filter.FromDate.day = 1
    this.http.getSalesman().then((r: any) => {
      this.Salesman = r;
    });
    this.http.getRoutes().then((r: any) => {
      this.Routes = r;
    });
    this.FilterData();
  }
  PrintData() {
    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Current Balance Report";
    this.ps.PrintData.SubTitle = "For Date:" + JSON2Date(this.Filter.FromDate);

    this.router.navigateByUrl("/print/print-html");
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter:any = {... this.Filter}
    filter.FromDate = JSON2Date(filter.FromDate)
    filter.ToDate = JSON2Date(filter.ToDate)
    this.http.postData("currentbalance" , filter).then((r: any) => {
      this.data = r;
    });
  }
}
