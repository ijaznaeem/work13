export const  UserInfo = {
    title: 'User Info',
    tableName: 'users',
    pk: 'userid',
    columns: [


      {
        fldName: 'username',
        control: 'input',
        type: 'text',
        label: 'UserName',
        required: true,
        size: 6,
      },
      {
        fldName: 'password',
        control: 'input',
        type: 'password',
        label: 'Password',
        size: 6,
      },


      // {
      //   fldName: 'is_master',
      //   control: 'select',
      //   type: 'list',
      //   label: 'Is Master',
      //   listTable: '',
      //   listData: [
      //     { id: '1', val: 'Yes' },
      //     { id: 0, val: 'No' },
      //   ],
      //   displayFld: 'val',
      //   valueFld: 'id',
      //   required: true,
      //   size: 6,
      // },

    ],
  };
