export const Settings = {
    crud: true,
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },

      {
        label: 'Type',
        fldName: 'Type',
      },

      {
        label: 'Account',
        fldName: 'Account',
      },
      {
        label: 'Description',
        fldName: 'Description',
      },

      {
        label: 'Payment',
        fldName: 'Payment',
        sum: true,
      },
      {
        label: 'Receipt',
        fldName: 'Receipt',
        sum: true,
      },
    ],
    Actions: [
      {
        action: 'hide',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
    ],
    Data: [],
  };
