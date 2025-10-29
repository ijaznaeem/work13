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
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  ButtonConfig,
  ButtonsBarComponent,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/buttons-bar/buttons-bar.component';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import { FindTotal } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { InvoiceTypes } from '../../../factories/constants';
import { SaleSetting } from '../../../factories/static.data';
import {
  GetDateJSON,
  JSON2Date,
  RoundTo2,
  getCurDate,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { SearchStockComboboxComponent } from '../../sales/search-stock-combobox/search-stock-combobox.component';
import { PInvoice, PInvoiceDetails } from '../pinvoicedetails.model';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss'],
})
export class PurchaseInvoiceComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('formqty') formSub: NgForm;
  @ViewChild('qty') elQty: ElementRef;
  @ViewChild('Barcode') pcode;
  @ViewChild('txtRate') txtRate;
  @ViewChild('txtRemarks') txtRemarks;
  @ViewChild('cmbCustomers') cmbAccts;
  @ViewChild('scrollTop') scrollTop;
  @ViewChild('btnBar') btnBar: ButtonsBarComponent;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };

  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public bPrint = true;
  public btnsave = false;
  public isPosted = false;
  public btnLocked = true;
  public isTableDisabled = false;
  public InvTypes = InvoiceTypes;
  public bsModalRef?: BsModalRef;
  pdetails = new PInvoiceDetails();
  purchase: any = new PInvoice();
  ReportSetting = SaleSetting;
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
      PCode: {
        title: 'Code',
        editable: false,
      },
      ProductName: {
        editable: false,
        title: 'Product',
        width: '250px',
        type: 'string',
      },
      Qty: {
        title: 'Qty',
        editable: true,
      },
      Packing: {
        title: 'Packing',
        editable: true,
      },
      Pcs: {
        title: 'Pcs',
        editable: true,
      },
      PPrice: {
        title: 'Price',
        editable: true,
      },
      Amount: {
        editable: true,
        title: 'Amount',
      },
    },
    pager: {
      display: true,
      perPage: 50,
    },
  };

  Stock: any = [];
  public Prods = [];
  public RptData = [];
  public Accounts: any = [];
  public SelectCust: any = {};
  marked = false;
  public LastPrice: any = {};

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
      shortcut: 'e',
    },
    {
      title: 'Print',
      icon: 'fa fa-print',
      classes: 'btn-warning',
      action: () => this.PrintInvoice(),
      shortcut: 'p',
    },
  ];
  btnSave: ButtonConfig[] = [
    {
      title: 'Save',
      icon: 'fa fa-save',
      classes: 'btn-success',
      action: () => this.SaveData(),
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

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private router: Router,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.Cancel();
    this.getCustomers('');

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
    this.cachedData.Stock$.subscribe((r) => {
      this.Stock = r;
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
    this.router.navigate(['/purchase/invoice/', this.Ino]);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadInvoice();
    }
  }
  LoadInvoice() {
    // this.Cancel();
    this.data.empty();
    this.data.refresh();

    if (this.EditID && this.EditID !== '') {
      console.log('loadinvoice', this.EditID);

      this.http.getData('pinvoices/' + this.EditID).then((r: any) => {
        if (!r) {
          this.myToaster.Warning('Invalid Invoice No', 'Edit', 1);
          this.router.navigateByUrl('purchase/invoice');
          return;
        }
        if (r.IsPosted == '1') {
          this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
          this.isPosted = true;
        } else {
          this.isPosted = false;
        }
        this.EditDisabled(false);
        this.purchase = r;
        this.purchase.Date = GetDateJSON(new Date(r.Date));

        this.http
          .getData('qrypinvoicedetails?filter=invoiceid=' + this.EditID)
          .then((rdet: any) => {
            for (const det of rdet) {
              this.AddToDetails({
                ProductID: det.ProductID,
                PCode: det.PCode,
                StockID: det.StockID,
                ProductName: det.ProductName,
                Qty: det.Qty,
                Packing: det.Packing,
                Pcs: det.Pcs,
                SPrice: det.SPrice,
                PPrice: det.PPrice,
                Bonus: det.Bonus,
                DiscRatio: det.DiscRatio,
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
      this.pcode.nativeElement.focus();
    }
  }
  RouteSelected($event) {
    if ($event.itemData) this.getCustomers($event.itemData.RouteID);
  }

  AddToDetails(ord: any) {
    const tQty = Number(ord.Qty) * Number(ord.Packing) + Number(ord.Pcs);

    console.log(ord);
    const obj = {
      PCode: ord.PCode,
      ProductName: ord.ProductName,
      PPrice: Number('0' + ord.PPrice),
      SPrice: Number('0' + ord.SPrice),
      Qty: Number(ord.Qty),
      Bonus: Number('0' + ord.Bonus),
      Pcs: Number(ord.Pcs),
      Amount: RoundTo2(ord.PPrice * tQty),
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      Packing: ord.Packing,
      DiscRatio: 0,
      SchemeRatio: 0,
      Remarks: ord.Remarks,
      Discount: 0,
      Scheme: 0,
      BusinessID: this.http.getBusinessID(),
      NetAmount: RoundTo2(ord.SPrice * tQty),
    };
    console.log(obj);
    FindTotal;
    this.data.prepend(obj);
  }
  public AddOrder() {
    // this.pdetails.DiscRatio = Number('0' +this.pdetails.DiscRatio);
    // this.pdetails.Bonus = Number('0' + this.pdetails.Bonus);
    // this.pdetails.SchemeRatio = Number('0' + this.pdetails.SchemeRatio);

    this.AddToDetails(this.pdetails);
    this.data.refresh();
    this.calculation();
    this.pcode.nativeElement.focus();
    this.pdetails = new PInvoiceDetails();
  }

  ProductSelected(product) {
    console.log(product);
    this.selectedProduct = product;

    if (product) {
      this.pdetails.PPrice = this.selectedProduct.PPrice;
      this.pdetails.SPrice = this.selectedProduct.SPrice;
      this.pdetails.Packing = this.selectedProduct.Packing;
      this.pdetails.ProductID = this.selectedProduct.ProductID;
      this.pdetails.StockID = this.selectedProduct.StockID;
      this.pdetails.ProductName = this.selectedProduct.ProductName;
      this.pdetails.PCode = this.selectedProduct.PCode;
      this.elQty.nativeElement.focus();
    }
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }
  public SaveData() {
    let InvoiceID = '';
    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }
    this.purchase.BusinessID = this.http.getBusinessID();
    this.purchase.ClosingID = this.http.getClosingID();

    this.purchase.Date = JSON2Date(this.purchase.Date);
    this.purchase.InvoiceDate = JSON2Date(this.purchase.InvoiceDate);
    this.purchase.UserID = this.http.getUserID();

    this.data.getAll().then((res1) => {
      let i = 0;
      console.log(res1);

      this.purchase.details = res1;
      this.http.postTask('purchase' + InvoiceID, this.purchase).then(
        (r: any) => {
          this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);
          if (this.EditID != '') {
            this.LoadInvoice();
          } else {
            this.NavigatorClicked({ Button: Buttons.Last });
          }
        },
        (err) => {
          this.purchase.Date = GetDateJSON(new Date(getCurDate()));
          this.myToaster.Error('Error saving invoice', 'Error', 2);
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
  public async onEdit(event) {
    if (
      event.newData.PPrice == event.data.PPrice &&
      (event.newData.Qty * event.newData.Packing + event.newData.Pcs) == (event.data.Qty * event.data.Packing + event.data.Pcs)
    ) {
      event.newData.PPrice =
        event.newData.Amount /
        (event.newData.Qty * event.newData.Packing + event.newData.Pcs);
    }

    event.newData.Amount = RoundTo2(
      (event.newData.Qty * event.newData.Packing + event.newData.Pcs) *
        event.newData.PPrice
    );
    event.newData.Discount = 0;

    event.newData.NetAmount = event.newData.Amount - event.newData.Discount;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  changel() {
    this.calculation();
  }
  public calculation() {
    this.purchase.Amount = 0;
    this.purchase.Discount = 0;

    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.purchase.Amount += d[i].Amount * 1;
        this.purchase.Discount += (d[i].Amount * d[i].DiscRatio) / 100;
      }
    });

    this.purchase.AmountPaid = 0;
  }

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.purchase = new PInvoice();
    this.pdetails = new PInvoiceDetails();
    this.btnsave = false;
    this.isPosted = false;
    this.SelectCust = {};
    this.purchase.Type = '1';
  }
  Search(term = '') {
    const initialState: ModalOptions = {
      initialState: {
        Table: 'qrystock',
        Term: term,
        DataSrvc: this.Stock,
        Flds: [
          {
            fldName: 'PCode',
            label: 'Barcode',
            search: true,
          },
          {
            fldName: 'ProductName',
            label: 'Product',
            search: true,
          },
          {
            fldName: 'PPrice',
            label: 'Price',
          },
        ],
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      SearchStockComboboxComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((res) => {
      console.log(res);

      if (res.command == 'OK') {
        this.bsModalRef?.hide();

        this.ProductSelected(res.data);
      } else {
        this.pcode.nativeElement.focus();
      }
    });
  }
  Find() {
    let code = this.pdetails.PCode;

    if (code == '') {
      this.Search();
      return;
    }
    if (code.substring(0, 1) == '/') {
      this.Search(code.substring(1));
      return;
    }

    code = code.trim();
    //      console.log(code.length, rx);
    const r = this.Stock.filter((x) => x.PCode == code || x.PackCode == code);

    console.log(r);

    if (r.length > 0) {
      this.ProductSelected(r[0]);
    } else {
      this.myToaster.Error('Code not fond', 'Error');
    }
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  PrintBill(r = {}) {

    this.router.navigateByUrl("/print/printpurchase/" + this.EditID);

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
  onFocus(event: any) {
    const target = event.target as HTMLInputElement; // Get the target element
    target.select(); // Select the text inside the input element
  }
  customSearchFn(term: string, item) {
    return item.CustomerName.toLocaleLowerCase().startsWith(
      term.toLocaleLowerCase()
    );
  }
  scrollToAccts() {
    if (this.scrollTop && this.scrollTop.nativeElement) {
      const element = this.scrollTop.nativeElement as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  NavigatorClicked(e) {
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
        this.http.getData('getpbno').then((r: any) => {
          billNo = r.billno;
          console.log(r);

          this.router.navigateByUrl('/purchase/invoice/' + billNo);
        });
        break;
      default:
        break;
    }
    //this.router.navigateByUrl('/purchase/invoice/' + billNo);
  }
  NewInvoice() {
    this.Cancel();
    this.router.navigateByUrl('/purchase/invoice');
  }
  PrintInvoice() {
    this.router.navigateByUrl("/print/printpurchase/" + this.EditID);
  }
  EditDisabled(lock: boolean): void {
    console.log('isposted:' + this.isPosted);
    this.btnBar.DisableBtn(1, lock || this.isPosted);
    this.isTableDisabled = !lock || this.isPosted;
    this.btnLocked = lock;
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
  RoundIt(v) {
    return RoundTo2(v);
  }
}
