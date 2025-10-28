export const CategoryForm = {
    form: {
        title: 'Categories',
        tableName: 'categories',
        pk: 'CategoryID',
        columns: [
            {
                fldName: 'CategoryName',
                control: 'input',
                type: 'text',
                label: 'Category Name'
            }
        ]
    },
    list: {
        tableName: 'categories',
        pk: 'CategoryID',
        columns: [
            {
                fldName: 'CategoryName',
                label: 'Category Name'
            }
        ]
    }
};

export const SetupsForm = {
  form: {
      title: 'Setups',
      tableName: 'business',
      pk: 'business_id',
      columns: [
          {
              fldName: 'BusinessName',
              control: 'input',
              type: 'text',
              label: 'Setup Name',
              size  : 9
          },
          
          {
              fldName: 'Address',
              control: 'input',
              type: 'text',
              label: 'Address',
              size  : 12
          },
          {
              fldName: 'Phone',
              control: 'input',
              type: 'text',
              label: 'Phone',
              size  : 6
          },
          {
              fldName: 'City',
              control: 'input',
              type: 'text',
              label: 'City',
              size  : 6
          },
          
      ]
  },
  list: {
      tableName: 'business',
      pk: 'business_id',
      columns: [
        
        {
          fldName: 'BusinessName',
          control: 'input',
          type: 'text',
          label: 'Setup Name'
      },
      {
          fldName: 'Address',
          control: 'input',
          type: 'text',
          label: 'Address'
      },
      {
          fldName: 'Phone',
          control: 'input',
          type: 'text',
          label: 'Phone'
      },
      {
          fldName: 'City',
          control: 'input',
          type: 'text',
          label: 'City'
      },

      
      ]
  }
};
