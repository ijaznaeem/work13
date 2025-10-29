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
import { GoldTrForm } from './gold-paid-receipt.settings';

@Component({
  selector: 'app-gold-paid_receipt',
  templateUrl: './gold-paid-receipt.component.html',
  styleUrls: ['./gold-paid-receipt.component.scss'],
})
export class GoldPaidReceiptComponent implements OnInit, OnChanges {
  @Input() Type: string;
  @Input() EditID = '';
  @ViewChild('fromSale') fromSale;
  @ViewChild('cmbProduct') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbCustomers') cmbCustomers;

  public data = new LocalDataSource([]);
  readonly VType = 'GV'; // Payment Voucher
  readonly navigateURL = '/sale/gold-paid-receipt';

  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  orderData = new DailyCash();
  orderForm = GoldTrForm;

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
    this.EditID = '';
    this.Ino = '';
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
          this.CalGold();
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

  public async Changed(event) {
    console.log(event);

    if (event.fldName == 'CustomerID') {
      let cust: any = await this.http.getData('Customers/' + event.value);
      if (cust) {
        this.orderData.CBal = RoundTo(cust.Balance || 0, 0);
        this.orderData.K24 = RoundTo(cust.GoldBalance || 0, 3);
        this.orderData.K22 = RoundTo(cust.Gold21K || 0, 3);
      } else {
        this.orderData.CBal = this.orderData.K24 = this.orderData.K22 = 0;
      }
    } else if (event.fldName == 'RawGold' || event.fldName == 'CutRatio' || event.fldName == 'GoldCutting') {
      this.CalGold();
    }
  }

  CalGold() {
    this.orderData.GoldCutting = RoundTo(
      Number(this.orderData.RawGold) * Number(this.orderData.CutRatio)/ 96,
      4
    );
    this.orderData.Gold = this.orderData.RawGold - this.orderData.GoldCutting;
  }
  Cancel() {
    this.isPosted = false;
    this.orderData = new DailyCash();
    this.orderData.Type = this.VType;
    this.orderData.TrType = 'DT';
    this.btnsave = false;
  }

  FindINo() {
    this.NavigateTo(this.Ino);
  }
  NavigateTo(rt = '') {
    this.router.navigateByUrl(this.navigateURL + (rt != '' ? '/' + rt : ''));
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

    let billNo: any = `${this.VType}-100000001`;
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
        this.http.getData(`getbno/${this.VType}`).then((r: any) => {
          billNo = r.billno;
          this.NavigateTo(billNo);
        });
        break;
      default:
        break;
    }
  }
}
