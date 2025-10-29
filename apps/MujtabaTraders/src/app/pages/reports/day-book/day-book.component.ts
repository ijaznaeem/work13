import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { PrintDataService } from '../../../services/print.data.services';
import { PurchaseSetting } from './purchase.settings';
import { SaleSetting } from './sale.setting';
import { TransferSettings } from './transfer.settings';
import { VoucherSetting } from './vouchers.settings';

@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.scss'],
})
export class DayBookComponent implements OnInit {
  public data: object[];
  Salesman: Observable<any[]>;
  public Routes: Observable<any[]>;
  public Customers: Observable<any[]>;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: '',
    RouteID: '',
    CustomerID: '',
  };
  settings: any = SaleSetting;
  nWhat = '1';
  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private ps: PrintDataService,
    private router: Router,
    private bill: PrintBillService
  ) {
    this.Salesman = this.cachedData.Salesman$;
    this.Routes = this.cachedData.routes$;
    this.Customers = this.cachedData.Accounts$;
  }

  ngOnInit() {
    this.FilterData();
  }

  FilterData() {
    let table = '';
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "' ";

    if (!(this.Filter.CustomerID === '' || this.Filter.CustomerID === null)) {
      filter += ' and CustomerID=' + this.Filter.CustomerID;
    }

    if (this.nWhat === '1') {
      this.settings = SaleSetting;
      table = 'qryinvoices?orderby=InvoiceID ';
    } else if (this.nWhat === '2') {
      this.settings = PurchaseSetting;
      table = 'qrypinvoices?orderby=InvoiceID ';
    } else if (this.nWhat === '3') {
      this.settings = VoucherSetting;
      table = 'qryvouchers?orderby=VoucherID ';
    } else if (this.nWhat === '4') {
      this.settings = TransferSettings;
      table = 'qrystocktransfer?orderby=TransferID ';
    }

    this.http.getData(table + '&filter=' + filter).then((r: any) => {
      r.map((x) => {
        x.IsPosted == '1' ? (x.Posted = 'Posted') : (x.Posted = 'Un Posted');
      });
      this.data = r;
    });
  }
  Clicked(e) {
    let table: any = {};
    let url = '';
    console.log(e);
    if (e.action === 'delete') {
      console.log(e.action);
      if (e.data.IsPosted === '0') {
        if (this.nWhat === '3') {
          table = { ID: e.data.VoucherID, Table: 'V' };
        } else if (this.nWhat === '2') {
          table = 'pinvoice/' + e.data.InvoiceID;
          table = { ID: e.data.InvoiceID, Table: 'P' };
        } else if (this.nWhat === '1') {
          table = { ID: e.data.InvoiceID, Table: 'S' };
        }
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
    } else if (e.action === 'print') {
      if (this.nWhat === '1') {
        if (e.data.Type == '1')
          this.router.navigateByUrl('/print/printinvoice/' + e.data.InvoiceID);
        else {
          this.http.getData('printbill/' + e.data.InvoiceID).then((d: any) => {
            d.Business = this.http.GetBData();
            console.log(d);
            this.bill.PrintPDFBill_A5(d);
            // this.bill.printTest();
          });
        }
      } else if (this.nWhat === '2') {
        this.router.navigateByUrl('/print/printpurchase/' + e.data.InvoiceID);
      } else if (this.nWhat === '3') {
        this.router.navigateByUrl('/print/printvoucher/' + e.data.VoucherID);
      } else if (this.nWhat === '4') {
        this.router.navigateByUrl('/print/stocktransfer/' + e.data.TransferID);
      }
    } else if (e.action === 'edit') {
      if (e.data.IsPosted === '0') {
        if (this.nWhat === '1') {
          if (e.data.Type == '1') {
            this.router.navigateByUrl('/sale/invoice/' + e.data.InvoiceID);
            // this.http.openModal(CreditSaleComponent, {EditID: e.data.InvoiceID})
          } else {
            this.router.navigateByUrl('/sale/retail/' + e.data.InvoiceID);
          }
        } else if (this.nWhat === '2') {
          this.router.navigateByUrl('/purchase/invoice/' + e.data.InvoiceID);
        } else if (this.nWhat === '3') {
          if (e.data.Credit > 0) {
            this.router.navigateByUrl('/cash/cashreceipt/' + e.data.VoucherID);
          } else {
            this.router.navigateByUrl('/cash/cashpayment/' + e.data.VoucherID);
          }
        } else if (this.nWhat === '4') {
          this.router.navigateByUrl('/sale/transfer/' + e.data.TransferID);
        } else {
          swal('Oops!', 'Can not edit posted data', 'error');
        }
      }
    } else if (e.action === 'post') {
      if (e.data.IsPosted === '0') {
        if (this.nWhat === '1') {
          url = 'postsales/' + e.data.InvoiceID;
        } else if (this.nWhat === '2') {
          url = 'postpurchases/' + e.data.InvoiceID;
        } else if (this.nWhat === '3') {
          url = 'postvouchers/' + e.data.VoucherID;
        } else if (this.nWhat === '4') {
          url = 'poststransfer/' + e.data.TransferID;
        }

        this.http.postTask(url, {}).then((r) => {
          e.data.IsPosted = '1';
          this.FilterData();
          swal('Post!', 'Your data has been posted!', 'success');

        });
      } else {
        swal('Oops!', 'Can not post posted data', 'error');
      }
    } else if (e.action === 'fullpay' && this.nWhat === '1') {
      if (e.data.IsPosted === '1') {
        swal('Oops!', 'Can not pay posted invoice', 'error');
        return;
      }
      swal({
        text: 'Full pay this invoice ?',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willPay) => {
        if (willPay) {
          this.http
            .postTask('payinvoice', {
              InvoiceID: e.data.InvoiceID,
              Amount: e.data.Balance,
            })
            .then((r) => {
              this.FilterData();
              swal('Paid!', 'Your data has been paid!', 'success');
            })
            .catch((er) => {
              swal('Oops!', 'Error while paying invoice', 'error');
            });
        }
      });
    } else if (e.action === 'partialpay' && this.nWhat === '1') {
      if (e.data.IsPosted === '1') {
        swal('Oops!', 'Can not pay posted invoice', 'error');
        return;
      }
      swal({
        text: 'Full pay this invoice ?',
        icon: 'warning',
        content: { element: 'input' },
      }).then((willPay) => {
        if (willPay) {
          console.log(willPay);

          this.http
            .postTask('payinvoice', {
              InvoiceID: e.data.InvoiceID,
              Amount: willPay,
            })
            .then((r) => {
              this.FilterData();
              swal('Paid!', 'Your data has been paid!', 'success');
            })
            .catch((er) => {
              swal('Oops!', 'Error while paying invoice', 'error');
            });
        }
      });
    } else if (e.action === 'return' && this.nWhat === '1') {
      swal({
        text: 'Full return this invoice ?',
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((res) => {
        if (e.data.DtCr === 'DT') {
          swal({
            text: 'Invalid Invoice type',
            icon: 'error',
          });
          return;
        }
        this.http
          .postTask('makereturn', { InvoiceID: e.data.InvoiceID })
          .then((r: any) => {
            this.FilterData();
            swal(
              'Return!',
              'Return Invoice have been created. Invoice # ' + r.id,
              'success'
            );
          })
          .catch((er) => {
            swal('Oops!', 'Error while paying invoice', 'error');
          });
      });
    }
  }
  TypeChange(e) {
    this.FilterData();
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
            swal('Oops!', 'Error while clsoing account', 'error');
          });
      }
    });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Daybook Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    if (this.nWhat === '1') {
      this.ps.PrintData.Title += ' - Sale Report';
    } else if (this.nWhat === '2') {
      this.ps.PrintData.Title += ' - Purchase Report';
    } else if (this.nWhat === '3') {
      this.ps.PrintData.Title += ' - Voucher Report';
    }

    this.router.navigateByUrl('/print/print-html');
  }
}
