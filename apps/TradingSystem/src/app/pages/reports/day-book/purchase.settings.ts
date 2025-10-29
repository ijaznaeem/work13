import { ColumnModel } from "@syncfusion/ej2-angular-grids";

export const PurchaseCols: ColumnModel[] | any = [
  {
    headerText: 'Invoice ID',
    field: 'InvoiceID',
  },
  {
    headerText: 'Date',
    field: 'Date',
  },
  {
    headerText: 'Order No',
    field: 'OrderNo',
  },

  {
    headerText: 'Customer Name',
    field: 'Customername',
  },
  {
    headerText: 'Amount',
    field: 'Amount',
  },
  {
    headerText: 'Freight',
    field: 'FrieghtCharges',
  },
  {
    headerText: 'Labour',
    field: 'Labour',
  },
  {
    headerText: 'Discount',
    field: 'Discount',
  },
  {
    headerText: 'Net Amount',
    field: 'NetAmount',
  },
  {
    headerText: 'Notes',
    field: 'Notes',
  },
  {
    headerText: 'Tr No',
    field: 'TrNo',
  },
  {
    headerText: 'Type',
    field: 'DtCr',
  },
  {
    headerText: 'User Name',
    field: 'UserName',
  },
  {
    headerText: 'Status',
    field: 'Status',
  },
];

export const PurchaseSubCols = [
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
