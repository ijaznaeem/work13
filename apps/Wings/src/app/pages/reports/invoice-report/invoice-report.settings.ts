export const InvoiceReportSettings = {
  tableName: 'qryinvoices',
  pk: 'invoice_id',
  Columns: [
    {
      fldName: 'date',
      label: 'Date',
    },
    {
      fldName: 'invoice_id',
      label: 'Inv No',

    },
    {
      fldName: 'order_id',
      label: 'Order No',
    },
    {
      fldName: 'agent_name',
      label: 'Agent Name',
    },
    {
      fldName: 'customer_name',
      label: 'Customer Name',
    },
    {
      fldName: 'amount',
      label: 'Amount',
      sum: true
    },
    {
      fldName: 'vat',
      label: 'Tax',
      sum: true
    },
    {
      fldName: 'bank_charges',
      label: 'Bank Charges',
      sum: true
    },

    {
      fldName: 'net_amount',
      label: 'Total Amount',
      sum: true
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

  crud: false,
};
