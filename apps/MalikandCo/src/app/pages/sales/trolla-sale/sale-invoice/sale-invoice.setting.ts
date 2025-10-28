import { getCurDate, GetDateJSON } from "../../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities";

export class SaleInvoice {
  public DetailID = '';
  public CustomerID = '';
  public InvoiceID = '';
  public Date: any = GetDateJSON(new Date(getCurDate()));
  public VehicleNo = '';
  public BuiltyNo = '';
  public ProductID = '';
  public StoreID = '';
  public StockID = '';
  public Qty:any = '';
  public Packing = 1;
  public PPrice = 0;
  public Amount = 0;
  public Weight = 0;
  public SPrice = 0;
  public BusinessID = '';
  public UserID = 0;
  public OrderID = '';
  public Notes = '';
  public RefNo= '';
  public Type = 2;
  public details = [];

}
export class SaleDetails{

  ProductID = '';
  Qty = 0;
  SPrice= 0;
  Amount= 0;
  Weight= 0;
  PWeight= 0;
  ProductName= '';
  PPrice= 0;

}


export const  TableSettings = {
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
      filter: false, // Optional: Disable filtering for serial number
      sort: false, // Optional: Disable sorting for serial number
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
    Weight: {
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
export const SearchSettings = {
        Table: 'qrybooking',
        Term: '',
        TermLength: 0,
        Filter: 'IsPosted = 0',
        Fields: [
          {
            fldName: 'DetailID',
            label: 'ID',
            search: false,
          },
          {
            fldName: 'Date',
            label: 'Date',
            search: true,
          },

          {
            fldName: 'CustomerName',
            label: 'Customer Name',
            search: true,
          },
          {
            fldName: 'ProductName',
            label: 'Product',
            search: true,
          },
          {
            fldName: 'PPrice',
            label: 'Rate',
            search: false,
          },
          {
            fldName: 'Qty',
            label: 'Qty ',
            search: false,
          },
          {
            fldName: 'Amount',
            label: 'Amount',
            search: false,
          },
        ],
      };
