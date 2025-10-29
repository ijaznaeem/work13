import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { PurchaseSetting } from '../day-book/purchase.settings';

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.scss'],
})
export class PurchaseReportComponent implements OnInit {
  public data: object[];
  public Salesman: object[];
  public Customers: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    CustomerID: '',
  };
  setting = PurchaseSetting;

  AcctTypes = this.cachedData.AcctTypes$;

  constructor(
    private http: HttpBase,
    private cachedData: CachedDataService,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  getAccounts(type) {
    this.http.getAcctstList(type).then((res: any) => {
      this.Customers = res;
    });
  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Purchase Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    if (!(this.Filter.CustomerID === '' || this.Filter.CustomerID === null)) {
      filter += ' and CustomerID=' + this.Filter.CustomerID;
    }

    this.http.getData('qrypinvoices?filter=' + filter).then((r: any) => {
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
        table = 'pinvoice/' + e.data.InvoiceID;

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
      this.router.navigateByUrl('/print/printpurchase/' + e.data.InvoiceID);
    } else if (e.action === 'edit') {
      if (e.data.IsPosted === '0') {
        this.router.navigateByUrl('/purchase/invoice/' + e.data.InvoiceID);
      } else {
        swal('Oops!', 'Can not edit posted data', 'error');
      }
    } else if (e.action === 'post') {
      if (e.data.IsPosted === '0') {
        url = 'postpurchases/' + e.data.InvoiceID;

        this.http.postTask(url, {}).then((r) => {
          e.data.IsPosted = '1';
          swal('Post!', 'Your data has been posted!', 'success');
        });
      } else {
        swal('Oops!', 'Can not post posted data', 'error');
      }
    }
  }
}
