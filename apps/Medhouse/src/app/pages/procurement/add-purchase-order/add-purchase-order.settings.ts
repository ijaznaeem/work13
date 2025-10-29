import { getYMDDate } from '../../../factories/utilities';
import {
  AddInputFld,
  AddLookupFld
} from '../../components/crud-form/crud-form-helper';

export class PurchaseOrder {
  OrderID: number;
  Date = getYMDDate();
  ProductName: string | null;
  Qty = 0;
  Supplier1 = '';
  Rate1 = 0;
  Approved1 = 0;
  Supplier2 = '';
  Rate2 = 0;
  Approved2 = 0;
  Supplier3 = '';
  Rate3 = 0;
  Approved3 = 0
  StatusID = 0
  PrevRate= 0;
  Balance1 = 0
  Balance2= 0;
  Balance3 = 0;

}

export const formPurchaseOrder = {
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
