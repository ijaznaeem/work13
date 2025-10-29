
export const StngsPendingReport  = {
  Checkbox: false,
  crud: true,
  Columns: [
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Invoice No',
      fldName: 'InvoiceID',
    },
    {
      label: 'Customer Name',
      fldName: 'CustomerName',
    },

    {
      label: 'Store Name',
      fldName: 'StoreName',
    },
    {
      label: 'Product Name',
      fldName: 'ProductName',
    },
    {
      label: 'Qty',
      fldName: 'Qty',
    },
    {
      label: 'Delivered',
      fldName: 'Delivered',
    },
    {
      label: 'Pending',
      fldName: 'Pending',
    },

  ],
  Actions: [
    {
      action: 'delivery',
      title: 'Deliver',
      icon: 'check',
      class: 'success',
    },
    {
      action: 'print',
      title: 'Print Gatepass',
      icon: 'print',
      class: 'primary',
    },
  ],
  Data: [],
};

