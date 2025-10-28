import { Component, OnInit } from '@angular/core';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
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
      label: 'Category',
      fldName: 'CategoryName',
    },
    {
      label: 'Unit',
      fldName: 'UnitName',
    },

    {
      label: 'Stock',
      fldName: 'ClosingStock',
      sum: true,
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

  Stores$ = this.cachedData.Stores$;
  Categories$ = this.cachedData.Categories$;

  constructor(private http: HttpBase, private cachedData: CachedDataService) {}

  ngOnInit() {
    this.setting.Columns = this.Columns;
    this.FilterData();
  }
  FilterData() {
    console.log(this.Filter);

    let filter = ' Stock > 0 ';
    if (this.Filter.StoreID !== '')
      filter += ' AND StoreID=' + this.Filter.StoreID;


    let flds = '*';
    if (this.Filter.nWhat == '2') {
      flds =
        'UnitName,sum(Stock) as Qty, Sum(Stock)/1000 as Tons &groupby=UnitName';
      this.setting.Columns = [
        { label: 'UnitName', fldName: 'UnitName' },
        { label: 'Stock', fldName: 'ClosingStock', sum: true },
        { label: 'In Tons', fldName: 'Tons', sum: true },
      ];
    } else {
      this.setting.Columns = this.Columns;
    }

    this.http
      .postData('dailystock', {
        StoreID: this.Filter.StoreID,
        Date: JSON2Date(GetDateJSON()),
        Type: this.Filter.nWhat,

      })
      .then((r: any) => {
        this.data = r;
        if (this.Filter.Stock){
          this.data = this.data.filter((x:any)=> {return Number(x.ClosingStock)>0})
        }
      });

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
