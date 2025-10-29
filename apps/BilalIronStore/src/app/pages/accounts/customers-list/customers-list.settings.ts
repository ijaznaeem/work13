import { AddFormButton } from "../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper";
import { Status } from "../../../factories/constants";

export const CustomersSettings =  {
    title: 'Customers',
    tableName: 'customers',
    pk: 'CustomerID',
    columns: [
      {
        fldName: 'AcctTypeID',
        control: 'select',
        type: 'list',
        label: 'Acct Type',
        listTable: 'accttypes',
        listData: [],
        displayFld: 'AcctType',
        valueFld: 'AcctTypeID',
        required: true,
        size: 4,
      },
      {
        fldName: 'CustomerName',
        control: 'input',
        type: 'text',
        label: 'Account Name',
        required: true,
        size: 8,
      },

      {
        fldName: 'Address',
        control: 'input',
        type: 'text',
        label: 'Address',
        size: 6,
      },
      {
        fldName: 'City',
        control: 'select',
        type: 'lookup',
        label: 'City',
        listTable: 'qrycities',
        listData: [],
        displayFld: 'City',
        valueFld: 'City',
        size: 4,
      },
      AddFormButton('First', (e) => {
        console.log('Add First Button Clicked', e);
      }, 1, 'plus', 'primary'),
      {
        fldName: 'PhoneNo1',
        control: 'input',
        type: 'text',
        label: 'Phone No 1',
        size: 4,
      },
      {
        fldName: 'PhoneNo2',
        control: 'input',
        type: 'text',
        label: 'Phone No 2',
        size: 4,
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
        size: 4,
      },
      {
        fldName: 'OBalance',
        control: 'input',
        type: 'number',
        label: 'Opening Balance',
        size: 4,
        required: true,
      },

      {
        fldName: 'NTNNo',
        control: 'input',
        type: 'text',
        label: 'NTN/CNIC',
        size: 4,
      },
      {
        fldName: 'STN',
        control: 'input',
        type: 'text',
        label: 'STN/NTN No',
        size: 4,
      },
      {
        fldName: 'UrduName',
        control: 'input',
        type: 'text',
        label: 'Urdu Name',
        size: 4,
      },

      {
        fldName: 'CustTypeID',
        control: 'select',
        type: 'list',
        label: 'Customer Type',
        listTable: 'custtypes',
        listData: [],
        displayFld: 'CustType',
        valueFld: 'CustTypeID',
        size: 4,
        required: true
      },
      {
        fldName: 'CustCatID',
        label: 'Customer Category',
        control: 'select',
        type: 'list',
        listTable: 'custcats',
        listData: [],
        displayFld: 'CustCategory',
        valueFld: 'CustCatID',
        size: 4,
        required: true
      },

      // AddSpace(4),
      // AddFormButton('Save',null, 1, 'save', 'success'),
      // AddFormButton('Cancel', null, 1, 'cancel', 'secondary'),
    ],
  };
