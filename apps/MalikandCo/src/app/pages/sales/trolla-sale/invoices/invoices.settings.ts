
export const InvoicesSetting = {
  Checkbox: false,
  Columns: [
    {
      label: 'Invoice No',
      fldName: 'SaleID',
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
      label: 'Product Name',
      fldName: 'CategoryName',
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
