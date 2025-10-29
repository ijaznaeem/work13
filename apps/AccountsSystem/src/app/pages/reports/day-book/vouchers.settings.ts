export const VoucherSetting = {
  Columns: [
    {
      label: 'Voucher No',
      fldName: 'VoucherNo',
    },
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Type',
      fldName: 'Type',
    },
    {
      label: 'Account Name',
      fldName: 'AccountName',
    },
    {
      label: 'Description',
      fldName: 'Description',
    },
    {
      label: 'From Account',
      fldName: 'FromAccount',
    },

    {
      label: 'Debit',
      fldName: 'Debit',
      sum: true,

    },
    {
      label: 'Credit',
      fldName: 'Credit',
      sum: true,

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
};
