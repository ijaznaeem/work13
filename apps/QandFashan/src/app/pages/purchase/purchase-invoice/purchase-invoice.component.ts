import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { JSON2Date, GetDateJSON, GetProps } from '../../../factories/utilities';
import { PInvoiceDetails, PInvoice } from '../purchase/pinvoicedetails.model';
import { CachedDataService } from '../../../services/cacheddata.service';
import {
  ComboBox,
  FilteringEventArgs,
} from '@syncfusion/ej2-angular-dropdowns';
import { PurchaseSettings } from './purchase.settings';
import { Router } from '@angular/router';
import { RoundTo2 } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { PurchaseSettings2 } from './purchase.settings2';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss'],
})
export class PurchaseInvoiceComponent implements OnInit {
  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any = {};
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('qty') elQty;
  @ViewChild('acctType') cmbActType;
  @ViewChild('cmbProducts') cmbProducts: ComboBox;

  public data = new LocalDataSource([]);
  orderno = 0;
  barcode: '';
  tqty: any = '';
  public btnsave = false;

  pdetails = new PInvoiceDetails();

  purchase = new PInvoice();

  settings = PurchaseSettings;
  settings2 = PurchaseSettings2;

  public Prods = [];
  public Stores: any = [];
  public Accounts: any = [];
  $Companies = this.cachedData.Companies$;
  AcctTypes = this.cachedData.AcctTypes$;
  SelectCust: any = {};
  bsModalRef: any;

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,

    private router: Router
  ) {}

  ngOnInit() {
    this.purchase.DtCr = this.Type;
    this.http.getData('blist').then((b) => {
      this.Stores = b;
    });
    this.getAccounts();
    this.getProducts();

    if (this.EditID && this.EditID !== '') {
      console.warn('Edit ID given');
      this.http
        .getData('qrypinvoices?filter=InvoiceID=' + this.EditID)
        .then((r: any) => {
          console.log(r);
          if (r[0].IsPosted == '0') {
            this.purchase = GetProps(r[0], Object.keys(this.purchase));
            this.purchase.Date = GetDateJSON(new Date(r[0].Date));
            this.purchase.InvoiceDate = GetDateJSON(new Date(r[0].InvoiceDate));
            console.log(this.purchase);

            this.http
              .getData('qrypinvoicedetails?filter=invoiceid=' + this.EditID)
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

  getAccounts() {
    this.http.getAcctstList('').then((res: any) => {
      this.Accounts = res;
    });
  }

  getProducts() {
    this.http.getProducts('1').then((res: any) => {
      this.Prods = res;
    });
  }
  private AddToDetails(ord: any) {
    const obj = {
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      PackPrice: ord.PackPrice,
      Qty: ord.Qty,
      Processed: ord.Processed,
      Output: ord.Output,
      Pcs: ord.Pcs,
      Bonus: ord.Bonus,
      Amount: RoundTo2(ord.PPrice * ord.Qty * 1),
      ProductID: ord.ProductID,
      Packing: ord.Packing,
      Discount: RoundTo2(ord.PPrice * ord.Qty * ord.DiscRatio) / 100,
      DiscRatio: ord.DiscRatio,
      BusinessID: this.http.getBusinessID(),

      NetAmount: RoundTo2(
        ord.PPrice * ord.Qty - (ord.PPrice * ord.Qty * ord.DiscRatio) / 100
      ),
    };
    this.data.prepend(obj);
  }
  CustomerSelected(event) {
    if (event.itemData && event.itemData.CustomerID) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.itemData.CustomerID;
      });
    }
  }
  public AddOrder() {
    this.AddToDetails(this.pdetails);
    this.data.refresh();
    this.calculation();
    this.selectedProduct = {};
    this.cmbProducts.focusIn();
    this.pdetails = new PInvoiceDetails();
  }
  ProductSelected($event) {
    if ($event.data && $event.data.ProductID !== '') {
      this.selectedProduct = $event.data;
      this.pdetails.ProductName = this.selectedProduct.ProductName;
      this.pdetails.ProductID = this.selectedProduct.ProductID;

      this.http
        .getData(
          'qrystock?orderby=StockID desc&filter=productid=' +
            $event.data.ProductID
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
          this.pdetails.Packing = this.selectedProduct.Packing;
          this.elQty.nativeElement.focus();
        });
    }
  }
  public SaveData() {
    console.log(this.purchase);
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.purchase.Date = JSON2Date(this.purchase.Date);
    this.purchase.InvoiceDate = JSON2Date(this.purchase.InvoiceDate);

    this.data.getAll().then((res1) => {
      this.purchase.details = res1;

      this.http.postTask('purchase' + InvoiceID, this.purchase).then(
        () => {
          this.myToaster.Sucess('Data Insert successfully', '', 2);
          if (this.EditID != '') {
            this.Cancel();
            this.router.navigateByUrl('/purchase/invoice');
          } else {
            this.Cancel();
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

      this.purchase.NetAmount = RoundTo2(
        this.purchase.Amount * 1 - this.purchase.Discount * 1
      );
    });
  }

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.tqty = '';
    this.purchase = new PInvoice();
    this.pdetails = new PInvoiceDetails();
    this.btnsave = false;
    this.calculation();
  }
  trackByFn(item: any) {
    return item.ProductID;
  }

  ItemSelected(e: any) {
    this.ProductSelected({ data: e.itemData });
  }
}
