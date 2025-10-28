
export const OrdersListSetting = {
  Checkbox: false,
  Columns: [
    {
      label: 'Order #',
      fldName: 'OrderID',
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
      label: 'Qty',
      fldName: 'Qty',
    },
    {
      label: 'Rate',
      fldName: 'Rate',
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
