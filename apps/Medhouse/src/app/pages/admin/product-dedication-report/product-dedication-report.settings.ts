import { AddLookupFld } from '../../components/crud-form/crud-form-helper';

export const ProductDedicationForm: any = {
  title: 'Product Dedication',
  CrudButtons: false,
  FormOnly: true,
  columns: [
    AddLookupFld(
      'ProductID',
      'Product',
      'qryProducts',
      'ProductID',
      'ProductName',
      4
    ),
    AddLookupFld(
      'CustomerID',
      'Customer',
      "qryCustomers?filter=Status=1 and AcctType = 'Customer'",
      'CustomerID',
      'CustomerName',
      4
    ),
  ],
};

export const ProductDedicationList = {
  Columns: [
    { fldName: 'ProductName', label: 'Product' },
    { fldName: 'RegionName', label: 'Region' },
    { fldName: 'CustomerName', label: 'Customer' },
  ],
  Actions: [],
};
