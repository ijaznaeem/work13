import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";
import { JSON2Date, GetDateJSON, RoundTo2 } from "../../../factories/utilities";
import { Router } from "@angular/router";
import { ProcessDetailsModel, ProcessModel } from "../sale.model";

@Component({
  selector: "app-processing",
  templateUrl: "./processing.component.html",
  styleUrls: ["./processing.component.scss"],
})
export class ProcessComponent implements OnInit {
  @Input() Type: string;
  @Input() EditID = "";

  selectedProduct: any = {};
  @ViewChild("fromPurchase") fromPurchase;
  @ViewChild("cmbProd") cmbProd;

  public data = new LocalDataSource([]);


  sdetails = new ProcessDetailsModel();
  process = new ProcessModel();

  public Prods = [];
  public Stock = [];

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
      },
      Qty: {
        title: "Qty",
        editable: true,
        sum: true,
      },

    },
    pager: {
      display: true,
      perPage: 50,
    },
  };

  btnsave: boolean = false;
  Stores: any = [];
  SelectStock: any={};

  constructor(
    private http: HttpBase,
    private router: Router,
    private myToaster: MyToastService
  ) { }

  ngOnInit() {
    console.log(this.EditID);
    this.http.getData('stores').then((r) => {
      this.Stores = r;
    })

    this.getproducts();

    if (this.EditID && this.EditID !== "") {
      console.warn("Edit ID given");
      this.http.getData("processing/" + this.EditID).then((r: any) => {
        console.log(r);
        if (r.IsPosted === "0") {
          this.process = r;
          this.process.Date = GetDateJSON(new Date(r.Date));
          console.log(this.process);

          this.http
            .getData("qryinvoicedetails?filter=invoiceid=" + this.EditID)
            .then((rdet: any) => {
              for (const det of rdet) {
                this.AddToDetails({
                  ProductID: det.ProductID,
                  StockID: det.StockID,
                  ProductName: det.ProductName,
                  Qty: det.Qty,

                });
              }

            });
        } else {
          this.myToaster.Warning("Invoice is already posted", "Edit", 1);
        }
      });
    }
  }
  StoreSelect(e) {
    console.log(e);

    if (e.itemData) {
      this.getStock(e.itemData.StoreID)
    }
  }
  ItemSelected(e) {
    console.log(e);

    if (e.itemData) {
      this.SelectStock = e.itemData;
      this.process.PPrice = this.SelectStock.PPrice;
    } else {
      this.SelectStock = {}
    }
  }


  getStock(StoreID) {
    console.log(StoreID);

    this.http.getData('qrystock?filter=StoreID=' + StoreID).then((res: any) => {
      this.Stock = res;
    });
  }

  getproducts() {
    this.http.getData('qryproducts').then((res: any) => {
      console.log(res);

      this.Prods = res;
    });
  }

  AddToDetails(ord: any) {
    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
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

if ((this.sdetails.Qty*1 + this.process.WeightOutput*1)> this.process.WeightUsed){
  this.myToaster.Error("Output weight can not be greater than weight processed", "Erorr");
  return;
}

    console.log(this.sdetails);

    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focusIn();
    this.sdetails = new ProcessDetailsModel();
  }

  ProductSelected($event) {

    if ($event.itemData) {
      this.selectedProduct = $event.itemData;

      this.sdetails.PPrice = this.selectedProduct.PPrice;
      this.sdetails.SPrice = this.selectedProduct.SPrice;
      this.sdetails.ProductID = this.selectedProduct.ProductID;

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
    this.process.BusinessID = this.http.getBusinessID();
    console.log(this.process, this.Type);
    this.process.Date = JSON2Date(this.process.Date);
    this.process.UserID = this.http.getUserID();

    console.log(this.process);

    this.data.getAll().then((res1) => {
      let i = 0;
      for (i = 0; i < res1.length; i++) {

        delete res1[i].ProductName;
        res1[i].PPrice = (this.process.PPrice * this.process.WeightUsed) / this.process.WeightOutput;
      }
      this.process.details = res1;
      this.http.postTask("processing" + InvoiceID, this.process).then(
        (r: any) => {
          this.Cancel(

          );
          if (p == 1) window.open("/#/print/printinvoice/" + r.id);
          this.myToaster.Sucess("Data Insert successfully", r.id);
          if (this.EditID) {
            this.router.navigateByUrl("/process/process");
          } else {
            this.getproducts();
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

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }


  changel() {
    this.calculation();
  }
  public calculation() {
    this.process.WeightOutput = 0;


    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.process.WeightOutput += d[i].Qty * 1;

      }

    });
  }

  Cancel(smid = "", smrt = "", btype = "") {
    this.data.empty();
    this.data.refresh();

    this.process = new ProcessModel();
    this.sdetails = new ProcessDetailsModel();
    this.btnsave = false;
  }
}
