import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { formatNumber } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
@Component({
  selector: 'app-rawstock-report',
  templateUrl: './rawstock-report.component.html',
  styleUrls: ['./rawstock-report.component.scss'],
})
export class RawstockReportComponent implements OnInit {
  public data: object[];
  public Filter = {
    StoreID: '',
    CategoryID: '',
  };
  setting = {
    Columns: [
      {
        label: 'ProductName',
        fldName: 'ItemName',
      },

      {
        label: 'Stock',
        fldName: 'Stock',
        sum: true,
      },

      {
        label: 'PPrice',
        fldName: 'PPrice',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['PPrice']);
        },
      },
      {
        label: 'Purchase Value',
        fldName: 'PurchaseValue',
        sum: true,
        valueFormatter: (d) => {
          return formatNumber(d['PurchaseValue']);
        },
      },
    ],
    Actions: [
      {
        action: 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'primary',
      },
    ],
    Data: [],
  };

  rawstockform = {
    title: 'Rawstock',
    tableName: 'rawstock',
    pk: 'StockID',
    columns: [
      {
        fldName: 'Stock',
        control: 'input',
        type: 'number',
        label: 'Sock',
        required: true,
        size: 3,
      },

      {
        fldName: 'PPrice',
        control: 'input',
        type: 'number',
        label: 'PPrice',
        required: true,
        size: 3,
      },
    ],
  };

  Categories$: Observable<any[]>;

  constructor(private http: HttpBase, private cachedData: CachedDataService) {
    this.Categories$ = this.cachedData.Categories$;
  }

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {
    let filter = ' Stock > 0 ';
    if (this.Filter.StoreID !== '')
      filter += ' AND StoreID=' + this.Filter.StoreID;

    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;

    this.http
      .getData('qryrawstock', { filter: filter, orderby: 'SortNo' })
      .then((r: any) => {
        this.data = r;
      });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'edit') {
      this.http
        .openForm(this.rawstockform, {
          RawstockID: e.data.RawstockID,
          Stock: e.data.Stock,
          SPrice: e.data.SPrice,
          PPrice: e.data.PPrice,
          BatchNo: e.data.BatchNo,
        })
        .then((r) => {
          if (r == 'save') {
            this.FilterData();
          }
        });
    }
  }
}
