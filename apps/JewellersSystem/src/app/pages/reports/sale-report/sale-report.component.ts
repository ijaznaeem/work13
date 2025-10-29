import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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

    CustomerID: '',
  };
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
        label: 'Total Weight',
        fldName: 'TotalWeight',
        sum: true,
      },
      {
        label: 'Advance Gold',
        fldName: 'AdvanceGold',
        sum: true,
      },
      {
        label: 'Balance Weight',
        fldName: 'BalanceWeight',
        sum: true,
      },
      {
        label: 'Rate',
        fldName: 'Rate',
        sum: true,
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,
      },
      {
        label: 'Total Polish',
        fldName: 'TotalPolish',
        sum: true,
      },
      {
        label: 'Total Labour',
        fldName: 'TotalLabour',
        sum: true,
      },
      {
        label: 'Total Amount',
        fldName: 'TotalAmount',
        sum: true,
      },
      {
        label: 'Advance Amount',
        fldName: 'AdvanceAmount',
        sum: true,
      },
      {
        label: 'Net Bill Gold',
        fldName: 'NetBillGold',
        sum: true,
      },
      {
        label: 'Bill Gold Amount',
        fldName: 'BillGoldAmount',
        sum: true,
      },
      {
        label: 'Balance Amount',
        fldName: 'BalanceAmount',
        sum: true,
      },
      {
        label: 'Gold Amount Paid',
        fldName: 'GoldAmountPaid',
        sum: true,
      },
      {
        label: 'Recieved Amount',
        fldName: 'RecievedAmount',
        sum: true,
      },
      {
        label: 'Discount',
        fldName: 'Discount',
        sum: true,
      },
      {
        label: 'Advance Returned',
        fldName: 'AdvanceReturned',
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
        fldName: 'RecievedAmount',
        sum: true,
      },
      {
        label: 'Credit Amount',
        fldName: 'CreditAmount',
        sum: true,
      },
      {
        label: 'DtCr',
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
          label: 'Product Code',
          fldName: 'BarCode',
        },
        {
          label: 'Product Name',
          fldName: 'Description',
        },
        {
          label: 'Qty',
          fldName: 'Qty',
          sum: true,
        },
        {
          label: 'Weight',
          fldName: 'Weight',
          sum: true,
        },
        {
          label: 'Polish',
          fldName: 'Polish',
          sum: true,
        },
        {
          label: 'Labour',
          fldName: 'Labour',
          sum: true,
        },
        {
          label: 'Cutting',
          fldName: 'Cutting',
          sum: true,
        },
      ],
    },
  };

  public Customers: Observable<any[]> ;
  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router,
    private bill: PrintBillService
  ) {}

  ngOnInit() {
    this.Customers = this.cachedData.accounts$;
    this.Filter.FromDate.day = 1
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
    if (this.Filter.CustomerID && this.Filter.CustomerID != '')
      filter += ' and CustomerID = ' + this.Filter.CustomerID;


    this.http.getData('qryInvoices?filter=' + filter).then((r: any) => {
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
