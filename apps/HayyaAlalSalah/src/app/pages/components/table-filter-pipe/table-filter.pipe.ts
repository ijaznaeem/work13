import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(Data: any, filterString: string, columns: any): any {
    if (Data.length === 0 || !filterString) {
      return Data;
    }
    let filteredData: any = [];
    for (let data of Data) {
      for(let col of columns)
      if (data[col.fldName].toLowerCase().includes(filterString.toLowerCase())) {
        filteredData.push(data);
        break;
      }
    }
    return filteredData;
  }
}
