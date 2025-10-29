import { AddInputFld, AddLookupFld } from "../../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper";

export const BookingSetting = {
  Checkbox: false,
  Columns: [
    {
      label: 'No',
      fldName: 'DetailID',
    },
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Customer Name',
      fldName: 'CustomerName',
    },
    {
      label: 'Address',
      fldName: 'Address',
    },
    {
      label: 'Decription',
      fldName: 'Notes',
    },
    {
      label: 'Product',
      fldName: 'ProductName',
    },

    {
      label: 'Rate',
      fldName: 'PPrice',
    },
    {
      label: 'Weight',
      fldName: 'Qty',
      sum: true,
    },
    {
      label: 'Amount',
      fldName: 'Amount',
      sum: true,
    },
  ],
  Actions: [
    {
      action: 'edit',
      title: 'Edit',
      icon: 'edit',
      class: 'primary',
    },
    {
      action: 'invoice',
      title: 'Make Invoice',
      icon: 'pdf-o',
      class: 'success',
    },
    {
      action: 'post',
      title: 'Post',
      icon: 'check',
      class: 'danger',
    },

    {
      action: 'print',
      title: 'Print',
      icon: 'print',
      class: 'primary',
    },
  ],
  Data: [],
};

export const BookingForm= {
  title: 'Booking',
  tableName: 'pinvoicedetails',
  pk: 'DetailID',
  columns: [

    AddInputFld('Date', 'Date', 4, true, 'date'),

    AddLookupFld('CustomerID', 'Supplier',  'customers', 'CustomerID', 'CustomerName', 8,[], true),
    AddLookupFld('ProductID', 'Select Product',  'categories', 'CategoryID', 'CategoryName', 8,[], true, {disabled: true}),
    AddInputFld('Qty', 'Weight (Kgs)', 4, true, 'number'),
    AddInputFld('PPrice', 'Rate', 4, true, 'number'),
    AddInputFld('Amount', 'Amount', 4, true, 'number',{readonly:true}),
    AddInputFld('Notes', 'Notes', 12, true,  'text'),


  ],
}
