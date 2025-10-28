import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { SearchComponent } from '../../../../../../../../libs/future-tech-lib/src/lib/components/search/search.component';
import { environment } from '../../../../../environments/environment';
import { GetDateJSON, JSON2Date, RoundTo2 } from '../../../../factories/utilities';
import { CachedDataService } from '../../../../services/cacheddata.service';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';
import { InvoiceDetails, SearchOrdersSettings } from './sale-add.setting';

@Component({
  selector: 'app-sale-add',
  templateUrl: './sale-add.component.html',
  styleUrls: ['./sale-add.component.scss'],
})
export class SaleAddComponent implements OnInit {
  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('OrderNo') OrderNo: ElementRef;
  @ViewChild('cmbStores') cmbStores: NgSelectComponent;
  @ViewChild('cmbProduct') cmbProduct;
  @ViewChild('cmbCustomers') cmbAccts: NgSelectComponent;
  @Output() onClose = new EventEmitter();

  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';

  sdetails = new InvoiceDetails();

  Stores: Observable<any[]>;
  Stock: any = [];

  public Prods = [];
  public Accounts: any = [];
  public SelectCust: any = {};
  public LastPrice: any = {};
  public curStoreID: any = 0;
  public GPStoreID: 1;
  TotalWeight = 0;
  curOrder: any = {};

  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpBase,
    private cachedData: CachedDataService,
    private modalService: BsModalService,
    private myToaster: MyToastService,
  ) {}

  ngOnInit() {
    this.sdetails.UserID = this.http.getUserID();
    this.Stores = this.cachedData.Stores$;
    this.getCustomers('');
    console.log('loadinvoice', this.EditID);
    if (this.EditID && this.EditID !== '') {
      this.LoadInvoice();
    }


    // this.activatedRoute.params.subscribe((params: Params) => {
    //   if (params.EditID) {

    //   }
    // });
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   this.cmbAccts.focus();
    // }, 300);
  }

  LoadInvoice() {
    if (this.EditID && this.EditID !== '') {
      console.log('loadinvoice', this.EditID);
      this.Ino = this.EditID;

      this.http.getData('sale/' + this.EditID).then((rdet: any) => {
        rdet.Date = GetDateJSON(new Date(rdet.Date));
        this.sdetails = rdet;
        this.StoreSelected({ StoreID: rdet.StoreID });

        const product = this.Stock.find((x) => {
          return x.ProductID == rdet.ProductID;
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
      // this.sdetails.PrevBalance = this.SelectCust.Balance;
    }
  }

  StoreSelected(e) {
    if (e) {
      this.http.getStock(e.StoreID).then((r) => {
        this.Stock = r;
      });
    }
  }

  public AddOrder() {
    if (!environment.production) {
      console.log(this.sdetails);
    }


    if (this.sdetails.CustomerID == '') {
      this.myToaster.Error('Customer not selected', 'Error');
      return;
    }

    const product = this.Stock.find((x) => {
      return x.ProductID == this.sdetails.ProductID;
    });

    if (this.sdetails.SPrice * 1 < product.PPrice * 1) {
      this.myToaster.Warning('Check sale rate', 'Warning', 2);
    }
    if (Number('0' + this.sdetails.Qty) == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }
    if (
      this.sdetails.Qty * this.sdetails.Packing >
      product.Stock
    ) {
      this.myToaster.Warning('stock not enough!', 'warning');
      // return;
    }

    if (Number('0' + this.sdetails.Packing) == 0) {
      this.sdetails.Packing = 1;
    }

    this.sdetails.Date = JSON2Date(this.sdetails.Date);
    this.http
      .postData('sale' + (this.EditID != '' ? '/' + this.EditID: ''), this.sdetails)
      .then((r: any) => {
        this.myToaster.Sucess('Sale Added', 'Save', 2);
        this.bsModalRef.hide();
      })
      .catch((err) => {
        this.sdetails.Date = GetDateJSON(this.sdetails.Date);
        this.myToaster.Error('Error saving sale', 'Error', 2);
      });
  }

  ProductSelected(product) {
    this.selectedProduct = product;

    if (product) {
      console.log(product);
      this.sdetails.PPrice = product.PPrice;
      this.sdetails.SPrice = product.SPrice;
      this.sdetails.Packing = product.Packing;
      // this.sdetails.ProductName = product.ProductName;
      this.sdetails.Weight = product.Weight;
    }
  }
  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }

  GetWeight() {
     return RoundTo2(this.sdetails.Qty * this.sdetails.Weight);
  }

  SubmitOrder() {
    if (this.fromPurchase.valid) {
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

  ProductSearchFn(term: any, item) {
    if (isNaN(term)) {
      return (
        item.ProductName.toLocaleLowerCase().indexOf(
          term.toLocaleLowerCase()
        ) >= 0
      );
    } else return item.ProductID == term;
  }

  Search(term = '') {
    const initialState: ModalOptions = {
      initialState: SearchOrdersSettings,
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    let modal: BsModalRef = this.modalService.show(
      SearchComponent,
      initialState
    );

    modal.content.Event.subscribe((res) => {
      if (res.res == 'ok') {
        modal?.hide();
        this.sdetails.OrderID = res.data.OrderID;
        this.LoadOrder(this.sdetails.OrderID);
      } else {
        this.bsModalRef?.hide();
        this.OrderNo.nativeElement.focus();
      }
    });
  }

  Find() {
    let code: any = this.sdetails.OrderID;

    if (code == '' || code == null) {
      this.Search();
      return;
    }
    this.LoadOrder(code);
  }
  LoadOrder(code) {
    this.http.getData('orders/' + code).then((r: any) => {
      if (r) {
        this.sdetails.CustomerID = r.CustomerID;
        this.sdetails.OrderID = r.OrderID;

        this.http
          .getData('qryorders?filter=orderid=' + code)
          .then((rdet: any) => {
            this.curOrder = rdet[0];
          });
      } else {
        this.myToaster.Error('Order not found', 'Error');
      }
    });
  }
  Cancel() {
    this.bsModalRef.hide();
  }
}
