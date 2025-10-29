export const PurchaseSetting = {
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
      label: 'Supplier Name',
      fldName: 'CustomerName',
    },

    {
      label: 'Total Weight',
      fldName: 'TotalWeight',
      sum: true,
    },
    {
      label: 'Cutting',
      fldName: 'Cutting',
      sum: true,
    },
    {
      label: 'Small Stone',
      fldName: 'SmallStone',
      sum: true,
    },
    {
      label: 'Big Stone',
      fldName: 'BigStone',
      sum: true,
    },
    {
      label: 'Wastage',
      fldName: 'TotalWastage',
      sum: true,
    },

    {
      label: 'Net Weight',
      fldName: 'NetWeight',
      sum: true,
    },
    {
      label: 'Gold Paid',
      fldName: 'GoldPaid',
      sum: true,
    },
    {
      label: 'Gold Balance',
      fldName: 'GoldBalance',
      sum: true,
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
    {
      label: 'Labour',
      fldName: 'Labour',
      sum: true,
    },
    {
      label: 'Amount Paid',
      fldName: 'AmountPaid',
      sum: true,
    },
    {
      label: 'Posted',
      fldName: 'Posted',
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
    {
      action: 'delete',
      title: 'Delete',
      icon: 'trash',
      class: 'danger',
    },
  ],
  Data: [],
};
