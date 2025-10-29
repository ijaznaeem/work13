import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridComponent, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import swal from 'sweetalert';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: "app-quotation-report",
  templateUrl: "./quotation-report.component.html",
  styleUrls: ["./quotation-report.component.scss"],
})
export class QuotationReportComponent implements OnInit {
  @ViewChild("RptTable") RptTable;
  public data: object[];
  public Salesman: object[];
  public Routes: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: "",
    RouteID: "",
  };
  setting = {
    Checkbox: true,
    Columns: [
      {
        label: "Date",
        fldName: "Date",
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
        label: "City",
        fldName: "City",
      },

      {
        label: "Net Amount",
        fldName: "NetAmount",
        sum: true,
      },
    
      {
        label: "User Name",
        fldName: "UserName",
      },
      {
        label: "Type",
        fldName: "DtCr",
      },
    ],
    Actions: [
      {
        action: "invoice",
        title: "Create Invoice",
        icon: "tik",
        class: "success",
      },
      {
        action: "print",
        title: "Print",
        icon: "print",
        class: "primary",
      },
      {
        action: "delete",
        title: "Delete",
        icon: "trash",
        class: "danger",
      },
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
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getSalesman().then((r: any) => {
      this.Salesman = r;
    });
    this.http.getRoutes().then((r: any) => {
      this.Routes = r;
    });
    this.FilterData();
  }
  PrintReport() {
    

    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Quotation Report";
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

    this.http.getData("qryquotations?filter=" + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === "print") {
      console.log(e.action);
      this.router.navigateByUrl("/print/printquotation/" + e.data.InvoiceID);
    } else if (e.action === "edit") {
      if (e.data.IsPosted === "1") {
        this.myToaster.Error("Can't edit posted quotation", "Error", 1);
      } else {
          this.router.navigateByUrl("/sale/quotation/" + e.data.InvoiceID);
      }
    } else if (e.action === "invoice") {
      this.http
        .postTask("createinvoice/" + e.data.InvoiceID, {})
        .then((r: any) => {
          this.myToaster.Sucess("Invoice created successfully", "Invoice");
          this.router.navigateByUrl("/sale/sale/" + r.id);
        })
        .catch((err) => {
          this.myToaster.Error("Invoice already created", "Invoice");
        });
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
              .postTask("delete", { ID: e.data.InvoiceID, Table: "Q" })
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
