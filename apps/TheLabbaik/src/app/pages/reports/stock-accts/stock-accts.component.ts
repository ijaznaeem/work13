import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  GetDateJSON,
  JSON2Date
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-stock-accts',
  templateUrl: './stock-accts.component.html',
  styleUrls: ['./stock-accts.component.scss'],
})
export class StockAcctsComponent implements OnInit {
  @ViewChild('cmbProduct') cmbProduct;
  public data: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    ProductID: '',
    Type: '1',
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
        label: 'Customer Name',
        fldName: 'CustomerName',
      },
      {
        label: 'Stock In',
        fldName: 'QtyIn',
      },
      {
        label: 'Stock Out',
        fldName: 'QtyOut',
      },
      {
        label: 'Balance',
        fldName: 'Balance',
        type: 'number',
      },
    ],
    Actions: [],
    Data: [],
  };

  public toolbarOptions: object[];
  Products: any= [];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http.getData('products?orderby=ProductName').then((r: any) => {
      this.Products = r;
    });

    this.FilterData();
  }

  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "' and Type=" + this.Filter.Type;

    if (!(this.Filter.ProductID === '' || this.Filter.ProductID === null)) {
      filter += ' and ProductID=' + this.Filter.ProductID;
    } else {
      filter += ' and ProductID=-1';
    }
    this.http
      .getData(
        'qrystockaccts?flds=Date, RefID , CustomerName, QtyIn, QtyOut, Balance' +
          ' &filter=' +
          filter +
          '&orderby=AcctID'
      )
      .then((r: any) => {
        this.data = r;
      });
  }

  Clicked(e) {}
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Product Accounts';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate) +
      ' Product: ' +
      this.cmbProduct.text;
    this.router.navigateByUrl('/print/print-html');
  }
  CustomerSelected(e) {}
  formatDate(d) {
    return JSON2Date(d);
  }
  ProductType(e) {
    if (e.target.value === '1') {
      this.http
        .getData('products?flds=ProductID, ProductName&orderby=ProductName')
        .then((r: any) => {
          this.Products = r;
        });
    } else {
      this.http
        .getData(
          'rawitems?flds=ItemID as ProductID,ItemName as ProductName&orderby=ItemName'
        )
        .then((r: any) => {
          this.Products = r;
        });
    }
    this.FilterData();
  }
}
