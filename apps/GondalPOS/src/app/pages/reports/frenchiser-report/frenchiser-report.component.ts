import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import swal from 'sweetalert';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-frenchiser-report',
  templateUrl: './frenchiser-report.component.html',
  styleUrls: ['./frenchiser-report.component.scss']
})
export class FrenchiserReportComponent implements OnInit {
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
        label: 'Product Name',
        fldName: 'ProductName'
      },
      {
        label: 'Strength',
        fldName: 'Strength'
      },
      {
        label: 'Total Qty',
        fldName: 'TotQty'
      },
      {
        label: 'Total Amount',
        fldName: 'Amount',
        sum: true
      },
      {
        label: '%age',
        fldName: 'DiscPer',
        sum: true
      },
      {
        label: 'Net Amount',
        fldName: 'NetAmount',
        sum: true
      }
    ],
    Actions: [
    ],
    Data: []
  };


  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.http.getSalesman().then((r: any) => {
      this.Salesman = r;
    });
    this.http.getRoutes().then((r: any) => {
      this.Routes = r;
    });
    this.FilterData();

  }
  PrintReport() {

    console.log(this.RptTable.GetSelected().map(e => e.CustomerName).join(','));


    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Frenchiser Report';
    this.ps.PrintData.SubTitle = 'From :' + JSON2Date(this.Filter.FromDate) + ' To: ' + JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "Date between '" + JSON2Date(this.Filter.FromDate) +
      '\' and \'' + JSON2Date(this.Filter.ToDate) + '\'';

    if (!(this.Filter.RouteID === '' || this.Filter.RouteID === null)) {
      filter += ' and RouteID=' + this.Filter.RouteID;
    }
    if (!(this.Filter.SalesmanID === '' || this.Filter.SalesmanID === null)) {
      filter += ' and SalesmanID=' + this.Filter.SalesmanID;
    }
    this.http.getReport('frenchiser?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'print') {
      console.log(e.action);
      this.router.navigateByUrl('/print/printinvoice/' + e.data.InvoiceID);
    } else if (e.action === 'edit') {
      if (e.data.IsPosted === '1') {
        this.myToaster.Error('Can\'t edit posted invoice', 'Error', 1);
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
        this.http.postTask('postsales/' + e.data.InvoiceID, {}).then(() => {
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
        })
          .then(willDelete => {
            if (willDelete) {
              this.http.postTask('delete', { ID: e.data.InvoiceID, Table: 'S' }).then(() => {
                this.FilterData();
                swal('Deleted!', 'Your data has been deleted!', 'success');

              }).catch(() => {
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
