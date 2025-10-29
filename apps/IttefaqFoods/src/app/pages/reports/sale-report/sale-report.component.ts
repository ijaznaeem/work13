import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import swal from 'sweetalert';
import { PrintDataService } from '../../../services/print.data.services';
import { formatNumber } from '../../../factories/utilities';

@Component({
  selector: 'app-sale-report',
  templateUrl: './sale-report.component.html',
  styleUrls: ['./sale-report.component.scss'],
})
export class SaleReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  public data: object[];
  public Salesman: object[];
  public Routes: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: '',
    RouteID: '',
  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Invoice No',
        fldName: 'InvoiceID',
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
        label: 'Address',
        fldName: 'Address',
      },
      {
        label: 'City',
        fldName: 'City',
      },
      {
        label: 'Amount',
        fldName: 'Amount',
      },
      {
        label: 'Discount',
        fldName: 'Discount',
      },

      {
        label: 'Net Amount',
        fldName: 'NetAmount',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['NetAmount']);
        },
      },
      {
        label: 'Recievd',
        fldName: 'AmountRecvd',
        sum: true,
      },
      {
        label: 'Balance',
        fldName: 'Balance',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Balance']);
        },
      },
      {
        label: 'Type',
        fldName: 'DtCr',
      },
    ],
    Actions: [
      {
        action: 'print',
        title: 'Print',
        icon: 'print',
        class: 'primary',
      },
      {
        action: 'printdelivery',
        title: 'Print delivery',
        icon: 'print',
        class: 'primary',
      },
    ],
    Data: [],
  };

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Sale Report';
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

    this.http.getData('qryinvoices?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'print') {
      console.log(e.action);
      this.router.navigateByUrl('/print/printinvoice/' + e.data.InvoiceID);
    } else if (e.action === 'printdelivery') {
      console.log(e.action);
      this.router.navigateByUrl('/print/deliverychallan/' + e.data.InvoiceID);
    } else if (e.action === 'edit') {
      if (e.data.IsPosted === '1') {
        this.myToaster.Error("Can't edit posted invoice", 'Error', 1);
      } else {
        if (e.data.DtCr === 'CR') {
          this.router.navigateByUrl('/sale/sale/' + e.data.InvoiceID);
        } else {
          this.router.navigateByUrl('/sale/salereturn/' + e.data.InvoiceID);
        }
      }
    } else if (e.action === 'post') {
      if (e.data.IsPosted === '1') {
        this.myToaster.Error('Invoice Already Posted', 'Post');
      } else {
        this.http.postTask('postsales/' + e.data.InvoiceID, {}).then((r) => {
          this.myToaster.Sucess('Invoice is posted', 'Post');
          e.data.IsPosted = '1';
        });
      }
    } else if (e.action === 'delete') {
      if (e.data.IsPosted === '0') {
        swal({
          text: 'Delete this Invoice!',
          icon: 'warning',
          buttons: {
            cancel: true,
            confirm: true,
          },
        }).then((willDelete) => {
          if (willDelete) {
            this.http
              .postTask('delete', { ID: e.data.InvoiceID, Table: 'S' })
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
    }
  }
}
