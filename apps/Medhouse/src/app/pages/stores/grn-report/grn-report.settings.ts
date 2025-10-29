import { ColumnModel } from "@syncfusion/ej2-angular-grids";

export const GRNReport : ColumnModel[] | any= [
  {
    headerText: 'GRN No',
    field: 'DetailID',
  },
  {
    headerText: 'Date',
    field: 'GrnDate',
  },
  {
    headerText: 'Product Name',
    field: 'ProductName',
    autoFit: true,
    Type: 'link',
    onClick :(d)=>{
      console.log(d);

    }
  },
  {
    headerText: 'QC No',
    field: 'QCNo',
  },

  {
    headerText: 'Recvd',
    field: 'QtyRecvd',
  },
  {
    headerText: 'Accepted',
    field: 'Qty',
  },
  {
    headerText: 'Rejected',
    field: 'QtyRejected',
  },
  {
    headerText: 'Packs',
    field: 'NoOfPacks',
  },
  {
    headerText: 'Batch No',
    field: 'BatchNo',
  },
  {
    headerText: 'Mfg Date',
    field: 'MfgDate',
  },
  {
    headerText: 'Exp Date',
    field: 'ExpiryDate',
  },
  {
    headerText: 'Department',
    field: 'CurDepartment',
    autoFit: true,
  },
];

export const CommentsCol: ColumnModel[] = [
  {
    headerText: 'Exp Date',
    field: 'Date',
  },
  {
    headerText: 'Forward Time',
    field: 'ForwardTime',
  },
  {
    headerText: 'Remarks',
    field: 'Remarks',
  },
  {
    headerText: 'Department',
    field: 'DeptName',
  },
  {
    headerText: 'User Name',
    field: 'UserName',
  },
]
