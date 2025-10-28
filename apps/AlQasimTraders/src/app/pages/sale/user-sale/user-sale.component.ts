import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";

@Component({
  selector: "app-user-sale",
  templateUrl: "./user-sale.component.html",
  styleUrls: ["./user-sale.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserSaleComponent implements OnInit {

  @ViewChild("DetailModal") DetailModal;
  public data: any = [];
  public detaildata: any = [];
  public CustomerID = "";
  public customerinfo: any = [];
  public customerfields: Object = { text: "CustomerName", value: "CustomerID" };
  public Typeinfo: any = [];
  public Typefields: Object = { text: "AcctType", value: "AcctTypeID" };
  public dteFilter = {
    dteFrom: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    },
    dteTo: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    },
  };

  settings1 = {
    Checkbox: true,
    Columns: [

      {
        label: 'ProductName',
        fldName: 'ProductName'
      },
      {
        label: 'Price',
        fldName: 'SPrice'
      },
      {
        label: 'Packing',
        fldName: 'Packing'
      },
      {
        label: 'Qty',
        fldName: 'Qty',
        sum: true
      },
      {
        label: 'KGs',
        fldName: 'KGs',
        sum: true
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true
      },


    ],
    Actions: [
    ],
    Data: []
  };


  public settings = {

    Columns: [
      { fldName: 'Date', label: 'Date' },
      { fldName: 'Time', label: 'Time' },
      { fldName: 'CustomerName', label: 'Account' },
      { fldName: 'NetAmount', label: 'NetAmount', sum: true },
      { fldName: 'AmntRecvd', label: 'AmntRecvd', sum: true },
      { fldName: 'Balance', label: 'Balance', sum: true },
    ],
    Actions: [
      { action: 'print', title: 'Print', icon: 'print', class: 'primary', },
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary', },
      { action: 'details', title: 'Details', icon: 'info', class: 'primary', },
    ]
  }



  date1 = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  public usersale = 0;
  public user: any = 0;
  public tsale = 0;
  constructor(
    private http: HttpBase,
    private router: Router,
    private myToaster: MyToastService
  ) { }

  ngOnInit() {

    this.http.getData("accttypes").then((res) => {
      this.Typeinfo = res;
    });
    this.user = JSON.parse(localStorage.getItem("currentUser")!).id;
    if (this.user == null) {
      this.user = 0;
    }
    this.LoadData();
  }

  public LoadData() {
    this.tsale = 0;
    this.data = [];
    let filter = "date between '" + this.getDate(this.dteFilter.dteFrom) + "' and '" + this.getDate(this.dteFilter.dteTo) + "'";
    filter += " and UserID = " + this.user;

    if (this.CustomerID != "") {
      filter += " and CustomerID = " + this.CustomerID;
    }
    this.http
      .getData(
        'qrysale?filter=' + filter)
      .then((res: any) => {
        this.data = res;
        /*    for (let i = 0;i<res.length;i++){
        this.tsale += res[i].netamount*1;
      }*/
      });
  }

  getDate(dte: any) {
    return dte.year + "-" + dte.month + "-" + dte.day;
  }

  ActionClicked(e) {
    if (e.action === "edit") {
      if (e.data.IsPosted !== "1") {
        this.router.navigateByUrl("pages/sale/newsale/" + e.data.InvoiceID);
      } else {
        this.myToaster.Warning("", "Not Editable");
      }

    } else if (e.action === "print") {

      this.router.navigateByUrl("/print/printinvoice/" + e.data.InvoiceID);

    } else if (e.action === "details") {
      this.detaildata = "";
      this.http.openModal(this.DetailModal);
      this.http
        .getData("qryinvoicedetail?filter=InvoiceID=" + e.data.InvoiceID)
        .then((res) => {
          this.detaildata = res;
        });
    }
  }




  TypeSelect($event) {
    if ($event.itemData) {
      this.http
        .getData("customers?filter=AcctTypeID=" + $event.value)
        .then((res) => {
          this.customerinfo = res;
        });
    }
  }
}
