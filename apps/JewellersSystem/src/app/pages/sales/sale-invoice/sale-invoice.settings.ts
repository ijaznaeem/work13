import { getCurDate } from "../../../factories/utilities";

export class Details {
  public DetailID?: number;
  public BillNo: number | null = 0;
  public StockID: number | null = 0;
  public SubItem: number | null = 0;
  public Description: string | null = '';
  public Picture: string | null = '';
  public Qty: number = 0;
  public Weight: number = 0;
  public Polish: number = 0;
  public Labour: number = 0;
  public CutRatio: number = 0;
  public Cutting: number = 0;
  public StoreID: number | null = 0;

}

export class Invoice {
  public BillID?: number;
  public CustomerID: number | null = 0;
  public BillNo: number | null = 0;
  public OrderNo: number | null = 0;
  public Date: string = getCurDate();
  public CustomerName: string = '';
  public Address: string = '';
  public PhoneNo: string = '';
  public TotalWeight: number = 0;

  public AdvanceGold: number = 0;
  public BalanceWeight: number = 0;
  public Rate: number = 0;
  public Amount: number = 0;
  public TotalPolish: number = 0;
  public TotalCutting: number = 0;
  public TotalLabour: number = 0;
  public TotalAmount: number = 0;
  public AdvanceAmount: number = 0;
  public BillGold: number = 0;
  public BillGoldCutting: number = 0;
  public NetBillGold: number = 0;
  public BillGoldRate: number = 0;
  public BillGoldAmount: number = 0;
  public BalanceAmount: number = 0;
  public GoldAmountPaid: number = 0;
  public RecievedAmount: number = 0;
  public Discount: number = 0;
  public AdvanceReturned: number = 0;
  public CreditAmount: number = 0;
  public Note: string = '';
  public Type: number = 0;
  public BillTime: Date | null = null;
  public DtCr: string = 'CR';
  public GoldType: number = 0;
  public PrevBalance: number = 0;
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
     Picture: {
      title: 'Picture',
      type: 'html',
      valuePrepareFunction: (image: string) => {
        return `<img src="${image}" width="50" height="50"/>`;
      }
    },
    Description: {
      editable: false,
      title: 'Description',
      width: '200px',
    },

    Qty: {
      title: 'Qty',
      editable: true,
    },
      Weight: {
        title: 'Weight',
        editable: true,
      },
      Labour: {
        title: 'Labour',
        editable: true,
      },
      Polish: {
        title: 'Polish',
        editable: true,
      },
      CutRatio: {
        title: 'Cutting Ratio',
        editable: true,
      },
      Cutting: {
        title: 'Cutting',
        editable: false,
      },
      NetWeight: {
        title: 'Net Weight',
        editable: false,
      },
  },
  pager: {
    display: true,
    perPage: 50,
  },
};
