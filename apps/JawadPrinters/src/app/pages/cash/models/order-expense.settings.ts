import { AddInputFld, AddLookupFld } from "../../components/crud-form/crud-form-helper";

export const NewOrderExpense = {
  title: 'EXpenses',
  tableName: 'expenses',
  pk: 'ExpendID',
  columns: [
    {
      fldName: 'Date',
      control: 'input',
      type: 'date',
      label: 'Date',
      required: true,
      size: 4,
    },
    // AddLookupFld('OrderID', 'Order', 'orders?filter=Status=1&orderby=CustomerName', 'OrderID', 'CustomerName', 12, [], true),
    AddLookupFld('HeadID', 'Heade', 'exp_heads', 'HeadID', 'HeadName', 12, [], true),
    AddInputFld('Description', 'Description', 8, true),
    AddInputFld('Amount', 'Amount', 4, true, 'number'),
    AddInputFld('OrderID', '', 4, false, 'hidden'),

  ],
};
