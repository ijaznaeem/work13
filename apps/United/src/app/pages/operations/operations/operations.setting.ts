export const OperationsListSettings = {
  tableName: 'qryoperations',
  pk: 'detailid',

  columns: [
    {
      data: 'detailid',
      label: 'ID',
      visible: false

    },

    {
      data: 'invoice_id',
      label: 'Invoice No',
    },
    {
      data: 'customer_name',
      label: 'Customer Name'
    },
    {
      data: 'cell_no',
      label: 'Cell No'
    },
    {
      data: 'whatsapp_no',
      label: 'WhatsApp No'
    },
    {
      data: 'product_name',
      label: 'Product'
    },
    {
      data: 'qty',
      label: 'Qty'
    },
    {
      data: 'price',
      label: 'Sale Price'
    },
    {
      data: 'cost',
      label: 'Cost'
    },

  ],
  actions: [
    {
      action: 'process',
      title: 'Process',
      icon: 'pencil',
      class: 'primary'

    },
  ],
  crud: false
};
