import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-production-summary',
  templateUrl: './production-summary.component.html',
  styleUrls: ['./production-summary.component.scss'],
})
export class ProductionsummaryComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Type: '1',
    ProductID: '',
    StoreID: '',
  };
  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Type',
        fldName: 'ProductionType',
      },
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
        label: 'Weight',
        fldName: 'Weight',
        sum: true,
      },
    ],
    Actions: [],
    Data: [],
  };

  public data: object[];
  Products: any= [];

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ProductType({ target: { value: '1' } });

  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Production Summary Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  ProductSelected(e) {
    this.FilterData();
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    filter += ' and ProductionType=\'' + this.Filter.Type  + '\'';

    if ( this.Filter.ProductID &&  this.Filter.ProductID != '') {
      filter += " and ProductID = " + this.Filter.ProductID ;
    }
    this.http
      .getData('qryproductionreport', {
        flds: 'Date,ProductName,ProductionType, Qty, PackingWght, Weight',
        filter: filter,
      })
      .then((r: any) => {
        this.data = r;
      });
  }
  Clicked(e) {}
  ProductType(e) {
    if (e.target.value === 'Finish Goods') {
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
