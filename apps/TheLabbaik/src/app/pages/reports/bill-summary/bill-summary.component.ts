import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-bill-summary',
  templateUrl: './bill-summary.component.html',
  styleUrls: ['./bill-summary.component.scss']
})
export class BillSummaryComponent implements OnInit {
  public data: object[];

  public Filter = {
    Date: GetDateJSON(),
    SalesmanID: '',
    RouteID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date'
      },

      {
        label: 'Bill No',
        fldName: 'InvoiceID'
      },

      {
        label: 'Customer Name',
        fldName: 'CustomerName'
      },
      {
        label: 'Address',
        fldName: 'Address'
      },
      {
        label: 'City',
        fldName: 'City'
      },

      {
        label: 'Bill Amount',
        fldName: 'NetAmount',
        sum: true
      },
      {
        label: 'Received Amount',
        fldName: 'AmountRecvd',
        sum: true
      },
      {
        label: 'Balance',
        fldName: 'Balance',
      },
      {
        label: 'Description',
        fldName: '',
      }
    ],
    Actions: [
    ],
    Data: []
  };

  Salesman: Observable<any[]>  ;
  Routes: any[] | Observable<any[]> ;
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {
    this.Salesman = this.cachedData.Salesman$;
    this.Routes = this.cachedData.routes$;
  }

  ngOnInit() {

    this.FilterData();

  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Recovery Sheet';
    this.ps.PrintData.SubTitle = 'Date :' + JSON2Date(this.Filter.Date) + ' Route: '
      + (Array.isArray(this.Routes) ? this.Routes.find((x: any) => x.RouteID === this.Filter.RouteID)?.RouteName : '');

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter = "Balance > 100 ";

    if (!(this.Filter.RouteID === '' || this.Filter.RouteID === null)) {
      filter += ' and RouteID=' + this.Filter.RouteID;
    }
    if (!(this.Filter.SalesmanID === '' || this.Filter.SalesmanID === null)) {
      filter += ' and SalesmanID=' + this.Filter.SalesmanID;
    }
    this.http.getData('qryinvoices?filter=' + filter).then((r: any) => {
      this.data = r;
    });
  }

}
