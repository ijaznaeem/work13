export const SaleReporByAgentsSettings = {
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
      label: 'Invoice Amount',
      sum: true
    },
    {
      fldName: 'return_amount',
      label: 'Return',
      sum: true
    },
    {
      fldName: 'net_sale',
      label: 'Net Sale',
      sum: true
    },
    {
      fldName: 'balance',
      label: 'Amount Due',
      sum: true
    },
    {
      fldName: 'staff_cost',
      label: 'Cost',
      sum: true
    },
    {
      fldName: 'profit',
      label: 'Profit',
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
