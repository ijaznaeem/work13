import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { FindTotal, RoundTo2, formatNumber } from '../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDateJSON, JSON2Date } from '../../factories/utilities';
import { HttpBase } from '../../services/httpbase.service';
import { MyToastService } from '../../services/toaster.server';
import { CashPaymentComponent } from '../cash/cash-payment/cash-payment.component';
import { CashReceiptComponent } from '../cash/cash-receipt/cash-receipt.component';
import { CreditSaleVoucherComponent } from '../cash/creditsale-voucher/creditsale-voucher.component';
import { ExpendComponent } from '../cash/expend/expend.component';
import { LubricantSaleComponent } from '../sales/lubricant-sale/lubricant-sale.component';
import { OilSaleComponent } from '../sales/oil-sale/oil-sale.component';
import { Settings } from './settings';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public data: object[] =[];

  public Filter = {
    Date: GetDateJSON(),
  };
  settings: any = Settings;

  constructor(
    private http: HttpBase,
    private toaster: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }

  FilterData() {
    let table = 'daybook';
    let filter = '' + JSON2Date(this.Filter.Date) + '';

    this.http.getData(table + '/' + filter).then((r: any) => {
      r.map((x) => {
        x.IsPosted == '1' ? (x.Status = 'Posted') : (x.Status = 'Un Posted');
      });
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      if (e.data.IsPosted === '0') {
        if (e.data.Type == '1') {
          this.AddOildSale(e.data.InvoiceID);
        } else if (e.data.Type == '2') {
          this.AddLubSale(e.data.InvoiceID);
        } else if (e.data.Type == '3') {
          this.AddRefund(e.data.InvoiceID);
        } else if (e.data.Type == '4') {
          this.CashReciept(e.data.InvoiceID);
        } else if (e.data.Type == '4') {
          this.CashReciept(e.data.InvoiceID);
        } else if (e.data.Type == '6') {
          this.CreditSale(e.data.InvoiceID);
        } else if (e.data.Type == '5') {
          this.toaster.Error(
            "Expense can't be edited, You can not delete it",
            'Error'
          );
        }
      } else {
        swal('Oops!', 'Can not edit posted data', 'error');
      }
    }
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
            if (
              e.data.Type == '1' ||
              e.data.Type == '2' ||
              e.data.Type == '3'
            ) {
              this.http
                .postTask('delete', { Table: 'S', ID: e.data.InvoiceID })
                .then((r) => {
                  this.toaster.Sucess('Invoice deleted successfully', 'Delete');
                  this.FilterData();
                })
                .catch((e) => {
                  this.toaster.Error(e.error.msg, 'Delete');
                });
            } else if (e.data.Type == '4') {
              this.http
                .postTask('delete', { Table: 'V', ID: e.data.InvoiceID })
                .then((r) => {
                  this.toaster.Sucess('Voucher deleted successfully', 'Delete');
                  this.FilterData();
                })
                .catch((e) => {
                  this.toaster.Error(e.error.msg, 'Delete');
                });
            } else if (e.data.Type == '5') {
              this.http
                .postTask('delete', { Table: 'E', ID: e.data.InvoiceID })
                .then((r) => {
                  this.toaster.Sucess('Expense deleted successfully', 'Delete');
                  this.FilterData();
                })
                .catch((e) => {
                  this.toaster.Error(e.error.msg, 'Delete');
                });
            }
          }
        });
      } else {
        swal('Oops!', 'Can not delete posted data', 'error');
      }
    }
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
          .postTask('CloseAccount'  , {
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
  FindBalance() {
    if (this.data.length == 0) return 0;

    return RoundTo2( FindTotal(this.data, 'Income') - FindTotal(this.data, 'Expense'));
  }
  AddOildSale(editID = '') {
    this.http
      .openModal(OilSaleComponent, { EditID: editID })
      .onHide?.subscribe(() => {
        setTimeout(() => {
          this.FilterData();
        }, 1000);
      });
  }
  AddLubSale(editID = '') {
    this.http
      .openModal(LubricantSaleComponent, { EditID: editID })
      .onHide?.subscribe(() => {
        setTimeout(() => {
          this.FilterData();
        }, 1000);
      });
  }
  AddRefund(editID = '') {
    this.http
      .openModal(LubricantSaleComponent, { EditID: editID, Type: 'DT' })
      .onHide?.subscribe(() => {
        setTimeout(() => {
          this.FilterData();
        }, 1000);
      });
  }
  CreditSale(editID = '') {
    this.http
      .openModal(CreditSaleVoucherComponent, { EditID: editID })
      .onHide?.subscribe(() => {
        this.FilterData();
      });
  }
  CashPayment(editID = '') {
    this.http
      .openModal(CashPaymentComponent, { EditID: editID })
      .onHide?.subscribe(() => {
        this.FilterData();
      });
  }
  CashReciept(editID = '') {
    this.http
      .openModal(CashReceiptComponent, { EditID: editID })
      .onHide?.subscribe(() => {
        this.FilterData();
      });
  }
  AddExpense(editID = '') {
    this.http
      .openModal(ExpendComponent, { EditID: editID })
      .onHide?.subscribe(() => {
        this.FilterData();
      });
  }
  FindTotal(data, fld) {
    return FindTotal(data, fld);
  }
  FindBalance2(){
    return formatNumber(this.FindBalance());
  }
}
