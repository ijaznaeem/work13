import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import swal from 'sweetalert';
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
import { SaleDetails, SaleModel } from '../sale.model';
import { SearchStockComponent } from '../search-stock/search-stock.component';
import { SaleSettings } from './sale-invoice.settings';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.scss'],
})
export class SaleInvoiceComponent implements OnInit, OnChanges {
  @Input() EditID = '';
  @Input() Type = 'CR';

  @ViewChild('fromPurchase') fromPurchase;

  @ViewChild('cmbAccts') cmbAccts;
  @ViewChild('scrollTop') scrollTop;
  @ViewChild('txtBatchNo') elQty;
  @ViewChild('cmbRoutes') cmbRoutes;
  @ViewChild('cmbProduct') cmbProduct;

  public data = new LocalDataSource([]);
  public selectedProduct: any = {
    Stock: 0,
    PPrice: 0,
  };
  public btnsave = false;
  public isPosted = false;
  public bsModalRef?: BsModalRef;
  sdetails = new SaleDetails();
  sale = new SaleModel(this.Type);

  public settings = SaleSettings;

  Salesman: Observable<any[]>;
  Companies: Observable<any[]>;
  Routes: any = [];
  Stock: Observable<any[]>;
  InvTypes = InvoiceTypes;
  InvoiceTitles: Observable<any[]>;

  public Prods = [];
  public Accounts: any = [];
  public SelectCust: any = {};
  marked = false;
  public LastPrice: any = {};
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private router: Router,
    private modalService: BsModalService,
    private myToaster: MyToastService
  ) {
    this.Salesman = this.cachedData.Salesman$;
    this.Companies = this.cachedData.Companies$;
    this.Stock = this.cachedData.Stock$;
    this.InvoiceTitles = this.cachedData.InvoiceTitles$;
  }

  ngOnInit() {
    this.cachedData.updateStock();
    this.sale.DtCr = this.Type;
    console.log(this.sale);

    this.Cancel();
    if (this.EditID && this.EditID !== '') {
      console.log(this.EditID);
      this.LoadInvoice(this.EditID);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.currentValue) {
      this.LoadInvoice(this.EditID);
    }
  }
  LoadInvoice(InvoiceID) {
    if (InvoiceID == null || InvoiceID == '') return;

    this.http.getData('invoices/' + InvoiceID).then((r: any) => {
      if (!r) {
        this.myToaster.Warning('Invalid Invoice No', 'Edit', 1);
        this.router.navigateByUrl('sales/invoice');
        return;
      }
      if (r.IsPosted == '1') {
        this.myToaster.Warning('Invoice is already posted', 'Edit', 1);
        this.isPosted = true;
      } else {
        this.isPosted = false;
      }
      this.getCustomers(r.RouteID);
      this.sale = r;
      this.sale.Date = GetDateJSON(new Date(r.Date));
      console.log(this.sale);
      this.SalesmanSelected({ SalesmanID: this.sale.SalesmanID });
      this.http
        .getData('qryinvoicedetails?filter=invoiceid=' + InvoiceID)
        .then((rdet: any) => {
          for (const det of rdet) {
            this.AddToDetails({
              PCode: det.PCode,
              ProductID: det.ProductID,
              StockID: det.StockID,
              ProductName: det.ProductName,
              Qty: det.Qty,
              Packing: det.Packing,
              Pcs: det.Pcs,
              SPrice: det.SPrice,
              PPrice: det.PPrice,
              Bonus: det.Bonus,
              DiscRatio: det.DiscRatio,
              BatchNo: det.BatchNo,
              SchemeRatio: det.SchemeRatio,
            });
          }
          this.calculation();
        });
    });
  }

  getCustomers(routeid) {
    if (routeid != '') {
      this.sale.CustomerID = '';
      this.http.getCustList(routeid).then((r: any) => {
        this.Accounts = [...r];
      });
    }
  }
  CustomerSelected(event) {
    console.log(event);

    if (event) {
      this.SelectCust = this.Accounts.find((x) => {
        return x.CustomerID == event.CustomerID;
      });
      this.sale.PrevBalance = this.SelectCust.Balance;
    }
  }
  async SalesmanSelected($event) {
    if ($event.SalesmanID) {
      this.Routes = await this.http.getData(
        `qrysmroutes?filter=SalesmanID=${$event.SalesmanID}`
      );
    }
  }
  RouteSelected($event) {
    if ($event.RouteID) this.getCustomers($event.RouteID);
  }

  AddToDetails(ord: any) {
    const numQty =
      parseFloat('0' + ord.Qty) * parseFloat('0' + ord.Packing) +
      parseFloat('0' + ord.Pcs);

    console.log(ord);
    const obj = {
      PCode: ord.PCode,
      ProductName: ord.ProductName,
      PPrice: ord.PPrice,
      SPrice: ord.SPrice,
      Qty: parseFloat('0' + ord.Qty),
      Bonus: ord.Bonus,
      Pcs: parseFloat('0' + ord.Pcs),
      Amount: RoundTo2(ord.SPrice * numQty),
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      Packing: ord.Packing,
      DiscRatio: ord.DiscRatio,
      SchemeRatio: ord.SchemeRatio,
      Discount: (ord.SPrice * numQty * ord.DiscRatio) / 100,
      Scheme: numQty * ord.SchemeRatio,
      BatchNo: ord.BatchNo,
      BusinessID: this.http.getBusinessID(),
      NetAmount: RoundTo2(
        ord.SPrice * numQty -
          (ord.SPrice * numQty * ord.DiscRatio) / 100 -
          numQty * ord.SchemeRatio
      ),
    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
    const Qty =
      Number(this.sdetails.Qty * this.sdetails.Packing) +
      Number(this.sdetails.Pcs);
    if (this.sdetails.SPrice * 1 < this.selectedProduct.PPrice * 1) {
      swal({
        text: 'Invalid sale rate',
        icon: 'warning',
      });
      return;
    }

    if (
      this.sale.DtCr == 'CR' &&
      Qty + this.sdetails.Bonus * 1 > this.selectedProduct.Stock
    ) {
      this.myToaster.Error('Stock is not enough!', 'Low Stock');
      return;
    }

    if (Qty == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }
    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProduct.focus();
    this.sdetails = new SaleDetails();
  }

  async ProductSelected(product) {
    console.log(product);

    if (product) {
      try {
        let item: any = await this.http.getData(
          'qrystock?filter=StockID=' + product.StockID
        );
        if (item.length > 0) {
          this.selectedProduct = item[0];
        }
      } catch (error) {
        this.selectedProduct = product;
      }

      this.sdetails.PPrice = this.selectedProduct.PPrice;
      this.sdetails.SPrice = this.selectedProduct.SPrice;
      this.sdetails.Packing = this.selectedProduct.Packing;
      this.sdetails.ProductID = this.selectedProduct.ProductID;
      this.sdetails.StockID = this.selectedProduct.StockID;
      this.sdetails.ProductName = this.selectedProduct.ProductName;
      this.sdetails.PCode = this.selectedProduct.PCode;
      this.sdetails.BatchNo = this.selectedProduct.BatchNo;
      this.sdetails.ExpiryDate = this.selectedProduct.ExpiryDate;

      this.elQty.nativeElement.focus();
      if (this.sale.CustomerID) {
        this.http
          .getData(
            'qrysalereport?flds=Date,SPrice,TotPcs,DiscRatio,SchemeRatio&orderby=InvoiceID Desc&limit=1&filter=CustomerID=' +
              this.sale.CustomerID +
              " and DtCr='CR' And ProductID = " +
              this.sdetails.ProductID
          )
          .then((r: any) => {
            console.log(r);
            if (r.length > 0) {
              this.LastPrice = r[0];
            } else {
              this.LastPrice = {};
            }
          });
      }
    }
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }
  public SaveData(print = 0) {
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
      for (i = 0; i < res1.length; i++) {
        delete res1[i].ProductName;
        delete res1[i].Amount;
      }
      this.sale.details = res1;
      this.http.postTask('sale' + InvoiceID, this.sale).then(
        (r: any) => {
          this.Cancel(this.sale.SalesmanID, this.sale.RouteID);

          if (print == 1) window.open('/#/print/printinvoice/' + r.id);
          this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);
          if (this.EditID) {
            this.router.navigateByUrl('/sales/invoice');
          } else {
            this.cmbAccts.focus();
            this.scrollToAccts();
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
  public onEdit(event) {
    event.newData.Amount =
      event.newData.Qty * event.newData.SPrice * event.newData.Packing +
      event.newData.Pcs * event.newData.SPrice;
    event.newData.Discount =
      (event.newData.Amount * event.newData.DiscRatio) / 100;
    event.newData.NetAmount =
      event.newData.Amount -
      event.newData.Discount -
      (event.newData.Qty * event.newData.Packing + event.newData.Pcs * 1) *
        event.newData.SchemeRatio;

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

  CashInvoice(e) {
    this.sale.AmountRecvd = this.sale.NetAmount;
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
  }

  Cancel(smid = '', smrt = '') {
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = { Stock: 0 };
    this.sale = new SaleModel(this.Type);
    this.sale.SalesmanID = smid;
    this.sale.RouteID = smrt;
    this.sdetails = new SaleDetails();
    this.sdetails.Pcs = '0';

    this.btnsave = false;
    this.isPosted = false;
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
        this.cmbProduct.focus();
      }
    });
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template, { class: 'modal-lg' });
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

  public async FindReturnInvoice(ino) {
    try {
      let invoice: any = await this.http.getData('invoices/' + ino);

      if (invoice.ReturnID != '0') {
        this.myToaster.Warning(
          `This invoice already return via Invoice No ${invoice.ReturnID}`,
          ''
        );
        return;
      } else if (invoice.IsPosted == 0) {
        this.myToaster.Warning(`Invoice is not posted, please edit`, 'Error');
        return;
      } else if (invoice.DtCr == 'DT') {
        this.myToaster.Warning(`Invalid Invoice type `, 'Error');
        return;
      } else {
        this.http
          .postTask('makereturn', {
            InvoiceID: ino,
            Date: JSON2Date(new Date(getCurDate())),
          })
          .then((r: any) => {
            this.router.navigateByUrl('/sales/return/' + r.id);
            this.myToaster.Sucess(
              'Return Invoice have been created. Invoice # ' + r.id,
              'Return!'
            );

            this.LoadInvoice(r.id);
          });
      }
    } catch (error) {}
  }
}
