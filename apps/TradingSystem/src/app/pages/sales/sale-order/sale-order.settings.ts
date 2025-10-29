import { getCurDate } from '../../../factories/utilities';

export class OrderDetails {
  public OrderID = '';
  public ProductID = '';
  public Qty = 0;
  public Delvrd = 0;
  public Packing = 0;
  public SPrice = 0;
  public PPrice = 0;
  public StockID = 0;
  public StoreID = 0;
  public description = '';
  public ProductName= '';
  public StoreName= '';
}

export class Order {
  public OrderID = '';
  public CustomerID = 0;
  public SPRNo = '';
  public Terms = 0;
  public Date: any = getCurDate(); // GetDateJSON(new Date(getCurDate()));
  public ShippedTo = '';
  public Notes = '';
  public Amount = 0;
  public SessionID = 0;
  public IsPosted = 0;
  public FinYearID = 0;
  public Term = 0;
  public StatusID = 0;
  public OrderStatusID = 0;
  public TransporterID = 0;
  public OrderTo = '';
  public OrderBy = '';
  public details: OrderDetails[] = [];
}

export const DetailsSettings = {
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
StoreName: {
      title: 'Store',
      editable: false,
    },
    ProductName: {
      editable: false,
      title: 'Product',
      width: '250px',
    },
    description: {
      title: 'Description',
      editable: true,
    },
    Qty: {
      title: 'Qty',
      editable: true,
    },
    Packing: {
      title: 'Packing',
      editable: false,
    },
    SPrice: {
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
