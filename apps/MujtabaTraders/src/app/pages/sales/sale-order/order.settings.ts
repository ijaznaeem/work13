import {
  AddInputFld,
  AddLookupFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { GetDateJSON, getCurDate } from '../../../factories/utilities';

export class OrderModel {
  public InvoiceID = 0;
  public CustomerID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public Time = '';
  public Discount = 0;
  public Amount = 0;
  public DeliveryCharges = 0;
  public Labour = 0;
  public PackingCharges = 0;
  public AmntRecvd = 0;
  public ClosingID = 0;
  public DtCr = 'CR';
  public Type = '1';
  public Notes = '';
  public IsPosted = 0;
  public UserID = 0;
  public PrevBalance = 0;
  public details = [];
  public NetAmount = 0;
  public BusinessID = '';
  public CustName = '';
}
export class OrderDetails {
  public DetailID = '';
  public PCode = '';
  public ProductID = '';
  public StoreID = '';
  public StockID = '';
  public Qty: any = '';
  public KGs: any = '0';
  public Pending = 0;
  public Packing = 1;
  public PPrice = 0;
  public SPrice = 0;
  public Labour = 0;
  public Weight = 0;
  public UnitValue = 0;
  public ProductName = '';
  public StoreName = '';
  public BusinessID = '';
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
    SNo: {
      title: 'S. No',
      type: 'text',
      valuePrepareFunction: (cell, row, index) => index.row.index + 1, // Adding 1 to start from 1
      filter: false,
      sort: false,
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
    TWeight: {
      title: 'Weight',
      editable: false,
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


export const SearchForm = {
  title: 'Search Invoices ',
  tableName: 'search',
  pk: 'id',
  columns: [
    AddInputFld('FromDate', 'From Date', 3, true, 'date'),
    AddInputFld('ToDate', 'To Date', 3, true, 'date'),
    AddLookupFld(
      'CustomerID',
      'Select Customer',
      'customers?fld=CustomerID,CustomerName&orderbyCustomerName',
      'CustomerID',
      'CustomerName',
      4,
      null,
      false
    ),
  ],
};

export const OrderSettings = {
  Checkbox: false,
  crud: true,
  Columns: [
    {
      label: 'Bill No',
      fldName: 'InvoiceID',
    },
    {
      label: 'Date',
      fldName: 'Date',
    },
    {
      label: 'Custome rName',
      fldName: 'CustomerName',
    },
    {
      label: 'Adress',
      fldName: 'Adress',
    },
    {
      label: 'Amount',
      fldName: 'Amount',
    },
  ],
  Actions: [
    {
      action: 'view',
      title: 'View',
      icon: 'check',
      class: 'primary',
    },
  ],
};
