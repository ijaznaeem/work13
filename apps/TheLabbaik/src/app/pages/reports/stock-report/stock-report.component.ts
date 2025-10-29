import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss'],
})
export class StockReportComponent implements OnInit {
  public data: object[];
  public Filter = {
    StoreID: '',
    CategoryID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Category',
        fldName: 'CategoryName',
      },
      {
        label: 'ProductName',
        fldName: 'ProductName',
      },
      {
        label: 'Packing',
        fldName: 'Packing',
      },
      {
        label: 'Stock',
        fldName: 'Stock',
        sum: true,
      },
      {
        label: 'Cortons',
        fldName: 'Packs',
        sum: true,
      },
      {
        label: 'Pcs',
        fldName: 'Pcs',
        sum: true,
      },

      {
        label: 'Weight (Tons)',
        fldName: 'Weight',
        sum: true,
      },


      {
        label: 'SPrice',
        fldName: 'SPrice',
        sum: true,

      },
      {
        label: 'PPrice',
        fldName: 'PPrice',
        sum: true,

      },
      {
        label: 'Purchase Value',
        fldName: 'PurchaseValue',
        sum: true,

      },
      {
        label: 'Sale Value',
        fldName: 'SaleValue',
        sum: true,

      },
    ],
    Actions: [

    ],
    Data: [],
  };



  Stores = [];
  Categories$: Observable<any[]>;

  constructor(private http: HttpBase, private cachedData: CachedDataService) {}

  ngOnInit() {
    this.http.getData('stores').then((r: any) => {
      this.Stores = r;
    });
    this.Categories$ = this.cachedData.Categories$;
    this.FilterData();
  }
  FilterData() {
    let filter = ' Stock > 0 ';
    if (this.Filter.StoreID !== '')
      filter += ' AND StoreID=' + this.Filter.StoreID;

    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;

    this.http.getData('qrystock', { orderby: 'SortNo', filter: filter }).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'edit') {

    }
  }
}
