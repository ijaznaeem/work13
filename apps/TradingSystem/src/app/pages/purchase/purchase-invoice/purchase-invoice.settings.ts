import { getCurDate } from '../../../factories/utilities';

export class Details {
  public OrderID = '';
  public ProductID = '';
  public Qty = 0;
  public Packing = 0;
  public Bags = 0;
  public SPrice = 0;
  public PPrice = 0;
  public Fare = 0;
  public Labour = 0;
  public DMA = 0;
  public StockID = 0;
  public StoreID = 0;
  public OrderDetailID = '';
  public CompanyInvNo = '';
  public CompanyInvDate: any = getCurDate();
  public SaleTaxValue = 0;
  public STPurchValue = 0;
  public ProductName= '';
  public StoreName= '';
}

export class Invoice {
  public OrderID = '';
  public CustomerID = null;
  public Date: any = getCurDate(); // GetDateJSON(new Date(getCurDate()));
  public OrderDate: any = getCurDate();
  public OrderNo = '';
  public CompanyInvoiceNo = '';
  public SalesmanID = 0;
  public Terms = null;
  public StoreID = 0;
  public TransporterID = null;
  public TruckNo = '';
  public BuiltyNo = '';
  public Amount = 0;
  public FrieghtCharges = 0;
  public Discount = 0;
  public AmountPaid = 0;
  public DtCr: any ='CR';
  public SessionID = 0;
  public Type = '';
  public Labour = 0;
  public IsPosted = 0;
  public Notes = '';
  public FinYearID = 0;
  public UserID = 0;
  public SPRNo = '';
  public CompanyOrderNo = '';
  public PStoreID = null;
  public TrNo = '';
  public details: Details[] = [];
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

    Qty: {
      title: 'Qty',
      editable: true,
    },

    PPrice: {
      editable: true,
      title: 'Rate',
    },
    Fare: {
      editable: true,
      title: 'Fare',
    },
    Labour: {
      editable: true,
      title: 'Labour',
    },
    DMA: {
      editable: true,
      title: 'DMA',
    },Amount: {
      editable: false,
      title: 'Amount',
    },
    STPurchValue: {
      editable: true,
      title: 'ST Value',
    },

  },
  pager: {
    display: true,
    perPage: 50,
  },
};
