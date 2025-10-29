import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { formatNumber, GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-sale-summary',
  templateUrl: './sale-summary.component.html',
  styleUrls: ['./sale-summary.component.scss'],
})
export class SalesummaryComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    SalesmanID: '',
    RouteID: '',
    CompanyID: ''
  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Product Name',
        fldName: 'ProductName',
      },

      {
        label: 'Sale Price',
        fldName: 'SPrice',

      },
      {
        label: 'Qty',
        fldName: 'Qty',
        sum: true,

      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Amount']);
        },
      },
      {
        label: 'Discount',
        fldName: 'Discount',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Discount']);
        },
      },

      {
        label: 'Net Amount',
        fldName: 'NetAmount',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['NetAmount']);
        },
      },

    ],
    Actions: [

    ],
    Data: [],
  };

  public Salesman: any;
  public $Companies: any;
  public Routes: any;
  public data: object[];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {
    this.Salesman = this.cachedData.salesman$;
    this.$Companies = this.cachedData.companies$;
    this.Routes = this.cachedData.routes$;
  }

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


    this.http.getData('qrysalereport?flds=ProductName,SPrice,sum(Qty) as Qty, sum(Amount) as Amount, '
      + 'sum(Discount) as Discount, Sum(NetAmount) as NetAmount&groupby=ProductName,SPrice&filter=' + filter).then((r: any) => {
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
