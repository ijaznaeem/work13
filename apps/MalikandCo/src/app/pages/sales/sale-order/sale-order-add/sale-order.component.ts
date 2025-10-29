import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { GetDateJSON, JSON2Date } from '../../../../factories/utilities';
import { CachedDataService } from '../../../../services/cacheddata.service';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';
import { OrdersDetails } from './sale-order.setting';

@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss'],
})
export class SaleOrderComponent implements OnInit {
  @Input() EditID = '';

  @ViewChild('fromPurchase') fromPurchase: NgForm;
  @ViewChild('cmbProduct') cmbProduct;
  @ViewChild('cmbCustomers') cmbAccts: NgSelectComponent;
  @Output() onClose = new EventEmitter();

  public data = new LocalDataSource([]);
  selectedProduct: any;
  public Ino = '';

  sdetails = new OrdersDetails();

  Categories: Observable<any[]>;
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
    private myToaster: MyToastService,
  ) {}

  ngOnInit() {
    this.sdetails.UserID = this.http.getUserID();
    this.Categories = this.cachedData.Categories$;
    this.getCustomers('');
    console.log('loadorder', this.EditID);
    if (this.EditID && this.EditID !== '') {
      this.LoadOrder();
    }


    // this.activatedRoute.params.subscribe((params: Params) => {
    //   if (params.EditID) {

    //   }
    // });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cmbAccts.focus();
    }, 300);
  }

  LoadOrder() {
    if (this.EditID && this.EditID !== '') {
      console.log('LoadOrder', this.EditID);
      this.Ino = this.EditID;

      this.http.getData('orders/' + this.EditID).then((rdet: any) => {
        rdet.Date = GetDateJSON(new Date(rdet.Date));
        this.sdetails = rdet;

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



    if (Number('0' + this.sdetails.Qty) == 0) {
      this.myToaster.Error('Quantity not given', 'Error');
      return;
    }


    this.sdetails.Date = JSON2Date(this.sdetails.Date);
    this.http
      .postData('orders' + (this.EditID != '' ? '/' + this.EditID: ''), this.sdetails)
      .then((r: any) => {
        this.myToaster.Sucess('Sale Ordered', 'Save', 2);
        this.bsModalRef.hide();
      })
      .catch((err) => {
        this.sdetails.Date = GetDateJSON(this.sdetails.Date);
        this.myToaster.Error('Error saving sale', 'Error', 2);
      });
  }


  getTime(d: Date) {
    return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
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



  Cancel() {
    this.bsModalRef.hide();
  }
}
