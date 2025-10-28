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
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
import { PrintBillService } from '../../../services/print-bill.service';
import { MyToastService } from '../../../services/toaster.server';
import { SaleDetails, SaleModel } from '../sale.model';
import { SearchStockComponent } from '../search-stock/search-stock.component';


@Component({
  selector: 'app-cash-sale',
  templateUrl: './cash-sale.component.html',
  styleUrls: ['./cash-sale.component.scss'],
})
export class CashSaleComponent implements OnInit, OnChanges {
  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('formqty') formSub: NgForm;
  @ViewChild('qty') elQty: ElementRef;
  @ViewChild('txtRate') txtRate: any;
  @ViewChild('cmbAccts') cmbAccts: { focus: () => void; };
  @ViewChild('cmbProduct') cmbProduct: { focus: () => void; };

  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public btnsave = false;
  public isPosted = false;
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
  Routes: Observable<any[]> ;
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
    private bill: PrintBillService,

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
    // this.getCustomers('');

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        console.log(this.EditID);
        this.LoadInvoice();
      }
    });
    this.sale.Type = '2';
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

  getCustomers(routeid: string | undefined) {
    this.http.getCustList(routeid).then((r: any) => {
      this.Accounts = [...r];
    });
  }
  CustomerSelected(event: { CustomerID: any; }) {
    console.log(event);

    if (event) {
      this.SelectCust = this.Accounts.find((x: { CustomerID: any; }) => {
        return x.CustomerID == event.CustomerID;
      });
      this.sale.PrevBalance = this.SelectCust.Balance;
      //this.sale.CustomerName = this.SelectCust.CustomerName;

    }
  }
  RouteSelected($event:  any ) {
    if ($event) this.getCustomers($event.RouteID);
  }

  AddToDetails(ord: any) {
    const tQty =
      parseFloat('0' + ord.Qty) * parseFloat(ord.Packing) + parseFloat(ord.Pcs);

    console.log(ord);
    const obj = {
      PCode: ord.PCode,
      ProductName: ord.ProductName,
      PPrice: parseFloat('0' + ord.PPrice),
      SPrice: parseFloat('0' + ord.SPrice),
      Qty: parseFloat(ord.Qty),
      Bonus: parseFloat('0' + ord.Bonus),
      Pcs: parseFloat(ord.Pcs),
      Amount: RoundTo2(ord.SPrice * tQty),
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      Packing: ord.Packing,
      DiscRatio: ord.DiscRatio,
      SchemeRatio: 0,
      Remarks: ord.Remarks,
      Discount: (ord.SPrice * tQty * ord.DiscRatio) / 100,
      Scheme: 0,
      BusinessID: this.http.getBusinessID(),
      NetAmount:
        RoundTo2(ord.SPrice * tQty) - (ord.SPrice * tQty * ord.DiscRatio) / 100,
    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
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
      this.selectedProduct.Stock
    ) {
      this.myToaster.Warning('low stock warning!', 'warning');
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

  ProductSelected(product: any) {
    this.selectedProduct = product;

    if (product) {
      this.sdetails.PPrice = this.selectedProduct.PPrice;
      this.sdetails.SPrice = this.selectedProduct.RetailRate;
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
      console.log(res1);

      this.sale.details = res1;
      this.http.postTask('sale' + InvoiceID, this.sale).then(
        (r: any) => {
          this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);
          if (print == 1) window.open('/#/print/printinvoice/' + r.id);
          if (this.EditID) {
            this.router.navigateByUrl('/sales/invoice');
          } else {
            this.cmbAccts.focus();
            this.Cancel(this.sale.SalesmanID, this.sale.RouteID);
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
  public onDeleteConfirm(event: { confirm: { resolve: () => void; reject: () => void; }; }): void {
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
  public onEdit(event: { newData: { Amount: number; Qty: number; Packing: number; Pcs: number; SPrice: number; Discount: number; DiscRatio: number; NetAmount: number; }; confirm: { resolve: (arg0: any) => void; }; }) {
    event.newData.Amount = (event.newData.Qty * event.newData.Packing + event.newData.Pcs)
     * event.newData.SPrice;
    event.newData.Discount =
      ((event.newData.Qty * event.newData.Packing + event.newData.Pcs) * event.newData.SPrice * event.newData.DiscRatio) /
      100;
    event.newData.NetAmount = RoundTo2( event.newData.Amount - event.newData.Discount);

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }

  CashInvoice(e: any) {
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

    this.bsModalRef.content.Event.subscribe((res: { res: string; data: { Packing: number; }; }) => {
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
  PrintBill(r = {}) {
    this.cmbProduct.focus();
    this.sale['Business'] = this.http.GetBData();
    this.sale['UserName'] = this.http.getUserData().SalesmanName;

    this.bill.PrintPDFBill(Object.assign(r, this.sale));
    this.Cancel(this.sale.SalesmanID);
    this.cmbProduct.focus();
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
  customSearchFn(term: string, item: { CustomerName: string; }) {
    return item.CustomerName.toLowerCase().includes(
      term.toLowerCase()
    );
  }

  ProductSearchFn(term: string, item: { ProductName: string; }) {
    // console.log(item);

    return (
      item.ProductName.toLowerCase().includes(
        term.toLowerCase()
      )
    );
  }
  Round(v: number) {
    return RoundTo2(v);
  }
}
