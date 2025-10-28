import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import swal from "sweetalert";
import { FindTotal, formatNumber, GetDateJSON, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { PrintDataService } from "../../../services/print.data.services";
import { MyToastService } from "../../../services/toaster.server";

@Component({
  selector: "app-cash-report",
  templateUrl: "./cash-report.component.html",
  styleUrls: ["./cash-report.component.scss"],
})
export class CashReportComponent implements OnInit {
  @ViewChild("RptTable") RptTable;
  public data: any = [];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: "",
    RouteID: "",
  };
  setting = {
    Checkbox: true,
    Columns: [
      { label: "Type", fldName: "Type" },
      { label: "Date", fldName: "Date" },
      { label: "Customer Name", fldName: "CustomerName" },
      { label: "Mobile Number", fldName: "PhoneNo1" },
      { label: "City", fldName: "City" },
      { label: "Description", fldName: "Description" },
      {
        label: "Debit",
        fldName: "Debit",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["Debit"]);
        },
      },
      {
        label: "Credit",
        fldName: "Credit",
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d["Credit"]);
        },
      },
    ],
    Actions: [
      { action: "edit", title: "Edit", icon: "pencil", class: "warning" },
      { action: "sms", title: "Send SMS", icon: "envelope", class: "primary" },
      { action: "delete", title: "Delete", icon: "trash", class: "danger" },
    ],
    Data: [],
  };
  public nDiff = 0;
  open_balance = 0;
  Business: any = {};
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.getData("business/" + this.http.getBusinessID() ).then((res: any) => {
      this.Business = res;
    });
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById("print-section");
    this.ps.PrintData.Title = "Cash Report";
    this.ps.PrintData.SubTitle = "From :" + JSON2Date(this.Filter.FromDate) + " To: " + JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl("/print/print-html");
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "Date between '" + JSON2Date(this.Filter.FromDate) + "' and '" + JSON2Date(this.Filter.ToDate) + "' ";
    this.http.getData("closing?filter=Date='" + JSON2Date(this.Filter.FromDate) + "'").then((r: any) => {
      if (r.length > 0) {
        this.open_balance = r[0]["OpeningAmount"];
      } else {
        this.open_balance = 0;
      }
      //this.http.getData("qryvouchers?flds=Date,'Voucher' as Type, CustomerName,PhoneNo1,Description,City,Debit,Credit,VocherID as ID&filter=" + filter).then((r: any) => {
      this.http
        .getData("qryvouchers?flds=Date,'Voucher' as Type, CustomerName,PhoneNo1,Description,City,Debit,Credit,IsPosted,VoucherID&filter=" + filter)
        .then((r: any) => {
          this.data = r;
          this.data.unshift({
            Date: "",
            Type: "Vouchers",
            CustomerName: "",
            PhoneNo1: "",
            PrevBalance: "0",
            City: "",
            Balance: "0",
            Description: "Opening Amount",
            Debit: "0",
            Credit: this.open_balance,
          });

          this.http.getData("qrysalereport?filter=" + filter + " and Received > 0 ").then((r: any) => {
            for (const d of r) {
              this.data.push({
                Date: d.Date,
                Type: "Sale",
                CustomerName: d.CustomerName,
                PhoneNo1: d.PhoneNo1,
                PrevBalance: d.PrevBalance,
                City: d.City,
                Balance: d.Balance,
                Description: "Cash Receipt B#" + d.DetailID,
                Debit: "0",
                Credit: d.Received,
              });
            }
          });


          this.http.getData("qrypurchasereport?filter=" + filter + " and Paid > 0 ").then((r: any) => {
            for (const d of r) {
              this.data.push({
                Date: d.Date,
                Type: "Purchase",
                CustomerName: d.CustomerName,
                PhoneNo1: d.PhoneNo1,
                PrevBalance: d.PrevBalance,
                City: d.City,
                Balance: d.Balance,
                Description: "Cash Paid B#" + d.DetailID,
                Debit: d.Paid,
                Credit: "0",
              });
            }
          });
          this.http.getData("qryexpenses?filter=" + filter + " ").then((r: any) => {
            for (const d of r) {
              this.data.push({
                Date: d.Date,
                Type: "Expense",
                CustomerName: d.HeadName,
                PhoneNo1: "",
                PrevBalance: "0",
                City: "",
                Balance: "0",
                Description: d.Description,
                Debit: d.Amount,
                Credit: 0,
                VoucherID: d.ExpendID,
              });
            }
          });
        });

      this.http.getData("getdiff?filter=" + filter).then((r: any) => {
        this.nDiff = r.diff;
      });
    });
  }
  Clicked(e) {
    if ((e.action == "edit" || e.action == "post" || e.action == "delete") && !(e.data.Type == "Voucher" || e.data.Type == "Expense")) {
      this.myToaster.Error("Not Allowed", e.data.Type);
      return;
    }

    if (e.action === "sms") {
    } else if (e.action === "edit") {
      if (e.data.IsPosted == "0") {
        if (e.data.Type == "Expense") {
          //  this.router.navigateByUrl("/cash/expense/" + e.data.VoucherID);
        } else {
          if (e.data.Credit * 1 > 0) {
            this.router.navigateByUrl("/cash/cashreceipt/" + e.data.VoucherID);
          } else {
            this.router.navigateByUrl("/cash/cashpayment/" + e.data.VoucherID);
          }
        }
      } else {
        swal("Oops!", "Can not edit posted data", "error");
      }
    } else if (e.action === "delete") {
      if (e.data.Type == "Expense") {
        //  this.router.navigateByUrl("/cash/expense/" + e.data.VoucherID);
        this.http.getData("expenses/" + e.data.VoucherID).then((r: any) => {
          if (r.IsPosted == 0) {
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
                  .Delete("expenses", e.data.VoucherID)
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
        });
        return;
      }

      if (e.data.IsPosted == "0") {
        swal({
          text: "Do you really want to delete this voucher",
          icon: "warning",
          buttons: {
            cancel: true,
            confirm: true,
          },
        }).then((close) => {
          if (close) {
            this.http
              .getData("delete/vouchers/" + e.data.VoucherID)
              .then((r) => {
                swal("Delete!", "Voucher deleted successfully", "success");
                this.FilterData();
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

  SendSMS() {
    if (this.RptTable.GetSelected().length > 0) {
      console.log(
        this.RptTable.GetSelected()
          .map((e) => e.mobile)
          .join(",")
      );
      let sms = {
        mobilenos: this.RptTable.GetSelected()
          .map((e) => e.mobile)
          .join(","),
        message: "",
      };
      this.http.postData("sendsms", sms).then((response) => {
        this.myToaster.Sucess("Message sent successfully", "Message");
        console.log(response);
      });
    } else {
      this.myToaster.Error("No Mobile nos have been selected", "Message");
    }
  }
  FindBalance() {


    if (this.data.length == 0) return 0;


    return FindTotal(this.data, "Credit") - FindTotal(this.data, "Debit");
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
          .postTask("CloseAccount", {
            ClosingID: this.http.getClosingID(),
            ClosingAmount: this.FindBalance(),
          })
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

  SendWhatsAppAll() {
    let bulksms: any = [];
    if (this.RptTable.GetSelected().length > 0) {
      let data: any = this.RptTable.GetSelected();
      for (let index = 0; index < data.length; index++) {
        if (data[index].PhoneNo1 && data[index].PhoneNo1.length > 10) {
          bulksms.push(this.GetSMS(data[index]));
        }
      }

      // bulksms = [
      //   { mobile: "923424256584", message: "Hello Ahmad Shahzad" },
      //   { mobile: "923217748892", message: "Hello Ali Ahmad" },
      //   { mobile: "923411788164", message: "Hello Mustafa Kamal" },
      // ];

      console.log(JSON.stringify(bulksms));

      this.http
        .postData("sendwabulk", {
          mobile: "03424256584",
          message: JSON.stringify(bulksms),
        })
        .then((response) => {
          this.myToaster.Sucess("Message sent successfully", "Message");
          console.log(response);
        });
    } else {
      this.myToaster.Error("No Mobile nos have been selected", "Message");
    }
  }

  GetSMS(data) {
    const Mobile = data.PhoneNo1.replace();
    let sms = "";
    sms = "*Cash Voucher*\nDate:" + data.Date;
    sms += "\nAccount Name: " + data.CustomerName;
    sms += "\nDescription: " + data.Description;
    data.Credit > 0 ? (sms += "\nAmount Received: " + data.Credit) : "";
    data.Debit > 0 ? (sms += "\nAmount Paid: " + data.Debit) : "";

    // sms += "\nCash Recvd: " + data.Received;
    // sms += "\nBalance: " + data.Balance;
    sms += "\n\n*" + this.Business.BusinessName + "*";
    sms += "\nFor any queryplease contact " + this.Business.Phone;
    return {
      mobile: "92".concat(Mobile.substr(1, 10)),
      message: sms,
    };
  }
}
