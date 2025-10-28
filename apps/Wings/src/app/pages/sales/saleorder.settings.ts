import { enActionType } from "../../factories/static.data";

export const OrdersListSettings = {
  tableName: 'qrysaleorders',
  pk: 'order_id',
  sort: ['0', 'desc'],
  columns: [
    {
      data: 'order_id',
      label: 'ID',
    },
    {
      data: 'customer_name',
      label: 'Customer Name',
    },
    {
      data: 'cell_no',
      label: 'Cell No',
    },
    {
      data: 'whatsapp_no',
      label: 'WhatsApp No',
      button: {
        callback: (d) => {
          window.open('https://wa.me/' + d.whatsapp_no);
        },
        style: 'link',
      },
    },

    {
      data: 'amount',
      label: 'Amount',
    },
    {
      data: 'markup',
      label: 'Markup',
    },
    {
      data: 'vat',
      label: 'VAT',
    },
    {
      data: 'bank_charges',
      label: 'Bank Charges',
    },

    {
      data: 'net_amount',
      label: 'Net Amount',
    },

    {
      data: 'agent_name',
      label: 'Agent',
    },{
      data: 'status',
      label: 'Status',
    },
    {
      data: 'status_id',
      label: 'Status',
      visible: false,
    },
  ],
  actions: [
    {
      action: 'edit',
      title: 'Edit',
      icon: 'pencil',
      class: 'primary',
      type: enActionType.edit
    },
    {
      action: 'print',
      title: 'Print',
      icon: 'print',
      class: 'primary',
      type: enActionType.any
    },
    {
      action: 'documents',
      title: 'Attach Documents',
      icon: 'paperclip',
      class: 'primary',
      type: enActionType.any
    },
    {
      action: 'invoice',
      title: 'Create Invoice',
      icon: 'plus',
      class: 'warning',
      type: enActionType.create,
      path : 'sale-list'
    },
    {
      action: 'delete',
      title: 'Void',
      icon: 'trash',
      class: 'danger',
      type: enActionType.delete
    },
  ],
  crud: false,
};

export const ExtraAction = [

];
