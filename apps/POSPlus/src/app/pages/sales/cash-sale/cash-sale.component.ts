import {
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { InvoiceTypes } from '../../../factories/constants';
import {
  GetDateJSON,
  JSON2Date,
  RoundTo,
  RoundTo2,
  getYMDDate,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { IndexedDBService } from '../../../services/idexdb.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { MyToastService } from '../../../services/toaster.server';
import { SaleDetails, SaleModel } from '../sale.model';
import { SearchGridComponent } from '../search-grid/search-grid.component';
import { SearchStockComponent } from '../search-stock/search-stock.component';
import {
  DailySaleSetting,
  HoldBillSetting,
  OfflineDataSettings,
} from './cash-sale.settings';

@Component({
  selector: 'app-cash-sale',
  templateUrl: './cash-sale.component.html',
  styleUrls: ['./cash-sale.component.scss'],
})
export class CashSaleComponent implements OnInit {
  public Type = 1;

  selectedProduct: any = {};
  @ViewChild('Barcode') pcode;
  @ViewChild('formPayment') formPayment;
  @ViewChild('dlgHoldBills') dlgHoldBills;
  @ViewChild('dlgSpecialItem') dlgSpecialItem;
  @ViewChild('dlgOfflineInvoices') dlgOfflineInvoices;
  @ViewChild('cmbSM') cmbSM;

  public saledata: any = [];
  specialItem: any = {
    Qty: 0,
    Price: 0,
  };
  public btnsave = false;
  public InvTypes = InvoiceTypes;
  sdetails = new SaleDetails();
  sale = new SaleModel();
  public bPrint = true;
  Salesman: any = [];
  public offlineCount = 0;
  public Prods = [];
  public Accounts: any = [];
  public SelectCust: any = {};
  marked = false;
  public LastPrice: any = {};
  bsModalRef?: BsModalRef;
  bsModalPayment?: BsModalRef;
  setting = DailySaleSetting;
  holdSetting = HoldBillSetting;
  offlineSetting = OfflineDataSettings;
  dlgHoldTitle = 'Hold Bill';

  HOLD_BILL = 'HOLD_BILL';
  SALE_DATA = 'SALE_DATA';

  holdData: any = [];
  offlineData: any = [];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  salereport: any = [];
  Customer: any = {};
  StockCashed$ = this.cachedData.Stock$;
  constructor(
    public http: HttpBase,
    private bill: PrintBillService,
    private cachedData: CachedDataService,
    private modalService: BsModalService,
    private myToaster: MyToastService,
    private idb: IndexedDBService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.GetOfflineInvoices();
    }, 3000);
    this.Cancel();
    this.http.getData('salesman').then((r) => {
      this.Salesman = r;
    });
    this.holdData = this.http.getItem(this.HOLD_BILL, []);
    this.saledata = this.http.getItem(this.SALE_DATA, []);
    for (let i = 0; i < this.saledata.length; i++) {
      this.saledata['InvoiceID'] = this.sale.InvoiceID;
    }
    this.calculation();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event) {
    if (event.key == 'F2') {
      event.preventDefault();
      this.Search();
    } else if (event.key == 'F3') {
      event.preventDefault();
      this.OpenSpecialItem();
    } else if (event.key == 'F4') {
      event.preventDefault();
      this.Type *= -1;
    } else if (event.key == 'F6') {
      event.preventDefault();
      this.HoldBill(1);
    } else if (event.key == 'F7') {
      event.preventDefault();
      this.HoldBill(2);
    } else if (event.key == 'F8') {
      event.preventDefault();
      this.Cancel('1', true);
    } else if (event.key == 'F9') {
      event.preventDefault();
      this.SaveToAccount();
    } else if (event.key == 'F10') {
      event.preventDefault();
      this.SaveToCredit();
    }
  }

  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "Date = '" + JSON2Date(this.Filter.FromDate) + "'";
    filter += ' and UserID = ' + this.http.getUserID();
    this.http
      .getData('qryinvoices?orderby=InvoiceID DESC&filter=' + filter)
      .then((r: any) => {
        this.salereport = r;
      });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'print') {
      this.http.getData('printbill/' + e.data.InvoiceID).then((d: any) => {
        d.Business = this.http.GetBData();
        console.log(d);
        var result = this.bill.PrintPDFBill(d);
      });
    }
  }
  AddToDetails(ord: any) {
    const tQty = parseFloat(ord.Qty);
    const o = this.saledata.find((x) => x.PCode == ord.PCode);
    if (o) {
      this.onEdit(tQty, o);
    } else {
      let obj:any = {
        InvoiceID: ord.InvoiceID,
        ProductName: ord.ProductName,
        PPrice: ord.PPrice,
        SPrice: ord.SPrice,
        Qty: ord.Qty,
        PCode: ord.PCode,
        Amount: RoundTo2(ord.SPrice * tQty),
        ProductID: ord.ProductID,
        StockID: ord.StockID,
        Packing: ord.Packing,
        DiscRatio: ord.DiscRatio,
        Discount: (ord.SPrice * tQty * ord.DiscRatio) / 100,
        GSTRatio: ord.GSTRatio,
        BusinessID: this.http.getBusinessID(),
        NetAmount: RoundTo2(
          ord.SPrice * tQty - (ord.SPrice * tQty * ord.DiscRatio) / 100
        ),
      };

      obj.GSTAmount = obj.NetAmount * obj.GSTRatio/100 ;
      obj.NetAmount += obj.GSTAmount;

      this.calculation();
      this.saledata.unshift(obj);
      this.http.setItem(this.SALE_DATA, this.saledata);
    }
  }
  public AddOrder(qty = 1) {
    this.sdetails.Qty = qty * this.Type;
    if (this.sdetails.SPrice * 1 < this.selectedProduct.PPrice * 1) {
      swal({
        text: 'Invalid sale rate',
        icon: 'warning',
      });
      return;
    }

    console.log(this.sdetails.Qty);

    if (
      this.sdetails.Qty * 1 > this.selectedProduct.Stock * 1 &&
      this.Type == 1
    ) {
      this.myToaster.Warning('Low stock!!', 'Warning');
    }

    if (this.sdetails.Qty == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }

    this.sdetails.ProductName = this.selectedProduct.ProductName;
    this.sdetails.InvoiceID = this.sale.InvoiceID;
    this.AddToDetails(this.sdetails);
    this.saledata = [...this.saledata];
    this.selectedProduct = {};
    this.calculation();
    this.pcode.nativeElement.focus();
    this.sdetails = new SaleDetails();
  }

  ProductSelected(item, qty = 1) {
    this.selectedProduct = item;

    if (item) {
      this.sdetails.PPrice = item.PPrice;
      this.sdetails.ProductName = item.ProductName;
      this.sdetails.SPrice = item.SPrice;
      this.sdetails.Packing = item.Packing;
      this.sdetails.ProductID = item.ProductID;
      this.sdetails.StockID = item.StockID;
      this.sdetails.DiscRatio = item.DiscRatio;
      this.sdetails.GSTRatio = 0;
      this.sdetails.PCode = item.PCode;

      this.AddOrder(qty);
    }
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }
  public SaveData() {
    if (this.sale.SalesmanID == '') {
      this.myToaster.Error('No Salesman selected', 'Error');
      return;
    }

    if (this.sale.Type == '2') {
      if (!this.Customer.CustomerID) {
        this.myToaster.Error('Customer is not selected', 'Credit Invoice');
        return;
      } else {
        this.sale.CustomerID = this.Customer.CustomerID;
        this.sale.CustomerName = this.Customer.CustomerName;
      }
    }

    this.sale.BusinessID = this.http.getBusinessID();
    this.sale.Time = this.getTime(new Date());
    this.sale.Date = getYMDDate();
    this.sale.UserID = this.http.getUserID();
    let res1: any;
    res1 = this.saledata.slice();

    let i = 0;
    for (i = 0; i < res1.length; i++) {
      res1[i].ProductName;
      res1[i].Amount;
    }
    this.sale.details = res1;

    console.log(this.sale);

    this.http.postTask('sale', this.sale).then(
      (r: any) => {
        this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);
        this.PrintBill(r);
        this.http.setItem(this.SALE_DATA, []);
      },
      (err) => {
        this.idb
          .add(this.sale.InvoiceID, JSON.stringify(this.sale))
          .then(this.backgroundSync)
          .catch(console.log);
        this.myToaster.Warning('data stored offline', 'Offline', 2);
        this.PrintBill();
        console.log(err.error);
      }
    );
    // });
  }
  PrintBill(r = {}) {
    console.log(this.bsModalRef);
    this.bsModalRef?.hide();
    this.pcode.nativeElement.focus();

    if (this.bPrint) {
      this.sale['Business'] = this.http.GetBData();
      this.sale['SalesmanName'] = this.Salesman.find((x) => {
        return x.SalesmanID == this.sale.SalesmanID;
      }).SalesmanName;

      this.bill.PrintPDFBill(Object.assign(r, this.sale));
    }
    this.Cancel(this.sale.SalesmanID);
    this.GetOfflineInvoices();
    this.pcode.nativeElement.focus();
  }
  checkLength() {
    if (this.saledata.length > 0) {
      this.btnsave = true;
    } else {
      this.btnsave = false;
    }
  }
  OnChange(v, o) {
    o.Qty = v;
    this.onEdit(0, o);
  }
  public onEdit(value, d) {
    console.log(d);
    d.Qty = Number(d.Qty) + Number(value) * 1;
    d.Discount = RoundTo2((d.SPrice * d.Qty * d.DiscRatio * 1) / 100);
    d.NetAmount = RoundTo2(d.SPrice * d.Qty - d.Discount * 1);
    console.log(d);

    this.calculation();
  }

  TaxPercentageChange(event, i) {
    if (
      !this.CheckDisc(
        this.saledata[i],
        (this.saledata[i].Qty * this.saledata[i].SPrice * event.target.value) /
          100
      )
    ) {
      event.target.value = this.saledata[i].GSTRatio;

      return;
    }

    this.saledata[i].GSTRatio = event.target.value * 1;

    this.saledata[i].GSTAmount =
      (this.saledata[i].Qty *
        this.saledata[i].SPrice *
        this.saledata[i].GSTRatio) /
      100;
    this.saledata[i].NetAmount =
      this.saledata[i].SPrice * this.saledata[i].Qty +
      this.saledata[i].GSTAmount * 1;
    this.calculation();
  }

  TaxChange(event, i) {
    if (!this.CheckDisc(this.saledata[i], event.target.value * 1)) {
      event.target.value = this.saledata[i].GSTAmount;

      return;
    }

    this.saledata[i].GSTAmount = event.target.value * 1;
    this.saledata[i].DiscRatio = RoundTo2(
      (this.saledata[i].GSTAmount /
        (this.saledata[i].SPrice * this.saledata[i].Qty)) *
        100
    );
    this.saledata[i].NetAmount =
      this.saledata[i].SPrice * this.saledata[i].Qty +
      this.saledata[i].GSTAmount * 1;

    this.calculation();
  }
  CheckDisc(sd: any, disc: number) {
    // if (sd.PPrice * sd.Qty >= sd.SPrice * sd.Qty - disc) {
    //   console.log(sd, sd.PPrice * sd.Qty, sd.PPrice * sd.Qty - disc);

    //   this.myToaster.Error('Invalid Discount', 'Error');
    //   return false;
    // }
    return true;
  }
  public onDeleteConfirm(i) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.saledata.splice(i, 1);
      this.calculation();
    }
  }

  getProducts(v) {
    this.http
      .getData('qrystock?orderby=ProductName&filter=stock>0 and CompanyID=' + v)
      .then((res: any) => {
        this.Prods = res;
      });
  }

  CashInvoice(e) {
    this.sale.AmountRecvd = this.sale.NetAmount;
  }
  changel() {
    this.calculation();
  }
  public calculation() {
    this.sale.NetAmount = 0;
    this.sale.GSTAmount = 0;
    this.sale.Items = 0;

    let i = 0;

    for (i = 0; i < this.saledata.length; i++) {
      this.sale.NetAmount += this.saledata[i].NetAmount * 1;
      this.sale.GSTAmount += this.saledata[i].GSTAmount * 1;
      this.sale.Items += this.saledata[i].Qty * 1;
    }
    this.sale.NetAmount = RoundTo(this.sale.NetAmount,2);
    this.sale.Amount = RoundTo(this.sale.NetAmount + this.sale.Discount,2);
    this.sale.Rounding = 0;
    this.sale.NetAmount += (this.sale.Rounding  +this.sale.GSTAmount);

  }

  Cancel(smid = '', bConfirm = false) {
    if (bConfirm) {
      if (!confirm('Are you sure')) return;
    }

    this.saledata = [];
    this.selectedProduct = {};
    this.sale = new SaleModel();
    this.sale.SalesmanID = this.http.getUserID();
    this.sale.InvoiceID = this.http.GetInvoiceID();
    this.sale.CustomerName = 'Cash Sale';

    this.sdetails = new SaleDetails();
    this.btnsave = false;
    this.Type = 1;
  }

  Search(term = '') {
    const initialState: ModalOptions = {
      initialState: {
        Table: 'qrystock',
        Term: term,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      SearchStockComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((res) => {
      if (res.res == 'ok') {
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
    if (code == '' && this.saledata.length > 0) {
      this.openModal(this.formPayment);
      return;
    }
    console.log(code);
    if (code.substring(0, 1) == '/') {
      this.Search(code.substring(1));
      return;
    }

    let qty = 1;
    if (code.substring(0, 2) == '98') {
      qty = Number(code.substring(code.length - 4, code.length)) / 1000;
      code = code.substring(2, code.length - 4);
    }

    // this.http
    //   .getData(
    //     "qrystock?filter=PCode = '" + code + "' or PackCode='" + code + "'"
    //   )
    //   .then((r: any) => {
    this.StockCashed$.subscribe((rx) => {
      code = code.trim();
      //      console.log(code.length, rx);
      const r = rx.filter(
        (x) => x.PCode.trim() == code || x.PackCode.trim() == code
      );

      console.log(r);

      if (r.length > 0) {
        if (r[0].PCode.trim() == code) {
          r[0].Packing = 1;
          this.ProductSelected(r[0], qty);
        } else {
          r[0].SPrice = r[0].PackPrice;
          r[0].PCode = r[0].PackCode;

          this.ProductSelected(r[0], qty);
        }
      } else {
        this.myToaster.Error('Code not fond', 'Error');
      }
    });
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  HoldBill(t = 1) {
    if (this.saledata.length == 0 && t == 1) {
      this.myToaster.Error('No item to hold', 'Hold');
      return;
    }

    if (t == 1) {
      const Inv = Object.assign({}, this.sale);
      Inv.details = [...this.saledata] as any;
      this.holdData.push(Inv);

      this.http.setItem(this.HOLD_BILL, this.holdData);
      this.Cancel();
      this.myToaster.Sucess('Bill is hold', 'Hold');
    } else {
      this.holdSetting = HoldBillSetting;
      this.openModal(this.dlgHoldBills);
    }
  }

  OfflineBills() {
    this.offlineData = [];
    this.idb.getAll().then((data) => {
      for (let i = 0; i < data.length; i++) {
        this.offlineData.push(JSON.parse(data[i]));
      }
      this.openModal(this.dlgOfflineInvoices);
    });
  }

  HoldClicked(e) {
    if (e.action === 'ok') {
      this.sale = Object.assign({}, e.data);
      this.saledata = [...e.data.details];
      this.calculation;
      this.holdData = this.holdData.filter(
        (f) => f.InvoiceID != e.data.InvoiceID
      );
      this.http.setItem(this.HOLD_BILL, this.holdData);
      this.bsModalRef?.hide();
    } else if (e.action === 'delete') {
      this.holdData = this.holdData.filter(
        (f) => f.InvoiceID != e.data.InvoiceID
      );
      this.http.setItem(this.HOLD_BILL, this.holdData);
    } else if (e.action == 'save') {
      this.http
        .postTask('sale', e.data)
        .then((r) => {
          console.log(r);
          this.idb.delete(e.data.InvoiceID);
          this.bsModalRef?.hide();
        })
        .catch((er) => {
          console.log(er);

          this.myToaster.Error(er.statusText, 'Save');
        });
    } else if (e.action == 'edit') {
      this.Cancel();
      e.data.InvoiceID = this.sale.InvoiceID;
      for (let i = 0; i < e.data.details.length; i++) {
        e.data.details[i].InvoiceID = this.sale.InvoiceID;
        this.AddToDetails(e.data.details[i]);
      }
      this.calculation();
    } else if (e.action == 'odelete') {
      this.idb.delete(e.data.InvoiceID);
      this.myToaster.Sucess('Offline invoice deleted', 'delete');
    }
  }
  onTabSelect(e) {
    this.FilterData();
  }

  RoundIt(n: number) {
    return RoundTo(n, 0);
  }
  SaveToAccount() {
    this.sale.Type = '2';
    this.openModal(this.formPayment);
  }
  FindAccount() {
    let bsModalFindAdd: BsModalRef;
    const initialState: ModalOptions = {
      initialState: {
        Table: 'customers',
        Fields: [
          { fldName: 'CustomerName', label: 'Name', search: true },
          { fldName: 'Address', label: 'Address', search: false },
          { fldName: 'Balance', label: 'Balance', search: false },
        ],
        OrderBy: 'CustomerName',
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    bsModalFindAdd = this.modalService.show(SearchGridComponent, initialState);

    bsModalFindAdd.content.Event.subscribe((res) => {
      if (res.res == 'ok') {
        bsModalFindAdd?.hide();
        this.Customer = res.data;
        this.sale.PrevBalance = this.Customer.Balance;
      } else {
        this.pcode.nativeElement.focus();
      }
    });
  }

  SaveToCredit() {
    this.sale.Type = '3';
    this.openModal(this.formPayment);
  }

  backgroundSync() {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready
        .then((swRegistration: any) => {
          swRegistration.sync.register('sync-invoices');
          console.log('stored for sync');
        })
        .catch(console.log);
    } else {
      console.log('No active ServiceWorker');
    }
  }
  async UpdateInvoices() {
    this.OfflineBills();
    return;
    this.idb.getAll().then(async (data) => {
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        await this.http.postTask('sale', JSON.parse(data[i])).then((r) => {
          console.log(r);
          this.idb.delete(JSON.parse(data[i]).InvoiceID);
        });
      }
    });
  }

  GetOfflineInvoices() {
    this.idb.getAll().then((r) => {
      this.offlineCount = r.length;
      console.log(this.offlineCount);
    });
  }
  OpenSpecialItem() {
    this.specialItem = {};
    this.openModal(this.dlgSpecialItem);
  }
  AddSpecialItem() {
    console.log(this.specialItem);
    const code = '##1010##';
    this.StockCashed$.subscribe((rx) => {
      const r = rx.filter((x) => x.PCode == code || x.PackCode == code);

      if (r.length > 0) {
        r[0].SPrice = this.specialItem.Price;
        r[0].PPrice = this.specialItem.Price;
        r[0].Qty = this.specialItem.Qty;
        r[0].ProductName = this.specialItem.ProductName;
        r[0].Packing = 1;
        this.ProductSelected(r[0], 1);
        this.bsModalRef?.hide();
      } else {
        this.myToaster.Error('Special Item COde not found', 'Error');
      }
    });
  }
  CancelDlg() {
    this.bsModalRef?.hide();
  }
}
