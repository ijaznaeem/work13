export const SaleSetting = {
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
      label: 'Customer Name',
      fldName: 'CustomerName',
    },
    {
      label: 'Address',
      fldName: 'Address',
    },
    {
      label: 'Phone No',
      fldName: 'PhoneNo',
    },

    {
      label: 'Total Weight',
      fldName: 'TotalWeight',
      sum: true,
    },
    {
      label: 'Advance Gold',
      fldName: 'AdvanceGold',
      sum: true,
    },
    {
      label: 'Balance Weight',
      fldName: 'BalanceWeight',
      sum: true,
    },
    {
      label: 'Rate',
      fldName: 'Rate',
      sum: true,
    },
    {
      label: 'Amount',
      fldName: 'Amount',
      sum: true,
    },
    {
      label: 'Total Cutting',
      fldName: 'TotalCutting',
      sum: true,
    },
    {
      label: 'Total Polish',
      fldName: 'TotalPolish',
      sum: true,
    },
    {
      label: 'Bill Gold',
      fldName: 'BillGold',
      sum: true,
    },
    {
      label: 'Bill Gold Amount',
      fldName: 'BillGoldAmount',
      sum: true,
    },
    {
      label: 'Balance Amount',
      fldName: 'BalanceAmount',
      sum: true,
    },
    {
      label: 'Credit Amount',
      fldName: 'CreditAmount',
      sum: true,
    },
    {
      label: 'Type',
      fldName: 'DtCr',
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
