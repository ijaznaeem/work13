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
  selector: 'app-orders-report',
  templateUrl: './orders-report.component.html',
  styleUrls: ['./orders-report.component.scss'],
})
export class OrdersReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Status: '0',
    CustomerID: '',
  };

  public data: object[];

  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Order#',
        fldName: 'OrderID',
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
        label: 'Product',
        fldName: 'ProductName',
      },
      {
        label: 'Odered Qty',
        fldName: 'OrderedQty',
      },
      {
        label: 'Deliverred Qty',
        fldName: 'DeliveredQty',
      },
      {
        label: 'Pending Qty',
        fldName: 'PendingQty',
      },

      {
        label: 'Rate',
        fldName: 'SPrice',
      },

      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['Amount']);
        },
      },

    ],
    Actions: [

    ],
    Data: [],
  };

  public Accounts: any ;
  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router,
    private bill: PrintBillService
  ) {
    this.Accounts = this.cachedData.Accounts$;
  }

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Orders Report';
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
    if (this.Filter.CustomerID && this.Filter.CustomerID != '')
      filter += ' and CustomerID = ' + this.Filter.CustomerID;
    if (this.Filter.Status == '1')
      filter += ' and PendingQty > 0 ';
    if (this.Filter.Status == '2')
      filter += ' and PendingQty <= 0 ';

    this.http.getData('qryordersreport?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'print') {
      // this.http.getData('printbill/' + e.data.InvoiceID).then((d: any) => {
      //   d.Business = this.http.GetBData();
      //   console.log(d);
      //   this.bill.PrintPDFBill_A5(d);
      // });
      this.router.navigateByUrl('/print/printinvoice/' + e.data.InvoiceID);

      // this.http.openModal(CreditInvoiceComponent, {
      //   InvoiceID: e.data.InvoiceID,
      // });
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

        // this.router.navigateByUrl('print/gatepass/' + e.data.InvoiceID  + "/" + r)
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
