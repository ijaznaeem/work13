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
      pk: 'BusinessID',
      columns: [
          {
              fldName: 'BusinessName',
              control: 'input',
              type: 'text',
              label: 'Setup Name',
              size  : 9
          },
          {
            fldName: 'Logo',
            control: 'file',
            type: 'image',
            label: 'Logo',
            size  : 3
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
          {
              fldName: 'Warranty',
              control: 'textarea',
              label: 'Warranty',
              size  : 12
          },
          {
              fldName: 'Signature',
              control: 'file',
              type: 'image',
              label: 'Signature',
              size  : 6
          }
      ]
  },
  list: {
      tableName: 'business',
      pk: 'BusinessID',
      columns: [
        {
          fldName: 'Logo',
          type: 'image',
          label: 'Logo',
      },
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

      {
          fldName: 'Singnature',
          control: 'Image',
          label: 'Singnature'
      }
      ]
  }
};
