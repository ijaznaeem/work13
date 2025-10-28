import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { SaleDetails, SaleModel } from "../sale.model";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";
import { JSON2Date, GetDateJSON, RoundTo2 } from "../../../factories/utilities";
import { Router } from "@angular/router";
import { EventEmitter } from "events";

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.scss"],
})
export class InvoiceComponent implements OnInit {
  @Input() Type: string;
  @Input() EditID = "";
  @Input() InvType = 1;

  selectedProduct: any = {};
  @ViewChild("fromPurchase") fromPurchase;
  @ViewChild("cmbProd") cmbProd;
  @ViewChild("qty") elQty;
  @ViewChild("cmbRoutes") elCity;

  public data = new LocalDataSource([]);


  sdetails = new SaleDetails();
  sale = new SaleModel();

  public Prods = [];
  public Customer: any = {};
  public Accounts: any = [];
  public AccountsFlds = { text: "CustomerName", value: "CustomerID" };


  public settings = {
    selectMode: "single", // single|multi
    hideHeader: false,
    hideSubHeader: true,
    actions: {
      columnTitle: "Actions",
      add: false,
      edit: true,
      delete: true,
      custom: [],
      position: "right", // left|right
    },
    add: {
      addButtonContent:
        '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
      createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
      saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
      confirmDelete: true,
    },
    noDataMessage: "No data found",
    columns: {
      ProductName: {
        editable: false,
        title: "Product",
        width: "250px",
      },


      SPrice: {
        title: "Price",
        editable: true,
      },
      Qty: {
        title: "Qty",
        editable: true,
        sum: true,
      },

      Amount: {
        title: "Amount",
        editable: false,
      },
      DiscRatio: {
        title: "%Age",
        editable: true,
      },
      Discount: {
        title: "Discount",
        editable: false,
      },

      NetAmount: {
        editable: false,
        title: "Net Amount",
      },

    },
    pager: {
      display: true,
      perPage: 50,
    },
  };

  btnsave: boolean = false;
  Stores: any = [];

  constructor(
    private http: HttpBase,
    private router: Router,
    private myToaster: MyToastService
  ) { }

  ngOnInit() {
    console.log(this.EditID);
    this.sale.Type = this.InvType;

    this.http.getData('stores').then((r) => {
      this.Stores = r;
    })
    this.getCustomers();

    this.http.getData("blist").then((r: any) => {

    });
    if (this.EditID && this.EditID !== "") {
      console.warn("Edit ID given");
      this.http.getData("invoices/" + this.EditID).then((r: any) => {
        console.log(r);
        if (r.IsPosted === "0") {
          this.sale = r;
          this.sale.Date = GetDateJSON(new Date(r.Date));
          console.log(this.sale);

          this.http
            .getData("qryinvoicedetails?filter=invoiceid=" + this.EditID)
            .then((rdet: any) => {
              for (const det of rdet) {
                this.AddToDetails({
                  ProductID: det.ProductID,
                  StockID: det.StockID,
                  StoreID: det.StoreID,
                  ProductName: det.ProductName,
                  Qty: det.Qty,
                  SPrice: det.SPrice,
                  PPrice: det.PPrice,
                  Bonus: det.Bonus,
                  DiscRatio: det.DiscRatio,

                });
              }
              this.calculation();
            });
        } else {
          this.myToaster.Warning("Invoice is already posted", "Edit", 1);
        }
      });
    }
  }
  getStock(StoreID) {
    console.log(StoreID);

    this.http.getData('qrystock?filter=StoreID=' + StoreID).then((res: any) => {
      this.Prods = res;
    });
  }
  getCustomers() {
    // if (routeid == "") return;
    this.http.getCustList().then((r) => {
      this.Accounts = r;
      this.Accounts = [...this.Accounts];
    });
  }
  CustomerSelected(event) {
    if (event.itemData.CustomerID) {
      this.Customer = this.Accounts.find((x) => {
        return x.CustomerID === event.itemData.CustomerID;
      });
      this.sale.PrevBalance = this.Customer.Balance;
    }
  }
  StoreSelect(e) {

    if (e.itemData) {
      this.getStock(e.itemData.StoreID)
    }
  }

  AddToDetails(ord: any) {
    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      Discount: ord.Qty * ord.SPrice * ord.DiscRatio / 100,
      DiscRatio: ord.DiscRatio,
      Amount: RoundTo2(ord.SPrice * ord.Qty),
      NetAmount: RoundTo2(ord.SPrice * ord.Qty - ord.Qty * ord.SPrice * ord.DiscRatio / 100),
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      StoreID: ord.StoreID,
      BusinessID: this.http.getBusinessID(),
    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
    this.sdetails.ProductName = this.cmbProd.text;

    console.log(this.sdetails);

    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focusIn();
    this.sdetails = new SaleDetails();
  }

  ProductSelected($event) {

    if ($event.itemData) {
      this.selectedProduct = $event.itemData;
      console.log($event.itemData);

      // this.http.getData('stockpharmcy/' + $event.itemData.StockID)

      this.sdetails.PPrice = this.selectedProduct.PPrice;
      this.sdetails.SPrice = this.selectedProduct.SPrice;
      this.sdetails.ProductID = this.selectedProduct.ProductID;
      this.sdetails.StockID = this.selectedProduct.StockID;

      console.log(this.sdetails);

    } else {
      this.selectedProduct = {};
    }
  }
  public SaveData(p) {
    let InvoiceID = "";
    if (this.EditID) {
      InvoiceID = "/" + this.EditID;
    }
    this.sale.BusinessID = this.http.getBusinessID();
    if (this.InvType ==2){
      this.sale.AmountRecvd = this.sale.Amount - this.sale.Discount;
    }
    this.sale.DtCr = this.Type;
    this.sale.Date = JSON2Date(this.sale.Date);
    this.sale.UserID = this.http.getUserID();

    console.log(this.sale);

    this.data.getAll().then((res1) => {
      let i = 0;
      for (i = 0; i < res1.length; i++) {
        delete res1[i].ProductName;
        delete res1[i].Amount;
      }
      this.sale.details = res1;
      this.http.postTask("sale" + InvoiceID, this.sale).then(
        (r: any) => {
          this.Cancel(

          );
          this.sale.DtCr = this.Type;
          if (p == 1) window.open("/#/print/printinvoice/" + r.id);
          this.myToaster.Sucess("Data Insert successfully", r.id);
          if (this.EditID) {
            this.router.navigateByUrl("/sale/sale");
          } else {
            this.elCity.focusIn();
          }
        },
        (err) => {
          this.myToaster.Error("Some thing went wrong", "", 2);
          console.log(err);
        }
      );
    });
  }

  checkLength() {
    this.data.getAll().then((d) => {
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
    event.newData.Amount = event.newData.Qty * event.newData.SPrice;
    event.newData.Discount = (event.newData.Qty * event.newData.SPrice * event.newData.DiscRatio) / 100;
    event.newData.NetAmount = event.newData.Amount - event.newData.Discount

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  CashInvoice(e) {
    this.sale.AmountRecvd = this.sale.NetAmount;
  }
  changel() {
    this.calculation();
  }
  public calculation() {
    this.sale.Amount = 0;
    this.sale.Discount = 0;

    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.sale.Amount += d[i].Amount * 1;
        this.sale.Discount += d[i].Discount * 1;
      }

    });
  }

  Cancel(smid = "", smrt = "", btype = "") {
    this.data.empty();
    this.data.refresh();

    this.sale = new SaleModel();
    this.sdetails = new SaleDetails();
    this.btnsave = false;
  }
}
