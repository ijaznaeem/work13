import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { JSON2Date, formatNumber } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { PrintDataService } from "../../../services/print.data.services";
import { MyToastService } from "../../../services/toaster.server";

@Component({
  selector: "app-no-business",
  templateUrl: "./no-business.component.html",
  styleUrls: ["./no-business.component.scss"],
})
export class NoBusinessComponent implements OnInit {
  public data = [];
  public Salesman: any;
  public Routes: any;

  public Filter = {
    Days: 0
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
        label: "Last Transaction",
        fldName: "LastActivity",
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

    this.Filter.Days = 90
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
    this.ps.PrintData.Title = "No Business Report";
    this.ps.PrintData.SubTitle = "No Activity for:" + JSON2Date(this.Filter.Days);

    this.router.navigateByUrl("/print/print-html");
  }
  FilterData() {
    // tslint:disable-next-line:quotemark

    this.http.getData("nobusiness/" + this.Filter.Days).then((r: any) => {
      this.data = r;
    });
  }
}
