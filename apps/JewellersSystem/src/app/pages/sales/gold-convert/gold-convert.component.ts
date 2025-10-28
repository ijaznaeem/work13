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
import { GetProps, RoundTo } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { GolConvertForm, GoldConvertModel } from './gold-convert.settings';

@Component({
  selector: 'app-gold-convert',
  templateUrl: './gold-convert.component.html',
  styleUrls: ['./gold-convert.component.scss'],
})
export class GoldConvertComponent implements OnInit, OnChanges {
  @Input() Type: string;
  @Input() EditID = '';
  @ViewChild('fromSale') fromSale;
  @ViewChild('cmbProduct') cmbProd;
  @ViewChild('qty') elQty;
  @ViewChild('cmbCustomers') cmbCustomers;

  public data = new LocalDataSource([]);
  navigateURL = '/sale/goldconvert';
  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  modelData = new GoldConvertModel();
  orderForm = GolConvertForm;

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

    this.http.getData(`GoldTransfers/${this.EditID}`).then((r: any) => {
      if (r ) {
        this.isPosted = !(r.IsPosted == '0');
        this.modelData = GetProps(r, Object.keys(new GoldConvertModel()));
        this.modelData.Date = this.modelData.Date.split(' ')[0];
        this.CalcGoldAmount();
      } else {
        this.myToaster.Error('Invoice No not found', 'Edit', 1);
      }
    });
  }
  public async Save(event) {

    this.http
      .postData(
        'GoldTransfers' + (this.EditID == '' ? '' : '/' + this.EditID),
        this.modelData
      )
      .then((r: any) => {
        if (r) {
          this.myToaster.Success('Saved Successfully', 'Save', 1);
          this.btnsave = true;
          this.isPosted = false;
          if (this.EditID == '') {
            this.NavigateTo(r.ID);
          }
        }
      })
      .catch((err) => {
        this.myToaster.Error('Error Saving', 'Save', 1);
      });
  }

  public Changed(event) {
    console.log(event);
    if (event.fldName == 'Gold' || event.fldName == 'Cutting') {
          this.modelData.NetGold = RoundTo(
            this.modelData.Gold -
              (this.modelData.Gold * this.modelData.Cutting) / 96,
            3
          );
          this.CalcGoldAmount();
        }
    else if (event.fldName == 'Rate') {
      this.CalcGoldAmount();
    }
  }
  CalcGoldAmount() {
    this.modelData.Amount = RoundTo(
      this.modelData.NetGold * this.modelData.Rate,
      3
    );
  }

  Cancel() {
    this.isPosted = false;
    this.modelData = new GoldConvertModel();
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
          .getData('getbno/TR')
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
