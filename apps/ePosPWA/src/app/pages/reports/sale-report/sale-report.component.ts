import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { CachedDataService } from '../../../services/cacheddata.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { SaleDetailsStng, SaleSmryStngs } from './sale-report.settings';

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
    SalesmanID: '',
  };

  Salesman = this.cachedData.Salesman$;
  public Routes = this.cachedData.routes$;
  public data: object[];
  public nWhat = '1';
  public settings = SaleSmryStngs;

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private bill: PrintBillService,
    private router: Router
  ) {}

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

    if (this.Filter.SalesmanID != '')
      filter += ' and SalesmanID = ' + this.Filter.SalesmanID;

    if (this.nWhat == '1') {
      const flds =
        'date,Count(*) as NoInv,  sum(Amount) as Amount, sum(Discount) as Discount, ' +
        ' sum(Rounding) as Rounding, sum(Netamount) as TotalSale, sum(CashReceived) as CashSale, ' +
        ' sum(CreditAmount) as CreditSale, Sum(BankAmount) as BankSale';

      const grpby = 'date';
      this.http
        .getData(
          'qryinvoices?filter=' +
            filter +
            '&groupby=' +
            grpby +
            '&flds=' +
            flds +
            '&orderby=Date'
        )
        .then((r: any) => {
          this.data = r;
        });

      this.settings = SaleSmryStngs;
    } else if (this.nWhat == '2') {
      this.http
        .getData('qryinvoices?filter=' + filter + '&orderby=Date')
        .then((r: any) => {
          this.data = r;
        });

      this.settings = SaleDetailsStng;
    }
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'print') {
      this.http.getData('printbill/' + e.data.InvoiceID).then((d: any) => {
        d.Business = this.http.GetBData();
        console.log(d);

        var result = this.bill.PrintPDFBill(d);
        // PDFObject.embed(result, '#elemEmb', {
        //   width: '100%',
        //   height: '500px',
        //   id: 'embeded',
        // })
      });
    }
  }
}
