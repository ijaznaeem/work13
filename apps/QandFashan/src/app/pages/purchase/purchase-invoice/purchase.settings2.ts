export const PurchaseSettings2 = 
  {
  selectMode: 'single', // single|multi
  hideHeader: false,
  hideSubHeader: false,
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
    Packing: {
      title: 'Packing',
      editable: false,
    },

    Qty: {
      title: 'Qty',
      editable: true,
    },
    Processed: {
      title: 'Processed',
      editable: true,
    },
    Output: {
      title: 'Output',
      editable: true,
    },
    
    PPrice: {
      editable: true,
      title: 'Rate',
    },
    Amount: {
      editable: false,
      title: 'Amount',
    },
  },
  pager: {
    display: true,
    perPage: 50,
  },
};