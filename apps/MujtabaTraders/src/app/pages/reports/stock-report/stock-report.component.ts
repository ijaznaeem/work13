import { Component, OnInit } from '@angular/core';
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
    StoreID: '1',
    Stock: false,
    nWhat: '1',
  };
  setting: any = {
    Columns: [],
    Actions: [
      {
        action: 'edit',
        title: 'Edit',
        icon: 'pencil',
        class: 'primary',
      },
    ],
  };
  Columns = [
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
      label: 'PPrice',
      fldName: 'PPrice',
    },
    {
      label: 'SPrice',
      fldName: 'SPrice',
    },
    {
      fldName: 'TotalWeight',
      label: 'Weight',
      sum: true,
    },
    {
      label: 'Unit',
      fldName: 'UnitName',
    },
    {
      label: 'Store',
      fldName: 'StoreName',
    },
  ];

  stockform = {
    title: 'Stock',
    tableName: 'stock',
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
        fldName: 'SPrice',
        control: 'input',
        type: 'number',
        label: 'Sale Price',
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
      {
        fldName: 'BatchNo',
        control: 'input',
        type: 'text',
        label: 'BatchNo',
        required: false,
        size: 3,
      },
    ],
  };

  Stores$: any;
  Categories$: any;

  constructor(private http: HttpBase, private cachedData: CachedDataService) {
    this.Stores$ = this.cachedData.Stores$;
    this.Categories$ = this.cachedData.Categories$;
  }

  ngOnInit() {
    this.setting.Columns = this.Columns;
    this.FilterData();
  }
  FilterData() {
    console.log(this.Filter);

    let filter = ' 1 ';
    if (this.Filter.Stock) {
      filter += ' AND Stock > 0 ';
    }

    if (this.Filter.StoreID !== '')
      filter += ' AND StoreID=' + this.Filter.StoreID;
    if (this.Filter.nWhat == '1') {
      this.setting.Columns = this.Columns;
      this.http.getData('qrystock?filter=' + filter).then((r: any) => {
        this.data = r;
      });
    } else if (this.Filter.nWhat == '2') {
      let flds =
        '&flds=CategoryName,sum(Stock) as Stock, Sum(TotalWeight) as KGs &groupby=CategoryName';
      this.setting.Columns = [
        { label: 'CategoryName', fldName: 'CategoryName' },
        { label: 'Stock', fldName: 'Stock', sum: true },
        { label: 'Weight(KGs) ', fldName: 'KGs', sum: true },
      ];
      this.http
        .getData('qrystock?filter=' + filter + flds + '')
        .then((r: any) => {
          this.data = r;
        });
    }

    // this.http
    //   .getData('qrystock?filter=' + filter + '&flds=' + flds)
    //   .then((r: any) => {
    //     this.data = r;
    //   });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'edit') {
      this.http
        .openForm(this.stockform, {
          StockID: e.data.StockID,
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
