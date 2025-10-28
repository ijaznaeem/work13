import { Component, OnInit } from '@angular/core';
import { JSON2Date, GetDateJSON } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';
import { formatNumber } from '../../../factories/utilities';
@Component({
  selector: "app-stock-report",
  templateUrl: "./stock-report.component.html",
  styleUrls: ["./stock-report.component.scss"],
})
export class StockReportComponent implements OnInit {
  public data: object[];
  public Stores: object[];
  public Filter = {
    StoreID: "",
  };
  setting = {
    Columns: [
      {
        label: "Store",
        fldName: "StoreName",
      },
      {
        label: "ProductName",
        fldName: "ProductName",
      },

      {
        label: "Category",
        fldName: "CategoryName",
      },

      {
        label: "Stock",
        fldName: "Stock",
        sum: true,
      },
      {
        label: "SPrice",
        fldName: "SPrice",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["SPrice"]);

        },
      },
      {
        label: "PPrice",
        fldName: "PPrice",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["PPrice"]);

        },
      },
      {
        label: "Purchase Value",
        fldName: "PurchaseValue",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["PurchaseValue"]);

        },
      },
      {
        label: "Sale Value",
        fldName: "SaleValue",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["SaleValue"]);

        },
      },
    ],
    Actions: [
      {
        action: "edit",
        title: "Edit",
        icon: "pencil",
        class: "primary",
      },
    ],
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(private http: HttpBase, private router: Router) {}

  ngOnInit() {
    this.http.getData("stores").then((r: any) => {
      this.Stores = r;
    });
    this.FilterData();
  }
  load() {}
  FilterData() {

    let filter = "";
    if (!(this.Filter.StoreID === "" || this.Filter.StoreID === null)) {
      filter += " StoreID=" + this.Filter.StoreID;
    }
    this.http.getData("qrystock?filter=" + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === "print") {
      console.log(e.action);
      this.router.navigateByUrl("/print/printinvoice/" + e.data.InvoiceID);
    }
  }
}
