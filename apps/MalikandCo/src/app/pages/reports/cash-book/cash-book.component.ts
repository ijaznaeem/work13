import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import {
  FindTotal,
  GetDateJSON,
  JSON2Date,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { CashbookSettings } from './cash-book.settings';

@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.scss'],
})
export class CashBookComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  public data: any = [];

  public Filter = {
    Date: GetDateJSON(),
  };
  settings = CashbookSettings;

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Cash Report';
    this.ps.PrintData.SubTitle = 'Date :' + JSON2Date(this.Filter.Date);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "Date = '" + JSON2Date(this.Filter.Date) + "'";

    this.http.getData('qryvouchers?orderby=VoucherID desc&filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }

  FindBalance() {
    if (this.data.length == 0) return 0;
    // console.log(Number(this.open_balance) +   FindTotal(this.data, "Credit") - FindTotal(this.data, "Debit"));

    return FindTotal(this.data, 'Credit') - FindTotal(this.data, 'Debit');
  }

  CloseAccounts() {
    swal({
      text: 'Account will be closed, Continue ??',
      icon: 'warning',
      buttons: {
        cancel: true,
        confirm: true,
      },
    }).then((close) => {
      if (close) {
        this.http
          .postTask('CloseAccount/' + this.http.getBusinessID(), {
            ClosingID: this.http.getClosingID(),
            ClosingAmount: this.FindBalance(),
          })
          .then((r) => {
            swal(
              'Close Account!',
              'Account was successfully closed, Login to next date',
              'success'
            );
            this.router.navigateByUrl('/auth/login');
          })
          .catch((er) => {
            swal('Oops!', 'Error while deleting voucher', 'error');
          });
      }
    });
  }
  Clicked(e) {
    let table: any = 'vouchers';
    let pkey = 'VoucherID';
    console.log(e);
    if (e.action === 'delete') {
      if (e.data.IsPosted === '0') {
        swal({
          text: 'Delete this record!',
          icon: 'warning',
          buttons: {
            cancel: true,
            confirm: true,
          },
        }).then((willDelete) => {
          if (willDelete) {
            this.http
              .postTask('delete/' + table + '/' + e.data[pkey], {})
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
    } else if (e.action === 'print') {
      this.router.navigateByUrl('/print/printvoucher/' + e.data.VoucherID);
    } else if (e.action === 'edit') {
      if (e.data.IsPosted === '0') {
        if (e.data.RefType == 4 && e.data.RefID > 0) {
          this.router.navigateByUrl('/cash/journalvoucher/' + e.data.VoucherID);
        } else if (e.data.Credit > 0 && e.data.RefType != 4) {
          this.router.navigateByUrl('/cash/cashreceipt/' + e.data.VoucherID);
        } else if (e.data.Debit > 0 && e.data.RefType != 4) {
          this.router.navigateByUrl('/cash/cashpayment/' + e.data.VoucherID);
        } else {
          swal('Oops!', 'Can not edit this voucher', 'error');
        }
      }
    } else if (e.action === 'post') {
      if (e.data.IsPosted === '0') {
        let url = 'postvouchers/' + e.data.VoucherID;

        this.http.postTask(url, {}).then((r) => {
          e.data.IsPosted = '1';
          this.FilterData();
          swal('Post!', 'Your data has been posted!', 'success');
        });
      } else {
        swal('Oops!', 'Can not post posted data', 'error');
      }
    }
  }
}
