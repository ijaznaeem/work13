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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import swal from 'sweetalert';

import { ChangeDetectorRef } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
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
  RoundTo,
  RoundTo2,
  getCurDate,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { MyToastService } from '../../../services/toaster.server';
import { PrintGatepassComponent } from '../../print/print-gate-pass/print-gatepass.component';
import { ThermalInvoiceComponent } from '../../print/print-thermal/thermal-invoice.component';
import { SaleDetails, SaleModel } from './sale.model';
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
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('formqty') formSub: NgForm;
  @ViewChild('qty') elQty: ElementRef;
  @ViewChild('cmbStores') cmbStores: NgSelectComponent;
  @ViewChild('cmbProduct') cmbProduct;
  @ViewChild('txtRate') txtRate;

  @ViewChild('cmbCustomers') cmbAccts: NgSelectComponent;
  @ViewChild('scrollTop') scrollTop;
  @ViewChild('txtPhoneNo') txtPhoneNo: ElementRef;

  SrchForm = SearchForm;
  searchData: any = {};
  SrchSttings = SaleSettings;
  srchResult: any = [];
  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public ReturnID = '';
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

      Remarks: {
        title: 'Remarks',
        editable: true,
      },
      Qty: {
        title: 'Qty',
        editable: true,
      },
      Packing: {
        title: 'Size',
        editable: true,
      },
      KGs: {
        title: 'Units',
        editable: true,
      },

      SPrice: {
        title: 'Rate/Feet',
        editable: true,
      },
      Weight: {
        title: 'Weight',
        editable: true,
      },
      WPrice: {
        title: 'Rate/KG',
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
  Stores: any = [];
  Stock: any = [];
  Banks: any = [];

  public Prods = [];
  public Accounts: any = [];
  public SelectCust: any = {};
  public LastPrice: any = {};
  public Transporters: any = [];
  public curCustomerID = '';
  public GPStoreID = 1;

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService,
    private bill: PrintBillService,
    private cdr: ChangeDetectorRef
  ) {
    this.Stores = this.cachedData.Stores$;
  }

  buttonConfigs: ButtonConfig[] = [
    {
      title: 'New',
      icon: 'fa fa-file',
      classes: 'btn-primary',
      action: () => this.NewInvoice(),
       shortcut: 'n',
    },
    {
      title: 'Edit',
      icon: 'fa fa-pencil',
      classes: 'btn-secondary',
      action: () => this.EditInvoice(),
      disabled: true,
      shortcut: 'z',
    },
    {
      title: 'Print',
      icon: 'fa fa-print',
      classes: 'btn-warning',
      action: () => this.PrintInvoice(this.EditID),
    },
    {
      title: 'Print Th',
      icon: 'fa fa-print',
      classes: 'btn-warning',
      action: () => this.PrintThermal(this.EditID),
      shortcut: 'p',
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
      action: () => this.SaveData(1),
      type: 'button',
      shortcut: 's',
    },
    {
      title: 'Cancel',
      icon: 'fa fa-refresh',
      classes: 'btn-warning',
      action: () => this.CancelInvoice(),
       shortcut: 'c',
    },
  ];

  async ngOnInit() {
    this.btnLocked = false;

    this.Cancel();
    this.getCustomers('');
    this.http.getBanks('Bank').then((res: any) => {
      this.Banks = res;
    });
    this.LoadTransporters();
    this.Stock = await this.http.getData('getstock');
    this.onTabSelect();

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        if (this.EditID == '0') {
          this.NavigatorClicked({ Button: Buttons.Last });
        } else {
          this.LoadInvoice(this.EditID);
        }
      }
    });
  }
  async GetStores(ProductID) {
    if (ProductID) {
      this.Stores = await this.http.getData(
        'qrystock?flds=StoreID,StoreName,Stock&filter=ProductID=' + ProductID
      );
    }
  }
  ProductSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    if (!(item.ProductName == null || item.PCode == null)) {
      return (
        item.ProductName.toLowerCase().includes(term) ||
        item.PCode.toLowerCase().includes(term)
      );
    }

    return false;
  }
  ngAfterViewInit(): void {
    if (this.EditID === '') {
      this.EditDisabled(true);
    } else {
      this.EditDisabled(false);
      setTimeout(() => {
        this.cmbAccts.focus();
        this.cdr.detectChanges(); // Manually trigger change detection
      }, 5000);
    }
  }
  FindINo() {
    this.router.navigate(['/sale/invoice/', this.Ino]);
  }
  FindReturn(InvoiceNo) {
    this.http.getData('invoices/' + InvoiceNo).then((r: any) => {
      if (!r) {
        this.myToaster.Warning('Invalid Invoice No', 'Return', 1);
        return;
      }
      this.sale = r;
      this.sale.Date = GetDateJSON(new Date(r.Date));
      this.sale.DtCr = 'DT';
      this.sale.IsPosted = '0';
      this.http
        .getData(
          'qryinvoicedetails?orderby=DetailID DESC&filter=invoiceid=' +
            InvoiceNo
        )
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
              UnitID,
              WPrice,
              Weight,
              Remarks,
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
              UnitID,
              WPrice,
              Weight,
              Remarks,
            });
          }
          this.calculation();
        });
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadInvoice(this.EditID);
    }
  }
  LoadInvoice(InvoiceNo) {
    if (InvoiceNo && InvoiceNo !== '') {
      console.log('loadinvoice', InvoiceNo);
      this.Ino = InvoiceNo;
      this.http.getData('invoices/' + InvoiceNo).then((r: any) => {
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
        this.curCustomerID = r.CustomerID;
        const customer = this.Accounts.find((c) => {
          return this.sale.CustomerID == c.CustomerID;
        });
        if (customer) this.CustomerSelected(customer);

        this.sale.Date = GetDateJSON(new Date(r.Date));
        console.log(this.sale);

        this.http
          .getData(
            'qryinvoicedetails?orderby=DetailID DESC&filter=invoiceid=' +
              InvoiceNo
          )
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
                UnitID,
                WPrice,
                Weight,
                Remarks,
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
                Remarks,
                UnitValue,
                UnitID,
                WPrice,
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
    if (event) {
      if (event.CustomerName.includes('Cash Sale')) {
        this.sale.PrevBalance = 0;
      } else if (this.curCustomerID != event.CustomerID) {
        this.sale.PrevBalance = event.CBalance;
      }

      this.sale.CustomerName = event.CustomerName;
      this.SelectCust = event;
    }
  }

  async StoreSelected(e) {
    if (e) {
      let product: any = await this.http.getData(
        'qrystock?filter=ProductID=' +
          this.sdetails.ProductID +
          ' and StoreID = ' +
          e.StoreID
      );
      if (product.length > 0) {
        this.selectedProduct = product[0];
        this.sdetails.PPrice = this.selectedProduct.PPrice;
        this.sdetails.SPrice = this.selectedProduct.SPrice;
        this.sdetails.Packing = this.selectedProduct.Packing;
        this.sdetails.UnitValue = this.selectedProduct.UnitValue;
        this.sdetails.UnitID = this.selectedProduct.UnitID;
        this.sdetails.ProductName = this.selectedProduct.ProductName;

        if (this.selectedProduct.UnitID == '1') {
          this.sdetails.WPrice = this.sdetails.SPrice;
          this.sdetails.SPrice = 0;
        }
      }
    }
  }
  AddToDetails(ord: any) {
    const tQty =
      parseFloat('0' + ord.Qty) * parseFloat(ord.Packing) + parseFloat(ord.KGs);

    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      StoreName: ord.StoreName,
      Remarks: ord.Remarks,
      PPrice: parseFloat('0' + ord.PPrice),
      SPrice: parseFloat('0' + ord.SPrice),
      Qty: parseFloat(ord.Qty),
      KGs: parseFloat(ord.KGs),
      Pending: parseFloat(ord.Pending),
      Weight: parseFloat(ord.Weight),
      WPrice: parseFloat(ord.WPrice),
      Amount: RoundTo2(
        ord.UnitID == '1'
          ? ord.WPrice * ord.Weight
          : (ord.SPrice * tQty) / ord.UnitValue
      ),
      Labour: ord.Labour,
      UnitValue: ord.UnitValue,
      UnitID: ord.UnitID,
      LabourAmount: ord.Labour * tQty,
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      Packing: ord.Packing,
      StoreID: ord.StoreID,
      BusinessID: this.http.getBusinessID(),
      NetAmount: RoundTo2(ord.SPrice * tQty),
    };

    this.data.add(obj);
    this.data.refresh();
    this.sdetails.StoreID = '';
    setTimeout(() => this.scrollToLastRow(), 0);
  }
  public AddOrder() {
    // this.sdetails.DiscRatio = parseFloat('0' +this.sdetails.DiscRatio);
    // this.sdetails.Bonus = parseFloat('0' + this.sdetails.Bonus);
    // this.sdetails.SchemeRatio = parseFloat('0' + this.sdetails.SchemeRatio);

    if (!this.btnLocked) return;

    if (Number(this.sdetails.Packing) == 0 || this.sdetails.Packing == null)
      this.sdetails.Packing = 1;

    console.log(this.sdetails);

    if (
      this.sdetails.Qty * this.sdetails.Packing + 1 * this.sdetails.KGs >
      this.selectedProduct.Stock
    ) {
      this.myToaster.Warning('low stock warning!', 'Error');
    }

    if (
      Number('0' + this.sdetails.Qty) * this.sdetails.Packing +
        this.sdetails.KGs ==
      0
    ) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }

    if (this.sdetails.SPrice == 0 && this.sdetails.WPrice == 0) {
      Swal.fire('Invalid Rate').then(() => {
        this.elQty.nativeElement.focus();
      });
      return;
    }
    if (this.sdetails.Weight == 0 || this.sdetails.Weight == null) {
      this.sdetails.Weight =
        (this.sdetails.Qty + this.sdetails.KGs / this.sdetails.Packing) *
        this.selectedProduct.Weight;
    }

    if (this.sdetails.WPrice == 0 || this.sdetails.WPrice == null) {
      if (this.selectedProduct.Weight == 0) {
        this.sdetails.WPrice = 0;
      } else {
        this.sdetails.WPrice = RoundTo(
          this.GetAmount() /
            ((this.sdetails.Qty + this.sdetails.KGs / this.sdetails.Packing) *
              (this.selectedProduct.Weight == 0
                ? 1
                : this.selectedProduct.Weight) *
              this.sdetails.UnitValue),
          4
        );
      }
    }
    if ((this.sdetails.SPrice ?? 0) == 0) {
      console.log(this.GetAmount());
      console.log(
        this.sdetails.Qty * this.sdetails.Packing + this.sdetails.KGs
      );

      this.sdetails.SPrice = RoundTo(
        this.GetAmount() /
          (this.sdetails.Qty * this.sdetails.Packing + this.sdetails.KGs * 1),
        4
      );
    }

    if (this.sdetails.Remarks == undefined) this.sdetails.Remarks = '';

    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProduct.focus();
    let strName = this.sdetails.StoreID;
    this.sdetails = new SaleDetails();
    this.sdetails.StoreID = '';
    this.sdetails.StoreName = '';
    // this.sdetails.StoreName = this.cmbStores.selectedItems()
  }

  async ProductSelected(product) {
    this.sdetails.StoreID = null;
    if (product) {
      // this.selectedProduct = product;
      this.Stores = [];
      await this.GetStores(product.ProductID);

      // this.sdetails.PPrice = product.PPrice;
      // this.sdetails.SPrice = product.SPrice;
      // this.sdetails.Packing = product.Packing;
      // this.sdetails.UnitValue = product.UnitValue;
      // this.sdetails.ProductName = product.ProductName;
      // if (this.selectedProduct.UnitID == 1) {
      //   this.sdetails.WPrice = this.sdetails.SPrice;
      //   this.sdetails.SPrice = 0;
      // }
    } else {
      this.selectedProduct = {};
    }
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }
  public async SaveData(print = 0) {
    this.isSaving = true;
    let InvoiceID = '';
    if (this.sale.CustomerID == null || isNaN(this.sale.CustomerID)) {
      let yes = await swal({
        text: 'Add this Customer To record',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      });
      if (yes) {
        let customer: any = await this.http.postData('customers', {
          CustomerName: this.sale.CustomerID,
          PhoneNo1: this.txtPhoneNo.nativeElement.value,
          AcctTypeID: '1',
          Status: 1,
        });
        console.log(customer);
        this.sale.CustomerID = customer.CustomerID;
      } else {
        alert('No');
      }
      return;
    }

    if (
      this.sale.DeliveryCharges > 0 &&
      (this.sale.TransporterID == '' || this.sale.TransporterID == null)
    ) {
      swal({ text: 'No Transport is selected', icon: 'error' });
      return;
    }

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
        this.EditDisabled(false);
        if (this.EditID != '') {
          this.sale.Date = GetDateJSON(new Date(getCurDate()));
          this.router.navigateByUrl('/sale/invoice/' + this.EditID);
        } else {
          this.router.navigateByUrl('/sale/invoice/' + r.id);
        }
        this.curCustomerID = '';
        this.isSaving = false;
      },
      (err) => {
        this.sale.Date = GetDateJSON(new Date(getCurDate()));
        this.myToaster.Error(err.error.message, 'Save', 2);
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
    if (event.newData.UnitID == '1') {
      event.newData.Amount = event.newData.WPrice * event.newData.Weight;
    } else {
      event.newData.Amount =
        ((event.newData.Qty * event.newData.Packing + 1 * event.newData.KGs) *
          event.newData.SPrice) /
        event.newData.UnitValue;
    }
    event.newData.Amount = RoundTo(event.newData.Amount, 2);

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 200);
  }

  CashInvoice(e) {
    this.sale.AmntRecvd = this.sale.NetAmount;
  }
  changel() {
    this.calculation();
  }
  public calculation() {
    this.sale.Amount = 0;
    this.sale.TotalWeight = 0;

    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.sale.Amount += d[i].Amount * 1;
        this.sale.TotalWeight += d[i].Weight * 1;
      }
      this.sale.Amount = RoundTo(this.sale.Amount, 2);
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
    console.log(item);

    term = term.toLowerCase();
    if (!(item.CustomerName == null || item.PhoneNo1 == null)) {
      return (
        item.CustomerName.toLowerCase().includes(term) ||
        item.PhoneNo1.includes(term)
      );
    }

    return false;
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

  async PrintInvoice(InvoiceID) {
    // const initialState: any = {
    //   initialState: {
    //     InvoiceID: InvoiceID,
    //   },
    //   class: 'modal-lg',

    //   ignoreBackdropClick: false,
    // };

    // this.modalService.show(CreditInvoiceComponent, initialState);
    // this.modalService.onHide.subscribe((reason: string) => {
    //   const _reason = reason ? `, dismissed by ${reason}` : '';
    // });

    window.open(
      '/#/print/printinvoice/' + InvoiceID,
      '_blank',
      'toolbar=1, scrollbars=1, resizable=1, width=' + 600 + ', height=' + 800
    );
    return;
  }
  async PrintThermal(InvoiceID) {
    const initialState: any = {
      initialState: {
        InvoiceID: InvoiceID,
      },
      class: 'modal-sm',

      ignoreBackdropClick: false,
    };

    this.modalService.show(ThermalInvoiceComponent, initialState);
    this.modalService.onHide.subscribe((reason: string) => {
      const _reason = reason ? `, dismissed by ${reason}` : '';
    });

    // window.open('/#/print/printinvoice/' + InvoiceID, '_blank');
    // window.open(
    //   '/#/print/printthermal/' + InvoiceID,
    //   '_blank',
    //   'toolbar=1, scrollbars=1, resizable=1, width=' + 400 + ', height=' + 600
    // );
    // return;
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
    const initialState: any = {
      initialState: {
        InvoiceID: this.EditID,
        StoreID: store,
      },
      class: 'modal-sm',

      ignoreBackdropClick: false,
    };

    this.modalService.show(PrintGatepassComponent, initialState);
    this.modalService.onHide.subscribe((reason: string) => {
      const _reason = reason ? `, dismissed by ${reason}` : '';
    });
  }

  GetPrintData(data: any) {
    data.Business = this.http.GetBData();
    return data;
  }
  EditDisabled(lock: boolean): void {
    console.log('isposted:' + this.isPosted);
    this.btnBar.DisableBtn(1, lock || this.isPosted);
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
      this.LoadInvoice(this.EditID);
    } else {
      this.NavigatorClicked({
        Button: Buttons.Last,
      });
    }
  }
  FindPhoneNo(e) {
    console.log(this.Accounts);
    let c = this.Accounts.find((x) => {
      console.log(x.PhoneNo1);
      if (x.PhoneNo1) return x.PhoneNo1.includes(e.target.value);
      else return false;
    });
    console.log(c);

    if (c) {
      this.sale.CustomerID = c.CustomerID;
      this.CustomerSelected(c);
    } else {
      this.sale.CustomerID = '';
    }
  }
  async LoadTransporters() {
    this.Transporters = await this.http.getData(
      "qrycustomers?filter=AcctType like '%transporter%'"
    );
  }
  async PrintEstimate() {
    this.calculation();
    let data: any = { ...this.sale };
    data.CustomerName = this.Accounts.find((c) => {
      return (this.sale.CustomerID = c.CustomerID);
    });

    data['details'] = await this.data.getAll();
    data = this.GetPrintData(data);
    this.http.SetPrintData(data);
    window.open(
      '/#/print/print-estimate/',
      '_blank',
      'toolbar=1, scrollbars=1, resizable=1, width=' + 1015 + ', height=' + 800
    );
  }
  RoundTo(n, d) {
    return RoundTo(n, d);
  }

  GetAmount() {
    return this.sdetails.WPrice == 0 || this.sdetails.WPrice == null
      ? (this.sdetails.Qty + this.sdetails.KGs / this.sdetails.Packing) *
          this.sdetails.SPrice *
          this.sdetails.Packing
      : this.selectedProduct.Weight *
          ((this.sdetails.Qty + this.sdetails.KGs / this.sdetails.Packing) *
            this.sdetails.WPrice);
  }
  GetTWeight() {
    return 2;
  }

  private scrollToLastRow() {
    const container: HTMLElement = this.tableContainer.nativeElement;
    const rows = container.querySelectorAll('tbody tr');
    if (!rows || rows.length === 0) return;
    const last = rows[rows.length - 1] as HTMLElement;
    last.scrollIntoView({ behavior: 'smooth', block: 'end' });
    // fallback: container.scrollTop = container.scrollHeight;
  }
}
