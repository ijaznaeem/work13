import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
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
    ProductID: '',
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
        button: {
          style: 'link',
          callback: (row) => {
            this.LoadInvoice(row);
          },
        },
      },
      {
        label: 'Description',
        fldName: 'Description',
      },
      {
        label: 'Qty',
        fldName: 'Qty',
      },
      {
        label: 'Rate',
        fldName: 'Rate',
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
  Customers: any;
  customer: any = {};

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http.getData('customers?orderby=CustomerName').then((r: any) => {
      this.Customers = r;
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
  LoadInvoice(row) {
    if (row)
      if (row.RefType == '1'  && row.RefID >0) {
        window.open('/#/print/printinvoice/' + row.RefID);
      } else if (row.RefType == '2' && row.RefID >0) {
        window.open('/#/print/printpurchase/' + row.RefID);
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

    if (!(this.Filter.ProductID === null || this.Filter.ProductID === '')) {
      filter += ' and ProductID=' + this.Filter.ProductID;
    }

    this.http
      .getData('qrycustomeraccts?filter=' + filter + '&orderby=DetailID')
      .then((r: any) => {
        this.data = r;
      });
  }

  Clicked(e) {}
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }
  CustomerSelected(e) {
    if (e.itemData) {
      this.http.getData('customers/' + e.itemData.CustomerID).then((r) => {
        this.customer = r;
      });
    }
  }
  formatDate(d) {
    return JSON2Date(d);
  }
}
