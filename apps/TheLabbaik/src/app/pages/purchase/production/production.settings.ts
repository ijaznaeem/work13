import { GetDateJSON, getCurDate } from '../../../factories/utilities';

export class ProductionDetails {
  public ProductName = '';
  public ProductionID = 0;
  public DetailID = '';
  public ProductID = '';
  public Qty = 0;
  public PackingWght = 0;
  public Cost = 0;

  public BusinessID = '';
}

export class Production {
  public ProductionID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public ProductName = '';
  public StoreName? = '';
  public IsPosted = 0;
  public Cost = 0;
  public RawCost = 0;
  public OtherExp = 0;
  public BusinessID = '';
  public ProductionType = '';
  public details: any = [];
  public grn: any = [];
  public exp: any = [];
}

export class GRNDetails {
  public ItemName = '';
  public ProductionID = 0;
  public DetailID = '';
  public ItemID = '';
  public StockID = '';
  public Qty = 0;
  public PPrice = 0;
  public BusinessID = '';
}
export class Expenses {
  public HeadName = '';
  public HeadID = 0;
  public ExpenseID = '';
  public Description = '';
  public Amount = 0;
  public ProductionID = 0;
  public BusinessID = '';
}
export const PrdctionSetting = {
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
    PackingWght: {
      title: 'Packing Weight',
      editable: true,
    },
    Qty: {
      title: 'Qty',
      editable: true,
    },

    ItemCost: {
      title: 'Item Cost',
      editable: false,
    },
    Cost: {
      title: 'Total Cost',
      editable: false,
    },
  },
  pager: {
    display: true,
    perPage: 50,
  },
};
export const GrnSttng = {
  selectMode: 'single', // single|multi
  hideHeader: false,
  hideSubHeader: true,
  actions: {
    columnTitle: 'Actions',
    add: false,
    edit: false,
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
    ItemName: {
      editable: false,
      title: 'Product',
      width: '250px',
    },
    Qty: {
      title: 'Qty',
      editable: true,
    },
    PPrice: {
      title: 'Price',
      editable: true,
    },
    Amount: {
      title: 'Amount',
      editable: true,
    },
  },
  pager: {
    display: true,
    perPage: 50,
  },
};
export const ExpnsSttng = {
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
    HeadName: {
      editable: false,
      title: 'HeadName',
    },
    Description: {
      title: 'Description',
      editable: true,
    },

    Amount: {
      title: 'Amount',
      editable: true,
    },
  },
  pager: {
    display: true,
    perPage: 50,
  },
};
