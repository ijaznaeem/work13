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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { jsonToArray } from '../../../factories/utilities';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss'],
  providers: [AggregateService, FilterService],
})
export class StockReportComponent implements OnInit {
  @ViewChild('grid') public Grid: GridComponent;
  public data: any[];
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
        label: 'Pack Price',
        fldName: 'PackPrice',
      },
      {
        label: 'P. Price',
        fldName: 'PPrice',
      },
      {
        label: 'S. Value',
        fldName: 'SaleValue',
        sum: true,
      },
      {
        label: 'P. Value',
        fldName: 'PurchaseValue',
        sum: true,
      },
      {
        label: 'StockID',
        fldName: 'StockID',
        visible: false,
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
        fldName: 'SPrice',
        control: 'input',
        type: 'number',
        label: 'Sale Price',
        required: true,
        size: 3,
      },
      {
        fldName: 'PackPrice',
        control: 'input',
        type: 'number',
        label: 'Pack Price',
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

    let filter = ' 1 = 1 ';
    if (this.Filter.CompanyID !== '')
      filter += ' AND CompanyID=' + this.Filter.CompanyID;

    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;

    this.http
      .getData('qrystock?flds=' + flds + '&filter=' + filter)
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
        PackPrice: e.PackPrice,
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
  PrintReport() {
    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(18);
    doc.text(this.http.GetBData().BusinessName, 105, 10, {
      align: 'center',
    });
   

    const head = this.setting.Columns.map((x) => x.label).filter(x => x!= 'StockID');
    console.log(head);
    var data = jsonToArray(this.data,['StockID']);
    console.log(data);
    doc.setFontSize(10);
    autoTable(doc, {
      head: [head],
      body: data,
      startY: 25,
      styles: {
        fontSize: 8, // Set the desired font size
        textColor: [0, 0, 0], // Text color in RGB
        fontStyle: 'normal', // 'normal', 'bold', 'italic' or 'bolditalic'
        font: 'helvetica', // Font type (e.g., 'helvetica', 'times', 'courier')
      },
      margin: { left: 5, right: 5 },
    });

    doc.save('table.pdf');
  }
}
