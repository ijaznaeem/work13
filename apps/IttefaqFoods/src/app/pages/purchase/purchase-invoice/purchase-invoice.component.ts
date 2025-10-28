import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";
import { JSON2Date, GetDateJSON } from "../../../factories/utilities";
import { PInvoiceDetails, PInvoice } from "../purchase/pinvoicedetails.model";

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
  @ViewChild("cmbProd") cmbProd;
  @ViewChild("qty") elQty;

  public data = new LocalDataSource([]);
  orderno = 0;
  barcode: "";
  tqty: any = "";
  public btnsave = false;
  ClosingID = 0;

  pdetails = new PInvoiceDetails();

  purchase = new PInvoice();

  public Prods = [];
  public Accounts: any = [];
  public AcctTypes: any = [];
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
      Qty: {
        title: "Qty",
        editable: true,
      },

      PPrice: {
        editable: true,
        title: "Rate",
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
  Stores: any = [];
  constructor(private http: HttpBase, private myToaster: MyToastService) {}

  ngOnInit() {
    console.log(this.pdetails);

    this.purchase.DtCr = this.Type;

    this.getproducts();
    this.getCustomers();
    this.http.getData('stores').then((r)=>{
      this.Stores = r;
    })


    if (this.EditID && this.EditID !== "") {
      console.warn("Edit ID given");
      this.http.getData("pinvoices/" + this.EditID).then((r: any) => {
        console.log(r);
        if (r.IsPosted === "0") {
          this.purchase = r;
          this.purchase.Date = GetDateJSON(new Date(r.Date));
          this.purchase.InvoiceDate = GetDateJSON(new Date(r.InvoiceDate));
          console.log(this.purchase);

          this.http
            .getData("qrypinvoicedetails?filter=invoiceid=" + this.EditID)
            .then((rdet: any) => {
              for (const det of rdet) {
                this.AddToDetails(det);
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
    this.http.getCustList().then((res) => {
      this.Accounts = res;
    });
  }

  getproducts() {
    this.http
      .getData(
        "qryproducts?flds=ProductID,ProductName,SPrice,PPrice,Packing"
      )
      .then((res: any) => {
        this.Prods = res;
        this.Prods = [...this.Prods];
      });
  }
  private AddToDetails(ord: any) {
    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      Pcs: ord.Pcs,
      Bonus: ord.Bonus,
      Amount: ord.PPrice * ord.Qty * 1,
      ProductID: ord.ProductID,
      StoreID: ord.StoreID,

      Discount: (ord.PPrice * ord.Qty * ord.DiscRatio) / 100,
      DiscRatio: ord.DiscRatio,
      BusinessID: this.http.getBusinessID(),

      NetAmount:
        ord.PPrice * ord.Qty - (ord.PPrice * ord.Qty * ord.DiscRatio) / 100,
    };
    this.data.prepend(obj);
  }
  public AddOrder() {
    console.log(this.cmbProd.text);

    this.pdetails.ProductName = this.cmbProd.text;
    this.AddToDetails(this.pdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focusIn();
    this.pdetails = new PInvoiceDetails();
  }
  ProductSelected($event) {
    console.log($event);

    if ($event.itemData && $event.itemData.ProductID !== "") {
      this.selectedProduct = $event.itemData;

      console.log(this.selectedProduct);

      this.http
        .getData("stock?filter=productid=" + $event.itemData.ProductID)
        .then((res1: any) => {
          if (res1.length > 0) {
            this.tqty = res1[0].Stock;
            this.pdetails.SPrice = res1[0].SPrice;
            this.pdetails.PPrice = res1[0].PPrice;
          } else {
            this.tqty = 0;
            this.pdetails.SPrice = this.selectedProduct.SPrice;
            this.pdetails.PPrice = this.selectedProduct.PPrice;
          }
          // document.getElementById('qty').focus();
        });
    }
  }
  public SaveData() {
    console.log(this.purchase);
    let InvoiceID = "";
    if (this.EditID) {
      InvoiceID = "/" + this.EditID;
    }
    this.purchase.Date = JSON2Date(this.purchase.Date);
    this.purchase.InvoiceDate = JSON2Date(this.purchase.InvoiceDate);

    this.data.getAll().then((res1) => {
      this.purchase.details = res1;

      this.http.postTask("purchase" + InvoiceID, this.purchase).then(
        () => {
          this.Cancel();
          this.myToaster.Sucess("Data Insert successfully", "", 2);
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
    event.newData.Amount = event.newData.Qty * event.newData.PPrice;
    event.newData.Discount =
      (event.newData.Qty * event.newData.PPrice * event.newData.DiscRatio) /
      100;
    event.newData.NetAmount = event.newData.Amount - event.newData.Discount;

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

  public onRowHover(e) {
    // console.log(event);
  }

  changel() {
    this.calculation();
  }
  public calculation() {
    this.purchase.Amount = 0;
    this.purchase.Discount = 0;

    this.data.getAll().then((d) => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.purchase.Amount += d[i].Amount * 1;
        this.purchase.Discount += d[i].Discount * 1;
      }

      this.purchase.NetAmount =
        this.purchase.Amount * 1 - this.purchase.Discount * 1;
    });
  }

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.tqty = "";
    this.purchase = new PInvoice();
    this.pdetails = new PInvoiceDetails();
    this.btnsave = false;
  }
}
