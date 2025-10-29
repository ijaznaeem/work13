export const OrderSettings = {
  Columns: [
    {
      label: 'Order No',
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
      label: 'Cash Amount',
      fldName: 'Cash',
      sum: true,

    },

    {
      label: 'Bank Amount',
      fldName: 'Bank',
      sum: true,

    },

    {
      label: 'Amount',
      fldName: 'Amount',
      sum: true,

    },

    {
      label: 'Posted',
      fldName: 'Status',
    },
  ],
  Actions: [
    {
      action: 'edit',
      title: 'Edit',
      icon: 'pencil',
      class: 'primary',
    },
    {
      action: 'post',
      title: 'Post',
      icon: 'check',
      class: 'warning',
    },
    {
      action: 'print',
      title: 'Print',
      icon: 'print',
      class: 'success',
    },
    // {
    //   action: 'delete',
    //   title: 'Delete',
    //   icon: 'trash',
    //   class: 'danger',
    // },
  ],
  Data: [],
};
