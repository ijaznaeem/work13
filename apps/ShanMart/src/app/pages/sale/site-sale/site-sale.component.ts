import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpBase } from "../../../services/httpbase.service";

@Component({
  selector: "app-site-sale",
  templateUrl: "./site-sale.component.html",
  styleUrls: ["./site-sale.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SiteSaleComponent implements OnInit {
  public dteFilter = {
    dteFrom: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    },
    dteTo: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    },
    branchid: 1
  };

  public data: any;
  public settings = {
    selectMode: "single", // single|multi
    hideHeader: false,
    hideSubHeader: false,
    filter: false,
    actions: {
      columnTitle: "Actions",
      add: false,
      edit: false,
      delete: false,
      custom: [],
      position: "right" // left|right
    },

    noDataMessage: "No data found",
    columns: {
      Date: {
        title: "Date",
        filter: false
      },
      CustomerNo: {
        title: "Customer No",
        filter: true
      },
      Details: {
        title: "Details",
        filter: true
      },
      Qty: {
        title: "Qty",
        filter: false
      },

      Income: {
        title: "Income",
        filter: false
      },
      Expense: {
        title: "Expense",
        filter: false
      }
    },
    pager: {
      display: true,
      perPage: 50
    }
  };

  public sites: any;

  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.http.getData("sites").then((res: any) => {
      this.sites = res;
    });
  }

  public LoadData() {
    console.log(this.dteFilter.branchid);

    this.http
      .getData(
        "sitesale/" +
          this.getDate(this.dteFilter.dteFrom) +
          "/" +
          this.getDate(this.dteFilter.dteTo) +
          "/" +
          this.dteFilter.branchid
      )
      .then((res: any) => {
        res.push({
          Date: "",
          Details: "Grand Total",
          Income: this.findTotal("Income", res),
          Expense: this.findTotal("Expense", res)
        });
        this.data = res;
      });
  }

  getDate(dte: any) {
    return dte.year + "-" + dte.month + "-" + dte.day;
  }

  findTotal(fld, arydata: any) {
    let i = 0;
    let total = 0;

    for (i = 0; i < arydata.length; i++) {
      total += arydata[i][fld] * 1;
    }
    console.log(fld, total);
    return total;
  }
}
