import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  GetDateJSON,
  JSON2Date,
  formatNumber,
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-sale-report',
  templateUrl: './sale-report.component.html',
  styleUrls: ['./sale-report.component.scss'],
})
export class SaleReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Balance: '0',
    SearchText: '',
    ShowDeleted: false
  };
  Salesman: any;
  public Routes: any;
  public data: object[];

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
        label: 'Reference',
        fldName: 'Reference',
      },

      {
        label: 'Posted',
        fldName: 'Status',
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,

      },
      {
        label: 'Carriage',
        fldName: 'DeliveryCharges',
        sum: true,

      },
      {
        label: 'Discount',
        fldName: 'Discount',
        sum: true,

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
        label: 'Amount Received',
        fldName: 'AmntRecvd',
        sum: true,
      },
      {
        label: 'Balance',
        fldName: 'Balance',
        sum: true,
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
        title: 'Print Gatepass',
        icon: 'print',
        class: 'primary',
      },

    ],
    Data: [],
    SubTable: {
      table: 'details',
      Columns: [
        {
          label: 'Product Name',
          fldName: 'ProductName',
        },
        {
          label: 'Qty',
          fldName: 'Qty',
          sum: true,
        },
        {
          label: 'Packing',
          fldName: 'Packing',
        },
        {
          label: 'KGs',
          fldName: 'KGs',
          sum: true,
        },
        {
          label: 'Sale Price',
          fldName: 'SPrice',
        },
        {
          label: 'Amount',
          fldName: 'Amount',
          sum: true,
        },
      ],
    },
  };

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router,
    private bill: PrintBillService
  ) {}

  ngOnInit() {
    this.Routes = this.cachedData.routes$;
    this.Salesman = this.cachedData.Salesman$;
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

    if (this.Filter.Balance > '0') filter += ' and Balance >= 1000 ';
    if (this.Filter.ShowDeleted) {
      filter += ' and IsDeleted = 1 ';
    } else {
      filter += ' and IsDeleted = 0 ';
    }

    this.http.getData('qryinvoices?filter=' + filter).then((r: any) => {
      this.data = r.map((obj: any) => {
        return {
          ...obj,
          details: [],
          Status: obj.IsPosted == 0 ? 'Un-Posted' : 'Posted',
        };
      });
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'print') {
      this.router.navigateByUrl('/print/printinvoice/' + e.data.InvoiceID);
    } else if (e.action === 'printdelivery') {
      console.log(e.action);
      this.http.Printgatepass().then((r: any) => {
        this.http
          .getData(`getgatepass/${e.data.InvoiceID}/${r}`)
          .then((inv: any) => {
            let Invoice = inv[0];

            this.http
              .getData(
                'qryinvoicedetails?filter=InvoiceID=' +
                  e.data.InvoiceID +
                  ' and StoreID =' +
                  r
              )
              .then((r: any) => {
                console.log(r);
                Invoice.details = r;
                Invoice.Business = this.http.GetBData();
                console.log(Invoice);
                this.bill.PrintGatePass_A5(Invoice);
              });
          });
      });
    }
  }

  RowClicked(event) {
    console.log(event);
    if (event.data.details.length == 0) {
      this.http
        .getData('qryinvoicedetails?filter=InvoiceID=' + event.data.InvoiceID)
        .then((r) => {
          event.data['details'] = r;
        });
    }
  }
}
