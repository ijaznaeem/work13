import { getCurDate } from '../../../factories/utilities';

export class Details {
  public InvoiceID?: string;
  public ProductID: number | null = null;
  public Qty: number = 0;
  public Packing: number = 1;
  public SPrice: number = 0;
  public PPrice: number = 0;
  public Fare: number = 0;
  public Amount: number = 0;
  public StockID: number | null = null;
  public StoreID: number | null = null;
  public OSPrice: number | null = null;
  public OPPrice: number | null = null;
  public ProductName: String | null = '';
  public StoreName: String | null = '';
}

export class Invoice {
  public CustomerID: number | null = null;
  public Date = getCurDate();
  public OrderNo: string = '';
  public OrderDate: Date | null = null;
  public SPRNo: string = '';
  public Terms: number | null = null;
  public TransporterID: number | null = null;
  public TruckNo: string = '';
  public BuiltyNo: string = '';
  public ShippedTo: string = '';
  public Amount: number = 0;
  public FareCharges: number = 0;
  public Discount: number | null = null;
  public AmntRecvd: number | null = null;
  public DtCr: string = 'CR';
  public SessionID: number | null = null;
  public UserID: number | null = null;
  public Type: number | null = null;
  public Notes: string = '';
  public IsPosted: number = 0;
  public FinYearID: number = 0;
  public TrType: number | null = null;
  public TrNo: string = '';
  public MobNo: string = '';
  public FarmerID: number | null = null;
  public Agency: string = '';
  public DrvrName: string = '';
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

    SPrice: {
      editable: true,
      title: 'Rate',
    },
    Amount: {
      editable: false,
      title: 'Amount',
    },
    Fare: {
      editable: true,
      title: 'Fare',
    },

    NetAmount: {
      editable: false,
      title: 'NetAmount',
    },
  },
  pager: {
    display: true,
    perPage: 50,
  },
};
