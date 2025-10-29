import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { formatNumber } from '../../../factories/utilities';

@Component({
  selector: "app-purchase-report",
  templateUrl: "./purchase-report.component.html",
  styleUrls: ["./purchase-report.component.scss"],
})
export class PurchaseReportComponent implements OnInit {
  public data: object[];
  public Salesman: object[];
  public Customers: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    CustomerID: "",
  };
  setting = {
    Columns: [
      {
        label: "  Invoice No",
        fldName: "InvoiceID",
      },
      {
        label: "Date",
        fldName: "Date",
      },
      {
        label: "Account Name",
        fldName: "CustomerName",
      },
      {
        label: "Address",
        fldName: "Address",
      },
      {
        label: "City",
        fldName: "City",
      },

      {
        label: "Net Amount",
        fldName: "NetAmount",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["NetAmount"]);
        },
      },
      {
        label: "Amount Paid",
        fldName: "AmountPaid",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["AmountPaid"]);
        },
      },
      {
        label: "Balance",
        fldName: "Balance",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["Balance"]);
        },
      },
      {
        label: "Type",
        fldName: "DtCr",
      },
    ],
    Actions: [
      {
        action: "print",
        title: "Print",
        icon: "print",
        class: "primary",
      },
    ],
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getCustList().then((r: any) => {
      this.Customers = r;
    });
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Purchase Report";
    this.ps.PrintData.SubTitle =
      "From :" +
      JSON2Date(this.Filter.FromDate) +
      " To: " +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl("/print/print-html");
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    if (!(this.Filter.CustomerID === "" || this.Filter.CustomerID === null)) {
      filter += " and CustomerID=" + this.Filter.CustomerID;
    }

    this.http.getData("qrypinvoices?filter=" + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === "print") {
      console.log(e.action);
      this.router.navigateByUrl("/print/printpurchase/" + e.data.InvoiceID);
    }
  }
}
