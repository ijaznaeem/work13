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
    Stock: true,
    nWhat: '1',
  };
  setting: any = {
    Columns: [],
    Actions: [

    ],
  };
  Columns = [
    {
      label: 'Category',
      fldName: 'CategoryName',
    },


    {
      label: 'Stock (Kgs)',
      fldName: 'Stock',
      sum: true,
    },
    {
      label: 'Stock (Tons)',
      fldName: 'Tons',
      sum: true,
    },




  ];



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

    let filter = ' 1=1 ';
    if (this.Filter.StoreID !== '')
      filter += ' AND StoreID=' + this.Filter.StoreID;


      this.setting.Columns = this.Columns;

    this.http
      .postData('dailystock', {})
      .then((r: any) => {
        this.data = r;
        this.data.map((x:any) => {
          x.Tons = x.Stock / 1000;
        });

      });


  }
  Clicked(e) {
    console.log(e);

  }
}
