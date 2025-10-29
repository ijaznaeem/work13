import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

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
        label: "Total Weight",
        fldName: "TotalWeight",
        sum: true,
      },
      {
        label: "Cutting",
        fldName: "Cutting",
        sum: true,
      },
      {
        label: "Net Weight",
        fldName: "NetWeight",
        sum: true,
      },
      {
        label: "Gold Paid",
        fldName: "GoldPaid",
        sum: true,
      },
      {
        label: "Gold Balance",
        fldName: "GoldBalance",
        sum: true,
      },
      {
        label: "Rate",
        fldName: "Rate",
        sum: true,
      },
      {
        label: "Amount",
        fldName: "Amount",
        sum: true,
      },
      {
        label: "Small Stone",
        fldName: "SmallStone",
        sum: true,
      },
      {
        label: "Big Stone",
        fldName: "BigStone",
        sum: true,
      },
      {
        label: "Total Wastage",
        fldName: "TotalWastage",
        sum: true,
      },
      {
        label: "Labour",
        fldName: "Labour",
        sum: true,
      },
      {
        label: "Net Amount",
        fldName: "NetAmount",
        sum: true,
      },
      {
        label: "Amount Paid",
        fldName: "AmountPaid",
        sum: true,
      },
      {
        label: "Balance Amount",
        fldName: "BalanceAmount",
        sum: true,
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
    SubTable: {
      table: 'details',
      Columns: [

        {
          label: "Product Name",
          fldName: "ProductName",
        },
        {
          label: "Store Name",
          fldName: "StoreName",
        },
        {
          label: "Qty",
          fldName: "Qty",
          sum: true,
        },
        {
          label: "Weight",
          fldName: "Weight",
          sum: true,
        },
        {
          label: "Cutting",
          fldName: "Cutting",
          sum: true,
        },
        {
          label: "Small Stone",
          fldName: "SmallStone",
          sum: true,
        },
        {
          label: "Big Stone",
          fldName: "BigStone",
          sum: true,
        },
        {
          label: "Purity",
          fldName: "Purity",
          sum: true,
        },
        {
          label: "Labour",
          fldName: "Labour",
          sum: true,
        },
        {
          label: "Wastage",
          fldName: "Wastage",
          sum: true,
        },
        {
          label: "Moti Charges",
          fldName: "MotiCharges",
          sum: true,
        },
        {
          label: "Lacer Charges",
          fldName: "LacerCharges",
          sum: true,
        }
      ],
    },
  };

  AcctTypes: any;

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.AcctTypes = this.cachedData.acctTypes$;
    this.FilterData();
  }
  getAccounts(type) {

    this.http.getAcctstList(type).then((res: any) => {
      this.Customers = res;
    });
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
      this.data = r.map((obj: any) => {
        return {
          ...obj,
          details: [],

        };
      });
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === "print") {
      console.log(e.action);
      this.router.navigateByUrl("/print/printpurchase/" + e.data.InvoiceID);
    }
  }
      RowClicked(event) {
        console.log(event);
        if (event.data.details.length == 0) {
          this.http
            .getData('qrypinvoicedetails?filter=InvoiceID=' + event.data.InvoiceID)
            .then((r) => {
              event.data['details'] = r;
            });
        }
      }
}
