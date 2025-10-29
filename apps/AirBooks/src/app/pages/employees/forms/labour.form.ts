import { statusData } from "../../../factories/static.data";

export const LabourInfo = {
    title: 'Employee Labour Info',
    tableName: 'users_labour',
    pk: 'labour_id',
    columns: [
      
      
      {
        fldName: 'card_no',
        control: 'input',
        type: 'text',
        label: 'Card No',
        required: true,
        size: 6,
      },
      {
        fldName: 'personel_code',
        control: 'input',
        type: 'text',
        label: 'Personel Code ',
        required: true,
        size: 6,
      },
      {
        fldName: 'labour_expiry',
        control: 'input',
        type: 'date',
        label: 'Labour Expiry',
        size: 6,
      },
      {
        fldName: 'wps',
        control: 'select',
        type: 'list',
        label: 'WPS ???',
        listData: [
          {'id': 'Yes'},
          {'id': 'No'},
        ],
        displayFld: 'id',
        valueFld:'id',
        size: 6,
      },
      
      {
        fldName: 'basic_salary',
        control: 'input',
        type: 'number',
        label: 'Basic Salary',
        required: true,
        size: 6,
      },
      {
        fldName: 'bank_name',
        control: 'input',
        type: 'text',
        label: 'Bank Name',
        required: true,
        size: 6,
      },
      {
        fldName: 'account_no',
        control: 'input',
        type: 'text',
        label: 'Account No',
        required: true,
        size: 6,
      },
      {
        fldName: 'routing_code',
        control: 'input',
        type: 'text',
        label: 'Routing Code-Mail',
        required: false,
        size: 6,
      },
      

      {
        fldName: 'user_id',
        control: 'input',
        type: 'hidden',
        required: true,
        size: 6,
        visible: false
      },
    ],
  };