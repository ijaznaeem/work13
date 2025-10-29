import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
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
    StoreID: '',
    ItemID: '',
    What: '1',
  };
  colProducts = [
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Description',
      fldName: 'Description',
    },
    {
      label: 'Qty Weight',
      fldName: 'Qty Weight',
    },
    {
      label: 'BalQty',
      fldName: 'BalQty',
    },
    {
      label: 'BalWeight',
      fldName: 'BalWeight',
    },
    {
      label: 'TrType',
      fldName: 'TrType',
    },
  ];

  setting: any = {
    Columns: [],
    Actions: [],
    Data: [],
  };
  lstDataRource: any = [];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.http
      .getData('Products?flds=ProductID, ProductName&orderby=ProductName')
      .then((r) => {
        this.lstDataRource = r;
      });

    this.Filter.FromDate.day = 1;

    this.FilterData();
  }

  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    if (!(this.Filter.ItemID === '' || this.Filter.ItemID === null)) {
      filter += ' and ItemID = ' + this.Filter.ItemID;

      this.http
        .getData(
          'qryProductAccts?flds=Date,  Description,  Qty Weight, BalQty, BalWeight, TrType' +
            ' &filter=' +
            filter +
            '&orderby=ProductAcctID'
        )
        .then((r: any) => {
          this.setting.Columns = this.colProducts;
          this.data = r;
        });
    }
  }
  LoadUnitsData(filter) {
    filter += " and UnitName = '" + this.Filter.ItemID + "'";
  }
  LoadProductsData(filter) {
    // tslint:disable-next-line:quotemark
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
}
