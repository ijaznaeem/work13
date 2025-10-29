import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs';
import { DailyCash } from '../../../factories/static.data';
import { GetProps, RoundTo } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { SaleOrderForm } from './sale-order.settings';

@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss'],
})
export class SaleOrderComponent implements OnInit, OnChanges {
  @Input() Type: string;
  @Input() EditID = '';
  @ViewChild('fromSale') fromSale;
  @ViewChild('cmbProduct') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbCustomers') cmbCustomers;

  public data = new LocalDataSource([]);
  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  orderData:any = {};
  orderForm = SaleOrderForm;

  public selectedProduct: any = {};

  AcctTypes: Observable<any[]>;
  SelectCust: any = {};

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.AcctTypes = this.cachedData.acctTypes$;
  }

  ngOnInit() {
    this.Cancel({});
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        this.LoadInvoice();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.EditID.currentValue != changes.EditID.previousValue) {
      this.LoadInvoice();
    }
  }

  LoadInvoice() {
    this.Cancel({});
    this.Ino = this.EditID;
    console.log(this.EditID);

    this.http
      .getData(`Orders?filter=OrderID='${this.EditID}'`)
      .then((r: any) => {
        if (r.length > 0) {
          this.isPosted = !(r[0].IsPosted == '0');
          this.orderData = GetProps(r[0], Object.keys(new DailyCash()));
          this.orderData.OrderDate = this.orderData.OrderDate.split(' ')[0];
          this.orderData.DueDate = this.orderData.DueDate.split(' ')[0];
          this.CalcGoldAmount();
        } else {
          this.myToaster.Error('Invoice No not found', 'Edit', 1);
        }
      });
  }
  public Save(event) {
    this.http
      .postTask(
        'dailycash' + (this.EditID == '' ? '' : '/' + this.EditID),
        this.orderData
      )
      .then((r: any) => {
        if (r) {
          this.myToaster.Success('Saved Successfully', 'Save', 1);
          this.btnsave = true;
          this.isPosted = false;
          if (this.EditID == '') {
            this.NavigatorClicked({ col: { label: 'Last' } });
          }
        }
      })
      .catch((err) => {
        this.myToaster.Error('Error Saving', 'Save', 1);
      });
  }
  BeforeSave(event) {
    console.log(event);
    delete event.data['RateInGrams'];
  }

  public Changed(event) {
    console.log(event);
    if (event.fldName == 'RawGold' || event.fldName == 'GoldCutting') {
      this.orderData.AdvanceGold = RoundTo(
        this.orderData.RawGold -
          (this.orderData.RawGold * this.orderData.GoldCutting) / 96,
        4
      );
      this.CalcGoldAmount();
    } else if (event.fldName == 'GoldRate' || event.fldName == 'AdvanceGold') {
      this.CalcGoldAmount();
    } else if (
      event.fldName == 'AdvanceAmount' ||
      event.fldName == 'GoldAmount'
    ) {
      this.CalcTotalAmount();
    }
  }
  CalcGoldAmount() {
    const nRate = RoundTo(this.orderData.GoldRate / 11.664, 4);
    this.orderData.GoldAmount = RoundTo(this.orderData.AdvanceGold * nRate, 4);
    this.orderData.RateInGrams = RoundTo(nRate, 4);
    this.CalcTotalAmount();
  }
  CalcTotalAmount() {
    this.orderData.TotalCash = RoundTo(
      Number(this.orderData.AdvanceAmount) + Number(this.orderData.GoldAmount),
      4
    );
  }
  Cancel(event) {
    this.isPosted = false;
    this.orderData = new DailyCash();
    this.btnsave = false;
  }

  FindINo() {
    this.NavigateTo(this.Ino);
  }
  NavigateTo(rt = '') {
    this.router.navigateByUrl('/sale/order' + (rt != '' ? '/' + rt : ''));
  }

  ButtonClicked(e) {
    switch (e.col.label) {
      case 'New':
        this.NavigateTo('');
        break;
      case 'Save':
        this.Save(e);
        break;
      case 'Cancel':
        this.Cancel(e);
        break;
      default:
        this.NavigatorClicked(e);
    }
  }

  NavigatorClicked(e) {
    console.log(e);

    let billNo: any = 1;
    switch (e.col.label) {
      case 'First':
        this.NavigateTo(billNo);
        break;
      case 'Prev':
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID.slice(-8)) - 1 > billNo) {
            billNo = Number(this.EditID.slice(-8)) - 1;
          }
        }
        this.router.navigateByUrl('/sale/order/' + billNo);
        break;
      case 'Next':
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID.slice(-8)) + 1;
        }
        this.router.navigateByUrl('/sale/order/' + billNo);
        break;
      case 'Last':
        this.http.getData('getbno/SO').then((r: any) => {
          billNo = r.billno;
          this.router.navigateByUrl('/sale/order/' + billNo);
        });
        break;
      default:
        break;
    }
  }
}
