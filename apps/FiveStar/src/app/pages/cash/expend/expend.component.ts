import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GetDateJSON, JSON2Date } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";

class ExpenseModel {
  Date: any = GetDateJSON();
  HeadID = "";
  Description = "";
  Amount = 0;
  BusinessID = "";
  ClosingID = JSON.parse(localStorage.getItem("currentUser") || "{}").closingid;
}
@Component({
  selector: "app-expend",
  templateUrl: "./expend.component.html",
  styleUrls: ["./expend.component.scss"],
})
export class ExpendComponent implements OnInit {
  @ViewChild("cmbHeads") cmbHeads;
  public Voucher = new ExpenseModel();
  ExpenseHeads = [];
  expenAdd = 1
  curCustomer: any = {};
  constructor(private http: HttpBase,
     private alert: MyToastService,
     private router: Router,
     private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.http.getData("expensehead").then((r: any) => {
      this.ExpenseHeads = r;
    });
  }

  SaveData() {
    this.Voucher.Date = JSON2Date(this.Voucher.Date);
    this.Voucher.BusinessID = this.http.getBusinessID();
    this.Voucher.Amount = this.Voucher.Amount * this.expenAdd;
    console.log(this.Voucher);
    this.http.postData("expenses", this.Voucher).then((r) => {
      this.alert.Sucess("Expense Saved", "Save", 1);
      this.Voucher = new ExpenseModel();
      this.cmbHeads.focusIn();
    });
  }

  Round(amnt) {
    return Math.round(amnt);
  }
}
