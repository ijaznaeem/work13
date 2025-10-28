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
      label: 'Bar Code',
      fldName: 'BarCode',
    },
    {
      label: 'ProductName',
      fldName: 'ProductName',
    },
    {
      label: 'Qty',
      fldName: 'Qty',
    },
    {
      label: 'Weight',
      fldName: 'Weight',
    },
    {
      label: 'Cutting',
      fldName: 'Cutting',
    },
    {
      label: 'Polish',
      fldName: 'Polish',
    },
    {
      label: 'Small Stone',
      fldName: 'SmallStone',
    },
    {
      label: 'Big Stone',
      fldName: 'BigStone',
    },
    {
      label: 'Net Weight',
      fldName: 'NetWeight',
    },
    {
      label: 'Labour',
      fldName: 'Labour',
    },
  ];

  stockform = {
    title: 'Stock',
    tableName: 'stock',
    pk: 'StockID',
    columns: [
      {
        fldName: 'Qty',
        control: 'input',
        type: 'number',
        label: 'Qty',
        required: true,
        size: 3,
      },
      {
        fldName: 'Weight',
        control: 'input',
        type: 'number',
        label: 'Weight',
        required: true,
        size: 3,
      },
      {
        fldName: 'Polish',
        control: 'input',
        type: 'number',
        label: 'Polish',
        required: true,
        size: 3,
      },
      {
        fldName: 'Cutting',
        control: 'input',
        type: 'number',
        label: 'Cutting',
        required: true,
        size: 3,
      },
      {
        fldName: 'SmallStone',
        control: 'input',
        type: 'number',
        label: 'Small Stone',
        required: true,
        size: 3,
      },
      {
        fldName: 'BigStone',
        control: 'input',
        type: 'number',
        label: 'Big Stone',
        required: true,
        size: 3,
      },

      {
        fldName: 'Labour',
        control: 'input',
        type: 'number',
        label: 'Labour',
        required: true,
        size: 3,
      },
    ],
  };
  $stores: any;

  constructor(private http: HttpBase, private cachedData: CachedDataService) {}

  ngOnInit() {
    this.$stores = this.cachedData.stores$;
    this.setting.Columns = this.Columns;
    this.FilterData();
  }
  FilterData() {
    console.log(this.Filter);

    let filter = ' Weight  >0 ';
    if (this.Filter.Stock) {
      filter = ' ';
    }
    if (this.Filter.StoreID !== '')
      filter += ' AND StoreID=' + this.Filter.StoreID;

    let flds = '*';

    this.http
      .getData('qryStock', {
        filter: filter,
        orderby: 'ProductName',
      })
      .then((r: any) => {
        this.data = r;

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
