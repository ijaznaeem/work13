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
import { FindCtrl } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { DailyCash } from '../../../factories/static.data';
import { GetProps, RoundTo } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { GolTrForm } from './gold-transaction.settings';

@Component({
  selector: 'app-gold-transaction',
  templateUrl: './gold-transaction.component.html',
  styleUrls: ['./gold-transaction.component.scss'],
})
export class GoldTransactionComponent implements OnInit, OnChanges {
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

  orderData: any = new DailyCash();
  orderForm = GolTrForm;

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
    this.Cancel();
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
    this.Cancel();
    this.Ino = this.EditID;
    console.log(this.EditID);

    this.http
      .getData('DailyCash', { filter: `DailyID='${this.EditID}'` })
      .then((r: any) => {
        if (r.length > 0) {
          this.isPosted = !(r[0].IsPosted == '0');
          this.orderData = GetProps(r[0], Object.keys(new DailyCash()));
          this.orderData.Date = this.orderData.Date.split(' ')[0];

          this.CalcGoldAmount();
        } else {
          this.myToaster.Error('Invoice No not found', 'Edit', 1);
        }
      });
  }
  public Save(event) {

    console.log('Save called', this.orderData);

    if (!this.orderData.CustomerID || this.orderData.CustomerID === '') {
      this.myToaster.Error('Please select a customer', 'Save', 1);
      return;
    }

    if (this.orderData.RawGold > 0 && this.orderData.GoldTypeID == '') {
      this.myToaster.Error('Please select Gold Type', 'Save', 1);
      return;
    }

    if (this.orderData.Gold < 0) {
      this.myToaster.Error('Invalid Gold Amount', 'Save', 1);
      return;
    }
    if (this.orderData.GoldRate < 0) {
      this.myToaster.Error('Invalid Gold Rate', 'Save', 1);
      return;
    }
    if (
      (!this.orderData.Gold || this.orderData.Gold <= 0) &&
      (!this.orderData.TotalCash || this.orderData.TotalCash <= 0)
    ) {
      this.myToaster.Error('Please enter Gold or  Cash amount', 'Save', 1);
      return;
    }

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

  public async Changed(event) {
    console.log(event);
    if (event.fldName == 'RawGold' || event.fldName == 'GoldCutting') {
      this.orderData.Gold = RoundTo(
        this.orderData.RawGold -
          (this.orderData.RawGold * this.orderData.GoldCutting) / 96,
        4
      );
      this.CalcGoldAmount();
    } else if (event.fldName == 'GoldRate' || event.fldName == 'Gold') {
      this.CalcGoldAmount();
    } else if (event.fldName == 'Cash' || event.fldName == 'GoldAmount') {
      this.CalcTotalAmount();
    } else if (event.fldName == 'CustomerID') {
      let cust: any = await this.http.getData('Customers/' + event.value);
      if (cust) {
        this.orderData.CBal = RoundTo(cust.Balance, 0);
        this.orderData.K24 = RoundTo(cust.GoldBalance, 3);
        this.orderData.K22 = RoundTo(cust.Gold21K, 3);
      } else {
        this.SelectCust = {};
        this.orderData.CBal = '0';
        this.orderData.K24 = '0';
        this.orderData.K22 = '0';
      }
    } else if (event.fldName == 'TrType') {
      const CashFld = FindCtrl(this.orderForm, 'CashReceived');

      if (CashFld && event.value == 'CR') {
        CashFld.label = 'Cash Received';
      } else if (CashFld && event.value == 'DT') {
        CashFld.label = 'Cash Paid';
      }
    }
  }
  CalcGoldAmount() {
    const nRate = RoundTo(this.orderData.GoldRate / 11.664, 4);
    this.orderData.GoldAmount = RoundTo(this.orderData.Gold * nRate, 4);
    this.orderData.RateInGrams = RoundTo(nRate, 4);
    this.CalcTotalAmount();
  }
  CalcTotalAmount() {
    this.orderData.TotalCash = RoundTo(
      Number(this.orderData.Cash) + Number(this.orderData.GoldAmount),
      4
    );
    this.orderData.CashBalance = RoundTo(
      this.orderData.TotalCash - this.orderData.CashReceived,
      4
    );
  }
  Cancel() {
    this.isPosted = false;
    this.orderData = new DailyCash();
    this.orderData.Type = 'TR';
    this.btnsave = false;
    this.CalcGoldAmount();
  }

  FindINo() {
    this.NavigateTo(this.Ino);
  }
  NavigateTo(rt = '') {
    this.router.navigateByUrl('/sale/gold' + (rt != '' ? '/' + rt : ''));
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
        this.Cancel();
        break;
      default:
        this.NavigatorClicked(e);
    }
  }

  NavigatorClicked(e) {
    console.log(e);

    let billNo: any = 'TR-100000001';
    switch (e.col.label) {
      case 'First':
        this.NavigateTo(billNo);
        break;
      case 'Prev':
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID.slice(-9)) - 1 > billNo) {
            billNo = Number(this.EditID.slice(-9)) - 1;
          }
        }
        this.NavigateTo(billNo);
        break;
      case 'Next':
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID.slice(-9)) + 1;
        }
        this.NavigateTo(billNo);
        break;
      case 'Last':
        this.http.getData('getbno/TR').then((r: any) => {
          billNo = r.billno;
          this.NavigateTo(billNo);
        });
        break;
      default:
        break;
    }
  }
}
