export const CompanyCats = {
  form: {
    title: 'Company Categories',
    tableName: 'companycatgories',
    pk: 'ID',
    columns: [
      {
        fldName: 'Category',
        control: 'input',
        type: 'text',
        label: 'Category',
        readonly: true,
      },
      {
        fldName: 'Value',
        control: 'input',
        type: 'number',
        label: '%Age',
      },
      {
        fldName: 'Target',
        control: 'input',
        type: 'number',
        label: 'Target',
      },
    ],
  },
  list: {
    tableName: 'companycatgories',
    pk: 'ID',
    columns: [
      {
        data: 'ID',
        label: 'ID',
      },
      {
        data: 'Category',
        label: 'Category',
      },
      {
        data: 'Value',
        label: '%Age/Target/Qty',
      },
    ],
  },
};
