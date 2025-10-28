import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs';
import { GetDateJSON, GetProps } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { CmdtyForm, DataModel } from './commodity-voucher.settings';

@Component({
  selector: 'app-commodity-voucher',
  templateUrl: './commodity-voucher.component.html',
  styleUrls: ['./commodity-voucher.component.scss'],
})
export class CommodityVoucherComponent implements OnInit, OnChanges {
  @Input() Type: string;
  @Input() EditID = '';

  public data = new LocalDataSource([]);
  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  modelData = new DataModel();
  modelForm = CmdtyForm;

  public selectedProduct: any = {};

  $Stores: Observable<any[]>;
  AcctTypes: Observable<any[]>;
  SelectCust: any = {};

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.$Stores = this.cachedData.Stores$;
    this.AcctTypes = this.cachedData.AcctTypes$;
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
      .getData(`CmdtyVouch?filter=VouchNo='${this.EditID}'`)
      .then((r: any) => {
        if (r.length > 0) {
          this.isPosted = !(r[0].IsPosted == '0');
          this.modelData = GetProps(r[0], Object.keys(new DataModel()));
          this.modelData.Date = this.modelData.Date.split(' ')[0];
          console.log(this.modelData);

          this.CalAmount();
        } else {
          this.myToaster.Error('Invoice No not found', 'Edit', 1);
        }
      });
  }
  public Save(event) {
    this.myToaster.Sucess('Saved Successfully', 'Save', 1);
    this.NavigatorClicked({col: {label: 'Last'}});
    this.modelData = new DataModel();
    this.btnsave = true;
    this.isPosted = false;
  }
  BeforeSave(event) {
    console.log(event);
    delete event.data['RateInGrams'];
  }

  public Changed(event) {
    console.log(event);
    this.modelData.NetWeight =
      this.modelData.Bags * this.modelData.Packing + this.modelData.Kgs;
    if (
      event.fldName == 'RateType' ||
      event.fldName == 'Bags' ||
      event.fldName == 'Kgs' ||
      event.fldName == 'Packing' ||
      event.fldName == 'Rate'
    ) {
      this.CalAmount();
    } else if (event.fldName == 'SaleCommission') {
      this.CalCommission();
    } else if (
      event.fldName == 'MarketFee' ||
      event.fldName == 'PurchaseValue'
    ) {
      this.CalPurchase();
    }
  }
  CalAmount() {
    if (this.modelData.RateType == 1) {
      this.modelData.SaleAmount =
        this.modelData.NetWeight * this.modelData.Rate;
    } else if (this.modelData.RateType == 40) {
      this.modelData.SaleAmount =
        (this.modelData.NetWeight * this.modelData.Rate) / 40;
    }
    this.modelData.Commission = (this.modelData.SaleCommission * 2) / 3;
    this.CalCommission();
  }
  CalCommission() {
    this.modelData.SaleCommission = this.modelData.SaleAmount * 0.03;
    this.modelData.NetSaleAmount =
      this.modelData.SaleAmount - this.modelData.SaleCommission;
    this.CalPurchase();
  }
  CalPurchase() {
    this.modelData.MarketFee = this.modelData.NetWeight / 100;
    this.modelData.PurchaseValue = this.modelData.SaleAmount;
    this.modelData.NetPurchValue =
      this.modelData.PurchaseValue + this.modelData.MarketFee;
  }
  async Cancel(event) {
    this.isPosted = false;
    this.modelData = new DataModel();
    let bno:any = await  this.http.getData(`getbno/CMD/true`);
    ;
    this.modelData.VouchNo = bno.billno ;
    this.btnsave = false;
  }

  FindINo() {
    this.NavigateTo(this.Ino);
  }
  NavigateTo(rt = '') {
    this.router.navigate(['/sale/commodity', rt]);
  }
  NavigatorClicked(e) {
    console.log(e);

    let dt = GetDateJSON();
    let billNo: any = 'CMD' + '-' + dt.year.toString().slice(2) + '000001';
    switch (e.col.label) {
      case 'First':
        this.NavigateTo(billNo);
        break;
      case 'Prev':
        if (!(this.EditID == '' || this.EditID == null)) {
          if (Number(this.EditID) - 1 > billNo) {
            billNo = Number(this.EditID) - 1;
          }
        }
        this.NavigateTo(billNo);
        break;
      case 'Next':
        if (!(this.EditID == '' || this.EditID == null)) {
          billNo = Number(this.EditID) + 1;
        }
        this.NavigateTo(billNo);
        break;
      case 'Last':
        this.http.getData('getbno/CMD').then((r: any) => {
          billNo = r.billno;
          this.NavigateTo(billNo);
        });
        break;
      default:
        break;
    }
  }
}
