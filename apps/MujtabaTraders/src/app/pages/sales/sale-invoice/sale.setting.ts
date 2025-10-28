import {
  AddInputFld,
  AddLookupFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';

export const SearchForm = {
  title: 'Search Invoices ',
  tableName: 'search',
  pk: 'id',
  columns: [
    AddInputFld('FromDate', 'From Date', 3, true, 'date'),
    AddInputFld('ToDate', 'To Date', 3, true, 'date'),
    AddLookupFld(
      'CustomerID',
      'Select Customer',
      'customers?fld=CustomerID,CustomerName&orderbyCustomerName',
      'CustomerID',
      'CustomerName',
      4,null,false
    ),
  ],
};
export const SaleSettings = {
  Checkbox: false,
  crud: true,
  Columns: [
    {
      label: 'Bill No',
      fldName: 'InvoiceID',
    },
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Custome rName',
      fldName: 'CustomerName',
    },
    {
      label: 'Adress',
      fldName: 'Adress',
    },
    {
      label: 'Amount',
      fldName: 'Amount',
    },

  ],
  Actions: [
    {
      action: 'view',
      title: 'View',
      icon: 'check',
      class: 'primary',
    },
  ],
}
