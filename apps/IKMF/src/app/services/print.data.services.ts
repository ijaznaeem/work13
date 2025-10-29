import { Injectable } from "@angular/core";

@Injectable()
export class PrintDataService {
  public PrintData: any = {};

  public ConvertToArray(cols: any) {
    const colArr = [];
    Object.keys(cols).forEach(k => {
      colArr.push(cols[k].title);
    });
    console.log(colArr);
    return colArr;

  }
}

