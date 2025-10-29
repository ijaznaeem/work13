import {
  AddFormButton,
  AddInputFld,
  AddListFld,
  AddSpace,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GoldTypes } from '../../../factories/static.data';

export class GoldConvertModel {
  Date: String = GetDate();
  CustomerID: String = '';
  Gold: number = 0;
  CutRatio: number = 0;
  Cutting: number = 0;
  NetGold: number = 0;
  Rate: number = 0;
  Amount: number = 0;
  Type: string = '';
  GoldTypeID: string = '';
}

export const GolConvertForm = {
  title: 'Gold Convert',
  tableName: 'Cash',
  pk: 'CashID',
  columns: [
    {
      fldName: 'Date',
      control: 'input',
      type: 'date',
      label: ' Date',
      required: true,
      size: 2,
    },
    AddListFld(
      'Type',
      'Transaction Type',
      '',
      'id',
      'type',
      2,
      [
        { id: 1, type: 'Gold to Cash' },
        { id: 2, type: 'Cash to Gold' },
      ],
      true
    ),
    {
      fldName: 'CustomerID',
      control: 'select',
      type: 'lookup',
      label: 'Select Account',
      listTable: 'Customers',
      listData: [],
      displayFld: 'CustomerName',
      valueFld: 'CustomerID',
      required: true,
      size: 5,
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

    AddInputFld('Gold', 'Gold', 2, true, 'number'),
    AddListFld(
      'GoldTypeID',
      'Gold Type',
      '',
      'ID',
      'GoldType',
      2,
      GoldTypes,
      true
    ),
    AddInputFld('Cutting', 'Cutting', 1, true, 'number'),
    AddInputFld('NetGold', 'Net Gold', 2, true, 'number', { readonly: true }),
    AddInputFld('Rate', 'Rate', 2, true, 'number'),
    AddInputFld('Amount', 'Amount', 2, true, 'number', { readonly: true }),

    AddSpace(1),
    AddFormButton('First', null, 1, 'fast-backward', 'primary'),
    AddFormButton('Prev', null, 1, 'backward', 'primary'),
    AddFormButton('Next', null, 1, 'fast-forward', 'primary'),
    AddFormButton('Last', null, 1, 'step-forward', 'primary'),
    AddSpace(5),
    AddFormButton('New', null, 1, 'file', 'primary'),
    AddFormButton('Save', null, 1, 'save', 'success'),
    AddFormButton('Cancel', null, 1, 'refresh', 'warning'),
  ],
};
