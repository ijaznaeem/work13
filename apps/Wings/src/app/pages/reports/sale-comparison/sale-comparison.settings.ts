export const SaleReporByAgentsSettings = {
  tableName: 'qryinvoices',
  pk: 'invoice_id',
  Columns: [

    {
      fldName: 'agent_name',
      label: 'Agent Name',
    },
    {
      fldName: 'total_invoices',
      label: 'Total Invoices',
      sum: true
    },

    {
      fldName: 'sale_amount',
      label: 'Sale Amount',
      sum: true
    },
    {
      fldName: 'credit_note_count',
      label: 'Credit Notes',
      sum: true
    },
    {
      fldName: 'credit_note_amount',
      label: 'Credit Notes Amount',
      sum: true
    },
    {
      fldName: 'net_sale',
      label: 'Net Sale',
      sum: true
    },

  ],
  Actions: [

  ],

  crud: false,
};
