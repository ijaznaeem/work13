import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GetDateJSON, GetProps, JSON2Date, RoundTo2 } from "../../../factories/utilities";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";
import { PInvoiceDetails } from "../purchase/pinvoicedetails.model";

@Component({
  selector: "app-purchase-invoice",
  templateUrl: "./purchase-invoice.component.html",
  styleUrls: ["./purchase-invoice.component.scss"],
})
export class PurchaseInvoiceComponent implements OnInit {
  @Input() Type: string;
  @Input() EditID = "";

  selectedProduct: any = {};
  @ViewChild("fromPurchase") fromPurchase;
  @ViewChild("cmbCustomer") cmbCustomer;
  @ViewChild("qty") elQty;

  public btnsave = false;
  ClosingID = 0;

  pdetails = new PInvoiceDetails();
  public Prods = [];
  public Stores: any = [];

  public Accounts: any = [];
  curCustomer: any = {};

  constructor(private http: HttpBase, private activatedRoute: ActivatedRoute,
    private router: Router,
    private myToaster: MyToastService) {}

  ngOnInit() {
    console.log(this.pdetails);

    this.pdetails.DtCr = this.Type;

    this.getproducts();
    this.http.getCustByType('').then((res) => {
      this.Accounts = res;
      this.Accounts = [...this.Accounts];
      this.activatedRoute.params.subscribe((params: Params) => {
        this.EditID = params.EditID;
        if (this.EditID) {
          this.http.getData("qrypurchasereport?filter=DetailID=" + this.EditID).then((r: any) => {
            if (r[0].IsPosted === "0") {
              this.pdetails = GetProps(r[0], Object.getOwnPropertyNames(new PInvoiceDetails()));
              this.pdetails.Date = GetDateJSON(new Date(r[0].Date));
              console.log(this.pdetails);
            } else {
              this.myToaster.Warning("Invoice is already posted", "Edit", 1);
            }
          });
        }
      });
    });


  }
  Round(num) {
    return RoundTo2(num);
  }
  getCustomers(acctType) {

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
    let purchaseid = "";

    if (this.EditID != "") {
      purchaseid = "/" + this.EditID;
    }

    console.log(this.pdetails);
    this.pdetails.DtCr = this.Type;
    this.pdetails.Date = JSON2Date(this.pdetails.Date);
    this.pdetails.UserID = this.http.getUserID();

    this.http.postTask("purchase" + purchaseid, this.pdetails).then(
      () => {
        this.Cancel(this.pdetails.ProductID);
        this.cmbCustomer.focusIn();
        this.myToaster.Sucess("Data Insert successfully", "", 2);
        if (this.EditID) {
          this.router.navigateByUrl("/purchase/purchase");
        }
      },
      (err) => {
        this.myToaster.Error(err.error.message, "Error", 2);
        this.pdetails.Date = GetDateJSON();
        console.log(err);
      }
    );
  }

  CustomerClicked(e) {
    if (e.itemData) {
      this.curCustomer = e.itemData;
    } else this.curCustomer = {};
  }
  Cancel(productid) {
    this.pdetails = new PInvoiceDetails();
    this.pdetails.Date = GetDateJSON();
    this.pdetails.ProductID = productid;
    this.btnsave = false;
  }
  isNumber(v){
    return isNaN(v) === false && v !== null && v !== undefined && v !== '';
  }
}
