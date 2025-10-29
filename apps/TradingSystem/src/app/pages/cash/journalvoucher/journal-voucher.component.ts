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
import {
  AddInputFld,
  FindCtrl,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { enRefType } from '../../../factories/static.data';
import { FindTotal, GetDateJSON, GetProps } from '../../../factories/utilities';
import { CtrlAcctsService } from '../../../services/ctrl-accts.service';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  DetailSettings,
  formNavigation,
  VDetailModel,
  VoucherForm,
  VoucherModel,
} from '../vouchers.settings';

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.scss'],
})
export class JournalVoucherComponent implements OnInit, OnChanges {
  @ViewChild('formDetail') formDetail: any;
  @Input() Type: string;
  @Input() EditID = '';

  public data = new LocalDataSource([]);
  Ino = '';
  tqty: any = '';
  public btnsave = false;
  public isPosted = false;

  voucher = new VoucherModel();
  voucherDetails = new VDetailModel();
  vDetailForm = JSON.parse(JSON.stringify(VoucherForm));
  frmNavigation = formNavigation;
  settings = JSON.parse(JSON.stringify(DetailSettings));
  vDetails: any = [];
  public selectedProduct: any = {};

  $Stores: Observable<any[]>;
  AcctTypes: Observable<any[]>;
  SelectCust: any = {};

  constructor(
    private http: HttpBase,
    private ctrlAccts: CtrlAcctsService,
    private myToaster: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.vDetailForm.title = 'Journal Voucher Voucher';
    const col = FindCtrl(this.vDetailForm, 'Amount');
    if (col) {
      col.fldName = 'Debit';
      col.label = 'Debit';
    }

    this.vDetailForm.columns.splice(
      6,
      0,
      AddInputFld('Credit', 'Credit', 2, true, 'number')
    );

    this.vDetailForm.columns[0].size = 4;
    this.vDetailForm.columns[1].size = 4;
    this.vDetailForm.columns[2].size = 4;
    this.vDetailForm.columns[3].size = 3;
    this.vDetailForm.columns[4].size = 3;
    this.vDetailForm.columns[7].size = 2;

    this.settings.Columns[5].fldName = 'Debit';
    this.settings.Columns[5].label = 'Debit';
    this.settings.Columns.push({
      fldName: 'Credit',
      label: 'Credit',
      type: 'number',
    });

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
      .getData(`Vouchers?filter=VoucherNo='${this.EditID}'`)
      .then((r: any) => {
        if (r.length > 0) {
          this.isPosted = !(r[0].IsPosted == '0');
          this.voucher = GetProps(r[0], Object.keys(new VoucherModel()));
          this.voucher.Date = this.voucher.Date.split(' ')[0];
          this.http
            .getData('qryVDetails', {
              filter: `VoucherNo='${this.EditID}'`,
            })
            .then((r: any) => {
              this.vDetails = r;
            });

          console.log(this.voucherDetails);
        } else {
          this.myToaster.Error('Invoice No not found', 'Edit', 1);
        }
      });
  }
  public SaveData() {
    this.voucher.UserID = this.http.getUserID();
    this.voucher.FinYearID = this.http.getFinYearID();
    this.voucher.RefType = enRefType.Vouchers;

    if (this.vDetails.length == 0) {
      this.myToaster.Error('No Details Found', 'Save', 1);
      return;
    }

    if (FindTotal(this.vDetails, 'Debit') != FindTotal(this.vDetails, 'Credit')) {
      this.myToaster.Error('Voucher Amount not equal', 'Save', 1);
      return;
    }


    console.log(this.vDetails);

    this.http
      .postTask('vouchers' + (this.EditID == '' ? '' : '/' + this.EditID), {
        ...this.voucher,
        details: this.vDetails,
      })
      .then((r: any) => {
        this.myToaster.Sucess('Saved Successfully', 'Save', 1);
        this.NavigatorClicked({ col: { label: 'Last' } });
        this.voucher = new VoucherModel();
        this.vDetails = [];
        this.voucher.VoucherNo = '-1';
        this.btnsave = true;
        this.isPosted = false;
      })
      .catch((err) => {
        console.log(err);
        this.myToaster.Error(err, 'Save', 1);
      });
  }

  public Changed(event) {
    console.log(event);
  }
  CalAmount() {}
  async Cancel(event) {
    this.isPosted = false;
    this.voucher = new VoucherModel();
    this.voucher.RefType = enRefType.Vouchers;
    this.btnsave = false;
  }

  FindINo() {
    this.NavigateTo(this.Ino);
  }
  NavigateTo(rt = '') {
    this.router.navigateByUrl(
      '/cash/journalvoucher' + (rt != '' ? '/' + rt : '')
    );
  }
  NavigatorClicked(e) {
    console.log(e);

    let dt = GetDateJSON();
    let billNo: any = 'JV' + '-' + dt.year.toString().slice(2) + '000001';
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
        this.http.getData('getbno/JV').then((r: any) => {
          billNo = r.billno;
          this.NavigateTo(billNo);
        });
      case 'New':
        this.NavigateTo();
        break;

      case 'Save':
        this.SaveData();

        break;
      default:
        break;
    }
  }
  AddToVoucher(e) {
    const CashType = FindCtrl(this.vDetailForm, 'CashTypeID');
    const Bank = FindCtrl(this.vDetailForm, 'BankID');
    const Customer = FindCtrl(this.vDetailForm, 'CustomerID');
    console.log(CashType, Bank);

    let obj: any = GetProps(
      this.voucherDetails,
      Object.keys(new VDetailModel())
    );

    obj = {
      ...obj,
      CashType: CashType.listData.find(
        (x) => x.TypeID == this.voucherDetails.CashTypeID
      ).Description,
      BankName: Bank.listData.find(
        (x) => x.BankID == this.voucherDetails.BankID
      ).BankName,
      CustomerName: Customer.listData.find(
        (x) => x.CustomerID == this.voucherDetails.CustomerID
      ).CustomerName,
    };
    this.vDetails.push(obj);
    this.voucherDetails = new VDetailModel();

  }
  Clicked(e) {
    console.log(e);
    if (e.action == 'delete') {
      this.vDetails = this.vDetails.filter((x) => {
        return !(
          x.CustomerID == e.data.CustomerID && x.Credit == e.data.Credit
        );
      });
    }
  }
}
