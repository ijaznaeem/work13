import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import { Terms } from '../../../factories/constants';
import { GetDateJSON, GetProps } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { DetailsSettings, Order, OrderDetails } from './sale-order.settings';

@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss'],
})
export class SaleOrderComponent implements OnInit, OnChanges {
  @Input() Type: string;
  @Input() EditID = '';
  @ViewChild('fromSale') fromSale;
  @ViewChild('cmbProduct') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbCustomers') cmbCustomers;

  public data = new LocalDataSource([]);
  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  odetails = new OrderDetails();
  sale = new Order();
  public settings = DetailsSettings;
  public Prods = [];
  public Terms = Terms;
  public Accounts: any = [];
  public Transporters: any = [];
  public OrderBy: any = [];
  public OrderTo: any = [];

  public selectedProduct: any = {};

  $Stores: Observable<any[]>;
  AcctTypes: Observable<any[]>;
  SelectCust: any = {};

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.$Stores = this.cachedData.Stores$;

    this.AcctTypes = this.cachedData.AcctTypes$;
  }

  ngOnInit() {
    this.Cancel();
    this.http.getAcctstList('').then((res: any) => {
      this.Accounts = res;
    });
    this.http.getTransporters().then((res: any) => {
      this.Transporters = res;
    });

    this.http.getProducts().then((res: any) => {
      this.Prods = res;
      this.odetails.ProductID = '';
    });

    setTimeout(() => {
      this.cmbCustomers.focus();
    }, 500);
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;

        this.LoadInvoice();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadInvoice();
    }
  }

  LoadInvoice() {
    this.Cancel();
    this.Ino = this.EditID;
    this.http
      .getData(`SOrder?filter=OrderID='${this.EditID}'`)
      .then((r: any) => {
        if (r.length > 0) {
          this.isPosted = !(r[0].IsPosted == '0');
          this.sale = GetProps(r[0], Object.keys(this.sale));
          // this.sale.Date = GetDateJSON(new Date(r[0].Date));

          this.http
            .getData(`qrySOrdDetails?filter=OrderID='${this.EditID}'`)
            .then((rdet: any) => {
              for (const det of rdet) {
                this.AddToDetails(det);
              }
              this.calculation();
            });
        } else {
          this.myToaster.Error('Invoice No not found', 'Edit', 1);
        }
      });
  }
  ProductSearchFn(term: any, item) {
    if (isNaN(term)) {
      return (
        item.ProductName.toLocaleLowerCase().indexOf(
          term.toLocaleLowerCase()
        ) >= 0
      );
    } else return item.ProductID == term;
  }

  private AddToDetails(ord: OrderDetails) {
    const obj = {
      ProductName: ord.ProductName,
      StoreName: ord.StoreName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      description: ord.description,
      Amount: ord.PPrice * ord.Qty,
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      StoreID: ord.StoreID,
      Packing: ord.Packing,
      Delvrd: ord.Delvrd > 0 ? ord.Delvrd: 0,
    };
    this.data.prepend(obj);
  }
  CustomerSelected(event) {
    console.log(event);

    if (event.CustomerID) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.CustomerID;
      });
    }
  }
  public AddOrder() {
    if (this.odetails.Packing == 0) {
      Swal.fire('Invalid Packing').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }

    if (this.odetails.PPrice == 0) {
      Swal.fire('Invalid Rate').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }

    this.odetails.ProductName = this.selectedProduct.ProductName;

    this.AddToDetails(this.odetails);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focus();
    this.odetails = new OrderDetails();
  }
  ProductSelected($event) {
    if ($event && $event.ProductID !== '') {
      this.selectedProduct = $event;
      this.odetails.Packing = this.selectedProduct.Packing;

      console.log(this.selectedProduct);

      this.http
        .getData(
          'qrystock?orderby=StockID desc&filter=productid=' + $event.ProductID
        )
        .then((res1: any) => {
          if (res1.length > 0) {
            this.tqty = res1[0].Stock;
            this.odetails.SPrice = res1[0].SPrice * res1[0].Packing;
            this.odetails.PPrice = res1[0].PPrice * res1[0].Packing;
            this.odetails.Packing = res1[0].Packing;
          } else {
            this.tqty = 0;
            this.odetails.SPrice = this.selectedProduct.SPrice;
            this.odetails.PPrice = this.selectedProduct.PPrice;
          }
          // document.getElementById('qty').focus();
        });
    }
  }
  public SaveData() {
    console.log(this.sale);
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }

    this.data.getAll().then((res1) => {
      this.sale.details = res1;
      this.sale.FinYearID = this.http.getFinYearID();
      this.sale.SessionID = this.http.getClosingID();

      this.http.postTask('so' + InvoiceID, this.sale).then(
        (r: any) => {
          this.myToaster.Sucess('Data Insert successfully', '', 2);
          if (this.EditID != '') {
            this.router.navigateByUrl('/sale/order/' + this.EditID);
          } else {
            this.router.navigateByUrl('/sale/order/' + r.id);
          }
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

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  public onFiltering = (e: FilteringEventArgs, prop: string) => {
    if (e.text === '' || e.text == null) {
      e.updateData(prop === 'CustomerName' ? this.Accounts : this.Prods);
    } else {
      //  console.log(prop === 'CustomerName'? this.Accounts: this.Prods);
      let filtered = (
        prop === 'CustomerName' ? this.Accounts : this.Prods
      ).filter((f) => {
        return f[prop].toLowerCase().indexOf(e.text.toLowerCase()) >= 0;
      });
      console.log(filtered);

      e.updateData(filtered);
    }
  };

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
    this.sale.Amount = 0;

    this.data.getAll().then((d) => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.sale.Amount += d[i].Amount * 1;
      }
    });
  }

  Cancel() {
    this.isPosted = false;
    this.data.empty();
    this.data.refresh();
    this.tqty = '';
    this.sale = new Order();
    this.odetails = new OrderDetails();
    this.btnsave = false;
  }

  FindINo() {
    this.router.navigate(['/sale/po/', this.Ino]);
  }
  NavigatorClicked(e) {
    let dt = GetDateJSON();
    let billNo: any = 'SO' + '-' + dt.year.toString().slice(2) + '000001';
    switch (Number(e.Button)) {
      case Buttons.First:
        this.router.navigateByUrl('/sale/order/' + billNo);
        break;
      case Buttons.Previous:
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.router.navigateByUrl('/sale/order/' + billNo);
        break;
      case Buttons.Next:
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.router.navigateByUrl('/sale/order/' + billNo);
        break;
      case Buttons.Last:
        this.http.getData('getbno/SO').then((r: any) => {
          billNo = r.billno;
          this.router.navigateByUrl('/sale/order/' + billNo);
        });
        break;
      default:
        break;
    }
  }
  NewInvoice() {
    this.Cancel();
    this.router.navigateByUrl('/sale/order');
  }
  PrintInvoice() {
    this.router.navigateByUrl('/print/printsale/' + this.EditID);
  }
}
