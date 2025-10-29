export const ExpensestSetting = {
  Columns: [
    {
      fldName: 'date',
      label: 'Date',
    },
    {
      fldName: 'expense_head',
      label: 'Expense Account',
    },
    {
      fldName: 'paid_from',
      label: 'Paid Through',
    },
    {
      fldName: 'is_vat',
      label: 'IsVat',
    },
    {
      fldName: 'companyname',
      label: 'Company Name',
    },
    {
      fldName: 'net_amount',
      label: 'Amount',
      sum: true,
    },
    {
      fldName: 'vat',
      label: 'Vat Amount',
      sum : true
    },
    {
      fldName: 'total_amount',
      label: 'Total Amount',
      sum:true
    },
    {
      fldName: 'ref_no',
      label: 'Ref/Book No',
    },
    {
      fldName: 'trn_no',
      label: 'Vat No',
    },
    {
      fldName: 'bill_link',
      label: 'Bill',
      type: 'image',
      button: {
        callback: (d) => {},
        style: 'link',
      },
    },
  ],
  Actions: [
    {
      action: 'edit',
      title: 'Edit',
      icon: 'pencil',
      class: 'primary',
    },
    {
      action: 'delete',
      title: 'Delete',
      icon: 'trash',
      class: 'danger',
    },
  ],
  crud: false,
};

export const Expense_Form = {
  title: 'Add Expense',
  tableName: 'expenses',
  pk: 'expense_id',
  columns: [
    {
      fldName: 'isvat',
      control: 'select',
      type: 'list',
      label: 'Is VAT Invoice',
      listData: [
        {
          id: '0',
          desc: 'No',
        },
        { id: '1', desc: 'yes' },
      ],
      valueFld: 'id',
      displayFld: 'desc',
      size: 2,
      required: true,
    },
    {
      fldName: 'trn_no',
      control: 'input',
      type: 'text',
      label: 'Vat No',
      size: 2,
      readonly: true,
    },
    {
      fldName: 'companyname',
      control: 'input',
      type: 'text',
      label: 'Company Name (as per vat certificate)',
      size: 8,
      readonly: true,
    },
    {
      fldName: 'date',
      control: 'input',
      type: 'date',
      label: 'Date',
      required: true,
      size: 6,
    },
    {
      fldName: 'ref_no',
      control: 'input',
      type: 'text',
      label: 'Bank Ref No',
      size: 6,
    },

    {
      fldName: 'expeanse_headid',
      control: 'select',
      type: 'multi',
      label: 'Expense Account',
      listTable: 'expheadslist',
      listData: [],
      Cols: [
        { title: 'Head Name', fldName: 'account_name', size: 6 },
        { title: 'Parent', fldName: 'parent_head', size: 6 },

      ],
      valueFld: 'account_id',
      displayFld: 'account_name',
      size: 6,
      required: true,
    },
    {
      fldName: 'paid_account',
      control: 'select',
      type: 'lookup',
      label: 'Paid Through',
      listTable: 'qrycashaccts',
      listData: [],
      valueFld: 'account_id',
      displayFld: 'account_name',
      size: 6,
      required: true,
    },

    {
      fldName: 'description',
      control: 'input',
      type: 'text',
      label: 'Description',
      required: true,
      size: 12,
    },

    {
      fldName: 'net_amount',
      control: 'input',
      type: 'number',
      label: 'Net Amount',
      size: 4,
      required: true,
    },
    {
      fldName: 'vat',
      control: 'input',
      type: 'number',
      label: 'VAT Amount',
      size: 4,
    },
    {
      fldName: 'total_amount',
      control: 'input',
      type: 'number',
      label: 'Total Amount',
      size: 4,
      readonly: true,
      required: true,
    },
    {
      fldName: 'bill_link',
      control: 'file',
      type: 'number',
      label: 'Attach Bill',
      size: 4,
    },
  ],
};
