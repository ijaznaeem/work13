import {
  AfterViewInit,
  Component,
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

import { NgSelectComponent } from '@ng-select/ng-select';
import {
  ButtonConfig,
  ButtonsBarComponent,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/buttons-bar/buttons-bar.component';
import { Buttons } from '../../../../../../../libs/future-tech-lib/src/lib/components/navigator/navigator.component';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import {
  FindTotal,
  GetDateJSON,
  JSON2Date,
  RoundTo2,
  getCurDate,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { MyToastService } from '../../../services/toaster.server';
import { DetailsSettings, OrderDetails, OrderModel, OrderSettings, SearchForm } from './order.settings';

@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss'],
})
export class SaleOrderComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('searchTab') searchTab: TabsetComponent;
  @ViewChild('gatepass') gpTmplt;
  @ViewChild('btnBar') btnBar: ButtonsBarComponent;

  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('formqty') formSub: NgForm;
  @ViewChild('cmbProduct') cmbProduct;
  @ViewChild('cmbCustomers') cmbAccts: NgSelectComponent;

  SrchForm = SearchForm;
  searchData: any = {};
  SrchSttings = OrderSettings;
  srchResult: any = [];
  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';
  public btnsave = false;
  public isPosted = false;
  public isSaving = false;
  public btnLocked = true;
  public bsModalRef?: BsModalRef;
  orderdetails = new OrderDetails();
  order: any = new OrderModel();

  public settings = DetailsSettings
  Products: any = [];

  public Accounts: any = [];
  public SelectCust: any = {};
  TotalWeight = 0;
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
      action: () => this.NewOrder(),
    },
    {
      title: 'Edit',
      icon: 'fa fa-pencil',
      classes: 'btn-secondary',
      action: () => this.EditOrder(),
      disabled: true,
    },
    {
      title: 'Print',
      icon: 'fa fa-print',
      classes: 'btn-warning',
      action: () => this.PrintOrder(this.EditID),
    },
    // {
    //   title: 'Gatepass',
    //   icon: 'fa fa-print',
    //   classes: 'btn-danger',
    //   action: () => this.OpenGatepass(this.gpTmplt),
    // },
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
      action: () => this.CancelOrder(),
    },
  ];

  ngOnInit() {
    this.btnLocked = false;
    this.Products = this.cachedData.Products$
    this.Cancel();
    this.getCustomers('');
    this.onTabSelect();

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        if (this.EditID == '0') {
          this.NavigatorClicked({ Button: Buttons.Last });
        } else {
          this.LoadOrder();
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
    this.router.navigate(['/sale/order/', this.Ino]);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadOrder();
    }
  }
  LoadOrder() {
    if (this.EditID && this.EditID !== '') {
      console.log('loadorder', this.EditID);
      this.Ino = this.EditID;
      this.http.getData('orders/' + this.EditID).then((r: any) => {
        if (!r) {
          this.myToaster.Warning('Invalid Order No', 'Edit', 1);
          this.router.navigateByUrl('sale/order');
          return;
        }
        if (r.IsPosted == '1') {
          // this.myToaster.Warning('Order is already posted', 'Edit', 1);
          this.isPosted = true;
        } else {
          this.isPosted = false;
        }
        this.EditDisabled(false);
        this.order = r;
        this.order.Date = GetDateJSON(new Date(r.Date));

        this.http
          .getData(
            'qryorderdetails?orderby=DetailID desc&filter=orderid=' +
              this.EditID
          )
          .then((rdet: any) => {
            this.data.empty();

            for (const det of rdet) {
              const {
                ProductID,
                ProductName,
                Qty,
                KGs,
                Weight,
                SPrice,
              } = det;
              // Create new object with selected properties
              this.AddToDetails({
                ProductID,
                ProductName,
                Qty,
                KGs,
                Weight,
                SPrice,
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
      this.order.PrevBalance = this.SelectCust.Balance;
      this.order.CustomerName = this.SelectCust.CustomerName;
    }
  }


  AddToDetails(ord: any) {
    const tQty =
      parseFloat('0' + ord.Qty) ;

    // console.log(ord);
    const obj = {
      ProductName: ord.ProductName,
      SPrice: parseFloat('0' + ord.SPrice),
      Qty: parseFloat(ord.Qty),
      TWeight: RoundTo2(ord.Qty * ord.Weight),
      Amount: RoundTo2(ord.SPrice * tQty),
      ProductID: ord.ProductID,
      BusinessID: this.http.getBusinessID(),
    };

    this.data.prepend(obj);
  }
  public AddOrder() {

    console.log(this.orderdetails);

    if (Number('0' + this.orderdetails.Qty) == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }

    this.AddToDetails(this.orderdetails);
    this.data.refresh();
    this.calculation();
    this.cmbProduct.focus();
    this.orderdetails = new OrderDetails();
  }

  ProductSelected(product) {
    this.selectedProduct = product;

    if (product) {
      console.log(product);
      this.orderdetails.SPrice = product.SPrice;
      this.orderdetails.ProductName = product.ProductName;
      this.orderdetails.Weight = product.Weight;
    }
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }
  public async SaveData() {
    this.isSaving = true;
    let OrderID = '';
    // if (this.order.CustomerID)

    let res1 = await this.data.getAll();
    if (!this.fromPurchase.valid || res1.length == 0) {
      this.myToaster.Error('Invalid Data', 'Save', 2);
      return;
    }
    if (this.EditID) {
      OrderID = '/' + this.EditID;
    }
    this.order.BusinessID = this.http.getBusinessID();
    this.order.ClosingID = this.http.getClosingID();

    this.order.Time = this.getTime(new Date());
    this.order.Date = JSON2Date(this.order.Date);
    this.order.UserID = this.http.getUserID();

    let i = 0;
    console.log(res1);

    this.order.details = res1;
    this.http.postTask('saleorder' + OrderID, this.order).then(
      (r: any) => {
        this.myToaster.Sucess('Order Saved Successfully', 'Save', 2);

        if (this.EditID != '') {
          this.LoadOrder();
        } else {
          this.NavigatorClicked({ Button: Buttons.Last });
        }
        this.isSaving = false;
      },
      (err) => {
        this.order.Date = GetDateJSON(new Date(getCurDate()));
        this.myToaster.Error('Error saving order', 'Error', 2);
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
      ((event.newData.Qty ) *
        event.newData.SPrice) ;

    event.confirm.resolve(event.newData);
    setTimeout(() => {
      this.calculation();
    }, 100);
  }


  public calculation() {
    this.order.Amount = 0;

    this.data.getAll().then((d) => {
      console.log(d);

      let i = 0;
      this.order.Amount = FindTotal(d, 'Amount');
      this.TotalWeight = FindTotal(d, 'TWeight');
    });
  }
  GetWight() {
    return RoundTo2(this.TotalWeight);
  }

  Cancel() {
    this.data.empty();
    this.data.refresh();
    this.selectedProduct = {};
    this.order = new OrderModel();
    this.order.UserID = this.http.getUserID();

    this.orderdetails = new OrderDetails();

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
    let billNo = 1;
    switch (Number(e.Button)) {
      case Buttons.First:
        this.router.navigateByUrl('/sale/order/' + billNo);
        break;
      case Buttons.Previous:
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.router.navigateByUrl('/sale/order/' + billNo);
        break;
      case Buttons.Next:
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.router.navigateByUrl('/sale/order/' + billNo);
        break;
      case Buttons.Last:
        this.http.getData('getbno/4/' + getCurDate()).then((r: any) => {
          billNo = r.billno;
          console.log(r);

          this.router.navigateByUrl('/sale/order/' + billNo);
        });
        break;
      default:
        break;
    }
    //this.router.navigateByUrl('/order/wholeorder/' + billNo);
  }
  NewOrder() {
    //this.Cancel();
    this.router.navigateByUrl('/sale/order');
  }

  onTabSelect() {
    this.searchData.FromDate = GetDate();
    this.searchData.ToDate = GetDate();
    this.searchData.CustomerID = '';
  }
  Clicked(e) {
    if (e.data) {
      this.router.navigateByUrl('/sale/order/' + e.data.OrderID);
      this.searchTab.tabs[0].active = true;
    }
  }
  BeforeSave(e) {
    e.cancel = true;

    let filter = `Date between '${this.searchData.FromDate}' and '${this.searchData.ToDate}'`;
    if (this.searchData.CustomerID) {
      filter += ' And CustomerID = ' + this.searchData.CustomerID;
    }

    this.http.getData('qryorders?filter=' + filter).then((r) => {
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
  PrintOrder(OrderID) {
    // window.open('/#/print/printorder/' + OrderID, '_blank');
    this.http.PrintOrder(OrderID);
    return;
  }

  async scrapData() {
    let data = await this.http.getData('printbill/' + this.EditID);
    data = this.GetPrintData(data);
    this.bill.PrintPDFBill_A5(data);
    // this.bill.PrintUrduBill()
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

  EditOrder() {
    this.EditDisabled(true);
    this.cmbAccts.focus();
  }
  CancelOrder() {
    this.Cancel();
    if (this.EditID != '') {
      this.LoadOrder();
    } else {
      this.NavigatorClicked({
        Button: Buttons.Last,
      });
    }
  }
}
