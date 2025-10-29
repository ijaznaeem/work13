
import { AddInputFld, AddLookupFld } from "../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper";

export const PolishRptStngs = {
  Checkbox: false,
  Columns: [
    {
      label: 'S No',
      fldName: 'SNo',
    },
    {
      label: 'Invoice No',
      fldName: 'InvoiceID',
    },
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Account Name',
      fldName: 'CustomerName',
    },
    {
      label: 'Description',
      fldName: 'Description',
    },

    {
      label: 'Polish',
      fldName: 'TotalPolish',
      sum: true,

    },

  ],
  Actions: [

  ],
  Data: [],
};
export const PolishAddForm={
  title: 'Add Polish',
  tableName : 'polish',
  pk: 'PolishID',
  columns : [
    AddInputFld('Date', 'Date', 4,true,'Date'),
    AddLookupFld('PolishHeadID', 'Polish Head','polishheads','PolishHeadID', 'PolishHead',8,null,true),
    AddInputFld('Description', 'Description', 8,true,'text'),
    AddInputFld('Amount', 'Amount', 4,true,'number'),
  ]

}
