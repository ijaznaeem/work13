import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MyToastService } from "../../../services/toaster.server";
import { HttpBase } from "./../../../services/httpbase.service";
import { Router } from "@angular/router";
import { PrintDataService } from "../../../services/print.data.services";
import { FindTotal } from "../../../factories/utilities";
@Component({
  selector: "app-balance-sheet",
  templateUrl: "./balance-sheet.component.html",
  styleUrls: ["./balance-sheet.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BalanceSheetComponent implements OnInit {
  CustomerID = "";



  public data: any = [];
  public customerinfo: any = [];
  constructor(
    private http: HttpBase  ) { }

  ngOnInit() {

    this.http.getData("balancesheet").then((r: any) => {
      this.data = r;
    })
  }


  public Print() {

  }
  FindTotal(fld) {
    return FindTotal(this.data, fld);
  }
}
