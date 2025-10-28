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

  selectedProduct: any = {};
  @ViewChild("fromPurchase") fromPurchase;
  @ViewChild("cmbProd") cmbProd;
  @ViewChild("qty") elQty;
  @ViewChild("cmbRoutes") elCity;

  public data = new LocalDataSource([]);
  orderno = 0;
  barcode: "";
  public tqty = "";
  public btnsave = false;
  ClosingID = 0;

  sdetails = new SaleDetails();
  sale = new SaleModel();
  isCash = false;
  public Prods = [];

  public RouteFlds = { text: "RouteName", value: "RouteID" };
  public Companies: any = [];
  public Accounts: any = [];
  public AccountsFlds = { text: "CustomerName", value: "CustomerID" };

  myVar1 = false;
  myVar2 = false;

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
      Discount: {
        title: "Discount",
        editable: true,
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
  Salesman = [];
  Biller = [];
  marked = false;
  constructor(
    private http: HttpBase,
    private router: Router,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    console.log(this.EditID);
    this.sale.Type = 1;

    this.getCustomers();
    this.getproducts("0");
    this.http.getData("blist").then((r: any) => {
      this.Biller = r;
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
                  ProductName: det.ProductName,
                  Strength: det.Strength,
                  BatchNo: det.BatchNo,
                  Qty: det.Qty,
                  SPrice: det.SPrice,
                  PPrice: det.PPrice,
                  Bonus: det.Bonus,

                  Amount: det.Amount,
                  Discount: det.Discount,
                  NetAmount: det.NetAmount,
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
  getCustomers() {
    // if (routeid == "") return;
    this.http.getCustList("Customers").then((r) => {
      this.Accounts = r;
      this.Accounts = [...this.Accounts];
    });
  }
  CustomerSelected(event) {
    if (event.itemData.CustomerID) {
      this.sale.PrevBalance = this.Accounts.find((x) => {
        return x.CustomerID === event.itemData.CustomerID;
      }).Balance;
    }
  }
  RouteSelected($event) {
    // this.getCustomers($event.itemData.RouteID);
    this.getCustomers();
  }

  getproducts(companyid) {
    if (companyid != "") {
      this.http
        .getData(
          "qrystock?filter=" +
            (companyid == "0" ? "1=1" : "CompanyID=" + companyid)
        )
        .then((res: any) => {
          this.Prods = res;
        });
    }
  }
  AddToDetails(ord: any) {
    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      Amount: RoundTo2(ord.SPrice * ord.Qty),
      Discount: ord.Discount,
      NetAmount: RoundTo2(ord.SPrice * ord.Qty - ord.Discount),
      ProductID: ord.ProductID,
      StockID: ord.StockID,

      BusinessID: this.http.getBusinessID(),
    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
    this.sdetails.ProductName = this.cmbProd.text;
    this.sdetails.BatchNo = this.selectedProduct.BatchNo;
    this.sdetails.UOM = this.selectedProduct.UOM;
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
      this.tqty = this.selectedProduct.Stock;
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
    console.log(this.sale, this.Type);
    this.sale.DtCr = this.Type;
    this.sale.Date = JSON2Date(this.sale.Date);
    this.sale.UserID = this.http.getUserID();

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
            this.sale.SalesmanID,
            this.sale.RouteID,
            this.sale.BillType
          );
          this.sale.DtCr = this.Type;
          if (p == 1) window.open("/#/print/printinvoice/" + r.id);
          this.myToaster.Sucess("Data Insert successfully", r.id);
          if (this.EditID) {
            this.router.navigateByUrl("/sale/sale");
          } else {
            this.getproducts("0");
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
    event.newData.NetAmount = event.newData.Amount - event.newData.Discount;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }
  refresh() {
    // any other execution
    this.ngOnInit();
  }
  public onRowSelect(e) {
    // console.log(event);
  }

  public onUserRowSelect(e) {
    // console.log(event);   //this select return only one page rows
  }

  public onRowHover(e) {
    // console.log(event);
  }
  CashInvoice(e) {
    this.sale.AmountRecvd = this.sale.NetAmount;
  }
  changel() {
    this.calculation();
  }
  public calculation() {
    this.sale.Amount = 0;
    this.sale.SaleTax = 0;
    this.sale.Discount = 0;

    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.sale.Amount += d[i].Amount * 1;
        this.sale.Discount += d[i].Discount * 1;
      }

      console.log(this.sale);
    });
  }

  Cancel(smid = "", smrt = "", btype = "") {
    this.data.empty();
    this.data.refresh();
    this.tqty = "";
    this.sale = new SaleModel();
    this.sale.SalesmanID = smid;
    this.sale.RouteID = smrt;
    this.sale.BillType = btype;
    this.sdetails = new SaleDetails();
    this.btnsave = false;
  }
}
