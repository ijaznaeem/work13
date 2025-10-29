export const VoucherSetting = {
  crud: true,
  Columns: [
    {
      label: 'Voucher No',
      fldName: 'VoucherID',
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
      label: 'Description',
      fldName: 'Description',
    },

    {
      label: 'Debit (€)',
      fldName: 'Debit',
      sum: true,
    },
    {
      label: 'Credit (€)',
      fldName: 'Credit',
      sum: true,
    },
  ],
  Actions: [
    {
      action: 'print',
      title: 'Print',
      icon: 'print',
      class: 'success',
    },
  ],
  Data: [],
};
