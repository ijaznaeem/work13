export  const PinvoiceSettings = {
  selectMode: 'single', // single|multi
  hideHeader: false,
  hideSubHeader: true,
  actions: {
    columnTitle: 'Actions',
    add: false,
    edit: true,
    delete: true,
    custom: [],
    position: 'right', // left|right
  },
  add: {
    addButtonContent:
      '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
    createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
    cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
  },
  edit: {
    confirmSave: true,
    editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
    saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
    cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
  },
  delete: {
    deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
    confirmDelete: true,
  },
  noDataMessage: 'No data found',
  columns: {
    ProductName: {
      editable: false,
      title: 'Product',
      width: '250px',
    },
    Pcs: {
      title: 'Qty',
      editable: true,
    },

    Bonus: {
      title: 'Bonus',
      editable: true,
    },
    BatchNo: {
      title: 'B. No',
      editable: true,
    },
    PPrice: {
      editable: true,
      title: 'PP',
    },
    RPrice: {
      editable: true,
      title: 'RP',
    },
    SPrice: {
      editable: true,
      title: 'TP',
    },
    Amount: {
      editable: false,
      title: 'Amount',
    },
    DiscRatio: {
      editable: true,
      title: '%age',
    },
    Discount: {
      editable: false,
      title: 'Discount',
    },
    NetAmount: {
      editable: false,
      title: 'Net Amount',
    },
  },
  pager: {
    display: true,
    perPage: 50,
  },
};

export const AddProductForm = {
  title: 'Products List',
  tableName: 'products',
  pk: 'ProductID',
  columns: [
    {
      fldName: 'CompanyID',
      control: 'select',
      type: 'lookup',
      label: 'Company',
      listTable: 'companies',
      listdata: [],
      displayFld: 'CompanyName',
      valueFld: 'CompanyID',
      required: true,
      size: 4,
    },

    {
      fldName: 'PCode',
      control: 'input',
      type: 'number',
      label: 'Product Code',
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
      fldName: 'UrduName',
      control: 'input',
      type: 'text',
      label: 'Urdu Name',

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
      fldName: 'SPrice',
      control: 'input',
      type: 'number',
      label: 'Sale Price',
      required: false,
      size: 3,
    },
    {
      fldName: 'RetailRate',
      control: 'input',
      type: 'number',
      label: 'Retail Price',
      required: false,
      size: 3,
    },
    {
      fldName: 'Scheme',
      control: 'input',
      type: 'number',
      label: 'Scheme',
      required: false,
      size: 3,
    },
    {
      fldName: 'Discount',
      control: 'input',
      type: 'number',
      label: '% Age',
      required: false,
      size: 3,
    },
    {
      fldName: 'ShortStock',
      control: 'input',
      type: 'number',
      label: 'Short Level',
      required: false,
      size: 3,
    },
  ],
};
