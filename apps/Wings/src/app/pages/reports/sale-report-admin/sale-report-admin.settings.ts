export const SaleReporAdminSettings = {
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
      fldName: 'net_amount',
      label: 'Total Amount',
      sum: true
    },
    {
      fldName: 'cost',
      label: 'Cost',
      sum: true
    },
    {
      fldName: 'profit',
      label: 'Profit',
      sum: true
    },
    {
      fldName: 'percentage',
      label: '%Age',

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
