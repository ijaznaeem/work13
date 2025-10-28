import { AddInputFld } from "../../components/crud-form/crud-form-helper";

export const NewOrderIncome = {
  title: 'Income',
  tableName: 'income',
  pk: 'IncomeID',
  columns: [
    {
      fldName: 'Date',
      control: 'input',
      type: 'date',
      label: 'Date',
      required: true,
      size: 4,
    },
    AddInputFld('Description', 'Description', 8, true),
    AddInputFld('Amount', 'Amount', 4, true, 'number'),
    AddInputFld('OrderID', '', 4, false, 'hidden'),

  ],
};
