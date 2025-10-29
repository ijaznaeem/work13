import { ColumnModel } from "@syncfusion/ej2-angular-grids";
import { AddInputFld, AddLookupFld } from "../../components/crud-form/crud-form-helper";

export const POReport : ColumnModel[] | any= [
  {
    headerText: 'PO No',
    field: 'OrderID',
  },
  {
    headerText: 'Date',
    field: 'Date',
  },
  {
    headerText: 'Product Name',
    field: 'ProductName',
    autoFit: true,
    Type: 'link',
    onClick :(d)=>{


    }
  },
  {
    headerText: 'Quantity',
    field: 'Qty',
  },

  {
    headerText: 'Supplier1',
    field: 'Rate1',
  },
  {
    headerText: 'Supplier2',
    field: 'Rate2',
  },
  {
    headerText: 'Supplier3',
    field: 'Rate3',
  },
  {
    headerText: 'Department',
    field: 'CurDepartment',
    autoFit: true,
  },
];


export const formPOApproval = {
  title: 'Purchase Order',
  tableName: 'PurchaseOrders',
  pk: 'OrderID',
  columns: [
    AddInputFld('Date', 'Date', 3, true, 'date'),
    AddLookupFld(
      'ProductName',
      'Product',
      'qryProductsRaw',
      'ProductName',
      'ProductName',
      6,
      null,
      true,
      { type: 'lookup' }
    ),
    AddInputFld('Qty', 'Quantity', 2, true, 'number'),

    AddLookupFld('Supplier1','Supplier 1','qrySuppliers','CustomerID','CustomerName',8,null, true,{ type: 'lookup' }),
    AddInputFld('Rate1', 'Rate 1', 4, true, 'number'),

    AddLookupFld('Supplier2','Supplier 2','qrySuppliers','CustomerID','CustomerName',8,null, true,{ type: 'lookup' }),
    AddInputFld('Rate2', 'Rate 2', 4, true, 'number'),

    AddLookupFld('Supplier3','Supplier 3','qrySuppliers','CustomerID','CustomerName',8,null, true,{ type: 'lookup' }),
    AddInputFld('Rate3', 'Rate 3', 4, true, 'number'),
  ],
};
