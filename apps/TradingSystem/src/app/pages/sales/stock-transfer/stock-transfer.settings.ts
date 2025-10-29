import { getCurDate, GetDateJSON } from "../../../factories/utilities";

export class InvoiceDetails {
  public TransferID: string | null = null;
  public StockID: number | null = null;
  public Qty: number | null = null;
  public Packing: number | null = null;
  public KGs: number | null = null;
  public Frieght: number = 0;
  public Labour: number = 0;
  public Description: string | null = null;
  public VehicleNo: string | null = null;
  public SPR: string | null = null;
  public GatePass: string | null = null;
  public TransporterID: number | null = null;
  public BuiltyNo: string | null = null;
  public DocDate: Date | null = null;
  constructor() {
    this.DocDate = getCurDate();
  }

}

export class Invoice {
  public Date=  GetDateJSON(new Date(getCurDate()));
  public FromStore=  '';
  public ToStore=  '';
  public IsPosted=  '';
  public UserID =  '';
  public details = [];
  public FinYearID = '';
  public Notes = '';

}
export const TransferSettings = {
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
        editable: false,
      },
      KGs: {
        title: 'Kgs',
        editable: true,
      },
      Agency: {
        title: 'Agency',
        editable: true,
      },
      SPR: {
        title: 'SPR',
        editable: true,
      },
      Frieght: {
        title: 'Frieght',
        editable: true,
      },
      Labour: {
        title: 'Labour',
        editable: true,
      },
      DocDate: {
        title: 'Date',
        editable: true,
      },
      Adda:{
        title: 'Adda',
        editable: true,
      },
      VehicleNo: {
        title: 'Vehicle No',
        editable: true,
      },
      BuiltyNo: {
        title: 'Bilty No',
        editable: true,
      },
    },
    pager: {
      display: true,
      perPage: 50,
    },
  };
