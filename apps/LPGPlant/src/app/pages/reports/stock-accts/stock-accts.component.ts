import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
  };
  colProducts = [
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Invoice No',
      fldName: 'RefID',

        button: {
          style: 'link',
          callback: (e)=>{this.InvNoClicked(e)}} ,
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
    },
  ];
  colUnits = [
    {
      label: 'Date',
      fldName: 'Date',
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
  ];
  setting: any = {
    Columns: [],
    Actions: [],
    Data: [],
  };
  lstDataRource: any = [];
  stores$: Observable<any[]>;

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router
  ) {
    this.stores$ = this.cachedData.Stores$;
  }

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http
      .getData(
        'qryproducts?flds=ProductID as ItemID, ProductName as ItemName&orderby=ProductName'
      )
      .then((r) => {
        this.lstDataRource = r;
      });
    this.FilterData();
  }

  FilterData() {
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    filter += ' and StoreID = ' + this.Filter.StoreID;

    if (!(this.Filter.ItemID === '' || this.Filter.ItemID === null)) {
      this.LoadProductsData(filter);
    }
  }

  LoadProductsData(filter) {
    // tslint:disable-next-line:quotemark

    filter += ' and ProductID = ' + this.Filter.ItemID;

    this.http
      .getData(
        'qrystockaccts?flds=Date, RefID, CustomerName, QtyIn, QtyOut, Balance' +
          ' &filter=' +
          filter +
          '&orderby=AcctID'
      )
      .then((r: any) => {
        this.setting.Columns = this.colProducts;
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

  Changed(e) {
    if (e.target.value == '1') {
    } else if (e.target.value == '2') {
      this.http
        .getData(
          'qryproducts?flds=UnitName as ItemID, UnitName as ItemName&groupby=UnitName&orderby=UnitName'
        )
        .then((r) => {
          this.lstDataRource = r;
        });
    }
  }
  InvNoClicked(e){
    console.log(e);
    if (e.QtyOut > 0){
      this.http.PrintSaleInvoice(e.RefID);
    } else  {
      this.http.PrintPurchaseInvoice(e.RefID);
    }

  }
}
