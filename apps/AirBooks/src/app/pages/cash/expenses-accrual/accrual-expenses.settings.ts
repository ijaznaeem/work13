import { AddFormButton } from '../../components/crud-form/crud-form-helper';

export const ExpensestSetting = {
  Columns: [
    {
      fldName: 'date',
      label: 'Date',
    },
    {
      fldName: 'expense_head',
      label: 'Expense Head',
    },

    {
      fldName: 'description',
      label: 'Description',
    },
    {
      fldName: 'amount',
      label: 'Amount',
    },
  ],
  Actions: [],
  crud: false,
};

export const Expense_Form = {
  title: 'Add Accrual Expense',
  tableName: 'expenses_accrual',
  pk: 'accrual_id',
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
      fldName: 'expeanse_headid',
      control: 'select',
      type: 'multi',
      label: 'Expense Account',
      listTable: 'expheadslist',
      listData: [],
      Cols: [
        { title: 'Head Name', fldName: 'head_name', size: 6 },
        { title: 'Parent', fldName: 'parent_head', size: 6 },
      ],
      valueFld: 'head_id',
      displayFld: 'head_name',
      size: 3,
      required: true,
    },

    {
      fldName: 'description',
      control: 'input',
      type: 'text',
      label: 'Description',
      required: true,
      size: 3,
    },

    {
      fldName: 'net_amount',
      control: 'input',
      type: 'number',
      label: 'Net Amount',
      size: 2,
      required: true,
    },
    {
      fldName: 'vat',
      control: 'input',
      type: 'number',
      label: 'VAT Amount',
      size: 2,

    },
    {
      fldName: 'total_amount',
      control: 'input',
      type: 'number',
      label: 'Total Amount',
      size: 2,
      readonly: true,
    },
    {
      fldName: 'date',
      control: 'input',
      type: 'date',
      label: 'Date',
      required: true,
      size: 2,
    },
    {
      fldName: 'date_start',
      control: 'input',
      type: 'date',
      label: 'Start Date',
      required: true,
      size: 2,
    },
    {
      fldName: 'date_end',
      control: 'input',
      type: 'date',
      label: 'End Date',
      required: true,
      size: 2,
    },

    {
      fldName: 'bill_link',
      control: 'file',
      type: 'number',
      label: 'Attach Bill',
      size: 4,
    },
    AddFormButton('Create', (form: any, data: any) => {}, 2, 'pencil'),
  ],
};
