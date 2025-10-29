export const CrNoteSettings: any = {
  Columns: [
    {
      fldName: 'note_id',
      label: 'ID',
    },
    {
      fldName: 'date',
      label: 'Date',
    },

    {
      fldName: 'account_name',
      label: 'Account Name',
    },

    {
      fldName: 'description',
      label: 'Description',
    },

    {
      fldName: 'credit',
      label: 'Credit',
    },
    {
      fldName: 'debit',
      label: 'Debit',
    },
    {
      fldName: 'invoice_id',
      label: 'Invoice_id',
    },
    {
      fldName: 'status',
      label: 'Status',
    },
  ],
  Actions: [
    {
      action: 'voucher',
      title: 'Create Voucher',
      icon: 'pencil',
      class: 'primary',
    },
    {
      action: 'edit',
      title: 'Edit Note',
      icon: 'edit',
      class: 'warning',
    },
    {
      action: 'delete',
      title: 'Delete Note',
      icon: 'trash',
      class: 'danger',
    },
  ],
};

export const PaymentReurn_Form = {
  title: 'Invoice Return Payment',
  tableName: 'vouchers',
  pk: 'voucher_id',
  columns: [
    {
      fldName: 'date',
      control: 'input',
      type: 'date',
      label: 'Date',
      required: true,
      size: 4,
    },
    {
      fldName: 'customer_name',
      control: 'input',
      type: 'input',
      label: 'Customer',
      size: 8,
      readonly: true,
    },
    {
      fldName: 'ref_no',
      control: 'input',
      type: 'text',
      label: 'Reference No',
      size: 4,
      readonly: true,
    },

    {
      fldName: 'payment_mode',
      control: 'select',
      type: 'lookup',
      label: 'Payment Mode',
      listTable: 'payment_modes',
      listData: [],
      valueFld: 'id',
      displayFld: 'payment_mode',
      size: 4,
    },
    {
      fldName: 'account_id',
      control: 'select',
      type: 'lookup',
      label: 'Select Account',
      listTable: 'qrycashaccts',
      listData: [],
      valueFld: 'account_id',
      displayFld: 'account_name',
      required: true,
      size: 4,
    },
    {
      fldName: 'description',
      control: 'input',
      type: 'text',
      label: 'Description',
      required: true,
      size: 8,
    },

    {
      fldName: 'debit',
      control: 'input',
      type: 'number',
      label: 'Amount',
      size: 4,
      required: true,
    },

    {
      fldName: 'supplier_id',
      control: 'input',
      type: 'hidden',
      label: 'Customer',
      visible: false,
      size: 4,
    },
    {
      fldName: 'ref_type',
      control: 'input',
      type: 'hidden',
      label: 'Ref Type',
      visible: false,
      size: 4,
    },
  ],
};
