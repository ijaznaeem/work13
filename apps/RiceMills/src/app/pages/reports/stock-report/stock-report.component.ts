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
    CompanyID: '',
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
        label: 'Stock',
        fldName: 'Stock',
        sum: true,
      },

      {
        label: 'Bags',
        fldName: 'Bags',
        sum: true,
      },
      {
        label: 'Kgs',
        fldName: 'Kgs',
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
        fldName: 'PPrice',
        control: 'input',
        type: 'number',
        label: 'PPrice',
        required: true,
        size: 3,
      },
    ],
  };

  Companies$: Observable<any[]>;
  Categories$: Observable<any[]>;

  constructor(private http: HttpBase, private cachedData: CachedDataService) {
    this.Companies$ = this.cachedData.Companies$;
    this.Categories$ = this.cachedData.Categories$;
  }

  ngOnInit() {
    this.FilterData();
  }
  FilterData() {
    let filter = ' Stock > 0 ';
    if (this.Filter.CompanyID !== '')
      filter += ' AND CompanyID=' + this.Filter.CompanyID;

    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;

    this.http.getData('qrystock?filter=' + filter).then((r: any) => {
      this.data = r;
    });
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
