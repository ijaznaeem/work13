import {
    AddFormButton,
    AddInputFld,
    AddSpace
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';

export class GoldConvertModel {
  Date: String = GetDate();
  CustomerID: String = '';
  Gold: number = 0;
  Cutting: number = 0;
  NetGold: number = 0;
  Rate: number = 0;
  Amount: number = 0;
  Type: number = 0;
  GoldTypeID: number = 0;
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
      size: 4,
    },

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
      size: 6,
    },
    AddInputFld('Gold', 'Gold', 4, true, 'number'),
    AddInputFld('Cutting', 'Cutting', 4, true, 'number'),
    AddInputFld('NetGold', 'Net Gold', 4, true, 'number', { readonly: true }),
    AddInputFld('Rate', 'Rate', 4, true, 'number'),
    AddInputFld('Amount', 'Amount', 4, true, 'number', { readonly: true }),

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
