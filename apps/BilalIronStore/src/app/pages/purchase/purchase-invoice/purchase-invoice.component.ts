import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import {
  ButtonConfig,
  ButtonsBarComponent,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/buttons-bar/buttons-bar.component';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import { InvoiceTypes } from '../../../factories/constants';
import {
  GetDateJSON,
  JSON2Date,
  RoundTo2,
  getCurDate,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

import { CustomersComponent } from '../../accounts/customers/customers.component';
import {
  InvoiceSettings,
  PurchaseDetails,
  PurchaseModel,
} from './purchase-invoice.setting';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss'],
})
export class PurchaseInvoiceComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild('searchTab') searchTab: TabsetComponent;
  @ViewChild('gatepass') gpTmplt;
  @ViewChild('btnBar') btnBar: ButtonsBarComponent;

  @Input() EditID = '';
  @Input() Type = 'CR';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('formqty') formSub: NgForm;
  @ViewChild('qty') elQty: ElementRef;
  @ViewChild('cmbStores') cmbStores;
  @ViewChild('cmbProduct') cmbProduct;
  @ViewChild('cmbCustomers') cmbAccts: NgSelectComponent;

  searchData: any = {};
  srchResult: any = [];
  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public btnsave = false;
  public isPosted = false;
  public isSaving = false;
  public btnLocked = true;
  public InvTypes = InvoiceTypes;
  public bsModalRef?: BsModalRef;
  sdetails = new PurchaseDetails();
  purchase = new PurchaseModel();

  public settings = InvoiceSettings;
  Stock: any = [];
  Banks: any = [];

  public Products: Observable<any>;
  public Accounts: any = [];
  public SelectCust: any = {};
  public LastPrice: any = {};
  public curStoreID: any = 0;
  public GPStoreID: 1;
  Stores: Observable<unknown>;
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService,
    private bsService: BsModalService
  ) {
    this.Stores = this.cachedData.Stores$;
    this.Products = this.cachedData.Products$;
  }

  buttonConfigs: ButtonConfig[] = [
    {
      title: 'New',
      icon: 'fa fa-file',
      classes: 'btn-primary',
      action: () => this.NewInvoice(),
      size: 'lg',
    },
    {
      title: 'Edit',
      icon: 'fa fa-pencil',
      classes: 'btn-secondary',
      action: () => this.EditInvoice(),
      size: 'lg',
    },
    {
      title: 'Print',
      icon: 'fa fa-print',
      classes: 'btn-warning',
      action: () => this.PrintInvoice(this.EditID),
      size: 'lg',
    },
  ];
  btnSave: ButtonConfig[] = [
    {
      title: 'Save',
      icon: 'fa fa-save',
      classes: 'btn-success',
      action: () => this.SaveData(),
      type: 'button',
      size: 'lg',
    },
    {
      title: 'Cancel',
      icon: 'fa fa-refresh',
      classes: 'btn-warning',
      action: () => this.CancelInvoice(),
      size: 'lg',
    },
  ];

  ngOnInit() {
    this.btnLocked = false;
    this.Cancel();
    this.getSuppliers();
    this.http.getAccountsByType('Bank').then((r: any) => {
      this.Banks = r;
    });
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        if (this.EditID == '0') {
          this.NavigatorClicked({ Button: Buttons.Last });
        } else {
          this.LoadInvoice();
        }
      }
    });
  }
  ngAfterViewInit(): void {
    if (this.EditID == '') this.EditDisabled(true);
    else this.EditDisabled(false);
    setTimeout(() => {
      this.cmbAccts.focus();
    }, 500);
  }

  StoreSelected(e) {}

  FindINo() {
    this.router.navigate(['/purchase/invoice/', this.Ino]);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadInvoice();
    }
  }
  LoadInvoice() {
    if (this.EditID && this.EditID !== '') {
      console.log('loadinvoice', this.EditID);
      this.Ino = this.EditID;
      this.http.getData('pinvoices/' + this.EditID).then((r: any) => {
        if (!r) {
          this.myToaster.Warning('Invalid invoice No', 'Edit', 1);
          this.router.navigateByUrl('purchase/invoice');
          return;
        }
        if (r.IsPosted == '1') {
          // this.myToaster.Warning('invoice is already posted', 'Edit', 1);
          this.isPosted = true;
        } else {
          this.isPosted = false;
        }
        this.EditDisabled(false);
        this.purchase = r;
        this.purchase.Date = GetDateJSON(new Date(r.Date));
        this.purchase.InvoiceDate = GetDateJSON(new Date(r.InvoiceDate));

        this.http
          .getData('qrypinvoicedetails', {
            orderby: 'DetailID desc',
            filter: 'InvoiceID=' + this.EditID,
          })
          .then((rdet: any) => {
            this.data.empty();

            for (const det of rdet) {
              const {
                ProductID,
                ProductName,
                Qty,
                SPrice,
                StoreName,
                PPrice,
                StoreID,
                Packing
              } = det;
              // Create new object with selected properties
              this.AddToDetails({
                ProductID,
                ProductName,
                Qty,
                SPrice,
                PPrice,
                StoreID,
                StoreName,
                Packing
              });
            }
            this.calculation();
          });
      });
    }
  }

  getSuppliers() {
    this.http.getAccountsByType('Supplier').then((r: unknown) => {
      this.Accounts = r;
    });
  }
  CustomerSelected(event) {
    console.log(event);

    if (event) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.CustomerID;
      });
      this.purchase.PrevBalance = this.SelectCust.Balance;
    }
  }

  AddToDetails(ord: any) {
    const tQty = parseFloat('0' + ord.Qty);

    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      PPrice: parseFloat('0' + ord.PPrice),
      SPrice: parseFloat('0' + ord.SPrice),
      Qty: parseFloat(ord.Qty),
      KGs: 0,
      Amount: RoundTo2(ord.PPrice * tQty * ord.Packing),
      ProductID: ord.ProductID,
      Packing: ord.Packing,
      StoreName: ord.StoreName,
      StoreID: ord.StoreID,
      BusinessID: this.http.getBusinessID(),
    };

    this.data.prepend(obj);
  }
  public AddOrder() {
    // this.sdetails.DiscRatio = parseFloat('0' +this.sdetails.DiscRatio);
    // this.sdetails.Bonus = parseFloat('0' + this.sdetails.Bonus);
    // this.sdetails.SchemeRatio = parseFloat('0' + this.sdetails.SchemeRatio);

    if (this.sdetails.Qty == 0) {
      this.myToaster.Error('Quantity not given!', 'error');
      return;
    }

    console.log(this.cmbStores.nativeElement);

    const selectedOption =
      this.cmbStores.nativeElement.options[
        this.cmbStores.nativeElement.selectedIndex
      ];
    this.sdetails.StoreName = selectedOption.text || '';

    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProduct.focus();
    this.sdetails = new PurchaseDetails();
  }

  ProductSelected(product) {
    this.selectedProduct = product;

    if (product) {
      console.log(product);
      this.sdetails.PPrice = product.PPrice;
      this.sdetails.SPrice = product.SPrice;
      this.sdetails.Packing = product.Packing;
      this.sdetails.ProductName = product.ProductName;
    }
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }
  public async SaveData() {
    this.isSaving = true;
    let InvoiceID = '';

    let res1 = await this.data.getAll();

    console.log(this.purchase);

    if (this.purchase.Bank > 0 && !this.purchase.BankID) {
      this.myToaster.Error('No Bank is selected', 'Save', 2);
      return;
    }

    if (this.purchase.VehicleNo == null || this.purchase.VehicleNo == '') {
      this.myToaster.Error('Invalid Vehicle No', 'Save', 2);
      return;
    }
    if (this.purchase.InvoiceNo == null || this.purchase.InvoiceNo == '') {
      this.myToaster.Error('Invalid Invoice No', 'Save', 2);
      return;
    }
    if (!this.fromPurchase.valid || res1.length == 0) {
      this.myToaster.Error('Invalid Data', 'Save', 2);
      return;
    }

    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.purchase.BusinessID = this.http.getBusinessID();
    this.purchase.ClosingID = this.http.getClosingID();

    this.purchase.Date = JSON2Date(this.purchase.Date);
    this.purchase.InvoiceDate = JSON2Date(this.purchase.InvoiceDate);
    this.purchase.UserID = this.http.getUserID();

    this.purchase.details = res1;
    this.http.postTask('purchase' + InvoiceID, this.purchase).then(
      (r: any) => {
        this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);

        this.PrintInvoice(r.id);

        if (this.EditID != '') {
          this.LoadInvoice();
        } else {
          this.NavigatorClicked({ Button: Buttons.Last });
        }



        this.isSaving = false;
      },
      (err) => {
        this.purchase.Date = GetDateJSON(new Date(getCurDate()));
        this.myToaster.Error('Error saving invoice', 'Error', 2);
        console.log(err);
      }
    );
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

  changel() {
    this.calculation();
  }
  public calculation() {
    this.data.getAll().then((d) => {
      this.purchase.Amount = d.reduce(
        (sum, item) => sum + Number(item.Amount),
        0
      );
    });
  }

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.purchase = new PurchaseModel();
    this.purchase.UserID = this.http.getUserID();
    this.sdetails = new PurchaseDetails();
    this.btnsave = false;
    this.isPosted = false;
    this.SelectCust = {};
  }

  SubmitOrder() {
    if (this.formSub.valid) {
      // Perform actions before submission if needed

      // Submit the form
      this.AddOrder();
    } else {
      // Handle form validation errors or display messages
      this.myToaster.Error('Invalid data', 'Error');
    }
  }

  customSearchFn(term: string, item) {
    return item.CustomerName.toLocaleLowerCase().includes(
      term.toLocaleLowerCase()
    );
  }

  NavigatorClicked(e) {
    let dt = GetDateJSON();
    let billNo = 1;
    switch (Number(e.Button)) {
      case Buttons.First:
        this.router.navigateByUrl('/purchase/invoice/' + billNo);
        break;
      case Buttons.Previous:
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.router.navigateByUrl('/purchase/invoice/' + billNo);
        break;
      case Buttons.Next:
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.router.navigateByUrl('/purchase/invoice/' + billNo);
        break;
      case Buttons.Last:
        this.http.getData('getbno/2').then((r: any) => {
          billNo = r.billno;
          console.log(r);

          this.router.navigateByUrl('/purchase/invoice/' + billNo);
        });
        break;
      default:
        break;
    }
    //this.router.navigateByUrl('/purchase/wholepurchase/' + billNo);
  }
  NewInvoice() {
    //this.Cancel();
    this.router.navigateByUrl('/purchase/invoice');
  }

  Clicked(e) {
    if (e.data) {
      this.router.navigateByUrl('/purchase/invoice/' + e.data.InvoiceID);
      this.searchTab.tabs[0].active = true;
    }
  }
  BeforeSave(e) {
    e.cancel = true;

    let filter = `Date between '${this.searchData.FromDate}' and '${this.searchData.ToDate}'`;
    if (this.searchData.CustomerID) {
      filter += ' And CustomerID = ' + this.searchData.CustomerID;
    }

    this.http.getData('qryinvoices?filter=' + filter).then((r) => {
      this.srchResult = r;
    });
  }
  ProductSearchFn(term: any, item) {
    if (term) {
      return (
        item.ProductName.toLocaleLowerCase().indexOf(
          term.toLocaleLowerCase()
        ) >= 0 || item.ProductID.indexOf(term) >= 0
      );
    } else {
      return false;
    }
  }

  PrintInvoice(InvoiceID) {
    // window.open('/#/print/printinvoice/' + InvoiceID, '_blank');
    this.http.PrintPurchaseInvoice(InvoiceID);
    return;
  }

  GetPrintData(data: any) {
    data.Business = this.http.GetBData();
    return data;
  }
  EditDisabled(lock: boolean): void {
    console.log('isposted:' + this.isPosted);
    // this.btnBar.DisableBtn(1, lock || this.isPosted);
    setTimeout(() => {
      this.btnLocked = lock;
    });

    this.settings.actions.edit = !this.isPosted && !this.btnLocked;
    this.settings.actions.delete = !this.isPosted && !this.btnLocked;
    this.settings = { ...this.settings };
  }
  ConfirmEdit(e) {
    console.log(e);

    alert('confirm edit');
  }

  EditInvoice() {
    this.EditDisabled(true);
    this.cmbAccts.focus();
  }
  CancelInvoice() {
    this.Cancel();
    if (this.EditID != '') {
      this.LoadInvoice();
    } else {
      this.NavigatorClicked({
        Button: Buttons.Last,
      });
    }
  }
  async NewCustomer() {
    await this.bsService.show(CustomersComponent, {
      class: 'modal-lg',
      backdrop: true,
      initialState: {
        EditID: '',
      },
    });

    this.getSuppliers(); // Refresh supplier list after adding new supplier
    this.cmbAccts.focus();
  }
}
