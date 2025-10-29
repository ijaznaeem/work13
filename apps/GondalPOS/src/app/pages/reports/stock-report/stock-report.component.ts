import { Component, OnInit } from '@angular/core';
import { JSON2Date, GetDateJSON } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { Router } from '@angular/router';
import { formatNumber } from '../../../factories/utilities';
import { PrintDataService } from '../../../services/print.data.services';
@Component({
  selector: "app-stock-report",
  templateUrl: "./stock-report.component.html",
  styleUrls: ["./stock-report.component.scss"],
})
export class StockReportComponent implements OnInit {
  public data: object[];
  public Company: object[];
  public Filter = {
    CompanyId: "",
    ProductName: ""
  };
  setting = {
    Columns: [
      {
        label: "ProductName",
        fldName: "ProductName",
      },

      {
        label: "Company",
        fldName: "CompanyName",
      },

      {
        label: "Total Pcs",
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
    Actions: [],
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(private http: HttpBase,
    private ps: PrintDataService,
    private router: Router) {}

  ngOnInit() {
    this.http.getData("companies").then((r: any) => {
      this.Company = r;
    });
    this.FilterData();
  }
  load() {}
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "1=1 ";

    if (!(this.Filter.CompanyId === "" || this.Filter.CompanyId === null)) {
      filter += " and CompanyID=" + this.Filter.CompanyId;
    }
    if (!(this.Filter.ProductName === "" )) {
      filter += " and ProductName like '%" + this.Filter.ProductName + "%'";
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
