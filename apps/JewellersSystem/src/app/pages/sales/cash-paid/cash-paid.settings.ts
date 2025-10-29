import {
  AddFormButton,
  AddSpace
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';

export const CashTrForm = {
  tableName: 'Cash',
  pk: 'CashID',
  title: 'Cash Receipt',

  columns: [
    {
      fldName: 'Date',
      control: 'input',
      type: 'date',
      label: 'Date',
      required: true,
      size: 2,
    },
    {
      fldName: 'CustomerID',
      control: 'select',
      type: 'lookup',
      label: 'Customer Name',
      listTable: 'Customers',
      listData: [],
      displayFld: 'CustomerName',
      valueFld: 'CustomerID',
      required: true,
      size: 7,
    },
    {
      fldName: 'CBal',
      control: 'input',
      type: 'text',
      label: 'C/Bal',
      readonly: true,
      size: 1,
    },
    {
      fldName: 'K24',
      control: 'input',
      type: 'text',
      label: '24K',
      readonly: true,
      size: 1,
    },
    {
      fldName: 'K22',
      control: 'input',
      type: 'text',
      label: '22/21K',
      readonly: true,
      size: 1,
    },
    {
      fldName: 'Notes',
      control: 'textarea',
      type: 'text',
      label: 'Description',
      size: 12,
    },

    {
      fldName: 'CashReceived',
      control: 'input',
      type: 'number',
      label: 'Cash Amount',
      required: true,
      size: 3,
    },

    AddSpace(12),
    AddFormButton('First', null, 1, 'fast-backward', 'primary'),
    AddFormButton('Prev', null, 1, 'backward', 'primary'),
    AddFormButton('Next', null, 1, 'fast-forward', 'primary'),
    AddFormButton('Last', null, 1, 'step-forward', 'primary'),
    AddSpace(2),

    AddFormButton('New', null, 2, 'file', 'primary'),
    AddFormButton('Save', null, 2, 'save', 'success'),
    AddFormButton('Cancel', null, 2, 'refresh', 'warning'),
  ],
};
