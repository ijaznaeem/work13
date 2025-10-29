export const HoldBillSetting = {
  crud: true,
  Columns: [
    {
      label: 'Bill NO',
      fldName: 'InvoiceID',
    },
    {
      label: 'Amount',
      fldName: 'NetAmount',
    },
  ],
  Actions: [
    {
      action: 'ok',
      title: 'Select',
      icon: 'check',
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

export const OfflineDataSettings = {
  crud: true,
  Columns: [
    {
      label: 'Bill NO',
      fldName: 'InvoiceID',
    },

    {
      label: 'Amount',
      fldName: 'Amount',
    },

    {
      label: 'Discount',
      fldName: 'Discount',
    },

    {
      label: 'Net Amount',
      fldName: 'NetAmount',
    },
  ],
  Actions: [
    {
      action: 'save',
      title: 'Save',
      icon: 'save',
      class: 'success',
    },
    {
      action: 'edit',
      title: 'Edit',
      icon: 'edit',
      class: 'warning',
    },
    {
      action: 'odelete',
      title: 'Delete',
      icon: 'trash',
      class: 'danger',
    },
  ],
  Data: [],
};
export const DailySaleSetting = {
  Checkbox: false,
  crud: true,
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
      label: 'Rounding',
      fldName: 'Rounding',
      sum: true,
    },

    {
      label: 'Net Amount',
      fldName: 'NetAmount',
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
  ],
  Data: [],
};
