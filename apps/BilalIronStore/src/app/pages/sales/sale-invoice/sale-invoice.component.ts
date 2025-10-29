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

import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import {
  ButtonConfig,
  ButtonsBarComponent,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/buttons-bar/buttons-bar.component';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import { InvoiceTypes } from '../../../factories/constants';
import {
  getCurDate,
  GetDateJSON,
  JSON2Date,
  RoundTo2,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { MyToastService } from '../../../services/toaster.server';

import { CustomersComponent } from '../../accounts/customers/customers.component';
import { SaleDetails, SaleModel } from './sale-invoice.setting';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.scss'],
})
export class SaleInvoiceComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('searchTab') searchTab: TabsetComponent;
  @ViewChild('gatepass') gpTmplt;
  @ViewChild('btnBar') btnBar: ButtonsBarComponent;

  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('formqty') formSub: NgForm;
  @ViewChild('qty') elQty: ElementRef;
  @ViewChild('cmbStores') cmbStores;
  @ViewChild('cmbProduct') cmbProduct;
  @ViewChild('txtRate') txtRate;
  @ViewChild('txtRemarks') txtRemarks;
  @ViewChild('cmbCustomers') cmbAccts: NgSelectComponent;
  @ViewChild('scrollTop') scrollTop;

  searchData: any = {};
  srchResult: any = [];
  storeList: any = [];
  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public OrderNo = '';
  public btnsave = false;
  public isPosted = false;
  public isSaving = false;
  public btnLocked = true;
  public InvTypes = InvoiceTypes;
  public bsModalRef?: BsModalRef;
  sdetails = new SaleDetails();
  sale = new SaleModel();

  public settings = {
    selectMode: 'single',
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
        valuePrepareFunction: (cell, row, index) => index.row.index + 1,
        filter: false,
        sort: false,
        editable: false,
      },
      StoreID: {
        editable: true,
        title: 'Store',
        width: '150px',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select Store',
            list: this.storeList,
          },
        },
        valuePrepareFunction: (cell) => {
          const store = this.storeList.find((s: any) => s.value === cell);
          return store ? store.title : cell;
        },
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
  Stock: any = [];
  Banks: any = [];

  public Prods: Observable<any>;
  public Accounts: any = [];
  public Transporters: any = [];
  public SelectCust: any = {};
  public LastPrice: any = {};
  public curStoreID: any = 0;
  public GPStoreID: 1;
  Stores: any = [];
  CustCats: Observable<unknown>;
  heldInvoices: number;
  heldInvoicesCount: number = 0;
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService,
    private bill: PrintBillService,
    private bsService: BsModalService
  ) {
    this.CustCats = this.cachedData.CustCats$;
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
    {
      title: 'Thermal',
      icon: 'fa fa-print',
      classes: 'btn-warning',
      action: () => this.PrintThermalInvoice(this.EditID),

      size: 'lg',
    },
  ];
  btnSave: ButtonConfig[] = [
    {
      title: '  Save  ',
      icon: 'fa fa-save',
      classes: 'btn-success',
      action: () => this.SaveData(),
      type: 'button',
      size: 'lg',
    },
  ];
  btnCancel: ButtonConfig[] = [
    {
      title: 'Cancel',
      icon: 'fa fa-refresh',
      classes: 'btn-warning',
      action: () => this.CancelInvoice(),
      size: 'lg',
    },
  ];

  async ngOnInit() {
    this.btnLocked = false;
    this.Banks = await this.http.getAccountsByType('Bank');
    this.Transporters = await this.http.getAccountsByType('Transporter');
    this.Stock = await this.http.getProducts(0);

    this.Cancel();
    this.loadHeldInvoicesCount();

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
    setTimeout(() => {
      if (this.EditID == '') this.EditDisabled(true);
      else this.EditDisabled(false);
      this.cmbAccts.focus();
    }, 500);
  }

  async StoreSelected(e) {
    if (e.target.value || e.target.value != '') {
      let product: any = await this.http.getData(
        'qrystock?filter=ProductID=' +
          this.sdetails.ProductID +
          ' and StoreID = ' +
          e.target.value
      );
      if (product.length > 0) {
        this.selectedProduct = product[0];
        this.sdetails.PPrice = this.selectedProduct.PPrice;
        this.sdetails.SPrice = this.selectedProduct.SPrice;
        this.sdetails.Packing = this.selectedProduct.Packing;

        this.sdetails.ProductName = this.selectedProduct.ProductName;
      }
    }
  }
  CustomerCat(event) {
    console.log(event.target.value);
    if (event.target.value && event.target.value != '') {
      this.http.getAccountsByCat(event.target.value).then((r: any) => {
        this.Accounts = r;
      });
    }
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
          this.myToaster.Warning('Invalid invoice No', 'Edit', 1);
          this.router.navigateByUrl('sale/invoice');
          return;
        }
        if (r.IsPosted == '1') {
          // this.myToaster.Warning('invoice is already posted', 'Edit', 1);
          this.isPosted = true;
        } else {
          this.isPosted = false;
        }

        this.EditDisabled(false);
        this.sale = r;
        this.sale.Date = GetDateJSON(new Date(r.Date));

        this.CustomerCat({ target: { value: this.sale.CustCatID } });

        this.http
          .getData('invoicetransporters', {
            filter: 'InvoiceID=' + this.EditID,
          })
          .then((rtrans: any) => {
            this.sale.TransporterIDs = Array.isArray(rtrans)
              ? rtrans.map((t: any) => t.TransporterID)
              : [];
          });

        this.http
          .getData('qryinvoicedetails', {
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
                PPrice,
                StockID,
                StoreID,
                StoreName,
              } = det;
              // Create new object with selected properties
              this.AddToDetails({
                ProductID,
                ProductName,
                Qty,
                SPrice,
                PPrice,
                StockID,
                StoreID,
                StoreName,
              });
            }
            this.calculation();
          });
      });
    }
  }

  CustomerSelected(event) {
    console.log(event);

    if (event) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.CustomerID;
      });
      // if (this.EditID == '' || this.EditID == '0') {
      this.sale.PrevBalance = this.SelectCust.CBalance;
      // }
      this.SelectCust.CustomerName = this.SelectCust.CustomerName;
      this.GetFromHeldInvoice(this.SelectCust.CustomerID);
    }
  }

  AddToDetails(ord: any) {
    const tQty = parseFloat('0' + ord.Qty);

    // console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      PPrice: parseFloat('0' + ord.PPrice),
      SPrice: parseFloat('0' + ord.SPrice),
      Qty: parseFloat(ord.Qty),
      KGs: 0,
      Amount: RoundTo2(ord.SPrice * tQty),
      ProductID: ord.ProductID,
      Packing: 1,
      StoreName: ord.StoreName,
      StoreID: ord.StoreID,
      StockID: ord.StockID,
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

    // For a native HTML <select> element, get the selected option's text
    const storeSelect: HTMLSelectElement =
      this.cmbStores && this.cmbStores.nativeElement;
    if (storeSelect && storeSelect.selectedIndex >= 0) {
      this.sdetails.StoreName =
        storeSelect.options[storeSelect.selectedIndex].text;
    } else {
      this.sdetails.StoreName = '';
    }

    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProduct.focus();
    this.sdetails = new SaleDetails();
    this.AddToInvoice();
  }

  ProductSelected(product) {
    this.selectedProduct = product;

    if (product) {
      this.GetStores(product.ProductID);
    }
  }
  async GetStores(ProductID) {
    if (ProductID) {
      this.Stores = await this.http.getData(
        'qrystock?orderby=StoreID&flds=StoreID,StoreName,Stock&filter=ProductID=' +
          ProductID
      );
      if (this.Stores.length > 0) {
        this.StoreSelected({
          target: { value: this.Stores[0].StoreID },
        });
      }
    }
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }
  public async SaveData() {
    this.isSaving = true;
    let InvoiceID = '';

    this.sale.TransporterIDs = this.sale.TransporterIDs || [];

    if (this.sale.Bank > 0 && this.sale.BankID == '') {
      this.myToaster.Error('Please select Bank Account', 'Save', 2);
      return;
    }
    if (this.sale.DeliveryCharges > 0 && this.sale.TransporterIDs.length == 0) {
      this.myToaster.Error('Please select Transporter', 'Save', 2);
      return;
    }

    let res1 = await this.data.getAll();
    if (!this.fromPurchase.valid || res1.length == 0) {
      this.myToaster.Error('Invalid Data', 'Save', 2);
      return;
    }

    this.sale.AmntRecvd = this.sale.Cash * 1 + this.sale.Bank * 1;

    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.sale.BusinessID = this.http.getBusinessID();
    this.sale.ClosingID = this.http.getClosingID();

    this.sale.Time = this.getTime(new Date());
    this.sale.Date = JSON2Date(this.sale.Date);
    this.sale.UserID = this.http.getUserID();

    this.sale.details = res1;

    this.http.postTask('sale' + InvoiceID, this.sale).then(
      async (r: any) => {
        this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);
        await this.http.RemoveHeldInvoice(this.sale.CustomerID);
        if (this.EditID != '') {
          this.LoadInvoice();
        } else {
          this.NavigatorClicked({ Button: Buttons.Last });
          this.EditID = r.id;
        }

        setTimeout(() => {
          this.PrintInvoice(this.EditID);
        }, 1000);

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
    event.newData.Amount = event.newData.Qty * event.newData.SPrice;
    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  changel() {
    this.calculation();
  }
  public calculation() {
    this.sale.Amount = 0;
    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.sale.Amount += d[i].Amount * 1;
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
    this.StoreSelected({ target: { value: this.sdetails.StoreID } });
    this.btnsave = false;
    this.isPosted = false;
    this.SelectCust = {};
  }

  SubmitOrder() {
    if (this.formSub.valid) {
      this.AddOrder();
    } else {
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
        this.http.getData('getbno/1').then((r: any) => {
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
    this.http.PrintSaleInvoice(InvoiceID);
    return;
  }
  PrintThermalInvoice(InvoiceID) {
    // window.open('/#/print/printinvoice/' + InvoiceID, '_blank');
    this.http.PrintThermalInvoice(InvoiceID);
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
    // Add SweetAlert confirmation before canceling
    import('sweetalert2').then((Swal) => {
      Swal.default
        .fire({
          title: 'Are you sure?',
          text: 'Do you want to cancel this invoice?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, cancel it!',
          cancelButtonText: 'No, keep it',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            this.Cancel();
            await this.http.RemoveHeldInvoice(this.sale.CustomerID);
            if (this.EditID != '') {
              this.LoadInvoice();
            } else {
              this.NavigatorClicked({
                Button: Buttons.Last,
              });
            }
          }
        });
    });
  }

  async NewCustomer() {
    await this.bsService.show(CustomersComponent, {
      class: 'modal-lg',
      backdrop: true,
      initialState: {
        EditID: '',
      },
    });
     this.CustomerCat({ target: { value: this.sale.CustCatID } });
    this.cmbAccts.focus();
  }
  getCustomerName() {
    if (this.SelectCust && this.SelectCust.CustomerName) {
      return this.SelectCust.CustomerName;
    } else {
      return this.sale.CustomerName || '';
    }
  }

  async AddToInvoice() {
    // Add SweetAlert confirmation before holding invoice
    // import('sweetalert2').then((Swal) => {
    //   Swal.default
    //

    await this.http.HoldInvoice({
      CustomerID: this.sale.CustomerID,
      CustomerName: this.getCustomerName(),
      Invoice: this.sale,
      Details: await this.data.getAll(),
    });

    // Refresh the held invoices count
    this.loadHeldInvoicesCount();
  }

  RetrieveInvoice() {
    import('sweetalert2').then(async (Swal) => {
      // Get held invoices
      const heldInvoices = await this.http.GetHeldInvoices();
      if (!heldInvoices || heldInvoices.length === 0) {
        return null;
      }

      // Prepare options for dropdown
      const options = heldInvoices.reduce((acc, inv) => {
        acc[inv.CustomerID] = `${inv.CustomerName || ''}`;
        return acc;
      }, {});

      // Show SweetAlert with dropdown
      Swal.default
        .fire({
          title: 'Retrieve Held Invoice',
          input: 'select',
          inputOptions: options,
          inputPlaceholder: 'Select an invoice',
          showCancelButton: true,
          confirmButtonText: 'Retrieve',
          cancelButtonText: 'Cancel',
        })
        .then(async (result) => {
          if (result.isConfirmed && result.value) {
            const selectedId = result.value;
            // Find and remove selected invoice from heldInvoices
            this.GetFromHeldInvoice(selectedId);
          }
        });
    });
  }
  GetFromHeldInvoice(selectedId: any) {
    this.data.empty();
    this.data.refresh();
    this.calculation();
    this.http.GetHeldInvoices().then((heldInvoices: any[]) => {
      const selectedInvoice = heldInvoices.find(
        (inv) => inv.CustomerID === selectedId
      );

      if (selectedInvoice) {
        // Remove from held list (if needed, call API to remove)
        // await this.http.RemoveHeldInvoice(selectedId);
        // Load invoice data into form
        this.sale = selectedInvoice.Invoice;

        this.data.load(selectedInvoice.Details || []);
        this.calculation();

        this.myToaster.Sucess('Invoice retrieved successfully', 'Retrieve', 1);
      }
    });
  }

  FindOrder() {
    if (this.OrderNo && this.OrderNo != '') {
      this.http
        .getData('qryorders', {
          filter: 'OrderID=' + this.OrderNo,
        })
        .then((r: any) => {
          if (!r) {
            this.myToaster.Warning('Invalid Order No', 'Find Order', 1);
            return;
          }

          this.sale = Object.assign(this.sale, r[0]);
          this.CustomerCat({ target: { value: this.sale.CustCatID } });
          this.sale.Cash = 0;
          this.sale.Bank = 0;
          this.sale.IsPosted = 0;
          this.sale.BankID = '';
          this.sale.AmntRecvd = 0;
          setTimeout(() => {
            this.CustomerSelected({
              CustomerID: this.sale.CustomerID,
              CustomerName: this.sale.CustomerName,
            });
            this.data.empty();
            this.http
              .getData('qryorderdetails', {
                filter: 'OrderID=' + this.OrderNo,
                orderby: 'OrderDetailID desc',
              })
              .then((details: any) => {
                this.data.empty();
                this.data.refresh();

                for (const det of details) {
                  if (!det.StoreID) {
                    det.StoreID = this.sdetails.StoreID || 1;
                    // Try to get store name from Stores observable if available
                    if (
                      this.Stores &&
                      typeof this.Stores.subscribe === 'function'
                    ) {
                      this.Stores.subscribe((stores: any) => {
                        const store = stores?.find(
                          (s) => s.StoreID == det.StoreID
                        );
                        if (store) {
                          det.StoreName = store.StoreName;
                        }
                      });
                    }
                  }

                  this.AddToDetails(det);
                }
                this.data.refresh();
                this.calculation();
              });
          }, 500);
          this.sale.Date = GetDateJSON(new Date(r[0].Date));

          this.myToaster.Sucess('Order loaded successfully', 'Find Order', 1);

          this.calculation();
        });
    } else {
      this.myToaster.Error('Please enter Order No', 'Find Order', 1);
    }
  }
  GetHoldedInvoicesCount() {
    return this.http.GetHeldInvoices().then((invoices: any[]) => {
      this.heldInvoicesCount = invoices ? invoices.length : 0;
      return this.heldInvoicesCount;
    });
  }

  async loadHeldInvoicesCount() {
    try {
      await this.GetHoldedInvoicesCount();
    } catch (error) {
      this.heldInvoicesCount = 0;
    }
  }

  ClearHoldInvoices(){
    import('sweetalert2').then(async (Swal) => {
      const result = await Swal.default.fire({
        title: 'Are you sure?',
        text: 'This will clear all held invoices. Do you want to continue?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, clear all!',
        cancelButtonText: 'No, keep them',
      });

      if (result.isConfirmed) {

        await this.http.ClearHeldInvoices();
        this.loadHeldInvoicesCount();
        this.myToaster.Sucess('All held invoices cleared', 'Clear', 1);
      }
    });
  }
}
