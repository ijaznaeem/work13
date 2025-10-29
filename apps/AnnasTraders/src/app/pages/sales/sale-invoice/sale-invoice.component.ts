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
import Swal from 'sweetalert2';
import {
  ButtonConfig,
  ButtonsBarComponent,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/buttons-bar/buttons-bar.component';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
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
      StoreName: {
        editable: false,
        title: 'Store',
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
      Packing: {
        title: 'Packing',
        editable: true,
      },
      KGs: {
        title: 'Kgs',
        editable: true,
      },
      Labour: {
        title: 'Labour',
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
  Stores: Observable<any[]> ;
  Stock: any = [];

  public Prods = [];
  public Accounts: any = [];
  public SelectCust: any = {};
  public LastPrice: any = {};

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
      disabled: true,
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
    this.onTabSelect();

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
          this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
          this.isPosted = true;
        } else {
          this.isPosted = false;
        }
        this.EditDisabled(false);
        this.sale = r;
        this.sale.Date = GetDateJSON(new Date(r.Date));

        this.http
          .getData('qryinvoicedetails?orderby=DetailID desc&filter=invoiceid=' + this.EditID)
          .then((rdet: any) => {
            this.data.empty();

            for (const det of rdet) {
              const {
                ProductID,
                ProductName,
                Qty,
                KGs,
                Pending,
                SPrice,
                PPrice,
                StockID,
                Labour,
                Packing,
                StoreID,
                StoreName,
                UnitValue,
              } = det;
              // Create new object with selected properties
              this.AddToDetails({
                ProductID,
                ProductName,
                Qty,
                KGs,
                Pending,
                SPrice,
                PPrice,
                StockID,
                Labour,
                Packing,
                StoreID,
                StoreName,
                UnitValue,
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

  StoreSelected(e) {
    if (e) {
      this.http.getStock(e.StoreID).then((r) => {
        this.Stock = r;
        this.sdetails.StoreName = e.StoreName;
      });
    }
  }
  AddToDetails(ord: any) {
    const tQty =
      parseFloat('0' + ord.Qty) * parseFloat(ord.Packing) + parseFloat(ord.KGs);

    // console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      StoreName: ord.StoreName,
      PPrice: parseFloat('0' + ord.PPrice),
      SPrice: parseFloat('0' + ord.SPrice),
      Qty: parseFloat(ord.Qty),
      KGs: parseFloat(ord.KGs),
      Pending: parseFloat(ord.Pending),
      Amount: RoundTo2(ord.SPrice * tQty) / ord.UnitValue,
      Labour: ord.Labour,
      UnitValue: ord.UnitValue,
      LabourAmount: ord.Labour * tQty,
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      Packing: ord.Packing,
      StoreID: ord.StoreID,
      BusinessID: this.http.getBusinessID(),
      NetAmount: RoundTo2(ord.SPrice * tQty),
    };

    this.data.prepend(obj);
  }
  public AddOrder() {
    // this.sdetails.DiscRatio = parseFloat('0' +this.sdetails.DiscRatio);
    // this.sdetails.Bonus = parseFloat('0' + this.sdetails.Bonus);
    // this.sdetails.SchemeRatio = parseFloat('0' + this.sdetails.SchemeRatio);

    if (this.sdetails.SPrice * 1 < this.selectedProduct.PPrice * 1) {
      Swal.fire({
        text: 'Invalid sale rate',
        icon: 'warning',
      });
      return;
    }
    console.log(this.sdetails);

    if (
      this.sdetails.Qty * this.sdetails.Packing + this.sdetails.KGs >
      this.selectedProduct.Stock
    ) {
      this.myToaster.Warning('low stock warning!', 'warning');
    }

    if (
      Number('0' + this.sdetails.Qty) * this.sdetails.Packing +
        this.sdetails.KGs ==
      0
    ) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }

    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProduct.focus();
    let strID = this.sdetails.StoreID;
    let strName = this.sdetails.StoreID;
    this.sdetails = new SaleDetails();
    this.sdetails.StoreID = strID;
    this.sdetails.StoreName = strName;
    // this.sdetails.StoreName = this.cmbStores.selectedItems()
  }

  ProductSelected(product) {
    //this.selectedProduct = product;

    if (product) {
      console.log(product);
      this.sdetails.PPrice = product.PPrice;
      this.sdetails.SPrice = product.SPrice;
      this.sdetails.Packing = product.Packing;
      this.sdetails.UnitValue = product.UnitValue;
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
    this.http.getData('getbno/1/' + getCurDate()).then((r: any) => {
      this.sale.InvoiceID = Number(r.billno) + 1;
    });

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
    let billNo: any =
      dt.year.toString().slice(2) +
      dt.month.toString().padStart(2, '0') +
      '00001';
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

  onTabSelect() {
    this.searchData.FromDate = GetDate();
    this.searchData.ToDate = GetDate();
    this.searchData.CustomerID = '';
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
    if (isNaN(term)) {
      return (
        item.ProductName.toLocaleLowerCase().indexOf(
          term.toLocaleLowerCase()
        ) >= 0
      );
    } else return item.ProductID == term;
  }
  async PrintInvoice(InvoiceID) {
    // window.open('/#/print/printinvoice/' + InvoiceID, '_blank');
    window.open('/#/print/printinvoice/' + InvoiceID, "_blank", "toolbar=1, scrollbars=1, resizable=1, width=" + 1015 + ", height=" + 800)
    return;
  }

  async scrapData() {
    let data = await this.http.getData('printbill/' + this.EditID);
    data = this.GetPrintData(data);
    this.bill.PrintPDFBill_A5(data);
    // this.bill.PrintUrduBill()
  }
  async OpenGatepass(template: TemplateRef<void>) {
    let store = await this.http.Printgatepass();
    let dd: any = await this.http.getData(
      `getgatepass/${this.EditID}/${store}`
    );

    window.open('/#/print/gatepass/' + this.EditID + '/' + store, "_blank", "toolbar=1, scrollbars=1, resizable=1, width=" + 1015 + ", height=" + 800);

  }

  GetPrintData(data: any) {
    data.Business = this.http.GetBData();
    return data;
  }
  EditDisabled(lock: boolean): void {
    console.log('isposted:' + this.isPosted);
    this.btnBar.DisableBtn(1, lock || this.isPosted);
    this.btnLocked = lock;
    this.settings.actions.edit = (!this.isPosted &&  this.btnLocked);
    this.settings.actions.delete = (!this.isPosted &&  this.btnLocked);
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
}
