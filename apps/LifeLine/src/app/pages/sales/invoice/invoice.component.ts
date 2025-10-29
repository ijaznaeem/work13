import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { LocalDataSource } from 'ng2-smart-table';
import swal from 'sweetalert';
import { InvoiceTypes } from '../../../factories/constants';
import { GetDateJSON, JSON2Date, RoundTo2 } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { SaleDetails, SaleModel } from '../sale.model';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit, OnChanges {
  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any;
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('cmbProd') cmbProd;
  @ViewChild('cmbCompany') cmbCompany;
  @ViewChild('qty') elQty;
  @ViewChild('cmbRoutes') elCity;

  public data = new LocalDataSource([]);

  public btnsave = false;
  public isPosted = false;
  public InvTypes = InvoiceTypes;
  sdetails = new SaleDetails();
  sale = new SaleModel();

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
    noDataMessage: 'No data found',
    columns: {
      ProductName: {
        editable: false,
        title: 'Product',
        width: '250px',
      },
      SPrice: {
        title: 'Price',
        editable: true,
      },
      Qty: {
        title: 'Packs',
        editable: true,
      },

      Bonus: {
        title: 'Bonus',
        editable: true,
      },
      Amount: {
        editable: false,
        title: 'Amount',
      },
      DiscRatio: {
        editable: true,
        title: '%age',
      },
      SchemeRatio: {
        editable: true,
        title: 'Scheme',
      },
      NetAmount: {
        editable: false,
        title: 'Net Amount',
      },
    },
    pager: {
      display: true,
      perPage: 50,
    },
  };
  Salesman = this.cachedData.Salesman$;
  Companies: any = [];
  public Routes = this.cachedData.routes$;
  public Prods = [];
  public Accounts: any = [];
  public SelectCust: any = {};
  marked = false;
  public LastPrice: any = {};
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private router: Router,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    console.log(this.EditID);
    this.sale.Type = '1';
    this.getCustomers('');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      if (this.EditID && this.EditID !== '') {
        this.http.getData('invoices/' + this.EditID).then((r: any) => {
          if (!r) {
            this.myToaster.Warning('Invalid Invoice No', 'Edit', 1);
            this.router.navigateByUrl('sales/invoice');
            return;
          }

          if (r.IsPosted == '1') {
            this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
            this.isPosted = true;
          } else {
            this.isPosted = false;
          }
          this.getCustomers(r.RouteID);
          this.sale = r;
          this.sale.Date = GetDateJSON(new Date(r.Date));
          console.log(this.sale);

          this.http
            .getData('qryinvoicedetails?filter=invoiceid=' + this.EditID)
            .then((rdet: any) => {
              for (const det of rdet) {
                this.AddToDetails({
                  ProductID: det.ProductID,
                  StockID: det.StockID,
                  ProductName: det.ProductName,
                  Qty: det.Qty,
                  Packing: det.Packing,
                  Pcs: det.Pcs,
                  SPrice: det.SPrice,
                  PPrice: det.PPrice,
                  Bonus: det.Bonus,
                  BatchNo: det.BatchNo,
                  DiscRatio: det.DiscRatio,
                  SchemeRatio: det.SchemeRatio,
                });
              }
              this.calculation();
              this.SMSelected({
                itemData: {
                  SalesmanID: this.sale.SalesmanID,
                },
              });
            });
        });
      }
    }
  }
  getCustomers(routeid) {
    if (routeid == null) {
      routeid = '';
    }
    this.sale.CustomerID = '';
    this.http.getCustList(routeid).then((r: any) => {
      this.Accounts = [...r];
    });
  }
  CustomerSelected(event) {
    console.log(event);

    if (event) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.CustomerID;
      });
      this.sale.PrevBalance = this.SelectCust.Balance;
    }
  }
  RouteSelected($event) {
    if ($event.itemData) this.getCustomers($event.itemData.RouteID);
  }

  public onFiltering = (e: FilteringEventArgs, prop: string) => {
    if (e.text === '' || e.text == null) {
      e.updateData(this.Accounts);
    } else {
      //  console.log(prop === 'CustomerName'? this.Accounts: this.Prods);
      let filtered = this.Accounts.filter((f) => {
        return f[prop].toLowerCase().indexOf(e.text.toLowerCase()) >= 0;
      });
      e.updateData(filtered);
    }
  };
  AddToDetails(ord: any) {
    const tQty =
      parseFloat(ord.Qty) * parseFloat(ord.Packing) + parseFloat(ord.Pcs);

    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      Bonus: ord.Bonus,
      Pcs: ord.Pcs,
      Amount: RoundTo2(ord.SPrice * tQty),
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      Packing: ord.Packing,
      BatchNo: ord.BatchNo,
      DiscRatio: ord.DiscRatio,
      SchemeRatio: ord.SchemeRatio,
      Discount: (ord.SPrice * tQty * ord.DiscRatio) / 100,
      Scheme: tQty * ord.SchemeRatio,
      BusinessID: this.http.getBusinessID(),
      NetAmount: RoundTo2(
        ord.SPrice * tQty -
          (ord.SPrice * tQty * ord.DiscRatio) / 100 -
          tQty * ord.SchemeRatio
      ),
    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
    // this.sdetails.DiscRatio = parseFloat('0' +this.sdetails.DiscRatio);
    // this.sdetails.Bonus = parseFloat('0' + this.sdetails.Bonus);
    // this.sdetails.SchemeRatio = parseFloat('0' + this.sdetails.SchemeRatio);

    if (this.sdetails.SPrice * 1 < this.selectedProduct.PPrice * 1) {
      swal({
        text: 'Invalid sale rate',
        icon: 'warning',
      });
      return;
    }

    if (
      this.sdetails.Qty * this.sdetails.Packing + this.sdetails.Pcs >
        this.selectedProduct.Stock &&
      this.Type == '1'
    ) {
      swal({
        text: 'Not enough stock!, Continue ?',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (!willDelete) {
          return;
        }
      });
    }

    if (this.sdetails.Qty * this.sdetails.Packing + this.sdetails.Pcs == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }
    this.sdetails.ProductName = this.cmbProd.text;
    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbCompany.focusIn();
    this.sdetails = new SaleDetails();
  }

  ProductSelected($event) {
    this.selectedProduct = $event.itemData;
    console.log($event.itemData);

    if ($event.itemData) {
      this.sdetails.PPrice = this.selectedProduct.PPrice;
      this.sdetails.BatchNo = this.selectedProduct.BatchNo;
      this.sdetails.SPrice = this.selectedProduct.SPrice;
      this.sdetails.Packing = this.selectedProduct.Packing;
      this.sdetails.ProductID = this.selectedProduct.ProductID;
      this.sdetails.StockID = this.selectedProduct.StockID;
      if (this.sale.CustomerID) {
        this.http
          .getData(
            'qrysalereport?flds=Date,SPrice,TotPcs,DiscRatio,SchemeRatio&orderby=InvoiceID Desc&limit=1&filter=CustomerID=' +
              this.sale.CustomerID +
              ' and ProductID = ' +
              this.sdetails.ProductID
          )
          .then((r: any) => {
            console.log(r);
            if (r.length > 0) {
              this.LastPrice = r[0];
            } else {
              this.LastPrice = {};
            }
          });
      }
    }
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }
  public SaveData(print = 0) {
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.sale.BusinessID = this.http.getBusinessID();
    this.sale.ClosingID = this.http.getClosingID();

    console.log(this.sale, this.Type);
    this.sale.DtCr = this.Type;
    this.sale.Time = this.getTime(new Date());
    this.sale.Date = JSON2Date(this.sale.Date);
    this.sale.UserID = this.http.getUserID();

    this.data.getAll().then((res1) => {
      let i = 0;
      for (i = 0; i < res1.length; i++) {
        delete res1[i].ProductName;
        delete res1[i].Amount;
      }
      this.sale.details = res1;
      this.http.postTask('sale' + InvoiceID, this.sale).then(
        (r: any) => {
          this.Cancel(this.sale.SalesmanID, this.sale.RouteID);
          this.sale.DtCr = this.Type;

          if (print == 1) window.open('/#/print/printinvoice/' + r.id);
          this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);
          if (this.EditID) {
            this.router.navigateByUrl('/sales/invoice');
          } else {
            this.elCity.focusIn();
          }
        },
        (err) => {
          this.myToaster.Error('Error saving invoice', 'Error', 2);
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
    event.newData.Amount =
      event.newData.Qty * event.newData.SPrice * event.newData.Packing;
    event.newData.Discount =
      (event.newData.Qty * event.newData.SPrice * event.newData.DiscRatio) /
      100;
    event.newData.NetAmount =
      event.newData.Amount -
      event.newData.Discount -
      (event.newData.Qty * event.newData.Packing + event.newData.Pcs * 1) *
        event.newData.SchemeRatio;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }
  getProducts(v) {
    this.http
      .getData('qrystock?orderby=ProductName&filter=stock>0 and CompanyID=' + v)
      .then((res: any) => {
        this.Prods = res;
      });
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
    this.sale.Scheme = 0;

    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.sale.Amount += d[i].Amount * 1;
        this.sale.Discount += (d[i].Amount * d[i].DiscRatio) / 100;
        this.sale.Scheme +=
          (d[i].Qty * d[i].Packing + d[i].Pcs * 1) * d[i].SchemeRatio;
      }
    });
  }

  Cancel(smid = '', smrt = '') {
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.sale = new SaleModel();
    this.sale.SalesmanID = smid;
    this.sale.RouteID = smrt;
    this.sdetails = new SaleDetails();
    this.btnsave = false;
    this.isPosted = false;
  }

  SMSelected(e) {
    console.log(e);

    if (e.itemData) {
      this.http.getData('companiesbysm/' + e.itemData.SalesmanID).then((c) => {
        this.Companies = c;
      });
    }
  }
}
