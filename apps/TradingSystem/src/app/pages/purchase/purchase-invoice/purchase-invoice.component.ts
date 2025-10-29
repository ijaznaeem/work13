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
import { GetDateJSON, GetProps, RoundTo } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { Details, DetailsSettings, Invoice } from './purchase-invoice.settings';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss'],
})
export class PurchaseInvoiceComponent implements OnInit, OnChanges {
  @Input() Type: string;
  @Input() EditID = '';
  @ViewChild('frmInvoice') frmInvoice;
  @ViewChild('cmbProduct') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbCustomers') cmbCustomers;

  public data = new LocalDataSource([]);
  private InvoiceUrl = '/purchase/invoice/';
  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  details = new Details();
  invoice = new Invoice();
  public settings = DetailsSettings;
  public Prods = [];
  public Terms = Terms;
  public Accounts: any = [];
  public Transporters: any = [];
  public OrderBy: any = [];
  public OrderTo: any = [];

  public selectedProduct: any = {};

  $Stores: Observable<any[]>;
  $PStores: Observable<any[]>;
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
    this.$PStores = this.cachedData.PStores$;

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
      this.details.ProductID = '';
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
      .getData(`PInvoices?filter=InvoiceID='${this.EditID}'`)
      .then((r: any) => {
        if (r.length > 0) {
          this.isPosted = !(r[0].IsPosted == '0');
          this.invoice = GetProps(r[0], Object.keys(this.invoice));
          // this.invoice.Date = GetDateJSON(new Date(r[0].Date));

          this.http
            .getData(`qryPInvDet?filter=InvoiceID='${this.EditID}'`)
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
  ProductSearchFn(term: any, item) {
    if (isNaN(term)) {
      return (
        item.ProductName.toLocaleLowerCase().indexOf(
          term.toLocaleLowerCase()
        ) >= 0
      );
    } else return item.ProductID == term;
  }

  private AddToDetails(ord: Details) {
    console.log(ord);

    const obj = {
      ProductName: ord.ProductName,
      StoreName: ord.StoreName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: ord.Qty,
      Amount: ord.PPrice * ord.Qty,
      Labour: ord.Labour,
      Fare: ord.Fare,
      DMA: ord.DMA,
      CompanyInvNo: ord.CompanyInvNo,
      CompanyInvDate: ord.CompanyInvDate,
      SaleTaxValue: ord.SaleTaxValue,
      STPurchValue: ord.STPurchValue,
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      StoreID: ord.StoreID,
      Packing: ord.Packing,
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
    if (this.details.Packing == 0) {
      Swal.fire('Invalid Packing').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }

    if (this.details.PPrice == 0) {
      Swal.fire('Invalid Rate').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }

    this.details.ProductName = this.selectedProduct.ProductName;

    this.AddToDetails(this.details);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focus();
    this.details = new Details();
  }
  ProductSelected($event) {
    if ($event && $event.ProductID !== '') {
      this.selectedProduct = $event;
      this.details.Packing = this.selectedProduct.Packing;

      console.log(this.selectedProduct);

      this.http
        .getData(
          'qrystock?orderby=StockID desc&filter=productid=' + $event.ProductID
        )
        .then((res1: any) => {
          if (res1.length > 0) {
            this.tqty = res1[0].Stock;
            this.details.SPrice = res1[0].SPrice * res1[0].Packing;
            this.details.PPrice = res1[0].PPrice * res1[0].Packing;
            this.details.Packing = res1[0].Packing;
          } else {
            this.tqty = 0;
            this.details.SPrice = this.selectedProduct.SPrice;
            this.details.PPrice = this.selectedProduct.PPrice;
          }
          // document.getElementById('qty').focus();
        });
    }
  }
  public SaveData() {
    console.log(this.invoice);
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }

    this.data.getAll().then((res1) => {
      this.invoice.details = res1;
      this.invoice.FinYearID = this.http.getFinYearID();
      this.invoice.UserID = this.http.getUserID();

      this.http.postTask('purchase' + InvoiceID, this.invoice).then(
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
    this.invoice.Amount = 0;
    this.invoice.Labour = 0;
    this.invoice.FrieghtCharges = 0;

    this.data.getAll().then((d) => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.invoice.Amount += d[i].Amount * 1;
        this.invoice.Labour += d[i].Labour * 1;
        this.invoice.FrieghtCharges += d[i].Fare * 1;
      }
    });
  }

  Cancel() {
    this.isPosted = false;
    this.data.empty();
    this.data.refresh();
    this.tqty = '';
    this.invoice = new Invoice();
    this.details = new Details();
    this.btnsave = false;
  }

  FindINo() {
    this.router.navigate([this.InvoiceUrl, this.Ino]);
  }
  NavigatorClicked(e) {
    let dt = GetDateJSON();
    let billNo: any = 'P' + '-' + dt.year.toString().slice(2) + '000001';
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
        this.http.getData('getbno/P').then((r: any) => {
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
  RoundTo(n,d){
    return RoundTo(n,d);
  }
}
