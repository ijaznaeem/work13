import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { JSON2Date, GetDateJSON, getYMDDate } from '../../../factories/utilities';
import { Router } from '@angular/router';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { ColSettings } from '../../components/multi-col-combobox/multi-col-combobox.component';
import { Order } from '../../../models/sale.model';
import { CachedDataService } from '../../../services/cacheddata.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any;
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('cmbProd') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbRoutes') elCity;

  public data = new LocalDataSource([]);
  orderno = 0;
  barcode: '';
  tqty = '';
  public btnsave = false;
  ClosingID = 0;

  sdetails = new Order();
  sale = { Amount: 0, Discount: 0, Scheme: 0, NetAmount: 0 };
  isCash = false;
  public Prods: any = [];

  public RouteFlds = { text: 'RouteName', value: 'RouteID' };
  public ProdCols: ColSettings[] = [
    { title: 'Product Name', fldName: 'ProductName', size: 7 },
    { title: 'Code', fldName: 'ProductID', size: 2 },
    { title: 'Stock', fldName: 'Stock', size: 3 }
  ];

  public Accounts: any = [];
  public AccountsFlds = { text: 'CustomerName', value: 'CustomerID' };
  public colmodel: any = '3';
  myVar1 = false;
  myVar2 = false;

  public settings = {
    selectMode: 'single',  // single|multi
    hideHeader: false,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: true,
      delete: true,
      custom: [],
      position: 'right' // left|right
    },
    add: {
      addButtonContent: '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
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
    noDataMessage: 'No data found',
    columns: {

      ProductName: {
        editable: false,
        title: 'Product',
        width: '250px'
      },
      SPrice: {
        title: 'Price',
        editable: true,

      },
      Qty: {
        title: 'Packs',
        editable: true,

      },
      Packing: {
        title: 'Packing',
        editable: false,
      },
      Pcs: {
        title: 'Pcs',
        editable: true,
      },
      Bonus: {
        title: 'Bonus',
        editable: true,

      },
      Amount: {
        editable: false,
        title: 'Amount'
      },
      DiscRatio: {
        editable: true,
        title: '%age'
      },
      SchemeRatio: {
        editable: true,
        title: 'Scheme'
      },
      NetAmount: {
        editable: false,
        title: 'Net Amount'
      },
    },
    pager: {
      display: true,
      perPage: 50
    }
  };
  $
  $Companies = this.cachedData.Companies$
  $Routes =  this.cachedData.routes$;

  marked = false;
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private router: Router,
    private myToaster: MyToastService
  ) {

  }

  ngOnInit() {

    console.log(this.EditID);


    if ((this.EditID && this.EditID !== '')) {
      console.warn('Edit ID given');
      this.http.getData('invoices/' + this.EditID).then((r: any) => {
        console.log(r);
        if (r.IsPosted === '0') {

          this.http.getData('qryinvoicedetails?filter=invoiceid=' + this.EditID).then((rdet: any) => {
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
  getCustomers(routeid) {
    this.http.getAcctstList(routeid).then(r => {
      this.Accounts = r;
    });
  }

  RouteSelected($event) {
    console.log($event.itemData);
    this.getCustomers($event.itemData.RouteID);
  }

  getProducts(v) {

    this.http.getData('qrystock?filter=CompanyID=' + v).then((res: any) => {
      this.Prods = res;
    });
  }
  AddToDetails(ord: Order) {

    const tQty = parseFloat(ord.Qty + '') * parseFloat(ord.Packing + '') + parseFloat(ord.Pcs + '');
    console.log(tQty);
    const obj = {
      Date: JSON2Date(this.http.getClosingDate()),
      CustomerID: ord.CustomerID,
      SalesmanID: ord.SalesmanID,
      RouteID: ord.RouteID,
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      Bonus: ord.Bonus,
      Pcs: ord.Pcs,
      Amount: (ord.SPrice * tQty),
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      Packing: ord.Packing,
      DiscRatio: ord.DiscRatio,
      SchemeRatio: ord.SchemeRatio,
      Discount: (ord.SPrice * tQty) * ord.DiscRatio / 100,
      Scheme: tQty * ord.SchemeRatio,
      BusinessID: this.http.getBusinessID(),
      NetAmount: (ord.SPrice * tQty) -
        ((ord.SPrice * tQty) * ord.DiscRatio / 100) - tQty * ord.SchemeRatio,
    };
    console.log(obj);

    this.data.prepend(obj);

  }
  public AddOrder() {
    this.sdetails.ProductName = this.cmbProd.text;
    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focusIn();
    this.sdetails = new Order(this.sdetails.CustomerID, this.sdetails.RouteID, this.sdetails.SalesmanID);

  }

  ProductSelected($event) {

    this.selectedProduct = $event.itemData;

    if ($event.itemData) {
      // this.http.getData('stockpharmcy/' + $event.itemData.StockID)
      this.tqty = this.selectedProduct.stock;
      this.sdetails.PPrice = this.selectedProduct.PPrice;
      this.sdetails.SPrice = this.selectedProduct.SPrice;
      this.sdetails.Packing = this.selectedProduct.Packing;
      this.sdetails.ProductID = this.selectedProduct.ProductID;
      console.log(this.tqty);
    }
  }
  public SaveData() {
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    const rt = this.sdetails.RouteID;

    this.data.getAll().then(res1 => {
      this.http.postTask('order', res1).then(r => {
        this.myToaster.Sucess('Order saved', 'Save Order', 1);
        this.Cancel();
        this.sdetails.RouteID = rt;
        this.sdetails.SalesmanID = this.http.getUserID();
      });
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
    event.newData.Amount = (event.newData.Qty * event.newData.SPrice);
    event.newData.Discount = (event.newData.Qty * event.newData.SPrice) * event.newData.DiscRatio / 100;
    event.newData.NetAmount = event.newData.Amount - event.newData.Discount - (event.newData.Qty * event.newData.Packing +
      event.newData.Pcs * 1) * event.newData.SchemeRatio;

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
  public onFiltering = (e: FilteringEventArgs) => {
    let filtered;
    if (e.text === '') {
      e.updateData(this.Prods);
      this.Prods = [...this.Prods];
    } else {
      let query = new Query();
      // frame the query based on search string with filter type.
      query =
        e.text !== ''
          ? query.search(e.text)
          : query;
      filtered = this.Prods.filter(x => {
        return (x.ProductName.toUpperCase().indexOf(e.text.toUpperCase()) >= 0 || x.ProductID === e.text);
      });
      console.log(filtered);
      // pass the filter data source, filter query to updateData method.
      e.updateData(filtered);
    }
  }
  SetPcs() {
    this.sdetails.SPrice = this.sdetails.PackRate / this.sdetails.Packing;
  }
  public calculation() {
    this.sale.Amount = 0;
    this.sale.Discount = 0;
    this.sale.Scheme = 0;

    this.data.getAll().then(d => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.sale.Amount += d[i].Amount * 1;
        this.sale.Discount += (d[i].Amount) * d[i].DiscRatio / 100;
        this.sale.Scheme += (d[i].Qty * d[i].Packing + d[i].Pcs * 1) * d[i].SchemeRatio;
      }
    });
  }

  Cancel() {

    this.data.empty();
    this.data.refresh();
    this.tqty = '';
    this.sdetails = new Order();
    this.calculation();
  }



}
