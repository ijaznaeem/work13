import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { formatNumber, GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { BsModalService } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: "app-tax-report",
  templateUrl: "./tax-report.component.html",
  styleUrls: ["./tax-report.component.scss"],
})
export class TaxReportComponent implements OnInit {
  public data: object[];
  public Salesman: object[];
  public Routes: object[];
  Customers: any = [];
  Customer: any ={};
 

  public Filter ={
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    CustomerID: "",
  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: "Date",
        fldName: "Date",
      },

      {
        label: "Invoice Number",
        fldName: "InvoiceID",
      },
      {
        label: "Customer Name",
        fldName: "CustomerName",
      },
      {
        label: "SaleTax Number",
        fldName: "STN",
      },
      {
        label: "Product Name",
        fldName: "ProductName",
      },
      {
        label: "Amount",
        fldName: "Amount",
        valueFormatter: (d) => {
          return formatNumber(d["Amount"]);
          
        },
        sum: true,
      },
      {
        label: "GST Ratio %",
        fldName: "GSTRatio",
      },

      {
        label: "Sale Tax",
        fldName: "SaleTax",

        sum: true,
      },

      {
        label: "Net Amount",
        fldName: "NetAmount",
        valueFormatter: (d) => {
          return formatNumber(d["NetAmount"]);
          
        },
        sum: true,
      },
    ],
    Actions: [],
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
   
    this.http.getData("customers").then((r: any) => {
      this.Customers = r;
    });
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Sale Report";
    this.ps.PrintData.SubTitle =
      "From :" +
      JSON2Date(this.Filter.FromDate) +
      " To: " +
      JSON2Date(this.Filter.ToDate) + ' - ' + (this.Customer.CustomerName || 'All') ;


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

    this.http.getData("qrysalereport?filter=" + filter).then((r: any) => {
      this.data = r;
    });
  }
  CustomerSelected(e) {
   if (e.itemData){
     this.http.getData('customers/' + e.itemData.CustomerID).then(r=>{
       this.Customer = r
     })
   } else 
   {
     this.Customer = {}
   }
  }
  Clicked(e) {
    console.log(e);
    if (e.action === "print") {
      console.log(e.action);
      this.router.navigateByUrl("/print/printinvoice/" + e.data.InvoiceID);
    } else if (e.action === "printdelivery") {
      console.log(e.action);
      this.router.navigateByUrl("/print/deliverychallan/" + e.data.InvoiceID);
    } else if (e.action === "edit") {
      if (e.data.IsPosted === "1") {
        this.myToaster.Error("Can't edit posted invoice", "Error", 1);
      } else {
        if (e.data.DtCr === "CR") {
          this.router.navigateByUrl("/sale/sale/" + e.data.InvoiceID);
        } else {
          this.router.navigateByUrl("/sale/salereturn/" + e.data.InvoiceID);
        }
      }
    } else if (e.action === "post") {
      if (e.data.IsPosted === "1") {
        this.myToaster.Error("Invoice Already Posted", "Post");
      } else {
        this.http.postTask("postsales/" + e.data.InvoiceID, {}).then((r) => {
          this.myToaster.Sucess("Invoice is posted", "Post");
          e.data.IsPosted = "1";
        });
      }
    } else if (e.action === "delete") {
      if (e.data.IsPosted === "0") {
        swal({
          text: "Delete this Invoice!",
          icon: "warning",
          buttons: {
            cancel: true,
            confirm: true,
          },
        }).then((willDelete) => {
          if (willDelete) {
            this.http
              .postTask("delete", { ID: e.data.InvoiceID, Table: "S" })
              .then((r) => {
                this.FilterData();
                swal("Deleted!", "Your data has been deleted!", "success");
              })
              .catch((er) => {
                swal("Oops!", "Error while deleting voucher", "error");
              });
          }
        });
      } else {
        swal("Oops!", "Can not delete posted data", "error");
      }
    }
  }
}
