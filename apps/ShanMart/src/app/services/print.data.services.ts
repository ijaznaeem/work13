export class PrintDataService {
  public PrintData:any = {
    Title: '',
    SubTitle: '',
    Columns: [],
    Data: [],
    isBase64: false,
    base64Data: ''
  };
  public InvoiceData: any;

  public ConvertToArray(cols: any) {
    const colArr:any = [];
    const cData = [];
    Object.keys(cols).forEach(k => {
      colArr.push({
        column: k,
        title: cols[k].title
      });
    });
    return colArr;
  }
  public ConvertData(data: any, cols: any) {
    const cData:any = [];
    for (let i = 0; i < data.length; i++) {
      const cRow:any = [];
      Object.keys(cols).forEach(k => {
        cRow.push(data[i][k]);
      });
      cData.push(cRow);
    }
    console.log(cData);
    return Object.keys(cols);
  }
}
