import {
  AddLookupFld
} from '../../components/crud-form/crud-form-helper';

export const ProductDedicationForm :any= {
  title: 'Product Dedication',
  tableName: 'ProductsByRegions',
  pk: 'ID',
  columns: [
    AddLookupFld('RegionID', 'Region', 'Regions', 'RegionID', 'RegionName', 6),
    AddLookupFld(
      'CustomerID',
      'Customer',
      "qryCustomers?filter=Status=1 and AcctType = 'Customer'",
      'CustomerID',
      'CustomerName',
      6
    ),
    AddLookupFld(
      'ProductID',
      'Product',
      'qryProducts',
      'ProductID',
      'ProductName',
      6
    ),

  ],
};

export const ProductDedicationList = {
  Columns: [
    { fldName: 'ProductName', label: 'Product' },
    { fldName: 'CustomerName', label: 'Customer' },
    { fldName: 'RegionName', label: 'Region' },
  ],
  Actions: [
    { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
    { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
  ],
};
