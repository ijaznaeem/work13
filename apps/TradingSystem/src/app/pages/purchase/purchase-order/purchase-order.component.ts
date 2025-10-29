import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import { Terms } from '../../../factories/constants';
import {
  GetDateJSON,
  GetProps
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { POrder, POrderDetails, PurchaseSettings } from './purchase-order.settings';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
})
export class PurchaseOrderComponent implements OnInit,  OnChanges {
  @Input() Type: string;
  @Input() EditID = '';
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('cmbProduct') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbCustomers') cmbCustomers;

  public data = new LocalDataSource([]);
  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  pdetails = new POrderDetails();

  purchase = new POrder();

  public settings =PurchaseSettings
  public Prods = [];
  public Terms = Terms ;
  public Stores: any = [];
  public Accounts: any = [];

  public selectedProduct: any = {};

  $Companies: Observable<any[]> ;
  AcctTypes: Observable<any[]> ;
  SelectCust: any = {};

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.$Companies = this.cachedData.Stores$;
    this.AcctTypes = this.cachedData.AcctTypes$;
  }

  ngOnInit() {
    this.Cancel();
    this.http.getAcctstList('').then((res: any) => {
      this.Accounts = res;
    });
    this.http.getProducts().then((res: any) => {
      this.Prods = res;
      this.pdetails.ProductID = '';
    });

    setTimeout(() => {
      this.cmbCustomers.focus()

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
    this.Ino = this.EditID
    this.http
      .getData(`POrders?filter=OrderID='${this.EditID}'`)
      .then((r: any) => {
      if (r.length > 0) {
        this.isPosted = !(r[0].IsPosted == '0');
        this.purchase = GetProps(r[0], Object.keys(this.purchase));
        // this.purchase.OrderDate = GetDateJSON(new Date(r[0].OrderDate));

        this.http
        .getData(`qryPOrderDetails?filter=OrderID='${this.EditID}'`)
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

  private AddToDetails(ord: POrderDetails) {
    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      DMA: ord.DMA,
      Recvd: ord.Recvd,
      purchasefrom: ord.purchasefrom,
      Amount:
        (ord.PPrice * ord.Qty) ,
      ProductID: ord.ProductID,
      Packing: ord.Packing,
      WHT: ord.WHT,
      BusinessID: this.http.getBusinessID(),
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
    if (this.pdetails.Packing == 0) {
      Swal.fire('Invalid Packing').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }
    if (!this.pdetails.purchasefrom ) {
      Swal.fire('Invalid Store')
      return;
    }

    if (this.pdetails.PPrice == 0) {
      Swal.fire('Invalid Rate').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }

    let storeid = this.pdetails.purchasefrom;
    this.pdetails.ProductName = this.selectedProduct.ProductName;
    this.AddToDetails(this.pdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focus();
    this.pdetails = new POrderDetails();
    this.pdetails.purchasefrom = storeid;
  }
  ProductSelected($event) {
    if ($event && $event.ProductID !== '') {
      this.selectedProduct = $event;
      this.pdetails.Packing = this.selectedProduct.Packing;

      console.log(this.selectedProduct);

      this.http
        .getData(
          'qrystock?orderby=StockID desc&filter=productid=' + $event.ProductID
        )
        .then((res1: any) => {
          if (res1.length > 0) {
            this.tqty = res1[0].Stock;
            this.pdetails.SPrice = res1[0].SPrice * res1[0].Packing;
            this.pdetails.PPrice = res1[0].PPrice * res1[0].Packing;
            this.pdetails.Packing = res1[0].Packing;
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
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    // this.purchase.OrderDate = JSON2Date(this.purchase.OrderDate);

    this.data.getAll().then((res1) => {
      this.purchase.details = res1;

      this.http.postTask('po' + InvoiceID, this.purchase).then(
        (r:any) => {
          this.myToaster.Sucess('Data Insert successfully', '', 2);
          if (this.EditID != '') {
            // this.purchase.OrderDate = GetDateJSON(new Date(this.purchase.OrderDate));
            this.router.navigateByUrl('/purchase/order/' + this.EditID);
          } else {

            this.router.navigateByUrl('/purchase/order/' + r.id);
          }
        },
        (err) => {
          // this.purchase.OrderDate = GetDateJSON(new Date(getCurDate()));
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
    event.newData.Amount =
      ((event.newData.Qty * event.newData.Packing + 1*event.newData.KGs) *
        event.newData.PPrice) /
      event.newData.RateUnit;

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
    this.purchase.Amount = 0;

    this.data.getAll().then((d) => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.purchase.Amount += d[i].Amount * 1;
      }
    });
  }

  Cancel() {
    this.isPosted = false;
    this.data.empty();
    this.data.refresh();
    this.tqty = '';
    this.purchase = new POrder();
    this.pdetails = new POrderDetails();
    this.btnsave = false;
  }

  FindINo() {
    this.router.navigate(['/purchase/order/', this.Ino]);
  }
  NavigatorClicked(e) {
    let dt = GetDateJSON()
    let billNo:any = 'PO'+ '-' +dt.year.toString().slice(2)  + '000001';
    switch (Number(e.Button)) {
      case Buttons.First:
        this.router.navigateByUrl('/purchase/order/' + billNo);
        break;
      case Buttons.Previous:
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.router.navigateByUrl('/purchase/order/' + billNo);
        break;
      case Buttons.Next:
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.router.navigateByUrl('/purchase/order/' + billNo);
        break;
      case Buttons.Last:
        this.http.getData('getbno/PO').then((r: any) => {
          billNo = r.billno;
          this.router.navigateByUrl('/purchase/order/' + billNo);
        });
        break;
      default:
        break;
    }
    //this.router.navigateByUrl('/sales/wholesale/' + billNo);
  }
  NewInvoice() {
    this.Cancel();
    this.router.navigateByUrl('/purchase/order');

  }
  PrintInvoice() {
    this.router.navigateByUrl('/print/printpurchase/' + this.EditID);
  }
}
