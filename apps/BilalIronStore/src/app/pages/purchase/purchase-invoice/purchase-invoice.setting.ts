export const InvoiceSettings = {
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
      deleteButtonContent: '<i class="fa fa-trash text-danger"></i>',
      confirmDelete: true,
    },
    noDataMessage: 'No data found',
    columns: {
      SNo: {
        title: 'S. No',
        type: 'text',
        valuePrepareFunction: (cell, row, index) => index.row.index + 1, // Adding 1 to start from 1
        filter: false, // Optional: Disable filtering for serial number
        sort: false, // Optional: Disable sorting for serial number
        editable: false,
      },

      ProductName: {
        editable: false,
        title: 'Product',
        width: '250px',
      },

      Qty: {
        title: 'Qty',
        editable: true,
      },

      SPrice: {
        title: 'Price',
        editable: true,
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
