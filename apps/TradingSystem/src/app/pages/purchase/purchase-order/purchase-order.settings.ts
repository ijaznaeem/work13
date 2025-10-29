import { getCurDate } from '../../../factories/utilities';

export class POrderDetails {
  public DetailID = 0;
  public OrderID = '';
  public ProductID = '';
  public Qty = 0;
  public Recvd = 0;
  public Packing = 0;
  public SPrice = 0;
  public PPrice = 0;
  public purchasefrom = '';
  public DMA = 0;
  public DMAStatus = 0;
  public WHT = 0;
  public WHTStatus = '';
  public ProductName = '';
}

export class POrder {
  public OrderID = '';
  public CustomerID = 0;
  public SPRNo = '';
  public Terms = 0;
  public OrderDate: any = getCurDate(); // GetDateJSON(new Date(getCurDate()));
  public Notes = '';
  public Amount = 0;
  public FinYearID = 0;
  public SessionID = 0;
  public Status = '';
  public CompanyOrderNo = '';
  public CompanyNTN = '';
  public WHT = 0;
  public CPRNo = '';
  public WHTStatus = '';
  public IsPosted = 0;
  public UserID = 0;
  public details: POrderDetails[] = [];
}

export const PurchaseSettings = {
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
    purchasefrom: {
      editable: false,
      title: 'Purchase Store',
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
    Packing: {
      title: 'Packing',
      editable: true,
    },
    PPrice: {
      editable: true,
      title: 'Rate',
    },
    DMA: {
      editable: true,
      title: 'DMA',
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
