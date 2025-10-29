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
  GetDateJSON
} from "../../../factories/utilities";

import { FilteringEventArgs } from "@syncfusion/ej2-dropdowns";
import { Query } from "@syncfusion/ej2-data";

import { PrintDataService } from "../../../services/print.data.services";

declare var qz: any;
@Component({
  selector: "app-newsale",
  templateUrl: "./newsale.component.html",
  styleUrls: ["./newsale.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NewsaleComponent implements OnInit, AfterViewInit {
  selectedProduct: any;
  @ViewChild("fromSale")
  fromSale;
  @ViewChild("cmbProd")
  cmbProd;
  @ViewChild("qty")
  elQty;
  @ViewChild("store")
  store;
  @ViewChild("type")
  type;
  public nWhat = "1"

  public data = new LocalDataSource([]);
  orderno = 0;
  ClosingID = 0;
  barcode: "";
  tqty: any = "";
  public btnsave = false;
  productdetails: any;
  Sale: any;

  public Prods:any = [];
  private editID: string;
  private orderID: string;

  public customerinfo: any = [];
  public customerfields: Object = { text: "CustomerName", value: "CustomerID" };
  public Typeinfo: any = [];
  public Typefields: Object = { text: "AcctType", value: "AcctTypeID" };
  public Stores: any = [];
  public Storefields: Object = { text: "StoreName", value: "StoreID" };
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
      Storename: {
        editable: false,
        title: "Store"
      },
      description: {
        editable: false,
        title: "Product Details"
      },
      qty: {
        title: "Qty",
        editable: true
      },
      Packing: {
        title: "Packing",
        editable: false
      },
      KGs: {
        title: "KGs",
        editable: true
      },
      Pending: {
        editable: true,
        title: "Pending"
      },
      SPrice: {
        editable: false,
        title: "Rate"
      },
      amount: {
        editable: false,
        title: "Amount"
      }
    },
    pager: {
      display: true,
      perPage: 50
    }
  };
  constructor(
    private http: HttpBase,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private prtSrvc: PrintDataService,
    private router: Router
  ) { }
  getDate(dte: any) {
    return dte.year + "-" + dte.month + "-" + dte.day;
  }
  getTime(tim: any) {
    return tim.hour + ":" + tim.min + ":" + tim.sec;
  }

  ngOnInit() {
    this.RefreshData();

    this.http.getData("accttypes").then(res => {
      this.Typeinfo = res;
    });
    this.ClosingID = JSON.parse(localStorage.getItem("currentUser")!).closingid;
    if (this.ClosingID == null) {
      this.ClosingID = 0;
    }
    this.http.getData("stores").then(res => {
      this.Stores = res;
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.orderID = params["orderID"];
      this.editID = params["editID"];

      console.log(this.editID);
      if (!(this.orderID === "" || this.orderID === undefined)) {
        this.http.getData("orders/" + this.orderID).then((r: any) => {
          this.Sale = r;
          this.http
            .getData("qryinvoicedetail?filter=InvoiceID=" + this.editID)
            .then((res: any) => {
              console.log(res);
              if (res.length > 0) {
                for (let i = 0; i < res.length; i++) {
                  this.data.add({
                    DetailID: res[i].DetailID,
                    description: res[i].ProductName,
                    PPrice: res[i].PPrice,
                    SPrice: res[i].SPrice,
                    qty: res[i].Qty,
                    KGs: res[i].KGs,
                    amount: res[i].Amount * 1,
                    ProductID: res[i].ProductID,
                    StoreID: res[i].StoreID,
                    Storename: res[i].StoreName,
                    Packing: res[i].Packing,
                    Pending: res[i].Pending
                  });
                }
              }
              this.data.refresh();
              this.btnsave = true;
            });
        });
      } else if (!(this.editID === "" || this.editID === undefined)) {
        this.data.empty();
        this.data.refresh();
        this.http
          .getData("qrysale?filter=InvoiceID=" + this.editID)
          .then((res1: any) => {
            console.log(res1);
            if (res1.length > 0) {
              if (res1[0].IsPosted !== "1") {
                this.Sale.InvoiceID = res1[0].InvoiceID;
                this.Sale.Notes = res1[0].Notes;
                this.customerinfo = res1;
                this.Sale.CustomerID = res1[0].CustomerID;
                this.Sale.date = GetDateJSON(new Date(res1[0].Date));
                this.Sale.totalamount = res1[0].Amount;
                this.Sale.PackingCharges = res1[0].PackingCharges;
                this.Sale.DeliveryCharges = res1[0].DeliveryCharges;
                this.Sale.discount = res1[0].Discount;
                this.Sale.netamount = res1[0].NetAmount;
                this.Sale.paidby = res1[0].AmntRecvd;
                this.Sale.Labour = res1[0].Labour;

                this.http
                  .getData("qryinvoicedetail?filter=InvoiceID=" + this.editID)
                  .then((res: any) => {
                    console.log(res);
                    if (res.length > 0) {
                      for (let i = 0; i < res.length; i++) {
                        this.data.add({
                          DetailID: res[i].DetailID,
                          description: res[i].ProductName,
                          PPrice: res[i].PPrice,
                          SPrice: res[i].SPrice,
                          qty: res[i].Qty,
                          KGs: res[i].KGs,
                          amount: res[i].Amount * 1,
                          ProductID: res[i].ProductID,
                          StoreID: res[i].StoreID,
                          Storename: res[i].StoreName,
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
  getproducts($event) {
    if ($event.itemData) {
      this.http
        .getData("qrystock?filter=StoreID=" + $event.value)
        .then((res: any) => {
          this.Prods = res;
        });
    }
  }

  ngAfterViewInit() { }
  GetBranchID() {
    let UserID = JSON.parse(localStorage.getItem("currentUser")!).id;
    if (UserID == null) {
      UserID = 0;
    }
    this.Sale.UserID = UserID;
  }
  public AddOrder() {
    if (this.nWhat == "2") {
      this.data.add({
        description: this.cmbProd.text,
        PPrice: this.productdetails.PPrice,
        SPrice: this.productdetails.SPrice,
        qty: this.productdetails.qty * -1,
        Pending: this.productdetails.Pending,
        KGs: this.productdetails.KGs,
        amount:
          this.productdetails.SPrice *
          (this.productdetails.qty * this.productdetails.Packing +
            this.productdetails.KGs * -1),
        ProductID: this.productdetails.ProductID,
        StoreID: this.productdetails.StoreID,
        Storename: this.Stores.filter(
          c => c.StoreID === this.productdetails.StoreID
        )[0].StoreName,
        Packing: this.productdetails.Packing
      });
    } else
     {
      this.data.add({
        description: this.cmbProd.text,
        PPrice: this.productdetails.PPrice,
        SPrice: this.productdetails.SPrice,
        qty: this.productdetails.qty,
        Pending: this.productdetails.Pending,
        KGs: this.productdetails.KGs,
        amount:
          this.productdetails.SPrice *
          (this.productdetails.qty * this.productdetails.Packing +
            this.productdetails.KGs * 1),
        ProductID: this.productdetails.ProductID,
        StoreID: this.productdetails.StoreID,
        Storename: this.Stores.filter(
          c => c.StoreID === this.productdetails.StoreID
        )[0].StoreName,
        Packing: this.productdetails.Packing
      });
    }

    this.data.refresh();
    this.calculation();
    this.data.getAll().then(d => {
      if (d.length > 0) {
        this.btnsave = true;
      }
    });
    this.productdetails.PPrice = "";
    this.productdetails.SPrice = "";
    this.productdetails.qty = "";
    this.productdetails.ProductID = "";
    this.productdetails.Packing = "";
    this.productdetails.KGs = 0;
    this.productdetails.Pending = "";

    this.store.focusIn();
  }
  ProductSelected($event) {
    // console.log($event);
    this.selectedProduct = $event.itemData;

    if (
      $event.itemData &&
      this.Prods.filter(c => c.ProductID === $event.itemData.ProductID)
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
  public onCreate(event) { }

  public SaveData() {
    let id = "";
    this.Sale.date = this.getDate(this.Sale.date);
    this.Sale.time = this.getTime(this.Sale.time);
    this.Sale.ClosingID = this.ClosingID;
    this.Sale.UserID = JSON.parse(localStorage.getItem("currentUser")!).id;

    this.prtSrvc.InvoiceData = Object.assign({}, this.Sale);
    this.prtSrvc.InvoiceData.CustomerName = this.customerinfo.filter(x => {
      return x.CustomerID === this.Sale.CustomerID;
    })[0].CustomerName;
    this.prtSrvc.InvoiceData.Address = this.customerinfo.filter(x => {
      return x.CustomerID === this.Sale.CustomerID;
    })[0].Address;

    this.prtSrvc.InvoiceData.City = this.customerinfo.filter(x => {
      return x.CustomerID === this.Sale.CustomerID;
    })[0].City;

    this.prtSrvc.InvoiceData.Amount = this.Sale.totalamount;
    this.prtSrvc.InvoiceData.Discount = this.Sale.discount;
    this.prtSrvc.InvoiceData.NetAmount = this.Sale.netamount;
    this.prtSrvc.InvoiceData.Date = this.Sale.date;

    this.prtSrvc.InvoiceData.Details = [];
    this.data.getAll().then(res1 => {
      let i = 0;
      // this.PrintData(res1);
      for (i = 0; i < res1.length; i++) {
        this.prtSrvc.InvoiceData.Details.push({
          ProductName: res1[i].description,
          Qty: res1[i].qty,
          SPrice: res1[i].SPrice,
          Pending: res1[i].Pending,
          Amount: res1[i].Amount
        });
        delete res1[i].description;
        delete res1[i].amount;
        delete res1[i].Storename;
      }
      if (this.Sale.InvoiceID !== "undefined" || this.Sale.InvoiceID !== "") {
        id = "/" + this.Sale.InvoiceID;
      }
      this.Sale.details = res1;
      this.http.postTask("sale" + id, this.Sale).then(
        (res: any) => {
          if (this.editID) {
            this.router.navigateByUrl("/sale/totalsale");
          } else {
          }
          this.Cancel();
          // this.myToaster.Sucess("Data Insert successfully", "", 2);
          this.router.navigateByUrl("/print/printinvoice/" + res.id);
          this.type.focusIn();
        },
        err => {
          this.myToaster.Error("Some thing went wrong", "", 2);
          console.log(err);
          this.Sale.date = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate()
          };
          this.Sale.time = {
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
      (event.newData.qty * event.newData.Packing + event.newData.qty * 1) *
      event.newData.SPrice;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  public onRowSelect(event) {
    // console.log(event);
  }

  public onUserRowSelect(event) {
    // console.log(event);   //this select return only one page rows
  }

  public onRowHover(event) {
    // console.log(event);
  }

  changel() {
    this.calculation();
  }
  public calculation() {
    this.Sale.totalamount = 0;

    this.Sale.netamount = 0;

    this.data.getAll().then(d => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.Sale.totalamount += d[i].amount;
      }
      this.Sale.netamount =
        this.Sale.totalamount * 1 +
        this.Sale.PackingCharges * 1 +
        this.Sale.DeliveryCharges * 1 +
        this.Sale.Labour * 1 -
        this.Sale.discount * 1;
    });
  }

  Cancel() {
    if (this.editID) {
      this.router.navigateByUrl("pages/sale/totalsale");
    }
    this.RefreshData();
  }
  public RefreshData() {
    this.data.empty();
    this.data.refresh();
    this.tqty = "";
    this.Sale = {
      InvoiceID: "",
      details: [],
      totalamount: 0,
      PackingCharges: 0,
      DeliveryCharges: 0,
      discount: 0,
      netamount: 0,
      paidby: "",
      type: 1,
      Labour: 0,
      Notes: "",
      UserID: "",
      CustomerID: "",
      PrevBalance: 0,
      date: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      },
      time: {
        hour: new Date().getHours(),
        min: new Date().getMinutes() + 1,
        sec: new Date().getSeconds()
      }
    };
    this.productdetails = {
      SPrice: 0,
      ProductID: "",
      PPrice: 0,
      Packing: 1,
      KGs: 0,
      Qty: "",
      StoreID: "",
      Pending: 0
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
  CustomerSelected($event) {
    let cust:any = [];
    if ($event.itemData) {
      cust = this.customerinfo.filter(x => {
        return x.CustomerID == $event.value;
      });

      if (cust.length > 0) {
        this.Sale.PrevBalance = cust[0].Balance;
      }
    }
  }

}
