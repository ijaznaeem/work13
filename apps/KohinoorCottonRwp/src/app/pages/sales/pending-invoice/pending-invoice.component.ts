import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

import Swal from 'sweetalert2';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import {
  AddDate,
  GetDate,
} from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { InvoiceTypes } from '../../../factories/constants';
import {
  GetDateJSON,
  JSON2Date,
  getCurDate
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { PendingDetails, PendingModel, PendingSettings } from './pending-invoice.setting';

@Component({
  selector: 'app-pending-invoice',
  templateUrl: './pending-invoice.component.html',
  styleUrls: ['./pending-invoice.component.scss'],
})
export class PendingInvoiceComponent implements OnInit, OnChanges {
  @ViewChild('searchTab') searchTab: TabsetComponent;

  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('formqty') formSub: NgForm;
  @ViewChild('qty') elQty: ElementRef;
  @ViewChild('cmbProduct') cmbProduct;
  @ViewChild('txtRate') txtRate;
  @ViewChild('txtRemarks') txtRemarks;
  @ViewChild('cmbCustomers') cmbAccts;
  @ViewChild('scrollTop') scrollTop;

  searchData: any = {};
  SrchSttings = PendingSettings;
  srchResult: any = [];
  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public btnsave = false;
  public isPosted = false;
  public InvTypes = InvoiceTypes;
  public bsModalRef?: BsModalRef;
  sdetails = new PendingDetails();
  pending: any = new PendingModel();

  public settings = {
    selectMode: 'single', // single|multi
    hideHeader: false,
    hideSubHeader: false,
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
        editable: false,
      },
      KGs: {
        title: 'Kgs',
        editable: true,
      },

    },
    pager: {
      display: true,
      perPage: 50,
    },
  };
  Stores = this.cachedData.Stores$;
  Stock: any = [];

  public Prods = [];
  public Accounts: any = [];
  public SelectCust: any = {};
  public marked = false;
  public LastPrice: any = {};
  public modalRef: BsModalRef;
  public GPStoreID: 1;
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private myToaster: MyToastService
  ) {}

  ngOnInit() {
    this.Cancel();
    this.getCustomers('');
    this.onTabSelect();

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        console.log(this.EditID);
        this.LoadInvoice();
      }
    });
  }
  FindINo() {
    this.router.navigate(['/sale/pending/', this.Ino]);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadInvoice();
    }
  }
  LoadInvoice() {
    if (this.EditID && this.EditID !== '') {
      console.log('loadinvoice', this.EditID);

      this.http.getData('pending/' + this.EditID).then((r: any) => {
        if (!r) {
          this.myToaster.Warning('Invalid Invoice No', 'Edit', 1);
          this.router.navigateByUrl('sale/pending');
          return;
        }

        this.pending = r;
        this.pending.Date = GetDateJSON(new Date(r.Date));
        console.log(this.pending);

        this.http
          .getData('qrypendingdetails?filter=invoiceid=' + this.EditID)
          .then((rdet: any) => {
            this.data.empty();

            for (const det of rdet) {
              const {
                ProductID,
                ProductName,
                Qty,
                KGs,

                StockID,
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

                StockID,
                Packing,
                StoreID,
                StoreName,
                UnitValue,
              });
            }
          });
      });
    }
  }
  ProductSearchFn(term: string, item) {
    return (
      item.ProductName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) >=
        0 || item.ProductID == term
    );
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
      this.pending.PrevBalance = this.SelectCust.Balance;
      this.pending.CustomerName = this.SelectCust.CustomerName;
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

    console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      StoreName: ord.StoreName,
      PPrice: parseFloat('0' + ord.PPrice),
      SPrice: parseFloat('0' + ord.SPrice),
      Qty: parseFloat(ord.Qty),
      KGs: parseFloat(ord.KGs),

      UnitValue: ord.UnitValue,
      ProductID: ord.ProductID,
      StockID: ord.StockID,
      Packing: ord.Packing,
      StoreID: ord.StoreID,
      BusinessID: this.http.getBusinessID(),

    };
    console.log(obj);

    this.data.prepend(obj);
  }
  public AddOrder() {
    // this.sdetails.DiscRatio = parseFloat('0' +this.sdetails.DiscRatio);
    // this.sdetails.Bonus = parseFloat('0' + this.sdetails.Bonus);
    // this.sdetails.SchemeRatio = parseFloat('0' + this.sdetails.SchemeRatio);

    if (this.sdetails.SPrice * 1 < this.selectedProduct.PPrice * 1) {
      Swal.fire({
        text: 'Invalid pending rate',
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
    this.cmbProduct.focus();
    let strID = this.sdetails.StoreID;
    this.sdetails = new PendingDetails();
    this.sdetails.StoreID = strID;
  }

  ProductSelected(product) {
    //this.selectedProduct = product;

    if (product) {
      console.log(product);

      this.sdetails.Packing = product.Packing;
      this.sdetails.UnitValue = product.UnitValue;
      this.sdetails.ProductName = product.ProductName;
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
    this.pending.BusinessID = this.http.getBusinessID();
    this.pending.ClosingID = this.http.getClosingID();

    this.pending.Time = this.getTime(new Date());
    this.pending.Date = JSON2Date(this.pending.Date);
    this.pending.UserID = this.http.getUserID();

    this.data.getAll().then((res1) => {
      let i = 0;
      console.log(res1);

      this.pending.details = res1;
      this.http.postTask('pendinginvoice' + InvoiceID, this.pending).then(
        (r: any) => {
          this.myToaster.Sucess('Invoice Saved Successfully', 'Save', 2);

          if (this.EditID != '') {
            this.router.navigateByUrl('/sale/pending');
          } else {
            this.Cancel();
            this.cmbAccts.focus();
            this.scrollToAccts();
          }
        },
        (err) => {
          this.pending.Date = GetDateJSON(new Date(getCurDate()));
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
        this.checkLength();
      }, 100);
    } else {
      event.confirm.reject();
    }
  }
  public onEdit(event) {


    event.confirm.resolve(event.newData);

  }



  Cancel() {
    let userID = this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.pending = new PendingModel();
    this.pending.UserID = this.http.getUserID();
    this.http.getData('getbno/1').then((r: any) => {
      this.pending.InvoiceID = Number(r.billno) + 1;
    });

    this.sdetails = new PendingDetails();

    this.btnsave = false;
    this.isPosted = false;
    this.SelectCust = {};
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
        this.router.navigateByUrl('/sale/pending/' + billNo);
        break;
      case Buttons.Previous:
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.router.navigateByUrl('/sale/pending/' + billNo);
        break;
      case Buttons.Next:
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.router.navigateByUrl('/sale/pending/' + billNo);
        break;
      case Buttons.Last:
        this.http.getData('getbno/4').then((r: any) => {
          billNo = r.billno;
          console.log(r);

          this.router.navigateByUrl('/sale/pending/' + billNo);
        });
        break;
      default:
        break;
    }
    //this.router.navigateByUrl('/pending/wholepending/' + billNo);
  }
  NewInvoice() {
    this.Cancel();
    this.router.navigateByUrl('/sale/pending');
  }
  PrintInvoice() {

  }
  onTabSelect() {
    this.searchData.FromDate = GetDate(AddDate(new Date(), -30));
    this.searchData.ToDate = GetDate();
    this.searchData.CustomerID = '1370';
  }
  Clicked(e) {
    if (e.data) {
      this.router.navigateByUrl('/sale/pending/' + e.data.InvoiceID);
      this.searchTab.tabs[0].active = true;
    }
  }

}
