import { AddInputFld, AddLookupFld } from "../../components/crud-form/crud-form-helper";

export const NewOrderForm = {
  title: 'Order',
  tableName: 'orders',
  pk: 'OrderID',
  columns: [
    {
      fldName: 'Date',
      control: 'input',
      type: 'date',
      label: 'Date',
      required: true,
      size: 4,
    },
    {
      fldName: 'CustomerName',
      control: 'input',
      type: 'text',
      label: 'Customer Name',
      required: true,
      size: 8,
    },

    AddInputFld('Address', 'Address', 8, true),
    AddInputFld('MobileNo', 'Mobile No', 4, true),
    AddLookupFld('JobID', 'Job', 'jobs', 'JobID', 'JobName', 4, [], true),
    AddInputFld('Description', 'Description', 8, true),
    AddInputFld('Qty', 'Quantity', 4, true, 'number'),
    AddInputFld('Rate', 'Rate', 4, true, 'number'),
    AddInputFld('Amount', 'Amount', 4, true, 'number'),

  ],
};
