import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AggregateService,
  FilterService,
  GridComponent,
  SearchSettingsModel,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss'],
  providers: [AggregateService, FilterService],
})
export class StockReportComponent implements OnInit {
  @ViewChild('grid') public Grid: GridComponent;
  public data: object[];
  public Filter = {
    CompanyID: '',
    CategoryID: '',
  };

  setting = {
    ButtonsAtRight: true,
    Columns: [
      {
        label: 'Category',
        fldName: 'CategoryName',
      },
      {
        label: 'Product',
        fldName: 'ProductName',
        width: 150,
      },

      {
        label: 'Barcode',
        fldName: 'PCode',
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
        label: 'Price',
        fldName: 'SPrice',
      },
      {
        label: 'S. Value',
        fldName: 'SaleValue',
        sum: true,
      },

      {
        label: 'StockID',
        fldName: 'StockID',
        visible: false,
      },
    ],
    Actions: [

    ],
    Data: [],
  };

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

    ],
  };


  Categories$ = this.cachedData.Categories$;

  public toolbarOptions: ToolbarItems[];
  public searchOptions: SearchSettingsModel;

  constructor(private http: HttpBase, private cachedData: CachedDataService) {}

  ngOnInit() {
    this.searchOptions = {
      fields: ['ProductName', 'PCode', 'CategoryName'],
      operator: 'contains',
      key: '',
      ignoreCase: true,
    };
    this.toolbarOptions = ['Search'];
    this.FilterData();
  }
  FilterData() {
    let flds = this.setting.Columns.map((x) => x.fldName).join(',');
    let filter = ' Type = 2 ';

    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;

    this.http
      .getData('qrystock?flds=' + flds + '&filter=' + filter)
      .then((r: any) => {
        this.data = r;
      });
  }
PrintReport(){
  this.Grid.print();
}
  OnEdit(e) {
    console.log(e);
    this.http
      .openForm(this.stockform, {
        StockID: e.StockID,
        Stock: e.Stock,
        SPrice: e.SPrice,
        PPrice: e.PPrice,
        PackPrice :e.PackPrice
      })
      .then((r) => {
        if (r == 'save') {
          this.FilterData();
        }
      });
  }
  GridLoad() {
    const rowHeight: number = this.Grid.getRowHeight(); // height of the each row
    const gridHeight: any = this.Grid.height; // grid height
    const pageSize: number = this.Grid.pageSettings.pageSize!; // initial page size
    const pageResize: any = (gridHeight - pageSize * rowHeight) / rowHeight; // new page size is obtained here
    this.Grid.pageSettings.pageSize = pageSize + Math.round(pageResize) - 2;
  }


}
