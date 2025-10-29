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
import swal from 'sweetalert';
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
import { PrintBillService } from '../../../services/print-bill.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';
import { SaleDetails, SaleModel } from '../sale.model';
import { SearchStockComboboxComponent } from '../search-stock-combobox/search-stock-combobox.component';

@Component({
  selector: 'app-retail-sale',
  templateUrl: './retail-sale.component.html',
  styleUrls: ['./retail-sale.component.scss'],
})
export class RetailSaleComponent implements OnInit, AfterViewInit, OnChanges {
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
  sdetails = new SaleDetails();
  sale: any = new SaleModel();
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
      Pcs: {
        title: 'Qty',
        editable: true,
      },
      SPrice: {
        title: 'Price',
        editable: true,
      },

      Remarks: {
        editable: true,
        title: 'Remarks',
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
  Salesman = this.cachedData.Salesman$;
  Companies = this.cachedData.Companies$;
  Routes = this.cachedData.routes$;
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
    private bill: PrintBillService,
    private ps: PrintDataService,
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
        if (this.EditID == '0'){
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
    this.router.navigate(['/sales/retail/', this.Ino]);
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

      this.http.getData('invoices/' + this.EditID).then((r: any) => {
        if (!r) {
          this.myToaster.Warning('Invalid Invoice No', 'Edit', 1);
          this.router.navigateByUrl('sales/retail');
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
          .getData('qryinvoicedetails?filter=invoiceid=' + this.EditID)
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
                SchemeRatio: det.SchemeRatio,
                Remarks: det.Remarks,
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
      Amount: RoundTo2(ord.SPrice * tQty),
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
    // this.sdetails.DiscRatio = Number('0' +this.sdetails.DiscRatio);
    // this.sdetails.Bonus = Number('0' + this.sdetails.Bonus);
    // this.sdetails.SchemeRatio = Number('0' + this.sdetails.SchemeRatio);

    if (this.sdetails.SPrice * 1 < this.selectedProduct.PPrice * 1) {
      swal({
        text: 'Invalid sale rate',
        icon: 'warning',
      });
      return;
    }
    console.log(this.sdetails);
    if (
      this.sdetails.Qty * this.sdetails.Packing + this.sdetails.Pcs >
      this.selectedProduct.CStock
    ) {
      this.myToaster.Error('not enought stock!', 'Stock');
      return;
    }

    if (this.sdetails.Qty * this.sdetails.Packing + this.sdetails.Pcs == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }
    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.pcode.nativeElement.focus();
    this.sdetails = new SaleDetails();
  }

  ProductSelected(product) {
    console.log(product);
    this.selectedProduct = product;
    this.selectedProduct.SPrice = product.RetailRate;

    if (this.sale.CustomerID) {
      this.http
        .getData(
          'qrysalereport?orderby=InvoiceID DESC&filter=ProductID=' +
            product.ProductID +
            ' and CustomerID=' +
            this.sale.CustomerID
        )
        .then((r: any) => {
          if (r.length > 0) {
            this.LastPrice = r[0];
            this.LastPrice.Stock = product.CStock;
          }
        });
    }
    this.LastPrice.Stock = product.CStock;
    if (product) {
      this.sdetails.PPrice = this.selectedProduct.PPrice;
      this.sdetails.SPrice = this.selectedProduct.SPrice;
      this.sdetails.Packing = this.selectedProduct.Packing;
      this.sdetails.ProductID = this.selectedProduct.ProductID;
      this.sdetails.StockID = this.selectedProduct.StockID;
      this.sdetails.ProductName = this.selectedProduct.ProductName;
      this.sdetails.PCode = this.selectedProduct.PCode;
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
    this.sale.BusinessID = this.http.getBusinessID();
    this.sale.ClosingID = this.http.getClosingID();

    this.sale.Time = this.getTime(new Date());
    this.sale.Date = JSON2Date(this.sale.Date);
    this.sale.UserID = this.http.getUserID();

    this.data.getAll().then((res1) => {
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
        },
        (err) => {
          this.sale.Date = GetDateJSON(new Date(getCurDate()));
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
    let stock: any = await this.http.getData('qrystock?filter=StockID=' + event.newData.StockID);

    if (event.newData.Pcs > stock[0].CStock) {
      this.myToaster.Error('not enought stock!', 'Stock');
      event.confirm.reject(event.newData);
      return;
    }

    if (
      event.newData.SPrice == event.data.SPrice &&
      event.newData.Pcs == event.data.Pcs
    ) {
      event.newData.SPrice = event.newData.Amount / event.newData.Pcs;
    }

    event.newData.Amount = RoundTo2(event.newData.Pcs * event.newData.SPrice);
    event.newData.Discount =
      (event.newData.Pcs * event.newData.SPrice * event.newData.DiscRatio) /
      100;
    event.newData.NetAmount = event.newData.Amount - event.newData.Discount;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }
  getStock(v) {
    this.http
      .getData('qrystock?orderby=ProductName&filter= CompanyID=' + v)
      .then((res: any) => {
        this.Prods = res;
      });
  }

  changel() {
    this.calculation();
  }
  public calculation() {
    this.sale.Amount = 0;
    this.sale.Discount = 0;
    this.sale.Scheme = 0;

    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;

      for (i = 0; i < d.length; i++) {
        this.sale.Amount += d[i].Amount * 1;
        this.sale.Discount += (d[i].Amount * d[i].DiscRatio) / 100;
        this.sale.Scheme +=
          (d[i].Qty * d[i].Packing + d[i].Pcs * 1) * d[i].SchemeRatio;
      }
    });

    this.sale.AmountRecvd = 0;
  }

  Cancel(smid = '', smrt = '') {
    smid = this.http.getUserID();
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.sale = new SaleModel();
    this.sale.SalesmanID = smid;
    this.sale.RouteID = smrt;
    this.sdetails = new SaleDetails();
    this.btnsave = false;
    this.isPosted = false;
    this.SelectCust = {};
    this.sale.Type = '1';
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
            fldName: 'SPrice',
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
        res.data.Packing = 1;
        this.ProductSelected(res.data);
      } else {
        this.pcode.nativeElement.focus();
      }
    });
  }
  Find() {
    let code = this.sdetails.PCode;

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
      if (r[0].PCode == code) {
        r[0].Packing = 1;
        this.ProductSelected(r[0]);
      } else {
        r[0].SPrice = r[0].PackPrice;
        r[0].PCode = r[0].PackCode;

        this.ProductSelected(r[0]);
      }
    } else {
      this.myToaster.Error('Code not fond', 'Error');
    }
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  PrintBill(r = {}) {
    this.pcode.nativeElement.focus();
    this.sale['Business'] = this.http.GetBData();
    this.sale['UserName'] = this.http.getUserData().SalesmanName;

    this.bill.PrintPDFBill(Object.assign(r, this.sale));
    this.Cancel(this.sale.SalesmanID);
    this.pcode.nativeElement.focus();
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

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Sale Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }

  Clicked(e) {
    console.log(e);
    if (e.action === 'print') {
      if (e.data.Type == '1')
        this.router.navigateByUrl('/print/printinvoice/' + e.data.InvoiceID);
      else {
        this.http.getData('printbill/' + e.data.InvoiceID).then((d: any) => {
          d.Business = this.http.GetBData();
          console.log(d);
          this.bill.PrintPDFBill(d);
          // this.bill.printTest();
        });
      }
    } else if (e.action === 'edit') {
      if (e.data.IsPosted === '1') {
        this.myToaster.Error('Invoice Already Posted', 'Post');
      } else {
        this.router.navigateByUrl('/sales/retail/' + e.data.InvoiceID);
      }
    }
  }
  NavigatorClicked(e) {
    let billNo = 100000001;
    switch (Number(e.Button)) {
      case Buttons.First:
        this.router.navigateByUrl('/sales/retail/' + billNo);
        break;
      case Buttons.Previous:
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.router.navigateByUrl('/sales/retail/' + billNo);
        break;
      case Buttons.Next:
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.router.navigateByUrl('/sales/retail/' + billNo);
        break;
      case Buttons.Last:
        this.http.getData('getbno/1').then((r: any) => {
          billNo = r.billno;
          console.log(r);

          this.router.navigateByUrl('/sales/retail/' + billNo);
        });
        break;
      default:
        break;
    }
    //this.router.navigateByUrl('/sales/retail/' + billNo);
  }
  NewInvoice() {
    this.Cancel();
    this.router.navigateByUrl('/sales/retail');
  }
  PrintInvoice() {
    this.http.getData('printbill/' + this.EditID).then((d: any) => {
      d.Business = this.http.GetBData();
      console.log(d);
      this.bill.PrintPDFBill(d);
      // this.bill.printTest();
    });
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
  OnQtyEnter(e) {
    console.log(e.target.value);
    if (e.target.value > this.selectedProduct.CStock) {
      this.myToaster.Error('not enought stock!', 'Stock');
      this.elQty.nativeElement.select();
      return;
    } else {
      this.txtRemarks.nativeElement.focus();
    }
  }
}
