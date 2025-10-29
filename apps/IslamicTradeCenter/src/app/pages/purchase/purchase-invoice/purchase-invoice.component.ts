import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { LocalDataSource } from 'ng2-smart-table';
import { RoundTo2 } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import {
  GetDateJSON,
  GetProps,
  JSON2Date,
  getCurDate,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { PInvoice, PInvoiceDetails } from '../purchase/pinvoicedetails.model';
import { AddProductForm, PinvoiceSettings } from './purchase-invoice.settings';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss'],
})
export class PurchaseInvoiceComponent implements OnInit {
  @Input() Type: string;
  @Input() EditID = '';

  selectedProduct: any;
  @ViewChild('fromPurchase') fromPurchase;
  @ViewChild('cmbProd') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('acctType') cmbActType;

  public data = new LocalDataSource([]);
  orderno = 0;
  barcode: '';
  tqty: any = '';
  public btnsave = false;

  pdetails = new PInvoiceDetails();

  purchase = new PInvoice();

  public settings = PinvoiceSettings;

  public Prods = [];
  public Stores: any = [];
  public Accounts: any = [];

  AcctTypes = this.cachedData.AcctTypes$;
  Companies$ = this.cachedData.Companies$;
  SelectCust: any = {};

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.pdetails);
    this.purchase.DtCr = this.Type;

    if (this.EditID && this.EditID !== '') {
      console.warn('Edit ID given');
      this.http
        .getData('qrypinvoices?filter=InvoiceID=' + this.EditID)
        .then((r: any) => {
          console.log(r);
          if (r[0].IsPosted == '0') {
            this.cmbActType.value = r[0].AcctTypeID;

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

  getAccounts(type) {
    this.http.getAcctstList(type).then((res: any) => {
      this.Accounts = res;
    });
  }

  getProducts(company) {
    if (company != null) {
      this.http.getProducts(company.CompanyID).then((res: any) => {
        this.Prods = res;
        this.pdetails.ProductID = '';
      });
    }
  }
  private AddToDetails(ord: any) {
    const obj = {
      ProductName: ord.ProductName,
      PPrice: RoundTo2(ord.PPrice),
      SPrice: RoundTo2(ord.SPrice),
      RPrice: RoundTo2(ord.RPrice),
      Qty: ord.Qty,
      Pcs: ord.Pcs,
      Bonus: ord.Bonus,
      Amount: RoundTo2(ord.PPrice * (ord.Qty * ord.Packing + ord.Pcs * 1)),
      ProductID: ord.ProductID,
      Packing: ord.Packing,
      Discount: RoundTo2(
        (ord.PPrice * (ord.Qty * ord.Packing + ord.Pcs * 1) * ord.DiscRatio) /
          100
      ),
      DiscRatio: ord.DiscRatio,
      BusinessID: this.http.getBusinessID(),
      BatchNo: ord.BatchNo,
      ExpiryDate: ord.ExpiryDate,
      NetAmount: RoundTo2(
        ord.PPrice * (ord.Qty * ord.Packing + ord.Pcs * 1) -
          (ord.PPrice * (ord.Qty * ord.Packing + ord.Pcs * 1) * ord.DiscRatio) /
            100
      ),
    };
    this.data.prepend(obj);
  }
  CustomerSelected(event) {
    if (event.itemData) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.itemData.CustomerID;
      });
    }
  }
  public AddOrder() {
    console.log(this.cmbProd.text);

    if (
      this.pdetails.PPrice == 0 ||
      this.pdetails.SPrice == 0 ||
      this.pdetails.RPrice == 0
    ) {
      this.myToaster.Error('TP, RP or PP is missing', 'Error');
      return;
    }

    this.pdetails.ProductName = this.cmbProd.text;
    this.AddToDetails(this.pdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focusIn();
    this.pdetails = new PInvoiceDetails(this.pdetails.CompanyID);
  }
  ProductSelected($event) {
    console.log($event);
    if ($event.itemData && $event.itemData.ProductID !== '') {
      this.selectedProduct = $event.itemData;
      console.log(this.selectedProduct);

      this.http
        .getData(
          'qrystock?orderby=StockID DESC&filter=productid=' +
            $event.itemData.ProductID
        )
        .then((res1: any) => {
          if (res1.length > 0) {
            this.tqty = res1[0].Stock;
            this.pdetails.SPrice = res1[0].SPrice * res1[0].Packing;
            this.pdetails.PPrice = res1[0].PPrice * res1[0].Packing;
            this.pdetails.RPrice = res1[0].RetailRate * res1[0].Packing;
            this.pdetails.Packing = res1[0].Packing;
          } else {
            this.tqty = 0;
            this.pdetails.SPrice = this.selectedProduct.SPrice;
            this.pdetails.PPrice = this.selectedProduct.PPrice;
            this.pdetails.RPrice = this.selectedProduct.RPrice;
          }
          this.pdetails.Packing = this.selectedProduct.Packing;
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
    this.purchase.Date = JSON2Date(this.purchase.Date);
    this.purchase.InvoiceDate = JSON2Date(this.purchase.InvoiceDate);

    this.data.getAll().then((res1) => {
      this.purchase.details = res1;

      this.http.postTask('purchase' + InvoiceID, this.purchase).then(
        () => {
          this.Cancel();
          this.myToaster.Sucess('Data Insert successfully', '', 2);
          this.router.navigateByUrl('purchase/invoice');
        },
        (err) => {
          this.purchase.Date = GetDateJSON(new Date(getCurDate()));
          this.purchase.InvoiceDate = GetDateJSON(new Date(getCurDate()));
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
      (event.newData.Qty * event.newData.Packing + event.newData.Pcs * 1) *
      event.newData.PPrice;
    event.newData.Discount =
      ((event.newData.Qty * event.newData.Packing + event.newData.Pcs * 1) *
        event.newData.PPrice *
        event.newData.DiscRatio) /
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
    this.tqty = '';
    this.purchase = new PInvoice();
    this.pdetails = new PInvoiceDetails();
    this.btnsave = false;
  }
  RoundIt(v) {
    return RoundTo2(v);
  }
  AddNewProduct() {
    this.http
      .openForm(AddProductForm, {
        CompanyID: this.pdetails.CompanyID,
        Scheme: 0,
        Discount: 0,
        ShortStock: 0,
      })
      .then((r: any) => {
        if (r == 'save') {
          this.getProducts({ CompanyID: this.pdetails.CompanyID });
        }
      });
  }
}
