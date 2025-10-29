import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import {
  AddFormButton,
  AddInputFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { CrudFormComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form.component';
import {
  formatNumber,
  getCurDate,
} from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetProps } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { VoucherModel } from '../voucher.model';

@Component({
  selector: 'app-recoveryby-bill',
  templateUrl: './recoveryby-bill.component.html',
  styleUrls: ['./recoveryby-bill.component.scss'],
})
export class RecoveryByBillComponent implements OnInit {
  @ViewChild('form') form: CrudFormComponent;
  VouchersList: any = [];
  Filter: any = {};

  public CashForm = {
    CrudButton: false,
    title: 'Filter Data',
    columns: [
      AddInputFld('Date', 'Date', 2, true, 'date'),
      AddInputFld('RefID', 'Invoice No', 2, true, 'number'),
      AddFormButton(
        'Find',
        (e) => {
          this.FindINo(this.model.RefID);
        },
        2,
        'search',
        'primary'
      ),
      AddInputFld('CustomerName', 'Customer', 6, true, 'text'),
      AddInputFld('Description', 'Description', 4, true, 'text'),
      AddInputFld('InvAmount', 'Amount', 2, true, 'number', { readonly: true }),
      AddInputFld('InvRecvdAmount', 'Recvd Amount', 2, true, 'number', {
        readonly: true,
      }),
      AddInputFld('InvBalanceAmount', 'Balance Amount', 2, true, 'number', {
        readonly: true,
      }),
      AddInputFld('Credit', 'Cash Recvd', 2, true, 'number'),
      AddInputFld('Balance', 'Balance', 2, true, 'number', { readonly: true }),
      // AddLookupFld('Type','Type','','ID', 'Type',2,[
      //   {ID: '1', 'Type': 'Cash Recvd'},
      //   {ID: '2', 'Type': 'Add to Acct'},
      // ],true, {type: 'list'} ),
      AddFormButton(
        'Save',
        (e) => {
          this.SaveVouchers();
        },
        2,
        'save',
        'success'
      ),
    ],
  };

  public model: any = {
    Date: new Date().toISOString().split('T')[0],
    Type: '1',
    RefID: '',
    Description: 'Cash Recvd',
  };
  public data: any = [];

  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Invoice No',
        fldName: 'RefID',
      },
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Customer Name',
        fldName: 'CustomerName',
      },
      {
        label: 'Invoice Amount',
        fldName: 'NetAmount',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['NetAmount']);
        },
      },
      {
        label: 'Amount Recvd',
        fldName: 'Credit',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Credit']);
        },
      },

      {
        label: 'Invoice Balance',
        fldName: 'Balance',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Balance']);
        },
      },
    ],
    Actions: [
      {
        action: 'edit',
        title: 'Edit',
        icon: 'edit',
        class: 'warning',
      },
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
    ],
    Data: [],
  };

  constructor(
    private http: HttpBase,
    private alert: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.LoadData();
  }

  SaveVouchers() {
    if (this.form.IsFormValid()) {
      let voucher = new VoucherModel();
      if (
        this.model.Credit * 1 + this.model.Discount * 1 >
        this.model.InvBalanceAmount
      ) {
        this.alert.Error('Inavlid Amount', 'Error');
        return 0;
      }
      Object.assign(voucher, this.model);
      console.log(voucher);
      let voucher2 = GetProps(voucher, Object.keys(new VoucherModel()));

      voucher2.ClosingID = this.http.getClosingID();
      voucher2.RefType = 2;
      console.log(voucher2);
      this.http
        .postTask('recoverybybill', voucher2)
        .then(async (s) => {
          this.LoadData();
          this.alert.Sucess('Data Saved', 'Recovery');
          this.model = {
            Date: getCurDate(),
            Type: '1',
            RefID: '',
            Description: 'Cash Recvd',
          };
        })
        .catch((err) => {
          this.alert.Error(err.Error.msg, 'Error');
        });
    }
  }
  async LoadData() {
    try {
      this.data = await this.http.getData(
        'qryrecoverylist?filter=RefType=2 and IsPosted=0'
      );
    } catch (error) {
      console.log(error.statusText);
      this.alert.Error(error.statusText, 'Erorr');
    }
  }

  RouteChange(e) {
    console.log(e);
    if (e.itemData && e.itemData.RouteID !== '') {
      this.http.getCustList(e.itemData.RouteID).then((r: any) => {
        this.VouchersList = r;
      });
    }
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'delete') {
      swal({
        text: 'Delete this voucher!',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('vouchers', e.data.VoucherID)
            .then((r) => {
              this.LoadData();
              swal('Deleted!', 'Your voucher has been deleted!', 'success');
            })
            .catch((er) => {
              swal('Oops!', 'Error while deleting voucher', 'error');
            });
        }
      });
    }
  }

  async FindINo(InvoiceNo) {
    const Invoice: any = await this.http.getData(
      'qryinvoicesbybill?filter=InvoiceID=' + InvoiceNo
    );
    if (Invoice.length > 0) {
      this.model.CustomerID = Invoice[0].CustomerID;
      this.model.RefID = Invoice[0].InvoiceID;
      this.model.RefType = '2';
      this.model.UserID = this.http.getUserID();
      this.model.SalesmanID = Invoice[0].SalesmanID;
      this.model.CustomerName = Invoice[0].CustomerName;
      this.model.InvAmount = Invoice[0].NetAmount;
      this.model.InvDiscount = Invoice[0].Discount;
      this.model.InvRecvdAmount = Invoice[0].AmountRecvd;
      this.model.InvBalanceAmount =
        Invoice[0].NetAmount - Invoice[0].AmountRecvd;
      this.model.Credit = 0;
      this.model.Discount = 0;
      this.CalcBalance();
      console.log(this.model);
    } else {
      this.alert.Error('Invoice No not found', 'Error');
    }
  }
  CalcBalance() {
    this.model.Balance =
      this.model.InvBalanceAmount - this.model.Credit - this.model.Discount;
  }
  Changed(e) {
    this.CalcBalance();
  }
}
