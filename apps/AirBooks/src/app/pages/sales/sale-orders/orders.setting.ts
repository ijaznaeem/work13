import { SmartTableDatepickerComponent } from "../custom-date-picker/smart-table-datepicker.component";

export const ODetailsSettings = {
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
    product_name: {
      editable: false,
      title: 'Product',
      width: '150px',
    },
    description: {
      editable: true,
      title: 'Details',
      width: '150px',
    },
    post_date: {
      title: 'Post Date',
      type: 'html',
      editor: {
        type: 'custom',
        component: SmartTableDatepickerComponent,
      },
    },
    price: {
      title: 'Price',
      editable: true,
    },
    qty: {
      title: 'Qty',
      editable: true,
    },

    amount: {
      editable: false,
      title: 'Amount',
    },

    vat_value: {
      title: 'VAT',
      editable: false,
    },
    markup: {
      title: 'Markup',
      editable: true,
    },
    net_amount: {
      editable: false,
      title: 'Net Amount',
    },
  },
  pager: {
    display: true,
    perPage: 50,
  },
};
