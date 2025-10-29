export const ProductsRawForm = {
  title: 'Products List',
  tableName: 'Products',
  pk: 'ProductID',
  columns: [
    {
      fldName: 'Category',
      control: 'select',
      type: 'lookup',
      label: 'Category',
      listTable: 'Categories',
      listData: [],
      displayFld: 'CatName',
      valueFld: 'CatID',
      required: true,
      size: 4,
    },


    {
      fldName: 'ProductName',
      control: 'input',
      type: 'text',
      label: 'Proiduct Name',
      required: true,
      size: 12,
    },
    {
      fldName: 'Packing',
      control: 'input',
      type: 'number',
      label: 'Packing',
      required: true,
      size: 3,
    },

    {
      fldName: 'PPrice',
      control: 'input',
      type: 'number',
      label: 'Purchase Price',
      required: false,
      size: 3,
    },


    {
      fldName: 'RawTypeID',
      control: 'select',
      type: 'lookup',
      label: 'Raw Type',
      listTable: 'RawTypes',
      displayFld: 'RawType',
      valueFld: 'RawTypeID',
      required: true,
      size: 3,
    },


    {
      fldName: 'Status',
      control: 'select',
      type: 'list',
      label: 'Status',
      listTable: '',
      listData: [
        {
          ID: 1,
          Status: 'Active',
        },
        {
          ID: 2,
          Status: 'In-Active',
        },
      ],
      displayFld: 'Status',
      valueFld: 'ID',
      required: true,
      size: 3,
    },
  ],
};

export const ProductsRawList = {
  tableName: 'qryproductsraw',
  pk: 'ProductID',

  columns: [
    { data: 'ProductID', label: 'ID' },
    { data: 'ProductName', label: 'Product Name' },
    { data: 'Packing', label: 'Packing' },

    { data: 'Status', label: 'Status' },
  ],
  actions: [
    { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
    { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
  ],
};
