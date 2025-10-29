import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportPDF } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-customer-accts',
  templateUrl: './customer-accts.component.html',
  styleUrls: ['./customer-accts.component.scss'],
})
export class CustomerAcctsComponent implements OnInit {
  public data: object[];
  public Products: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    CustomerID: '',
    RouteID: null,
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Invoice No',
        fldName: 'RefID',
      },
      {
        label: 'Description',
        fldName: 'Description',
      },

      {
        label: 'Debit',
        fldName: 'Debit',
        sum: true,
      },
      {
        label: 'Credit',
        fldName: 'Credit',
        sum: true,
      },
      {
        label: 'Balance',
        fldName: 'Balance',
      },
    ],
    Actions: [],
    Data: [],
  };

  public toolbarOptions: object[];
  Customers: any = [];
  AcctTypes: any = [];
  Routes: any = this.cached.routes$;
  customer: any = {};

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cached: CachedDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http.getData('accttypes').then((r: any) => {
      this.AcctTypes = r;
    });

    this.http.ProductsAll().then((r: any) => {
      r.unshift({ ProductID: '', ProductName: 'All Products' });
      this.Products = r;
    });

    this.http.getUsers().then((r: any) => {
      this.Users = r;
    });
    this.FilterData();
  }
  LoadCustomer(event) {
    if (event.AcctTypeID !== '') {
      this.http
        .getData(
          'qrycustomers?flds=CustomerName,Address, City, CustomerID&orderby=CustomerName' +
            '&filter=AcctTypeID=' +
            event.AcctTypeID
        )
        .then((r: any) => {
          this.Customers = r;
        });
    }
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
    } else {
      filter += ' and CustomerID=-1';
    }

    this.http
      .getData('qrycustomeraccts?filter=' + filter + '&orderby=DetailID')
      .then((r: any) => {
        this.data = r;
      });
  }

  Clicked(e) {}
  PrintReport() {
    ExportPDF(
      this.setting,
      this.data,
      'Customer Account',
      'Customer: ' +
        this.customer.CustomerName +
        '  From: ' +
        JSON2Date(this.Filter.FromDate) +
        ' To: ' +
        JSON2Date(this.Filter.ToDate)
    );
    // this.ps.PrintData = {

    // this.ps.PrintData.HTMLData = document.getElementById('print-section');
    // this.router.navigateByUrl('/print/print-html');
  }
  CustomerSelected(e) {
    if (e) {
      this.http.getData('customers/' + e.CustomerID).then((r) => {
        this.customer = r;
      });
    }
  }
  RouteChanges(e) {
    this.http
      .getData(
        'qrycustomers?flds=CustomerName,Address, City, CustomerID&orderby=CustomerName' +
          '&filter=RouteID=' +
          e.value
      )
      .then((r: any) => {
        this.Customers = r;
      });
  }
  formatDate(d) {
    return JSON2Date(d);
  }
}
