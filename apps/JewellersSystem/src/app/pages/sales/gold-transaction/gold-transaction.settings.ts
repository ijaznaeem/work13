import { AddFormButton, AddInputFld, AddListFld, AddSpace } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';

export const GolTrForm = {
  title: 'Gold Transaction',
  tableName: 'Cash',
  pk: 'CashID',
  columns: [
    {
      fldName: 'Date',
      control: 'input',
      type: 'date',
      label: ' Date',
      required: true,
      size: 4,
    },

    {
      fldName: 'AcctID',
      control: 'select',
      type: 'lookup',
      label: 'Select Account',
      listTable: 'Customers',
      listData: [],
      displayFld: 'CustomerName',
      valueFld: 'CustomerID',
      required: true,
      size: 6,
    },
    AddInputFld('Details', 'Details', 12,true  ),
    {
      fldName: 'Expense',
      control: 'input',
      type: 'number',
      label: 'Gold Given',
      size: 4,
    },
    {
      fldName: 'Income',
      control: 'input',
      type: 'number',
      label: 'Gold Received',
      size: 4,
    },
    AddListFld('GoldTypeID', 'Gold Type', 'GoldTypes', 'GoldTypeID', 'GoldType', 4, [], true, ),

    AddFormButton('First', null, 1, 'fast-backward', 'primary'),
    AddFormButton('Prev', null, 1, 'backward', 'primary'),
    AddFormButton('Next', null, 1, 'fast-forward', 'primary'),
    AddFormButton('Last', null, 1, 'step-forward', 'primary'),
    AddSpace(4),
    AddFormButton('New', null, 1, 'file', 'primary'),
    AddFormButton('Save', null, 1, 'save', 'success'),
    AddFormButton('Cancel', null, 1, 'refresh', 'warning'),

  ],
};
