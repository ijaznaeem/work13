import { getCurDate } from '../../../factories/utilities';

export class Details {
  public ProductName = '';
  public Picture:any = null;
  public PicturePrev:any = null;
  public Qty = 0;
  public Weight = 0.0;
  public CutRatio = 0.0;
  public Polish = 0.0;
  public Cutting = 0.0;
  public ProductID = '';
  public BigStone = 0.0;
  public SmallStone = 0.0;
  public StoreName = '';
  public StoreID = '';

}

export class Invoice {
  public CustomerID = '';
  public CustomerName = '';
  public Address = '';
  public PhoneNo = '';
  public TotalWeight = 0.0;
  public Cutting = 0.0;
  public SmallStone = 0.0;
  public BigStone = 0.0;
  public TotalPolish = 0.0;
  public NetWeight = 0.0;
  public GoldPaid = 0.0;
  public GoldBalance = 0.0;
  public Rate = 0.0;
  public Amount = 0.0;
  public AmountPaid = 0.0;
  public CreditAmount = 0.0;
  public Note = '';
  public GoldType = '';
  public Date: any = getCurDate();
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

    PicturePrev: {
      title: 'Picture',
      type: 'html',
      valuePrepareFunction: (image: string) => {
        return `<img src="${image}" width="50" height="50"/>`;
      }
    },
    Account: {
      editable: false,
      title: 'StoreName',
    },
    ProductName: {
      editable: false,
      title: 'Product',
      width: '150px',
    },

    Qty: {
      title: 'Qty',
      editable: true,
    },

    Weight: {
      editable: true,
      title: 'Weight',
    },
    CutRatio: {
      editable: true,
      title: 'CutRatio',
    },
    Cutting: {
      editable: true,
      title: 'Cutting',
    },
    Polish: {
      editable: true,
      title: 'Polish',
    },

    BigStone: {
      editable: true,
      title: 'Big Stone',
    },
    SmallStone: {
      editable: true,
      title: 'Small Stone',
    },

    NetWeight: {
      editable: false,
      title: 'Net Weight',
    },
  },
  pager: {
    display: true,
    perPage: 50,
  },
};
