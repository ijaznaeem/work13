import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { FindTotal, GetDateJSON, JSON2Date } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { SearchAccountComponent } from '../search-account/search-account.component';
import { Voucher, VoucherDetail } from '../voucher.model';
import { DetailSettings } from '../vouchers.setting';

@Component({
  selector: 'app-bank-receipt',
  templateUrl: './bank-receipt.component.html',
  styleUrls: ['./bank-receipt.component.scss'],
})
export class BankReceiptComponent implements OnInit {
  @ViewChild('cmbCustomer') cmbCustomer;
  public voucher = new Voucher();
  public vdetails = new VoucherDetail();
  public settings :any = {}

  Accounts = [];
  VData: any = [];
  EditID = '';

  curCustomer: any = {};
  Products: any = [];
  bsModalRef: BsModalRef;
  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.settings = JSON.parse(JSON.stringify(DetailSettings));
    this.settings.Columns.push({
      fldName: 'Credit',
      label: 'Amount',
      sum: true,
    });
    this.StartVoucher();
    this.http
      .getData('accounts?flds=AccountName, AccountCode,AccountID')
      .then((r: any) => {
        this.Accounts = r;
      });

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.EditID) {
        this.EditID = params.EditID;
        this.http
          .getData('qryvouchers?filter=VoucherID=' + this.EditID)
          .then((r: any) => {
            this.voucher = r[0];

            // this.GetCustomer(this.voucher.AccountID);
          });
      } else {
        this.EditID = '';
      }
      console.log(this.EditID);
    });
  }

  SaveData() {
    let voucherid = '';

    if (this.EditID != '') {
      voucherid = '/' + this.EditID;
    }
    this.voucher['details'] = this.VData
    this.voucher.Date = JSON2Date(this.voucher.Date);
    this.voucher.Debit = FindTotal(this.VData, 'Credit');
    console.log(this.voucher);

    this.http.postTask('vouchers' + voucherid, this.voucher).then((r) => {
      this.alert.Sucess('Receipt Saved', 'Save', 1);
      if (this.EditID != '') {
        this.StartVoucher();
        this.router.navigateByUrl('/tasks/bankreceipt/');
      } else {
        this.StartVoucher();

      }
    }).catch((er:any)=>{
      this.alert.Error('Error while saving', 'Error');
      this.voucher.Date = GetDateJSON();
      console.log(er);

    });
  }
  SelectedAccount(curAccts) {
    this.curCustomer = curAccts;
  }
  Round(amnt) {
    return Math.round(amnt);
  }

  Search(nwhat = 1) {
    const initialState: ModalOptions = {
      initialState: {
        Table: 'qryaccounts',
        Term: '',
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      SearchAccountComponent,
      initialState
    );

    this.bsModalRef.content.Event.subscribe((res) => {
      if (res.res == 'ok') {
        this.bsModalRef?.hide();

        if (nwhat == 1) {
          this.voucher.AccountID = res.data.AccountID;
        } else if (nwhat == 2) {
          this.SelectedAccount(res.data)
          this.vdetails.AccountID = res.data.AccountID;
          this.curCustomer = res.data
        }
      }
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action =='delete'){
      this.VData = this.VData.filter(x=>{
        return !(x.AccountID ==e.data.AccountID && x.Credit == e.data.Credit);
      })
    }
  }

  AddVData() {
    this.VData.push({
      AccountID: this.vdetails.AccountID,
      AccountName: this.curCustomer.AccountName,
      AccountCode: this.curCustomer.AccountCode,
      Description: this.vdetails.Description,
      Credit: this.vdetails.Credit,
      Debit: this.vdetails.Debit,
      FinYearID: this.vdetails.FinYearID,

    });
    this.vdetails = new VoucherDetail();
  }
   StartVoucher() {
    this.voucher = new Voucher();
    this.VData = [];
    this.voucher.VType = 3
    this.http.getData('voucherno/' + this.voucher.VType).then((r:any)=>{
      this.voucher.VoucherNo = r.code
    }).catch(()=>{
      this.alert.Error('Error while getting voucher no', 'Eorr');
    })
  }

}

