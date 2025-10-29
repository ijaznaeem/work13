import { Injectable } from '@angular/core';
import { MyData } from '../pages/reports/grid-test/grid-test.component';
import { DataManager } from '@syncfusion/ej2-data';

@Injectable({ providedIn: 'root' })
export class MyDataService {
  private data: MyData[] = [
    {
      ID: 11,
      Name: 'a',
    },
    { ID: 102, Name: 'b' },
  ];

  constructor() {}

  getData(): DataManager {
    return new DataManager(this.data);
  }

  addData(newData: MyData) {
    this.data.push(newData);
  }
}
