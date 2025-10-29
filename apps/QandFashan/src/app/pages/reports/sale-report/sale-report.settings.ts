export const SaleSmryStngs = {
  Checkbox: false,
  Columns: [
    {
      label: 'Date',
      fldName: 'Date',
    },

    {
      label: 'Invoices',
      fldName: 'NoInv',
      sum: true,
    },
    {
      label: 'Amount',
      fldName: 'Amount',
      sum: true,
    },
    {
      label: 'Discount',
      fldName: 'Discount',
      sum: true,
    },
    {
      label: 'Rounding',
      fldName: 'Rounding',
      sum: true,
    },

    {
      label: 'Cash',
      fldName: 'CashSale',
      sum: true,
    },
    {
      label: 'Bank',
      fldName: 'BankSale',
      sum: true,
    },
    {
      label: 'Credit',
      fldName: 'CreditSale',
      sum: true,
    },
    {
      label: 'Total',
      fldName: 'TotalSale',
      sum: true,
    },
  ],
  Actions: [
  ],
  Data: [],
};

export const SaleDetailsStng = {
  Checkbox: false,
  Columns: [
    {
      label: 'Invoice No',
      fldName: 'InvoiceID',
    },
    {
      label: 'Bill No',
      fldName: 'BillNo',
    },
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Time',
      fldName: 'Time',
    },
    {
      label: 'Customer Name',
      fldName: 'CustomerName',
    },

    {
      label: 'Amount',
      fldName: 'Amount',
      sum: true,
    },
    {
      label: 'Discount',
      fldName: 'Discount',
      sum: true,
    },
    {
      label: 'Extra Disc',
      fldName: 'ExtraDisc',
      sum: true,
    },
    {
      label: 'Rounding',
      fldName: 'Rounding',
      sum: true,
    },

    {
      label: 'Net Amount',
      fldName: 'NetAmount',
      sum: true,
    },
    {
      label: 'Recievd',
      fldName: 'CashReceived',
      sum: true,
    },
    {
      label: 'Credit',
      fldName: 'CreditAmount',
      sum: true,
    },
  ],
  Actions: [
    {
      action: 'print',
      title: 'Print',
      icon: 'print',
      class: 'primary',
    },
    {
      action: 'print2',
      title: 'Print 2',
      icon: 'print',
      class: 'primary',
    },
  ],
  Data: [],
};
