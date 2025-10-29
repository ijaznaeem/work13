import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import {
  CardData,
  CardStyle,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/gradient-card/gradient-card.component';
import {
  FindTotal,
  GetDateJSON,
  JSON2Date,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { BankPaymentComponent } from '../../tasks/bank-payment/bank-payment.component';
import { BankReceiptComponent } from '../../tasks/bank-receipt/bank-receipt.component';
import { CashPaymentComponent } from '../../tasks/cash-payment/cash-payment.component';
import { CashReceiptComponent } from '../../tasks/cash-receipt/cash-receipt.component';
import { VoucherSetting } from './vouchers.settings';

@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.scss'],
})
export class DayBookComponent implements OnInit {
  public Customers: object[] = [];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    AccountID: '',
  };
  settings: any = VoucherSetting;
  public data = [];
  public table = 'daybook';
  Accounts: any = [];
  bsModalRef: BsModalRef = new BsModalRef();
  Cards: CardData[] = [];
  cardStyles: any = Object.values(CardStyle);
  constructor(
    private http: HttpBase,
    private modalService: BsModalService,
    private router: Router
  ) {}

  ngOnInit() {
console.log(this.Filter);


    this.http
      .getData('accounts?flds=AccountName, AccountCode,AccountID')
      .then((r: any) => {
        this.Accounts = r;
      });
    this.FilterData();
  }

  FilterData() {
    let filter = "Date Between '" + 
      JSON2Date(this.Filter.FromDate) + "' and '"  + 
      JSON2Date(this.Filter.ToDate )+ "'";
      
    if (this.Filter.AccountID != null && this.Filter.AccountID != '') {
      filter += ' and FromAccountID = ' + this.Filter.AccountID;
    }

    this.http
      .getData('qryvdetails?orderby=VoucherNo&filter=' + filter)
      .then((r: any) => {
        r.map((x:any) => {
          x.IsPosted == '1' ? (x.Status = 'Posted') : (x.Status = 'Un Posted');
        });
        this.data = r;
        this.Cards = [];
        const groupData: any = this.ExtactGroupTotals(this.data);
        console.log(groupData);

        let i = 0;
        groupData.map((x:any) => {
          x.Style = this.cardStyles[i % 4];
          this.Cards.push({
            Caption: x.FromAccount,
            Value: x.Amount >= 0 ? `${x.Amount} Dr` : `${x.Amount * -1} Cr`,
            Style: this.cardStyles[i % 4],
          });
          i++;
        });
        // Assume this is part of a function inside a class or object
        let totalAmount = FindTotal(groupData, 'Amount');
        let balanceType = totalAmount >= 0 ? 'Dr' : 'Cr';
        totalAmount = Math.abs(totalAmount);
        this.Cards.push({
          Caption: 'Closing Balance',
          Value: `${totalAmount} ${balanceType}`,
          Style: this.cardStyles[i % 4], // Styles cycle based on index
        });
      });
  }
  Clicked(e) {
    let table: any = {};
    let url = '';
    console.log(e);
    if (e.action === 'delete') {
      console.log(e.action);
      if (e.data.IsPosted === '0') {
        table = { ID: e.data.VoucherID, Table: 'V' };

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
              .postTask('delete', table)
              .then((r) => {
                this.FilterData();
                swal('Deleted!', 'Your data has been deleted!', 'success');
              })
              .catch((er) => {
                swal('Oops!', 'Error while deleting voucher', 'error');
              });
          }
        });
      } else {
        swal('Oops!', 'Can not delete posted data', 'error');
      }
    } else if (e.action == 'print') {
      this.router.navigateByUrl('/print/printvoucher/' + e.data.VoucherID);
    } else if (e.action === 'edit') {
      if (e.data.IsPosted === '0') {
        if (e.data.VType == 1) {
          this.OpenForm('CashReceipt', e.data.VoucherID);
        } else if (e.data.VType == 2) {
          this.OpenForm('CashPaid', e.data.VoucherID);
        } else if (e.data.VType == 3) {
          this.router.navigateByUrl('/tasks/bankreceipt/' + e.data.VoucherID);
        } else if (e.data.VType == 4) {
          this.router.navigateByUrl('/tasks/bankpayment/' + e.data.VoucherID);
        } else if (e.data.VType == 5) {
          this.router.navigateByUrl('/tasks/jv/' + e.data.VoucherID);
        }
      } else {
        swal('Oops!', 'Can not edit posted data', 'error');
      }
    } else if (e.action === 'post') {
      if (e.data.IsPosted === '0') {
        url = 'postvouchers/' + e.data.VoucherID;

        this.http.postTask(url, {}).then((r) => {
          e.data.IsPosted = '1';
          swal('Post!', 'Your data has been posted!', 'success');
        });
      } else {
        swal('Oops!', 'Can not post posted data', 'error');
      }
    }
  }
  OpenForm(form, id = null) {
    let formCtrl: any;

    if (form == 'CashPaid') {
      formCtrl = CashPaymentComponent;
    } else if (form == 'CashReceipt') {
      formCtrl = CashReceiptComponent;
    } else if (form == 'BankPaid') {
      formCtrl = BankPaymentComponent;
    } else if (form == 'BankReceipt') {
      formCtrl = BankReceiptComponent;
    } else if (form == 'Accounts') {
      this.router.navigateByUrl('/accounts/list' );
    }

    const initialState: ModalOptions = {
      initialState: {
        EditID: id,
      },
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(formCtrl, initialState);

    this.bsModalRef.onHide?.subscribe(() => {
      this.FilterData();
    });
  }
  ExtactGroupTotals(data: any) {
    // Create a new Map to store the sums grouped by FromAccount
    const groupedData = new Map<string, { Debit: number; Credit: number }>();

    // Iterate over each entry in the data array
    data.forEach((item) => {
      const { FromAccount, Debit, Credit } = item;

      // If the FromAccount already exists in the map, update the sums
      if (groupedData.has(FromAccount)) {
        const existingData = groupedData.get(FromAccount)!;
        existingData.Debit += parseFloat(Debit.toString());
        existingData.Credit += parseFloat(Credit.toString());
      } else {
        // Otherwise, add a new entry to the map
        groupedData.set(FromAccount, {
          Debit: parseFloat(Debit.toString()),
          Credit: parseFloat(Credit.toString()),
        });
      }
    });

    // Convert the map back into an array of objects
    const result = Array.from(groupedData.entries()).map(
      ([FromAccount, sums]) => ({
        FromAccount,
        Amount: sums.Debit - sums.Credit,
      })
    );

    return result;
  }
}
