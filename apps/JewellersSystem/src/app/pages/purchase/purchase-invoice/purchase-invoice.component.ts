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
  @ViewChild('cmbStore') cmbStore;

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

  public selectedProduct: any = {};

  $Stores: Observable<any[]>;
  AcctTypes: Observable<any[]>;
  SelectCust: any = {};
  $GoldTypes: Observable<any[]>;

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.AcctTypes = this.cachedData.acctTypes$;
    this.$Stores = this.cachedData.stores$;
    this.$GoldTypes = this.cachedData.goldType$;
  }

  ngOnInit() {
    this.Cancel();
    this.http.getAcctstList('').then((res: any) => {
      this.Accounts = res;
    });

    this.http.getProducts().then((res: any) => {
      this.Prods = res;
    });

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
    this.http.getData(`PInvoices/${this.EditID}`).then((r: any) => {
      if (r) {
        this.isPosted = !(r.IsPosted == '0');
        this.invoice = GetProps(r, Object.keys(this.invoice));
        this.http
          .getData(`qryPInvoiceDetails?filter=InvoiceID='${this.EditID}'`)
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
      Picture: ord.Picture,
      PicturePrev: ord.PicturePrev,
      Qty: Number(ord.Qty),
      Weight: Number(ord.Weight),
      Cutting: Number(ord.Cutting),
      CutRatio: Number(ord.CutRatio),
      Purity: Number(ord.Purity),
      ProductID: ord.ProductID,
      SmallStone: Number(ord.SmallStone),
      BigStone: Number(ord.BigStone),
      StoreName: ord.StoreName,
      StoreID: ord.StoreID,
      Wastage: Number(ord.Wastage),
      LacerCharges: Number(ord.LacerCharges),
      MotiCharges: Number(ord.MotiCharges),
      GoldType: Number(ord.GoldType),
      Comments: ord.Comments,
      NetWeight: RoundTo(
        Number(ord.Weight) -
          Number(ord.Cutting) -
          Number(ord.SmallStone) +
          Number(ord.Wastage),
        3
      ),
    };
    this.data.prepend(obj);
  }
  CustomerSelected(event) {
    console.log(event);

    if (event.CustomerID) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.CustomerID;
      });

      if (this.SelectCust) {
        this.invoice.CustomerName = this.SelectCust.CustomerName;
        this.invoice.Address = this.SelectCust.Address;
        this.invoice.PhoneNo = this.SelectCust.PhoneNo;
      }
    }
  }
  onSelect(event) {
    this.details.Picture = event.addedFiles[0];
    if (this.details.Picture) {
      const reader = new FileReader();
      reader.readAsDataURL(this.details.Picture);
      reader.onload = () => {
        this.details.PicturePrev = reader.result as string; // Store Base64 image
      };
    }
  }
  public AddOrder() {
    if (this.details.Qty == 0) {
      Swal.fire('Invalid Rate').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }
    if (this.details.Weight == 0) {
      Swal.fire('Invalid Weight').then(() => {});
      return;
    }

    this.details.ProductName = this.selectedProduct.ProductName;
    this.details.StoreName = this.cmbStore.selectedItem
      ? this.cmbStore.selectedItem.StoreName
      : '';

    this.AddToDetails(this.details);
    this.data.refresh();
    this.calculation();
    this.cmbProd.focus();
    this.details = new Details();
    this.details.Picture = null;
    this.details.PicturePrev = null;
  }
  ProductSelected($event) {
    if ($event && $event.ProductID !== '') {
      this.selectedProduct = $event;

      console.log(this.selectedProduct);
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
      this.invoice.Date = this.invoice.Date.substring(0, 10); // Ensure date is in YYYY-MM-DD format
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
    event.newData.NetWeight = RoundTo(
      Number(event.newData.Weight) -
        Number(event.newData.Cutting) -
        Number(event.newData.SmallStone) +
        Number(event.newData.Wastage),
      4
    );

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  public onFiltering = (e: FilteringEventArgs, prop: string) => {
    if (e.text === '' || e.text == null) {
      e.updateData(prop === 'CustomerName' ? this.Accounts : this.Prods);
    } else {
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
    this.invoice.TotalWeight = 0;
    this.invoice.Cutting = 0;
    this.invoice.SmallStone = 0;
    this.invoice.BigStone = 0;
    this.invoice.TotalWastage = 0;
    this.invoice.Labour = 0;

    this.data.getAll().then((d) => {
      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.invoice.TotalWeight += d[i].Weight * 1;
        this.invoice.Cutting += d[i].Cutting * 1;
        this.invoice.SmallStone += d[i].SmallStone * 1;
        this.invoice.TotalWastage += d[i].Wastage * 1;
        this.invoice.BigStone += d[i].BigStone * 1;
        this.invoice.Labour += d[i].MotiCharges * 1 + d[i].LacerCharges * 1;
      }
      this.invoice.NetWeight = RoundTo(
        this.invoice.TotalWeight -
          this.invoice.Cutting -
          this.invoice.SmallStone +
          this.invoice.TotalWastage,
        4
      );
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
        this.http.getData('getbno/2').then((r: any) => {
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
  onCutRatioChange(e) {
    console.log(e);
    this.details.Cutting = RoundTo(( this.details.Weight - this.details.SmallStone  +  this.details.Wastage)  * this.details.CutRatio/ 96, 4);
  }
  onWastageRatioChange(e) {
    console.log(e);
    this.details.Wastage = RoundTo((this.details.Weight - this.details.SmallStone)  * this.details.WastageRatio/ 96, 4);
  }

  toNumber(n) {
    return Number(n) || 0;
  }
}
