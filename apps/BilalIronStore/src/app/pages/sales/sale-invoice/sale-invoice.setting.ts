import { getCurDate, GetDateJSON } from '../../../factories/utilities';

export class SaleModel {
  public InvoiceID = 0;
  public CustomerID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public Time = '';
  public Discount = 0;
  public Amount: number = 0;
  public DeliveryCharges = 0;
  public Labour = 0;
  public PackingCharges = 0;
  public AmntRecvd = 0;
  public Cash = 0;
  public Bank = 0;
  public BankID: string | null = '';
  public ClosingID = 0;
  public DtCr = 'CR';
  public Type = '1';
  public Notes = '';
  public IsPosted = 0;
  public UserID = 0;
  public CustCatID = 0;
  public PrevBalance = 0;
  public details = [];
  public TransporterIDs: Number[] = [];
  public NetAmount = 0;
  public BusinessID = '';
  public CustomerName = '';
  public Reference = '';
}
export class SaleDetails {
  public DetailID = '';
  public PCode = '';
  public BillNo = '';
  public ProductID = '';
  public StoreID = '1';
  public Qty: any = '';
  public KGs: any = '0';
  public Packing = 0;
  public PPrice = 0;
  public SPrice = 0;
  public ProductName = '';
  public StoreName = '';
  public BusinessID = '';
}
export function getInvoiceSettings(storeList: any) {
  return {
    selectMode: 'single',
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
        valuePrepareFunction: (cell, row, index) => index.row.index + 1,
        filter: false,
        sort: false,
        editable: false,
      },
      StoreName: {
        editable: true,
        title: 'Store',

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
}
