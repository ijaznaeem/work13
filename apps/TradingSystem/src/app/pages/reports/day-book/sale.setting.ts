import { ColumnModel } from "@syncfusion/ej2-angular-grids";

export const SaleCols: ColumnModel[] | any = [

];

export const SaleSubCols = [
  {
    headerText: 'I No',
    field: 'InvoiceID',
  },
  {
    headerText: 'Product Name',
    field: 'ProductName',
  },
  {
    headerText: 'Product Price',
    field: 'PPrice',
  },
  {
    headerText: 'Quantity',
    field: 'Qty',
  },
  {
    headerText: 'Amount',
    field: 'Amount',
  },
  {
    headerText: 'Fare',
    field: 'Fare',
  },
  {
    headerText: 'Labour',
    field: 'Labour',
  },
  {
    headerText: 'Store Name',
    field: 'StoreName',
  }
]
