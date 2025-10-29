import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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

@Component({
  selector: 'app-credit-sale',
  templateUrl: './credit-sale.component.html',
  styleUrls: ['./credit-sale.component.scss'],
})
export class CreditSaleComponent implements OnInit, OnChanges {
  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase;

  @ViewChild('cmbAccts') cmbAccts;
  @ViewChild('scrollTop') scrollTop;
  @ViewChild('qty') elQty: ElementRef;
  @ViewChild('cmbRoutes') cmbRoutes;
  @ViewChild('cmbProduct') cmbProduct;

  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public btnsave = false;
  public isPosted = false;
  public InvTypes = InvoiceTypes;
  public bsModalRef?: BsModalRef;
  sdetails = new SaleDetails();
  sale = new SaleModel();

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
      deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
      confirmDelete: true,
    },
    noDataMessage: 'No data found',
    columns: {
      ProductName: {
        editable: false,
        title: 'Product',
        width: '250px',
      },
      SPrice: {
        title: 'Price',
        editable: true,
      },
      Qty: {
        title: 'Packs',
        editable: true,
      },
      Packing: {
        title: 'Packing',
        editable: false,
      },
      Pcs: {
        title: 'Pcs',
        editable: true,
      },

      Bonus: {
        title: 'Bonus',
        editable: true,
      },
      Amount: {
        editable: false,
        title: 'Amount',
      },

      DiscRatio: {
        editable: true,
        title: '%age',
      },
      SchemeRatio: {
        editable: true,
        title: 'Scheme',
      },
      NetAmount: {
        editable: false,
        title: 'Net Amount',
      },
    },
    pager: {
      display: true,
      perPage: 50,
    },
  };
  Salesman: Observable<any[]>;
  Companies: Observable<any[]>;
  Routes: Observable<any[]>;
  Stock: Observable<any[]>;
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
    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService
  ) {
    this.Salesman = this.cachedData.Salesman$;
  this.Companies = this.cachedData.Companies$;
  this.Routes = this.cachedData.routes$;
  this.Stock = this.cachedData.Stock$;
  }

  ngOnInit() {
    this.Cancel();
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        console.log(this.EditID);
        this.LoadInvoice();
      }
    });
    this.sale.Type = '1';
  }
  FindINo() {
    this.router.navigate(['/sales/invoice/', this.Ino]);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadInvoice();
    }
  }
  LoadInvoice() {
    if (this.EditID && this.EditID !== '') {
      console.log('loadinvoice', this.EditID);

      this.http.getData('invoices/' + this.EditID).then((r: any) => {
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

        this.http
          .getData('qryinvoicedetails?filter=invoiceid=' + this.EditID)
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
                SchemeRatio: det.SchemeRatio,
              });
            }
            this.calculation();
          });
      });
    }
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
    // this.sdetails.DiscRatio = parseFloat('0' +this.sdetails.DiscRatio);
    // this.sdetails.Bonus = parseFloat('0' + this.sdetails.Bonus);
    // this.sdetails.SchemeRatio = parseFloat('0' + this.sdetails.SchemeRatio);

    if (this.sdetails.SPrice * 1 < this.selectedProduct.PPrice * 1) {
      swal({
        text: 'Invalid sale rate',
        icon: 'warning',
      });
      return;
    }

    if (
      this.sale.DtCr == 'CR' &&
      this.sdetails.Qty * this.sdetails.Packing + this.sdetails.Pcs >
        this.selectedProduct.Stock
    ) {
      this.myToaster.Warning('low stock warning!', 'warning');
      return;
    }

    if (this.sdetails.Qty * this.sdetails.Packing + this.sdetails.Pcs == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }
    this.AddToDetails(this.sdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProduct.focus();
    this.sdetails = new SaleDetails();
  }

  ProductSelected(product) {
    this.selectedProduct = product;

    if (product) {
      this.sdetails.PPrice = this.selectedProduct.PPrice;
      this.sdetails.SPrice = this.selectedProduct.SPrice;
      this.sdetails.Packing = this.selectedProduct.Packing;
      this.sdetails.ProductID = this.selectedProduct.ProductID;
      this.sdetails.StockID = this.selectedProduct.StockID;
      this.sdetails.ProductName = this.selectedProduct.ProductName;
      this.sdetails.PCode = this.selectedProduct.PCode;
      this.elQty.nativeElement.focus();
    } else {
      this.selectedProduct = {};
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
      (event.newData.Qty * event.newData.Packing +
      event.newData.Pcs * 1) * event.newData.SPrice;
    event.newData.Discount =
      (event.newData.Amount * event.newData.DiscRatio) / 100;
    event.newData.NetAmount =
      event.newData.Amount +

      event.newData.Discount * 1 -
      (event.newData.Qty * event.newData.Packing + event.newData.Pcs * 1) *
        event.newData.SchemeRatio;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }
  getStock(v) {
    this.http
      .getData(
        'qrystock?filter=Stock > 0&orderby=ProductName&filter= CompanyID=' + v
      )
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
    let InvAmount: number = 0;
    let InvDisc: number = 0;
    let InvScheme: number = 0;

    this.data
      .getAll()
      .then((d) => {
        console.log('Fetched Data:', d);
        for (let item of d) {
          // Destructuring the item for cleaner access
          const { Amount, DiscRatio, Qty, Packing, Pcs, SchemeRatio } = item;

          InvAmount += Number(Amount);
          InvDisc += (Amount * DiscRatio) / 100;
          InvScheme += (Qty * Packing + Pcs) * SchemeRatio;
        }
        this.sale.Amount = this.Round(InvAmount);
        this.sale.Discount = this.Round(InvDisc);
        this.sale.Scheme = this.Round(InvScheme);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  Cancel(smid = '', smrt = '') {
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.sale = new SaleModel();
    this.sale.SalesmanID = smid;
    this.sale.RouteID = smrt;
    this.sdetails = new SaleDetails();

    this.btnsave = false;
    this.isPosted = false;
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  customSearchFn(term: string, item) {
    return item.CustomerName.toLowerCase().includes(
      term.toLowerCase()
    );
  }
  ProductSearchFn(term: string, item) {
    return (
      item.ProductName.toLowerCase().includes(
        term.toLowerCase()
      )
    );
  }
  scrollToAccts() {
    if (this.scrollTop && this.scrollTop.nativeElement) {
      const element = this.scrollTop.nativeElement as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  Round(v) {
    return RoundTo2(v);
  }
}
