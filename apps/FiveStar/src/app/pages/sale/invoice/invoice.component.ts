import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { GetDateJSON, GetProps, JSON2Date, RoundTo2 } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";
import { InvoiceDetails } from "../sale.model";

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.scss"],
})
export class InvoiceComponent implements OnInit {
  @Input() Type: string;
  @Input() EditID = "";

  selectedProduct: any = {};
  @ViewChild("fromPurchase") fromPurchase;
  @ViewChild("cmbCustomer") cmbCustomer;
  @ViewChild("qty") elQty;

  public btnsave = false;
  ClosingID = 0;

  pdetails = new InvoiceDetails();
  public Prods = [];
  public Stores: any = [];

  public Accounts: any = [];
  curCustomer: any = {};

  constructor(private http: HttpBase, private router: Router, private myToaster: MyToastService) {}

  ngOnInit() {
    this.getproducts();
    this.http.getCustByType('').then((res) => {
      this.Accounts = res;
      this.Accounts = [...this.Accounts];

      if (this.EditID) {
        this.http.getData("qrysalereport?filter=DetailID=" + this.EditID).then((r: any) => {
          if (r[0].IsPosted === "0") {
            this.pdetails = GetProps(r[0], Object.getOwnPropertyNames(new InvoiceDetails()));
            this.pdetails.Date = GetDateJSON(new Date(r[0].Date));
            console.log(this.pdetails);
          } else {
            this.myToaster.Warning("Invoice is already posted", "Edit", 1);
          }
        });
      }
    });

    console.log(this.EditID);


  }
  CustomerClicked(e) {
    if (e.itemData) {
      this.curCustomer = e.itemData;
    } else this.curCustomer = {};
  }

  Round(num) {
    return RoundTo2(num);
  }

  getproducts() {
    this.http.getData("qryproducts?flds=ProductID,ProductName,CompanyName,SPrice,PPrice").then((res: any) => {
      this.Prods = res;
      this.Prods = [...this.Prods];
    });
  }

  ProductSelected(e) {
    console.log(e.target.value);
    if (e.target && e.target.value !== "") {
      this.selectedProduct = this.Prods.find((x: any) => x.ProductID == e.target.value);
      this.pdetails.SPrice = this.selectedProduct.SPrice;
      this.pdetails.PPrice = this.selectedProduct.PPrice;
    }
  }
  public SaveData() {
    let saleid = "";

    if (this.EditID != "") {
      saleid = "/" + this.EditID;
    }

    this.pdetails.DtCr = this.Type;
    console.log(this.pdetails);
    this.pdetails.Date = JSON2Date(this.pdetails.Date);
    this.pdetails.UserID = this.http.getUserID();

    this.http.postTask("sale" + saleid, this.pdetails).then(
      () => {
        this.Cancel(this.pdetails.ProductID);
        this.cmbCustomer.focusIn();
        this.myToaster.Sucess("Data Insert successfully", "", 2);
        if (this.EditID != "") {
          this.router.navigate(["sale/sale"]);
        }
      },
      (err) => {
        this.myToaster.Error(err.error.message, "Error", 2);
        console.log(err);
        this.pdetails.Date = GetDateJSON();
      }
    );
  }

  Cancel(productid) {
    this.pdetails = new InvoiceDetails();
    this.pdetails.Date = GetDateJSON();
    this.pdetails.ProductID = productid;
    this.btnsave = false;
  }
  isNumber(v){
    return isNaN(v) === false && v !== null && v !== undefined && v !== '';
  }
}
