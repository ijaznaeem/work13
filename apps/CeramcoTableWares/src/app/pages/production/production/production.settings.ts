import { GetDateJSON } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';

export class ProductionModel {
  public ProductionID = 0;
  public Date: any = GetDateJSON();
  public Description = '';
  public IsPosted = 0;
  public BusinessID = '';
  public UserID = '';
  public details: any = [];
}
export class ProductionDetails {
  public Date: any = GetDateJSON();
  public DetailID = '';
  public ProductionID = '';
  public ProductID = '';
  public ProductName = '';
  public Qty: any = '';
  public RawRatio = 0;
  public RawConsumed = 0;
}
export const smTableSettings = {
  selectMode: 'single', // single|multi
  hideHeader: false,
  hideSubHeader: false,
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
    deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
    confirmDelete: true,
  },
  noDataMessage: 'No data found',
  columns: {
    ProductName: {
      editable: false,
      title: 'Product',
    },

    Qty: {
      title: 'Qt',
      editable: true,
      width: '250px',
    },
  },
  pager: {
    display: true,
    perPage: 50,
  },
};
