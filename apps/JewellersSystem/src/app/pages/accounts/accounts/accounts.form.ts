import { Status } from "../../../factories/constants";

export const AccountsForm = {
  title: 'Customers',
  tableName: 'Customers',
  pk: 'CustomerID',
  columns: [
    {
      fldName: 'AcctTypeID',
      control: 'select',
      type: 'list',
      label: 'Acct Type',
      listTable: 'AcctTypes',
      listData: [],
      displayFld: 'AcctType',
      valueFld: 'AcctTypeID',
      required: true,
      size: 6,
    },
    {
      fldName: 'Reference',
      control: 'input',
      type: 'text',
      label: 'Reference',
      size: 6,
    },


    {
      fldName: 'CustomerName',
      control: 'input',
      type: 'text',
      label: 'Account Name',
      required: true,
      size: 12,
    },
    {
      fldName: 'Address',
      control: 'input',
      type: 'text',
      label: 'Address',
      size: 6,
    },

    {
      fldName: 'PhoneNo',
      control: 'input',
      type: 'text',
      label: 'Phone No',
      size: 6,
    },

    {
      fldName: 'Status',
      control: 'select',
      type: 'list',
      label: 'Status',
      listTable: '',
      listData: Status,
      displayFld: 'Status',
      valueFld: 'ID',
      required: true,
      size: 6,
    },
    {
      fldName: 'Notes',
      control: 'textarea',
      type: 'text',
      label: 'Notes',
      size: 12,
    },

  ],
};
