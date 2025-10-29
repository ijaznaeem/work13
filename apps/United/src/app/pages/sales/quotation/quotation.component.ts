import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { SaleDetails, SaleModel } from "../sale.model";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";
import { JSON2Date, GetDateJSON, RoundTo2 } from "../../../factories/utilities";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { formatNumber } from '../../../factories/utilities';
@Component({
  selector: "app-quotation",
  templateUrl: "./quotation.component.html",
  styleUrls: ["./quotation.component.scss"],
})
export class QuotationComponent implements OnInit {
  Type: string = "CR";
  EditID = "";

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
  public Routes: any = [];
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
      Strength: {
        title: "Size",
        editable: false,
      },

      SPrice: {
        title: "Price",
        editable: true,
        valueFormatter: (d) => {
          return formatNumber(d["SPrice"]);
        },
      },
      Qty: {
        title: "Qty",
        editable: true,
      },
      SaleTax: {
        title: "Sale Tax",
        editable: true,
      },
      NetAmount: {
        editable: false,
        title: "Net Amount",
        valueFormatter: (d) => {
          return formatNumber(d["NetAmount"]);
        },
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
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log(this.EditID);
    this.sale.Type = 1;

    this.http.getData("companies?orderby=CompanyName").then((res: any) => {
      res.unshift({ CompanyID: "0", CompanyName: "--All--" });
      this.Companies = res;
    });
    this.getCustomers("1");
    this.getproducts("0");
    this.http.getData("blist").then((r: any) => {
      this.Biller = r;
    });
    this.activatedRoute.params.subscribe((params: Params) => {
      this.EditID = params.EditID;
      console.log(this.EditID);
    });

    if (this.EditID && this.EditID !== "") {
      console.warn("Edit ID given");
      this.http.getData("quotations/" + this.EditID).then((r: any) => {
        console.log(r);
        if (r.IsPosted === "0") {
          this.sale = r;
          this.sale.Date = GetDateJSON(new Date(r.Date));
          console.log(this.sale);

          this.http
            .getData("qryquotationdetails?filter=InvoiceID=" + this.EditID)
            .then((rdet: any) => {
              for (const det of rdet) {
                this.AddToDetails({
                  ProductID: det.ProductID,
                  StockID: det.StockID,
                  ProductName: det.ProductName,
                  Strength: det.Strength,
                  BatchNo: det.BatchNo,
                  Qty: det.Qty,
               
                  GSTRatio: det.GSTRatio,
                  SaleTax: det.SaleTax,
                  SPrice: det.SPrice,
                  PPrice: det.PPrice,
                  Bonus: det.Bonus,
                  DiscRatio: det.DiscRatio,
                  SchemeRatio: det.SchemeRatio,
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
  getCustomers(routeid) {
    // if (routeid == "") return;
    this.http.getCustList(routeid).then((r) => {
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
    this.getCustomers($event.itemData.RouteID);
  }
  CompanySelected($event) {
    console.log($event.itemData);
    this.getproducts($event.itemData.CompanyID);
  }
  getproducts(companyid) {
    if (companyid != "") {
      this.http.getData("qryproducts").then((res: any) => {
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
    
      Bonus: ord.Bonus,
      GSTRatio: ord.GSTRatio,
      Strength: ord.Strength,
      Amount: RoundTo2(ord.SPrice * ord.Qty),
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      SaleTax: (ord.Qty * ord.SPrice * ord.GSTRatio) / 100,
      DiscRatio: ord.DiscRatio,
      SchemeRatio: ord.SchemeRatio,
      Discount: (ord.SPrice * ord.Qty * ord.DiscRatio) / 100,
      NetAmount: RoundTo2(
        ord.SPrice * ord.Qty + (ord.Qty * ord.SPrice * ord.GSTRatio) / 100
      ),
    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
    this.sdetails.ProductName = this.cmbProd.text;
    this.sdetails.BatchNo = this.selectedProduct.BatchNo;
    this.sdetails.Strength = this.selectedProduct.Strength;
    this.sdetails.ProductName = this.cmbProd.text;

    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focusIn();
    this.sdetails = new SaleDetails();
  }

  ProductSelected($event) {
    this.selectedProduct = $event.itemData;
    console.log($event.itemData);

    if ($event.itemData) {
      // this.http.getData('stockpharmcy/' + $event.itemData.StockID)
      this.tqty = this.selectedProduct.Stock;
      this.sdetails.PPrice = this.selectedProduct.PPrice;
      this.sdetails.SPrice = this.selectedProduct.SPrice;
      this.sdetails.ProductID = this.selectedProduct.ProductID;
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
      this.http.postTask("quotation" + InvoiceID, this.sale).then(
        (r: any) => {
          this.Cancel(this.sale.RouteID, this.sale.BillType);
          this.sale.DtCr = this.Type;
          if (p == 1) window.open("/#/print/printquotation/" + r.id);
          this.myToaster.Sucess("Data Insert successfully", "", 2);
          if (this.EditID) {
            this.router.navigateByUrl("/sale/sale");
          } else {
            this.getproducts(-1);
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
    event.newData.Discount =
      (event.newData.Qty * event.newData.SPrice * event.newData.DiscRatio) /
      100;
    event.newData.NetAmount =
      event.newData.Amount -
      event.newData.Discount -
      event.newData.Qty * event.newData.SchemeRatio;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  public onRowSelect(e) {
    // console.log(event);
  }

  public onUserRowSelect(e) {
    // console.log(event);   //this select return only one page rows
  }
  refresh() {
    // any other execution
    this.ngOnInit();
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
    this.sale.Discount = 0;
    this.sale.SaleTax = 0;

    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.sale.Amount += d[i].Amount * 1;
        this.sale.Discount += (d[i].Amount * d[i].DiscRatio) / 100;
        this.sale.SaleTax += d[i].SaleTax * 1;
      }
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
