import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  JSON2Date,
  GetDateJSON,
  GetProps,
  RoundTo2,
  FindTotal,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { ActivatedRoute, Params } from '@angular/router';
import { GroupBy } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';

class Production {
  Date = GetDateJSON();
  ProductID = '';
  StockID = '';
  Packing = 0;
  Qty = 0;
  FinYearID = 0;
  ClosingID = 0;
  TotalWeight = 0;
  Notes = '';
}

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss'],
})
export class ProductionComponent implements OnInit {
  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any;
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('cmbProd') cmbProd;
  @ViewChild('qty') elQty;
  OutputByCategoy: any = [];
  public data = new LocalDataSource([]);
  orderno = 0;
  barcode: '';
  tqty: any = '';
  public btnsave = false;

  pdetails: any = [];
  production: any = new Production();

  public settings = {
    selectMode: 'single', // single|multi
    hideHeader: false,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: true,
      delete: true,
      custom: [],
      position: 'right', // left|right
    },
    add: {
      addButtonContent:
        '<h4 class="mb-1"> <i class="fa fa-plus ml-3 text-success"></i></h4>',
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
    noDataMessage: 'No data found',
    columns: {
      ProductName: {
        editable: false,
        title: 'Product',
        width: '350px',
      },
      Qty: {
        title: 'Qty',
        editable: true,
      },
      Packing: {
        title: 'Weight/Unit',
        editable: false,
      },
      TotalWeight: {
        title: 'Total Weight',
        editable: false,
      },
    },
    pager: {
      display: true,
      perPage: 50,
    },
  };
  public RawStock = [];
  public Prods = [];

  SelectCust: any = {};
  SelectRaw: any = {};

  constructor(
    private http: HttpBase,

    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.http.getStock(1).then((rs: any) => {
      this.RawStock = rs;
    });
    this.getProducts(0);
    this.activatedRoute.params.subscribe((params: Params) => {
      this.EditID = params.EditID;
    });

    if (this.EditID && this.EditID !== '') {
      this.http
        .getData('qryproduction?filter=ProductionID=' + this.EditID)
        .then((r: any) => {
          console.log(r);
          if (r[0].IsPosted == '0') {
            this.production = GetProps(r[0], Object.keys(this.production));
            this.production.Date = GetDateJSON(new Date(r[0].Date));
            this.http
              .getData(
                'qryproductiondetails?filter=ProductionID=' + this.EditID
              )
              .then((rdet: any) => {
                for (const det of rdet) {
                  this.AddToDetails(det);
                }
                this.calculation();
              });
          } else {
            this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
          }
        });
    }
  }
  getProducts(cat) {
    this.http.getProducts(cat).then((res: any) => {
      this.Prods = res;
    });
  }
  private AddToDetails(ord: any) {
    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      CategoryName: ord.CategoryName,
      PPrice: 0,
      SPrice: 0,
      Qty: ord.Qty,
      Kgs: ord.Kgs,
      TotalWeight: ord.Qty * ord.Packing,
      ProductID: ord.ProductID,
      Packing: ord.Packing,
      BusinessID: this.http.getBusinessID(),
    };
    this.data.prepend(obj);
    setTimeout(() => {
      this.calculation();
    }, 500);
  }

  public AddOrder() {
    this.pdetails.ProductName = this.cmbProd.text;
    this.AddToDetails(this.pdetails);
    this.data.refresh();
    this.cmbProd.focusIn();
    this.pdetails = [];
  }
  ProductSelected($event) {
    if ($event.itemData && $event.itemData.ProductID !== '') {
      this.selectedProduct = $event.itemData;
      console.log(this.selectedProduct);

      this.tqty = 0;
      this.pdetails.SPrice = this.selectedProduct.SPrice;
      this.pdetails.PPrice = this.selectedProduct.PPrice;
      this.pdetails.Packing = this.selectedProduct.Packing;
      this.pdetails.CategoryName = this.selectedProduct.CategoryName;
    }
  }
  public SaveData() {
    this.production.UserID = this.http.getUserID();
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.production.Date = JSON2Date(this.production.Date);
    this.data.getAll().then((res1) => {
      this.production.details = res1;

      this.http.postTask('production' + InvoiceID, this.production).then(
        () => {
          this.Cancel();
          this.myToaster.Sucess('Data Insert successfully', '', 2);
        },
        (err) => {
          this.myToaster.Error('Some thing went wrong', '', 2);
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
    if (window.confirm('Are you sure you want to delete?')) {
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

  public onFiltering = (e: FilteringEventArgs, prop: string) => {
    if (e.text === '' || e.text == null) {
      e.updateData(prop == 'RawProducts' ? this.RawStock : this.Prods);
    } else {
      //  console.log(prop === 'CustomerName'? this.Accounts: this.Prods);
      let filtered = (
        prop === 'RawProducts' ? this.RawStock : this.Prods
      ).filter((f: any) => {
        return f[prop].toLowerCase().indexOf(e.text.toLowerCase()) >= 0;
      });
      console.log(filtered);

      e.updateData(filtered);
    }
  };

  changel() {
    this.calculation();
  }
  public calculation() {
    this.production.TotalWeight = 0;

    this.data.getAll().then((d) => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.production.TotalWeight += d[i].TotalWeight * 1;
      }
      this.CaluelatePercentage(d);
    });
  }
  CaluelatePercentage(data) {
    const groupedTotals: { [key: string]: number } = {};

    data.forEach((item) => {
      const { CategoryName, TotalWeight } = item;

      if (groupedTotals[CategoryName] === undefined) {
        groupedTotals[CategoryName] = TotalWeight;
      } else {
        groupedTotals[CategoryName] += TotalWeight;
      }
    });
    this.OutputByCategoy = Object.entries(groupedTotals).map(
      ([CategoryName, TotalWeight]) => ({ CategoryName, TotalWeight })
    );

    console.log(this.OutputByCategoy);
  }
  Round2(n) {
    return RoundTo2(n);
  }
  Sum(array, fld) {
    return FindTotal(array, fld);
  }
  SumP(array, fld) {
    return   array.reduce((a, b) => parseFloat(a) + (parseFloat(b[fld])/(this.production.Qty * this.production.Packing) * 100), 0);
  }
  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.tqty = '';
    this.production = {};
    this.pdetails = [];
    this.btnsave = false;
  }
  RawStockSelected(event) {
    console.log(event);

    if (event) {
      console.log(event);

      this.SelectRaw = this.RawStock.find((x: any) => {
        return x.ProductID == event.value;
      });
      this.production.ProductID = this.SelectRaw.ProductID;
      this.production.Packing = this.SelectRaw.Packing;
    }
  }
}
