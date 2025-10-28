import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SaleSetting } from '../../../factories/static.data';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

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
    RouteID: '',
  };
  setting = SaleSetting;
  Salesman = this.cachedData.Salesman$;
  public Routes = this.cachedData.routes$;
  public data: object[];

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private bill: PrintBillService,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
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
    if (this.Filter.RouteID && this.Filter.RouteID != '')
      filter += ' and Routeid = ' + this.Filter.RouteID;
    if (this.Filter.SalesmanID && this.Filter.SalesmanID != '')
      filter += ' and SalesmanID = ' + this.Filter.SalesmanID;

    this.http.getData('qryinvoices?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'print') {
      if (e.data.Type == '1')
        this.router.navigateByUrl('/print/printinvoice/' + e.data.InvoiceID);
      else {
        this.http.getData('printbill/' + e.data.InvoiceID).then((d: any) => {
          d.Business = this.http.GetBData();
          console.log(d);
          this.bill.PrintPDFBill(d);
          // this.bill.printTest();
        });
      }
    } else if (e.action === 'edit') {
      if (e.data.IsPosted === '1') {
        this.myToaster.Error('Invoice Already Posted', 'Post');
      } else {
        if (e.data.Type == '1')
          this.router.navigateByUrl('/sales/invoice/' + e.data.InvoiceID);
        else {
          this.router.navigateByUrl('/sales/wholesale/' + e.data.InvoiceID);
        }
      }
    }
  }
}
