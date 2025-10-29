import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { CachedDataService } from '../../../services/cacheddata.service';
import {
  AggregateService,
  FilterService,
  GridComponent,
  SearchSettingsModel,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'app-stock-report-raw',
  templateUrl: './stock-report-raw.component.html',
  styleUrls: ['./stock-report-raw.component.scss'],
  providers: [AggregateService, FilterService],
})
export class StockReportRawComponent implements OnInit {
  @ViewChild('grid') public Grid: GridComponent;
  public data: object[];
  public Filter = {

    CategoryID: '',
  };

  setting = {
  
    Columns: [
      
      {
        label: 'Product',
        fldName: 'ProductName',
        width: 150,
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
        fldName: 'PPrice',
      },
      
      {
        label: 'P. Value',
        fldName: 'PurchaseValue',
        sum: true,
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
        fldName: 'PPrice',
        control: 'input',
        type: 'number',
        label: 'Purchase Price',
        required: true,
        size: 3,
      },
      
    ],
  };

  Companies$ = this.cachedData.Companies$;
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
    console.log(flds);

    let filter = ' Type = 1 ';
    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;

    this.http
      .getData('qrystockraw?flds=' + flds + '&filter=' + filter)
      .then((r: any) => {
        this.data = r;
      });
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
