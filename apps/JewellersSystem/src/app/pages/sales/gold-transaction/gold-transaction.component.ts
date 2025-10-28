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
import { CashModel, enTransactionType } from '../../../factories/static.data';
import { GetProps } from '../../../factories/utilities';
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
  navigateURL = '/sale/gold';
  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  modelData = new CashModel();
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

    this.http.getData(`Cash?filter=CashID='${this.EditID}'`).then((r: any) => {
      if (r.length > 0) {
        this.isPosted = !(r[0].IsPosted == '0');
        this.modelData = GetProps(r[0], Object.keys(new CashModel()));
        this.modelData.Date = this.modelData.Date.split(' ')[0];
        this.CalcGoldAmount();
      } else {
        this.myToaster.Error('Invoice No not found', 'Edit', 1);
      }
    });
  }
  public async Save(event) {
    if (this.modelData.CashID == null || this.modelData.CashID == 0) {
      let bno: any = 1;
      bno = await this.http.getData(
        'getbno/CASH-' + enTransactionType.Gold + '/1'
      );
      this.modelData.CashID = bno.billno;
    }
    this.http
      .postTask(
        'vouchers' + (this.EditID == '' ? '' : '/' + this.EditID),
        this.modelData
      )
      .then((r: any) => {
        if (r) {
          this.myToaster.Success('Saved Successfully', 'Save', 1);
          this.btnsave = true;
          this.isPosted = false;
          if (this.EditID == '') {
            this.NavigateTo(this.modelData.CashID.toString());
          }
        }
      })
      .catch((err) => {
        this.myToaster.Error('Error Saving', 'Save', 1);
      });
  }

  public Changed(event) {
    console.log(event);
    if (event.fldName == 'RawGold' || event.fldName == 'GoldCutting') {
    }
  }
  CalcGoldAmount() {}

  Cancel() {
    this.isPosted = false;
    this.modelData = new CashModel();
    this.modelData.Type = enTransactionType.Gold;
    this.btnsave = false;
  }

  FindINo() {
    this.NavigateTo(this.Ino);
  }
  NavigateTo(rt = '') {
    // this.router.navigate([this.navigateURL, rt]);
    if (rt == '') {
      this.router.navigateByUrl(this.navigateURL);
    } else {
      this.router.navigateByUrl(this.navigateURL + '/' + rt);
    }
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
    let billNo: any = 1;
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
        this.http
          .getData('getbno/CASH-' + enTransactionType.Gold)
          .then((r: any) => {
            billNo = r.billno;
            this.NavigateTo(billNo);
          });
        break;
      default:
        break;
    }
  }
}
