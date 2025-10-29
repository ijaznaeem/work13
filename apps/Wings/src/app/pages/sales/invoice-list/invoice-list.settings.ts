import { ACTION_CREATE, enActionType } from "../../../factories/static.data";

export const InvoiceListSettings = {
  tableName: 'qryinvoices',
  pk: 'invoice_id',
  sort: ['0', 'desc'],
  columns: [
    {
      data: 'invoice_id',
      label: 'ID',
      valueFormatter: (d) => {
        if (d.status_id == '2' && d.isposted != '1') {
          return `<i class="fa fa-warning text-danger"
          > </i> ${d.invoice_id}`;
        } else {
          return d.invoice_id;
        }
      },
    },
    {
      data: 'customer_id',
      label: 'CustID',
      visible: false,
    },

    {
      data: 'date',
      label: 'Date',
    },
    {
      data: 'order_id',
      label: 'Order No',
    },
    {
      data: 'customer_name',
      label: 'Customer Name',
    },


    {
      data: 'net_amount',
      label: 'Total Amount',
    },
    {
      data: 'received',
      label: 'Received',
    },
    {
      data: 'balance',
      label: 'Balance',
    },
    {
      data: 'agent_name',
      label: 'Agent',
    },
    {
      data: 'isposted',
      label: 'Is Posted',
      visible: false,
    },
    {
      data: 'status',
      label: 'Status',
    },

    {
      data: 'payment_status',
      label: 'Payment Status',
    },
    {
      data: 'status_id',
      label: 'StatusID',
      visible: false,
    },
  ],
  actions: [

    ACTION_CREATE,
    {
      action: 'post',
      title: 'Post',
      icon: 'check',
      class: 'warning',
      type: enActionType.any
    },
    {
      action: 'edit',
      title: 'Edit',
      icon: 'pencil',
      class: 'primary',
      type: enActionType.edit
    },

    {
      action: 'pay',
      title: 'Add Payment',
      icon: 'money',
      class: 'success',
      type: enActionType.create
    },
    {
      action: 'delete',
      title: 'Void',
      icon: 'trash',
      class: 'danger',
      type: enActionType.delete
    },
    {
      action: 'print',
      title: 'Print',
      icon: 'print',
      class: 'success',
      type: enActionType.any
    },
    {
      action: 'print-details',
      title: 'Print Details',
      icon: 'print',
      class: 'success',
      type: enActionType.any
    },
    {
      action: 'return',
      title: 'Sale Return',
      icon: 'undo',
      class: 'warning',
      type: enActionType.create,
      path: 'salereturn'
    },
    {
      action: 'documents',
      title: 'Attach Docments',
      icon: 'file',
      class: 'primary',
      type: enActionType.any
    },
    {
      action: 'objection',
      title: 'View Objection',
      icon: 'warning',
      class: 'warning',
      type: enActionType.any
    },
  ],
  extra : [

  ],
  crud: false,
};

