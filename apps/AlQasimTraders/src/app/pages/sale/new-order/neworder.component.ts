import { HttpBase } from "../../../services/httpbase.service";
import { ActivatedRoute, Params } from "@angular/router";
import {
  Component,
  ViewEncapsulation,
  OnInit,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { Router } from "@angular/router";
import { MyToastService } from "../../../services/toaster.server";
import { LocalDataSource } from "ng2-smart-table";
import {
  GetDateJSON,
  getCurrentTime,
  JSON2Date
} from "../../../factories/utilities";

import { FilteringEventArgs } from "@syncfusion/ej2-dropdowns";
import { Query } from "@syncfusion/ej2-data";



@Component({
  selector: "app-neworder",
  templateUrl: "./neworder.component.html",
  styleUrls: ["./neworder.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NeworderComponent implements OnInit, AfterViewInit {
  selectedProduct: any;
  @ViewChild("fromSale") fromSale;
  @ViewChild("cmbProd") cmbProd;
  @ViewChild("qty") elQty;
  @ViewChild("store") store;
  @ViewChild("type") type;

  public rsale = true;
  public rreturn = false;

  public data = new LocalDataSource([]);
  orderno = 0;
  ClosingID = 0;
  barcode: "";
  tqty: any = "";
  public btnsave = false;
  productdetails: any;
  Sale: any;

  public Prods = [];
  private editID: string;
  public customerinfo: any = [];
  public customerfields: Object = { text: "CustomerName", value: "CustomerID" };
  public Typeinfo: any = [];
  public Typefields: Object = { text: "AcctType", value: "AcctTypeID" };

  public settings = {
    selectMode: "single", // single|multi
    hideHeader: false,
    hideSubHeader: false,
    actions: {
      columnTitle: "Actions",
      add: false,
      edit: true,

      delete: true,
      custom: [],
      position: "right" // left|right
    },
    add: {
      addButtonContent:
        '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
      createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>'
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
      saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
      confirmDelete: true
    },
    noDataMessage: "No data found",
    columns: {
      ProductID: {
        title: "ProductID",
        editable: false,
        width: "60px",
        type: "html",
        valuePrepareFunction: value => {
          return '<div class="text-center">' + value + "</div>";
        }
      },

      Description: {
        editable: false,
        title: "Product Details"
      },
      Qty: { title: "Qty", editable: true },
      Packing: { title: "Packing", editable: false },
      KGs: { title: "KGs", editable: true },
      Pending: { editable: true, title: "Pending" },
      SPrice: { editable: false, title: "Rate" },
      Amount: { editable: false, title: "Amount" },
      Discount: { editable: false, title: "Discount" },
      NetAmount: { editable: false, title: "NetAmount" }
    },
    pager: { display: true, perPage: 50 }
  };
  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  getDate(dte: any) {
    return dte.year + "-" + dte.month + "-" + dte.day;
  }
  getTime(tim: any) {
    return tim.hour + ":" + tim.min + ":" + tim.sec;
  }

  ngOnInit() {
    this.Cancel();

    this.http.getData("accttypes").then(res => {
      this.Typeinfo = res;
    });
    this.ClosingID = JSON.parse(localStorage.getItem("currentUser")!).closingid;
    if (this.ClosingID == null) {
      this.ClosingID = 0;
    }
    this.getproducts();

    this.activatedRoute.params.subscribe((params: Params) => {
      this.editID = params["editID"];
      console.log(this.editID);
      if (this.editID) {
        this.data.empty();
        this.data.refresh();
        this.http
          .getData("qryorders?filter=OrderID=" + this.editID)
          .then((res1: any) => {
            console.log(res1);
            if (res1.length > 0) {
              if (res1[0].Status !== "1") {
                this.Sale.OrderID = res1[0].OrderID;
                this.Sale.Notes = res1[0].Notes;

                this.Sale.CustomerID = res1[0].CustomerID;
                this.Sale.Date = GetDateJSON(new Date(res1[0].Date));
                this.Sale.Time = res1[0].Time;
                this.Sale.Amount = res1[0].Amount;

                this.Sale.Discount = res1[0].Discount;
                this.Sale.Netamount = res1[0].Netamount;
                this.Sale.AmntRecvd = res1[0].AmntRecvd;

                this.http
                  .getData("qryorderdetails?filter=OrderID=" + this.editID)
                  .then((res: any) => {
                    console.log(res);
                    if (res.length > 0) {
                      for (let i = 0; i < res.length; i++) {
                        this.data.add({
                          DetailID: res[i].DetailID,
                          Description: res[i].ProductName,
                          PPrice: res[i].PPrice,
                          SPrice: res[i].SPrice,
                          Qty: res[i].Qty,
                          KGs: res[i].KGs,
                          Amount: res[i].Amount * 1,
                          Discount: res[i].Discount * 1,
                          NetAmount: res[i].NetAmount * 1,
                          ProductID: res[i].ProductID,
                          Packing: res[i].Packing,
                          Pending: res[i].Pending
                        });
                      }
                      this.data.refresh();
                      this.btnsave = true;
                    }
                  });
              } else {
                this.myToaster.Warning("", "Not Editable");
                this.editID = "";
              }
            }
          });
      }
    });
  }
  getproducts() {
    this.http.getData("qryproducts").then((res: any) => {
      this.Prods = res;
    });
  }

  ngAfterViewInit() {}
  GetBranchID() {
    let userid = JSON.parse(localStorage.getItem("currentUser")!).id;
    if (userid == null) {
      userid = 0;
    }
    this.Sale.userid = userid;
  }
  public AddOrder() {
    this.data.add({
      Description: this.cmbProd.text,
      PPrice: this.productdetails.PPrice,
      SPrice: this.productdetails.SPrice,
      Qty: this.productdetails.Qty,
      KGs: this.productdetails.KGs,
      Amount:
        this.productdetails.SPrice *
        (this.productdetails.Qty * this.productdetails.Packing +
          this.productdetails.KGs * 1),
      Discount:
        (this.productdetails.SPrice *
          (this.productdetails.Qty * this.productdetails.Packing +
            this.productdetails.KGs * 1) *
          this.productdetails.DiscRatio) /
        100,

      NetAmount:
        this.productdetails.SPrice *
          (this.productdetails.Qty * this.productdetails.Packing +
            this.productdetails.KGs * 1) -
        (this.productdetails.SPrice *
          (this.productdetails.Qty * this.productdetails.Packing +
            this.productdetails.KGs * 1) *
          this.productdetails.DiscRatio) /
          100,

      ProductID: this.productdetails.ProductID,
      Packing: this.productdetails.Packing
    });

    this.data.refresh();
    this.calculation();
    this.data.getAll().then(d => {
      if (d.length > 0) {
        this.btnsave = true;
      }
    });
    this.productdetails.PPrice = "";
    this.productdetails.SPrice = "";
    this.productdetails.Qty = 0;
    this.productdetails.ProductID = "";
    this.productdetails.Packing = "";
    this.productdetails.KGs = 0;

    this.cmbProd.focusIn();
  }
  ProductSelected($event) {
    // console.log($event);
    this.selectedProduct = $event.itemData;

    if (
      $event.itemData &&
      this.Prods.filter((c:any) => c.ProductID === $event.itemData.ProductID)
    ) {
      this.productdetails.SPrice = this.selectedProduct.SPrice;
      this.productdetails.PPrice = this.selectedProduct.PPrice;
      this.productdetails.Packing = this.selectedProduct.Packing;
      this.tqty = this.selectedProduct.Stock;
    }
  }

  public onFiltering = (e: FilteringEventArgs) => {
    if (e.text === "") {
      e.updateData(this.Prods);
      this.Prods = [...this.Prods];
    } else {
      let query = new Query();
      // frame the query based on search string with filter type.
      query =
        e.text !== ""
          ? query.where("ProductName", "contains", e.text, true)
          : query;
      // pass the filter data source, filter query to updateData method.
      e.updateData(this.Prods, query);
    }
  };
  public onCreate() {}

  public SaveData() {
    let id = "";
    this.Sale.Date = JSON2Date(this.Sale.Date);
    // this.Sale.Time = this.getTime(this.Sale.Time);
    this.Sale.ClosingID = this.ClosingID;

    this.data.getAll().then(res1 => {
      let i = 0;
      // this.PrintData(res1);
      for (i = 0; i < res1.length; i++) {
        delete res1[i].Description;
        delete res1[i].Amount;
        delete res1[i].NetAmount;
        delete res1[i].Discount;
      }
      if (this.Sale.OrderID !== "undefined" || this.Sale.OrderID !== "") {
        id = "/" + this.Sale.OrderID;
      }
      this.Sale.orderdetails = res1;
      this.http.postTask("order" + id, this.Sale).then(
        (res: any) => {
          if (this.editID) {
            //   this.router.navigateByUrl("pages/sale/totalsale");
          } else {
          }
          this.Cancel();
          this.myToaster.Sucess("Data Saved Successfully", "", 2);
          //  this.router.navigateByUrl("/printinvoice/" + res.id);
          this.type.focusIn();
        },
        err => {
          this.myToaster.Error("Some thing went wrong", "", 2);
          console.log(err);
          this.Sale.Date = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate()
          };
          this.Sale.Time = {
            hour: new Date().getHours(),
            min: new Date().getMinutes() + 1,
            sec: new Date().getSeconds()
          };
        }
      );
    });
  }

  checkLength() {
    this.data.getAll().then(d => {
      if (d.length > 0) {
        this.btnsave = true;
      } else {
        this.btnsave = false;
      }
    });
  }
  public onDeleteConfirm(event): void {
    if (window.confirm("Are you sure you want to delete?")) {
      event.confirm.resolve();
      setTimeout(() => {
        this.calculation();
        this.checkLength();
      }, 100);
    } else {
      event.confirm.reject();
    }
  }

  public onEdit(event) {
    event.newData.amount =
      (event.newData.Qty * event.newData.Packing + event.newData.Qty * 1) *
      event.newData.SPrice;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  public onRowSelect(event) {
    console.log(event);
  }

  public onUserRowSelect(event) {
    console.log(event); // this select return only one page rows
  }

  public onRowHover(event) {
    console.log(event);
  }

  changel() {
    this.calculation();
  }
  public calculation() {
    this.Sale.Amount = 0;
    this.Sale.Discount = 0;

    this.data.getAll().then(d => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.Sale.Amount += d[i].Amount;
        this.Sale.Discount += d[i].Discount;
      }
      this.Sale.NetAmount = this.Sale.Amount * 1 - this.Sale.Discount * 1;
    });
  }

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.tqty = "";
    this.Sale = {
      OrderID: "",
      details: [],
      Amount: 0,
      Discount: 0,
      NetAmount: 0,
      AmntRecvd: 0,
      CustomerID: "",
      Notes: "",
      UserID: "",
      Date: GetDateJSON(),
      Time: getCurrentTime()
    };
    this.productdetails = {
      SPrice: 0,
      ProductID: "",
      PPrice: 0,
      Packing: 1,
      KGs: 0,
      DiscRatio: 0,
      Qty: 0,
      StoreID: "",
      Pending: ""
    };
    this.GetBranchID();
    this.btnsave = false;
  }

  TypeSelect($event) {
    if ($event.itemData) {
      this.http
        .getData("customers?filter=AcctTypeID=" + $event.value)
        .then(res => {
          this.customerinfo = res;
        });
    }
  }

  public SaleClick() {
    this.rsale = true;
    this.rreturn = false;
  }
  public Return() {
    this.rsale = false;
    this.rreturn = true;
  }
}
