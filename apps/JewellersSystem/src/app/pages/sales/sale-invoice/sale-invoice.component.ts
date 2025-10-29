import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import { UPLOADS_URL } from '../../../../../../../libs/future-tech-lib/src/lib/constants/constants';
import { Terms } from '../../../factories/constants';
import { GetDateJSON, GetProps, RoundTo } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { Details, DetailsSettings, Invoice } from './sale-invoice.settings';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.scss'],
})
export class SaleInvoiceComponent implements OnInit, OnChanges {
  @Input() Type: string;
  @Input() EditID = '';
  @ViewChild('frmInvoice') frmInvoice;
  @ViewChild('cmbProduct') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbCustomers') cmbCustomers;

  public data = new LocalDataSource([]);
  private InvoiceUrl = '/sale/invoice/';
  Ino = '';
  OrderNo = '';

  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  details = new Details();
  invoice = new Invoice();
  public settings = DetailsSettings;
  public Stock = [];
  public Terms = Terms;
  public Transporters: any = [];
  public Agencies: any = [];
  public OrderTo: any = [];

  public selectedProduct: any = {
    Description: '',
    Weight: 0,
    Karat: '',
    Purity: 0,
  };
  public ImageUrl = UPLOADS_URL + '/pictures/';
  $GoldTypes: Observable<any[]>;
  $Accounts: Observable<any[]>;
  $Stores: Observable<any[]>;
  SelectCust: any = {};

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.$GoldTypes = this.cachedData.goldType$;
    this.$Accounts = this.cachedData.accounts$;
    this.$Stores = this.cachedData.stores$;
    this.$GoldTypes = this.cachedData.goldType$;
  }

  ngOnInit() {
    this.Cancel();

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
    this.http.getData(`Invoices/${this.EditID}`).then((r: any) => {
      if (r) {
        this.isPosted = !(r.IsPosted == '0');
        this.invoice = GetProps(r, Object.keys(this.invoice));
        // this.invoice.Date = GetDateJSON(new Date(r[0].Date));

        this.http
          .getData(`qryInvoiceDetails?filter=InvoiceID=${this.EditID}`)
          .then((rdet: any) => {
            for (const det of rdet) {
              this.AddToDetails(det);
            }
            this.calculation();
          });
      } else {
        this.myToaster.Error('Invoice No not found', 'Edit', 1);
        this.NavigatorClicked({ Button: Buttons.Last });
      }
    });
  }
  StoreSelected(event) {
    if (event && event.StoreID) {
      this.loadStockForStore(event.StoreID);
    } else {
      this.Stock = [];
    }
  }
  loadStockForStore(StoreID: any) {
    this.http.getStock(StoreID).then((res: any) => {
      this.Stock = res;
    });
  }
  ProductSearchFn(term: any, item) {
    return (
      item.ProductName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) >=
        0 ||
      item.BarCode.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) >= 0
    );
  }

  ItemSelected(event) {
    this.selectedProduct = {
      Description: '',
      Weight: 0,
      Karat: '',
      Purity: 0,
    };
    if (event && event.StockID !== '') {
      this.http
        .getData(`qryStock?filter=StockID=${event.StockID}`)
        .then((res: any) => {
          this.selectedProduct = res[0];
          this.details.Description = this.selectedProduct.ProductName;
          this.details.Weight = this.selectedProduct.Weight || 0;
        });
    }
  }
  private AddToDetails(ord: Details | any) {
    console.log(ord);
    ord.Cutting = RoundTo(ord.Cutting || 0, 3);
    ord.Polish = RoundTo(ord.Polish || 0, 3);
    ord.Weight = RoundTo(ord.Weight || 0, 3);
    ord.NetWeight = this.GetNetWeight(ord);
    if (ord.Picture) {
      ord.Picture = this.ImageUrl + '/' + ord.Picture;
    } else {
      ord.Picture = null;
    }

    this.data.prepend(ord);
  }
  CustomerSelected(event) {
    if (event.CustomerID) {
      this.http.getData(`Customers/${event.CustomerID}`).then((res: any) => {
        this.SelectCust = res;
        this.invoice.CustomerName = res.CustomerName;
        this.invoice.PhoneNo = res.PhoneNo;
        this.invoice.Address = res.Address;
        this.invoice.PrevBalance = {
          Cash:  res.Balance || 0,
          Gold24K: res.GoldBalance || 0,
          Gold22K: res.Gold21K || 0,
        };
      });
    }
  }
  public AddOrder() {
    if (this.details.Weight == 0) {
      Swal.fire('Invalid Weight').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }
    // if (this.details.Qty == 0) {
    //   Swal.fire('Invalid Qty').then(() => {
    //     this.elQty.nativeElement.focus();
    //   });
    //   return;
    // }
    this.details.Picture = this.selectedProduct.Picture || null;

    this.AddToDetails(this.details);
    this.data.refresh();
    this.calculation();
    this.details = new Details();
  }

  public SaveData() {
    console.log(this.invoice);
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }

    this.data.getAll().then((res1) => {
      this.invoice.details = res1;
      this.invoice.Date = this.invoice.Date.substring(0, 10); // Ensure date is in YYYY-MM-DD format

      this.http.postTask('sale' + InvoiceID, this.invoice).then(
        (r: any) => {
          this.myToaster.Sucess('Data Insert successfully', '', 2);
          if (this.EditID != '') {
            this.router.navigateByUrl(this.InvoiceUrl + this.EditID);
          } else {
            this.router.navigateByUrl(this.InvoiceUrl + r.id);
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

  public calculation() {
    this.data.getAll().then((rows) => {
      this.invoice.TotalWeight = rows.reduce(
        (sum, row) => sum + (row?.NetWeight ?? 0),
        0
      );
      this.invoice.TotalCutting = rows.reduce(
        (sum, row) => sum + (row?.Cutting ?? 0),
        0
      );
      this.invoice.TotalLabour = rows.reduce(
        (sum, row) => sum + (row?.Labour ?? 0),
        0
      );
      this.invoice.TotalPolish = rows.reduce(
        (sum, row) => sum + (row?.Polish ?? 0),
        0
      );
    });
    this.GrandCalc();
  }
  GrandCalc(e = null) {
    this.invoice.BalanceWeight =
      RoundTo(this.invoice.TotalWeight - this.invoice.AdvanceGold, 3) || 0;
    this.invoice.Amount = RoundTo(
      (this.invoice.BalanceWeight * this.invoice.Rate) / 11.664,
      0
    );
    this.invoice.TotalAmount = this.invoice.Amount * 1 + this.invoice.TotalLabour * 1;
    this.invoice.NetBillGold =
      this.invoice.BillGold - this.invoice.BillGoldCutting;
    this.invoice.BillGoldAmount = RoundTo(
      (this.invoice.NetBillGold * this.invoice.BillGoldRate) / 11.664,
      0
    );
    this.invoice.BalanceAmount =
      this.invoice.TotalAmount -
      this.invoice.BillGoldAmount -
      this.invoice.AdvanceAmount;



    this.invoice.CreditAmount =
      this.invoice.BalanceAmount -
      this.invoice.Discount * 1 +
      this.invoice.GoldAmountPaid * 1 +
      this.invoice.AdvanceReturned * -
      this.invoice.AdvanceAmount -
      this.invoice.RecievedAmount;
  }

  Cancel() {
    this.cachedData.updateAccounts();
    this.cachedData.updateItems();
    this.isPosted = false;
    this.data.empty();
    this.data.refresh();
    this.tqty = '';
    this.invoice = new Invoice();
    this.invoice.DtCr = this.Type || 'CR';
    this.details = new Details();
    this.loadStockForStore(this.details.StoreID);
    this.btnsave = false;
  }

  FindINo() {
    this.router.navigate([this.InvoiceUrl, this.Ino]);
  }
  FindOrderNo() {
    if (this.invoice.OrderNo == 0 || this.invoice.OrderNo == null) {
      Swal.fire('Please enter Order No');
      return;
    }

    this.http.getData('Orders/' + this.invoice.OrderNo).then((res: any) => {
      if (res) {
        this.invoice.CustomerID = res.CustomerID;
        this.invoice.CustomerName = res.CustomerName;
        this.invoice.PhoneNo = res.PhoneNo;
        this.invoice.Address = res.Address;
        this.invoice.AdvanceGold = res.AdvanceGold;
        this.invoice.AdvanceAmount = res.AdvanceAmount;
      } else {
        Swal.fire('Order No not found');
      }
    });
  }

  NavigatorClicked(e) {
    let dt = GetDateJSON();
    let billNo: any = 1;
    switch (Number(e.Button)) {
      case Buttons.First:
        this.router.navigateByUrl(this.InvoiceUrl + billNo);
        break;
      case Buttons.Previous:
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.router.navigateByUrl(this.InvoiceUrl + billNo);
        break;
      case Buttons.Next:
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.router.navigateByUrl(this.InvoiceUrl + billNo);
        break;
      case Buttons.Last:
        this.http.getData('getbno/1').then((r: any) => {
          billNo = r.billno;
          this.router.navigateByUrl(this.InvoiceUrl + billNo);
        });
        break;
      default:
        break;
    }
  }
  NewInvoice() {
    this.Cancel();
    this.router.navigateByUrl(this.InvoiceUrl);
  }
  PrintInvoice() {
    this.router.navigateByUrl('/print/printsale/' + this.EditID);
  }
  RoundTo(n, d) {
    return RoundTo(n, d);
  }
  GetNetWeight(obj) {
    if (!obj.Weight || !obj.CutRatio) {
      return obj.Weight + (obj.Polish || 0) * 1;
    }
    return RoundTo(
      obj.Weight -
        (obj.Weight * obj.CutRatio) / 96 +
        (obj.Polish || 0) +
        obj.Polish * 1,
      3
    );
  }
}
