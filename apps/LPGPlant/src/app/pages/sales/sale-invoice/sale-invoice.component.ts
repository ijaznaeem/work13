import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
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
import { PrintBillService } from '../../../services/print-bill.service';
import { MyToastService } from '../../../services/toaster.server';
import { SaleDetails, SaleModel } from '../sale.model';
import { SaleSettings, SearchForm } from './sale.setting';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.scss'],
})
export class CashSaleComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('searchTab') searchTab: TabsetComponent;
  @ViewChild('gatepass') gpTmplt;
  @ViewChild('btnBar') btnBar: ButtonsBarComponent;

  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('formqty') formSub: NgForm;
  @ViewChild('qty') elQty: ElementRef;
  @ViewChild('cmbStores') cmbStores: NgSelectComponent;
  @ViewChild('cmbProduct') cmbProduct;
  @ViewChild('txtRate') txtRate;
  @ViewChild('txtRemarks') txtRemarks;
  @ViewChild('cmbCustomers') cmbAccts: NgSelectComponent;
  @ViewChild('scrollTop') scrollTop;

  SrchForm = SearchForm;
  searchData: any = {};
  SrchSttings = SaleSettings;
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
  sdetails = new SaleDetails();
  sale: any = new SaleModel();

  links = [
    {
      link: '/cash/cashreceipt',
      label: 'Cash Receipt',
    },
    {
      link: '/cash/cashpayment',
      label: 'Cash Payment',
    },
    {
      link: '/purchase/invoice/0',
      label: 'Purchase',
    },
    {
      link: '/reports/daybook',
      label: 'Daybook',
    },
  ];

  public settings = {
    selectMode: 'single', // single|multi
    hideHeader: false,
    hideSubHeader: true,
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
      deleteButtonContent: '<i class="fa fa-trash text-danger"></i>',
      confirmDelete: true,
    },
    noDataMessage: 'No data found',
    columns: {
      SNo: {
        title: 'S. No',
        type: 'text',
        valuePrepareFunction: (cell, row, index) => index.row.index + 1, // Adding 1 to start from 1
        filter: false, // Optional: Disable filtering for serial number
        sort: false, // Optional: Disable sorting for serial number
        editable: false,
      },

      ProductName: {
        editable: false,
        title: 'Product',
        width: '250px',
      },

      Qty: {
        title: 'Qty',
        editable: true,
      },

      SPrice: {
        title: 'Price',
        editable: true,
      },
      Amount: {
        editable: false,
        title: 'Amount',
      },
    },
    pager: {
      display: true,
      perPage: 50,
    },
  };
  Stores: Observable<any[]>;
  Stock: any = [];

  public Prods = [];
  public Accounts: any = [];
  public SelectCust: any = {};
  public LastPrice: any = {};
  public curStoreID: any = 0;
  public GPStoreID: 1;
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService,
    private bill: PrintBillService
  ) {}

  buttonConfigs: ButtonConfig[] = [
    {
      title: 'New',
      icon: 'fa fa-file',
      classes: 'btn-primary',
      action: () => this.NewInvoice(),
    },
    {
      title: 'Edit',
      icon: 'fa fa-pencil',
      classes: 'btn-secondary',
      action: () => this.EditInvoice(),
      disabled: false,
    },
    {
      title: 'Print',
      icon: 'fa fa-print',
      classes: 'btn-warning',
      action: () => this.PrintInvoice(this.EditID),
    },
    {
      title: 'Gatepass',
      icon: 'fa fa-print',
      classes: 'btn-danger',
      action: () => this.OpenGatepass(this.gpTmplt),
    },
  ];
  btnSave: ButtonConfig[] = [
    {
      title: 'Save',
      icon: 'fa fa-save',
      classes: 'btn-success',
      action: () => this.SaveData(),
      type: 'button',
    },
    {
      title: 'Cancel',
      icon: 'fa fa-refresh',
      classes: 'btn-warning',
      action: () => this.CancelInvoice(),
    },
  ];

  ngOnInit() {
    this.btnLocked = false;

    this.Stores = this.cachedData.Stores$;
    this.Cancel();
    this.getCustomers('');
    this.http.getProducts().then((r: any) => {
      this.Stock = r;
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
  FindINo() {
    this.router.navigate(['/sale/invoice/', this.Ino]);
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
      this.http.getData('invoices/' + this.EditID).then((r: any) => {
        if (!r) {
          this.myToaster.Warning('Invalid Invoice No', 'Edit', 1);
          this.router.navigateByUrl('sale/invoice');
          return;
        }
        if (r.IsPosted == '1') {
          // this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
          this.isPosted = true;
        } else {
          this.isPosted = false;
        }
        this.EditDisabled(false);
        this.sale = r;
        this.sale.Date = GetDateJSON(new Date(r.Date));

        this.http
          .getData(
            'qryinvoicedetails?orderby=DetailID desc&filter=invoiceid=' +
              this.EditID
          )
          .then((rdet: any) => {
            this.data.empty();

            for (const det of rdet) {
              const {
                ProductID,
                ProductName,
                Qty,
                SPrice,
                PPrice,
                Packing,
                UnitValue,
                Weight,
              } = det;
              // Create new object with selected properties
              this.AddToDetails({
                ProductID,
                ProductName,
                Qty,
                SPrice,
                PPrice,
                Packing,
                UnitValue,
                Weight,
              });
            }
            this.calculation();
          });
      });
    }
  }

  getCustomers(routeid) {
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
      this.sale.CustomerName = this.SelectCust.CustomerName;
    }
  }

  AddToDetails(ord: any) {
    const tQty = parseFloat('0' + ord.Qty) * parseFloat(ord.Packing);

    // console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      PPrice: parseFloat('0' + ord.PPrice),
      SPrice: parseFloat('0' + ord.SPrice),
      Qty: parseFloat(ord.Qty),
      Amount: RoundTo2(((ord.SPrice * tQty) * ord.Weight) / ord.UnitValue),
      UnitValue: ord.UnitValue,
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      Packing: ord.Packing,
      BusinessID: this.http.getBusinessID(),
      NetAmount: RoundTo2(ord.SPrice * tQty * ord.Weight / ord.UnitValue),
    };

    this.data.prepend(obj);
  }
  public AddOrder() {
    // this.sdetails.DiscRatio = parseFloat('0' +this.sdetails.DiscRatio);
    // this.sdetails.Bonus = parseFloat('0' + this.sdetails.Bonus);
    // this.sdetails.SchemeRatio = parseFloat('0' + this.sdetails.SchemeRatio);

    if (this.sdetails.SPrice * 1 < this.selectedProduct.PPrice * 1) {
      this.myToaster.Warning('Check sale rate', 'Warning', 2);
    }
    console.log(this.sdetails);

    if (
      this.sdetails.Qty * this.sdetails.Packing * 1 >
      this.selectedProduct.Stock
    ) {
      this.myToaster.Warning('stock not enough!', 'warning');
      return;
    }

    if (Number('0' + this.sdetails.Qty) * this.sdetails.Packing == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }

    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProduct.focus();

    this.sdetails = new SaleDetails();

    // this.sdetails.StoreName = this.cmbStores.selectedItems()
  }

  ProductSelected(product) {
    this.selectedProduct = product;

    if (product) {
      console.log(product);
      this.sdetails.PPrice = product.PPrice;
      this.sdetails.SPrice = product.SPrice;
      this.sdetails.Packing = product.Packing;
      this.sdetails.UnitValue = product.UnitValue;
      this.sdetails.Weight = product.Weight;
      this.sdetails.ProductName = product.ProductName;
    }
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }
  public async SaveData(print = 0) {
    this.isSaving = true;
    let InvoiceID = '';
    // if (this.sale.CustomerID)

    let res1 = await this.data.getAll();
    if (!this.fromPurchase.valid || res1.length == 0) {
      this.myToaster.Error('Invalid Data', 'Save', 2);
      return;
    }
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.sale.BusinessID = this.http.getBusinessID();
    this.sale.ClosingID = this.http.getClosingID();

    this.sale.Time = this.getTime(new Date());
    this.sale.Date = JSON2Date(this.sale.Date);
    this.sale.UserID = this.http.getUserID();

    let i = 0;
    console.log(res1);

    this.sale.details = res1;
    this.http.postTask('sale' + InvoiceID, this.sale).then(
      (r: any) => {
        this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);

        if (this.EditID != '') {
          this.LoadInvoice();
        } else {
          this.NavigatorClicked({ Button: Buttons.Last });
        }

        // this.PrintInvoice(this.EditID)

        this.isSaving = false;
      },
      (err) => {
        this.sale.Date = GetDateJSON(new Date(getCurDate()));
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
    event.newData.Amount =
      ((event.newData.Qty * event.newData.Packing + 1 * event.newData.KGs) *
        event.newData.SPrice) /
      event.newData.UnitValue;
    event.newData.LabourAmount = event.newData.Qty * event.newData.Labour;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  CashInvoice(e) {
    this.sale.AmntRecvd = this.sale.NetAmount;
  }
  changel() {
    this.calculation();
  }
  public calculation() {
    this.sale.Amount = 0;
    this.sale.Labour = 0;

    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.sale.Amount += d[i].Amount * 1;
        this.sale.Labour += d[i].Qty * d[i].Labour;
      }
    });
  }

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.sale = new SaleModel();
    this.sale.UserID = this.http.getUserID();

    this.sdetails = new SaleDetails();

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
    let billNo = 5225210;
    switch (Number(e.Button)) {
      case Buttons.First:
        this.router.navigateByUrl('/sale/invoice/' + billNo);
        break;
      case Buttons.Previous:
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.router.navigateByUrl('/sale/invoice/' + billNo);
        break;
      case Buttons.Next:
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.router.navigateByUrl('/sale/invoice/' + billNo);
        break;
      case Buttons.Last:
        this.http.getData('getbno/1/' + getCurDate()).then((r: any) => {
          billNo = r.billno;
          console.log(r);

          this.router.navigateByUrl('/sale/invoice/' + billNo);
        });
        break;
      default:
        break;
    }
    //this.router.navigateByUrl('/sale/wholesale/' + billNo);
  }
  NewInvoice() {
    //this.Cancel();
    this.router.navigateByUrl('/sale/invoice');
  }

  Clicked(e) {
    if (e.data) {
      this.router.navigateByUrl('/sale/invoice/' + e.data.InvoiceID);
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
    return (
      item.ProductName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) >=
      0
    );
  }
  PrintInvoice(InvoiceID) {
    // window.open('/#/print/printinvoice/' + InvoiceID, '_blank');
    this.http.PrintSaleInvoice(InvoiceID);
    return;
  }

  async scrapData() {
    let data = await this.http.getData('printbill/' + this.EditID);
    data = this.GetPrintData(data);
    this.bill.PrintPDFBill_A5(data);
    // this.bill.PrintUrduBill()
  }
  async OpenGatepass(template: TemplateRef<void>) {
    try {
      let store = await this.http.Printgatepass();
      this.http.PrintSaleGatePass(this.EditID, store);
    } catch (error) {}
  }

  GetPrintData(data: any) {
    data.Business = this.http.GetBData();
    return data;
  }
  EditDisabled(lock: boolean): void {
    console.log('isposted:' + this.isPosted);
    // this.btnBar.DisableBtn(1, lock || this.isPosted);
    this.btnLocked = lock;
    this.settings.actions.edit = !this.isPosted && this.btnLocked;
    this.settings.actions.delete = !this.isPosted && this.btnLocked;
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
  formatNumber() {
    this.sale.Amount = this.sale.Amount.replace(/,/g, ''); // Remove previous commas
    if (!isNaN(Number(this.sale.Amount))) {
      this.sale.Amount = new Intl.NumberFormat('en-US').format(
        Number(this.sale.Amount)
      );
    }
  }
}
