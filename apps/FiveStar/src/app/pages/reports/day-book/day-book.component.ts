import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { FindTotal, GetDateJSON, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { PrintDataService } from "../../../services/print.data.services";
import { PurchaseSetting } from "./purchase.settings";
import { SaleSetting } from "./sale.setting";
import { VoucherSetting } from "./vouchers.settings";

@Component({
  selector: "app-day-book",
  templateUrl: "./day-book.component.html",
  styleUrls: ["./day-book.component.scss"],
})
export class DayBookComponent implements OnInit {
  public data: object[];
  public pdata: object[];
  public vdata: object[];
  public Salesman: object[];
  public Customers: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Status: "",
    CustomerID: "",
  };
  salesettings: any = SaleSetting;
  purchasesetting: any = PurchaseSetting;
  vouchersetting: any = VoucherSetting;
  nWhat = "1";
  open_balance: number = 0;
  constructor(private http: HttpBase, private ps: PrintDataService, private router: Router) {}

  ngOnInit() {
    this.http.getSalesman().then((r: any) => {
      this.Salesman = r;
    });
    this.http.getCustList().then((r: any) => {
      this.Customers = r;
    });
    this.FilterData();
  }

  FilterData() {
    let table = "";
    let filter = "Date between '" + JSON2Date(this.Filter.FromDate) + "' and '" + JSON2Date(this.Filter.ToDate) + "' ";

    if (!(this.Filter.CustomerID === "" || this.Filter.CustomerID === null)) {
      filter += " and CustomerID=" + this.Filter.CustomerID;
    }
    if (!(this.Filter.Status === "" || this.Filter.Status === null)) {
      filter += " and IsPosted=" + this.Filter.Status;
    }

    let idx = -1;
    // tslint:disable-next-line:prefer-for-of
    // for (let index = 0; index < this.settings.Actions.length; index++) {
    //   if (this.settings.Actions[index].action === 'post') {
    //     idx = index;
    //   }
    // }

    // this.settings.Actions = this.settings.Actions.filter(x => {
    //   return !(JSON.parse(localStorage.getItem('currentUser')||"{}").rights !== '1' && x.action === 'post');
    // });

    this.http.getData("qrysalereport?filter=" + filter).then((r: any) => {
      this.data = r;
    });
    this.http.getData("qrypurchasereport?filter=" + filter).then((r: any) => {
      this.pdata = r;
    });

    this.http.getData("closing?filter=Date='" + JSON2Date(this.Filter.FromDate) + "'").then((r: any) => {
      if (r.length > 0) {
        this.open_balance = r[0]["OpeningAmount"];
      } else {
        this.open_balance = 0;
      }

      this.http.getData("qryvouchers?orderby=VoucherID" + "&filter=" + filter).then((r: any) => {
        this.vdata = r;

        this.vdata.unshift({
          Date: "",
          PhoneNo1: "",
          PrevBalance: "0",
          City: "",
          Balance: "0",
          CustomerName: "Opening Amount",
          Debit: "0",
          Credit: this.open_balance,
        });

        this.http.getData("qryexpenses?filter=" + filter + " ").then((r: any) => {
          for (const d of r) {
            this.vdata.push({
              Date: d.Date,
              CustomerName: d.HeadName + ", " + d.Description,
              PhoneNo1: "",
              PrevBalance: "0",
              City: "",
              Balance: "0",
              Debit: d.Amount,
              Credit: 0,
              VoucherID: d.ExpendID,
            });
          }
        });
      });
    });
  }
  Clicked(e) {
    let table: any = {};
    let url = "";
    console.log(this.nWhat);
    if (e.action === "delete") {
      console.log(e.action);
      if (e.data.IsPosted === "0") {
        if (this.nWhat === "3") {
          table = { ID: e.data.VoucherID, Table: "V" };
        } else if (this.nWhat === "2") {
          table = { ID: e.data.InvoiceID, Table: "P" };
        } else if (this.nWhat === "1") {
          table = { ID: e.data.InvoiceID, Table: "S" };
        }
        swal({
          text: "Delete this record!",
          icon: "warning",
          buttons: {
            cancel: true,
            confirm: true,
          },
        }).then((willDelete) => {
          if (willDelete) {
            this.http
              .postTask("delete", table)
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
    } else if (e.action === "print") {
      if (this.nWhat === "1") {
        this.router.navigateByUrl("/print/printinvoice/" + e.data.InvoiceID);
      } else if (this.nWhat === "2") {
        this.router.navigateByUrl("/print/printpurchase/" + e.data.InvoiceID);
      } else if (this.nWhat === "3") {
        this.router.navigateByUrl("/print/printvoucher/" + e.data.VoucherID);
      }
    } else if (e.action === "edit") {
      if (e.data.IsPosted === "0") {
        if (this.nWhat === "1") {
          this.router.navigateByUrl("/sale/sale/" + e.data.DetailID);
        } else if (this.nWhat === "2") {
          this.router.navigateByUrl("/purchase/purchase/" + e.data.DetailID);
        } else if (this.nWhat === "3") {
          console.log(e.data);
          if (e.data.Credit > 0) {
            this.router.navigateByUrl("/cash/cashreceipt/" + e.data.VoucherID);
          } else {
            this.router.navigateByUrl("/cash/cashpayment/" + e.data.VoucherID);
          }
        }
      } else {
        swal("Oops!", "Can not edit posted data", "error");
      }
    } else if (e.action === "post") {
      if (e.data.IsPosted === "0") {
        if (this.nWhat === "1") {
          url = "postsales/" + e.data.InvoiceID;
        } else if (this.nWhat === "2") {
          url = "postpurchases/" + e.data.InvoiceID;
        } else if (this.nWhat === "3") {
          url = "postvouchers/" + e.data.VoucherID;
        }

        this.http.postTask(url, {}).then((r) => {
          e.data.IsPosted = "1";
          swal("Post!", "Your data has been posted!", "success");
        });
      } else {
        swal("Oops!", "Can not edit posted data", "error");
      }
    } else if (e.action === "fullpay" && this.nWhat === "1") {
      if (e.data.IsPosted === "1") {
        swal("Oops!", "Can not pay posted invoice", "error");
        return;
      }
      swal({
        text: "Full pay this invoice ?",
        icon: "warning",
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willPay) => {
        if (willPay) {
          this.http
            .postTask("payinvoice", { InvoiceID: e.data.InvoiceID, Amount: e.data.Balance })
            .then((r) => {
              this.FilterData();
              swal("Paid!", "Your data has been paid!", "success");
            })
            .catch((er) => {
              swal("Oops!", "Error while paying invoice", "error");
            });
        }
      });
    } else if (e.action === "partialpay" && this.nWhat === "1") {
      if (e.data.IsPosted === "1") {
        swal("Oops!", "Can not pay posted invoice", "error");
        return;
      }
      swal({
        text: "Full pay this invoice ?",
        icon: "warning",
        content: { element: "input" },
      }).then((willPay) => {
        if (willPay) {
          console.log(willPay);

          this.http
            .postTask("payinvoice", { InvoiceID: e.data.InvoiceID, Amount: willPay })
            .then((r) => {
              this.FilterData();
              swal("Paid!", "Your data has been paid!", "success");
            })
            .catch((er) => {
              swal("Oops!", "Error while paying invoice", "error");
            });
        }
      });
    } else if (e.action === "return" && this.nWhat === "1") {
      swal({
        text: "Full return this invoice ?",
        icon: "warning",
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((res) => {
        if (e.data.DtCr === "DT") {
          swal({
            text: "Invalid Invoice type",
            icon: "error",
          });
          return;
        }
        this.http
          .postTask("makereturn", { InvoiceID: e.data.InvoiceID })
          .then((r: any) => {
            this.FilterData();
            swal("Return!", "Return Invoice have been created. Invoice # " + r.id, "success");
          })
          .catch((er) => {
            swal("Oops!", "Error while paying invoice", "error");
          });
      });
    }
  }
  ClickedSale(e) {
    this.nWhat = "1";
    this.Clicked(e);
  }
  ClickedPurchase(e) {
    this.nWhat = "2";
    this.Clicked(e);
  }
  ClickedVoucher(e) {
    this.nWhat = "3";
    this.Clicked(e);
  }
  TypeChange(e) {
    this.FilterData();
  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Sale Report";
    this.ps.PrintData.SubTitle = "From :" + JSON2Date(this.Filter.FromDate) + " To: " + JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl("/print/print-html");
  }
  CloseAccounts() {
    swal({
      text: "Account will be closed, Continue ??",
      icon: "warning",
      buttons: {
        cancel: true,
        confirm: true,
      },
    }).then((close) => {
      if (close) {
        this.http
          .postTask("CloseAccount", { ClosingID: this.http.getClosingID() })
          .then((r) => {
            swal("Close Account!", "Account was successfully closed, Login to next date", "success");
            this.router.navigateByUrl("/login");
          })
          .catch((er) => {
            swal("Oops!", "Error while deleting voucher", "error");
          });
      }
    });
  }
  FindBalance() {
    if (this.vdata.length == 0) return 0;
    return FindTotal(this.vdata, "Credit") - FindTotal(this.vdata, "Debit");
  }
}
