import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { CachedDataService } from '../../../services/cacheddata.service';
import {
  AggregateService,
  FilterService,
  Grid,
  GridComponent,
  SearchSettingsModel,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';
import { DataManager } from '@syncfusion/ej2-data';
import { MyDataService } from '../../../services/my-data.service';

export interface MyData {
  ID: number;
  Name: String;
}

@Component({
  selector: 'app-grid-test',
  templateUrl: './grid-test.component.html',
  styleUrls: ['./grid-test.component.scss'],
  providers: [AggregateService, FilterService],
})
export class GridTestComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;

  dataManager: DataManager;
  newRowData = {
    ID: 2,
    Name: 'my name',
  };
  data = [
    {
      ID: 1,
      Name: 'xyz',
    },
  ];

  constructor(private dataService: MyDataService) {}

  ngOnInit() {
    setTimeout(() => {
      this.data.push(this.newRowData);
    }, 1000);
    // Get data from service or define initial data
    // this.dataManager = this.dataService.getData();
  }

  onCellEditingStopped(args: any) {
    if (args.rowIndex === 0) {
      this.newRowData[args.columnName] = args.data.value;
      if (this.isPinnedRowCompleted(this.newRowData)) {
        this.dataService.addData(this.newRowData);
        this.grid.refresh();
        this.newRowData = {
          ID: 0,
          Name: '',
        }; // Clear data for next row
      }
    }
  }
  isPinnedRowCompleted(data: MyData): boolean {
    for (const key in data) {
      if (data[key] === undefined) {
        return false;
      }
    }
    return true;
  }
}
