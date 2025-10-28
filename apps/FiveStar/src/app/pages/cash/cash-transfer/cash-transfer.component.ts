import { Component, OnInit, ViewChild } from "@angular/core";
import { GetProps, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { Router } from "@angular/router";
import { MyToastService } from "../../../services/toaster.server";
import { VoucherModel } from "../voucher.model";
import { AcctTypes } from "../../../factories/constants";

@Component({
  selector: "app-cash-transfer",
  templateUrl: "./cash-transfer.component.html",
  styleUrls: ["./cash-transfer.component.scss"],
})
export class CashTransferComponent implements OnInit {
  @ViewChild("cmbCustomer") cmbCustomer;
  public Voucher = new VoucherModel();
  public Voucher1 = new VoucherModel();
  Customers = [];
  Customers1 = [];
  bList: any = [];
  AcctTypes = AcctTypes;
  AcctTypeID = "";
  BusinessID = "";
  VouchersList: object[];
  curCustomer: any = {};
  curCustomer1: any = {};

  voucher: any;
  voucher1: any;
  constructor(private http: HttpBase, private alert: MyToastService, private router: Router) {}

  ngOnInit() {
    this.http.getData("blist").then((r) => {
      this.bList = r;
    });

    
  }

  LoadCustomer(event, v) {
    if (event.itemData.AcctTypeID !== "") {
      this.http
        .getCustByType(event.AcctTypeID)

        .then((r: any) => {
          if (v == 1) this.Customers = r;
          else this.Customers1 = r;
        });
    }
  }
  SaveData() {
    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    this.Voucher1.Date = JSON2Date(this.Voucher1.Date);
    
    this.Voucher.UserID = this.http.getUserID();
    this.Voucher1.UserID = this.http.getUserID();
    
    this.http.postTask("vouchers", this.Voucher).then((r: any) => {
      this.Voucher1.RefID = r.id;
      this.Voucher1.RefType = 4;
      
      this.Voucher1['BusinessID'] = this.BusinessID;
      this.Voucher1.Credit = this.Voucher.Debit;

      this.http.postTask("vouchers", this.Voucher1).then((r1) => {
        this.alert.Sucess("Voucher Saved", "Save", 1);
        this.Voucher = new VoucherModel();
        this.Voucher1 = new VoucherModel();

        this.cmbCustomer.focusIn();
      });
    });
  }
  GetCustomer(e, v) {
    console.log(e);
    if (e.itemData.CustomerID !== "") {
      this.http
        .getData("qrycustomers?filter=CustomerID=" + e.itemData.CustomerID, { bid: v == 1 ? this.http.getBusinessID() : this.BusinessID })
        .then((r: any) => {
          if (v == 1) this.curCustomer = r[0];
          else this.curCustomer1 = r[0];
        });
    }
  }
  Round(amnt) {
    return Math.round(amnt);
  }

  LoadByBusiness(event) {
    if (event.itemData.BusinessID !== "") {
      this.http
        .getData("customers?flds=CustomerName,Address, PhoneNo1, Balance,CustomerID&orderby=CustomerName", { bid: event.itemData.BusinessID })
        .then((r: any) => {
          this.Customers1 = r;
        });
    }
  }
}
