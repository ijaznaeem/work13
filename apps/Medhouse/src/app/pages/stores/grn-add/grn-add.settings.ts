import { AcctTypes } from '../../../config/constants';
import { getCurDate } from '../../../factories/utilities';
import {
  AddFormButton,
  AddInputFld,
  AddLookupFld,
} from '../../components/crud-form/crud-form-helper';

export class GRNPurchase {
  DetailID: any = '';
  InvoiceID?: any = '';
  ProductID?: any = '';
  Qty?: any = '';
  Packing?: any = '';
  SPrice?: any = '';
  PPrice?: any = '';
  StockID?: any = '';
  CommRatio?: any = '';
  BatchNo?: string = '';
  QtyRecvd?: any = '';
  QtyRejected?: any = '';
  ExpiryDate?: string = '';
  MfgDate?: string = '';
  NoOfPacks?: any = '';
  QCNo?: string = '';
  PrevPPrice?: any = '';
  GM?: string = '';
  Operations?: string = '';
  Procurement?: string = '';
  Tentative?: any = '';
  Status?: any = '';
  ForwardedTo?: any = '';
  GrnDate?: any = getCurDate();
  StoreRemarks?: string = '';
  ProcurementRemarks?: string = '';
  QCRemarks?: string = '';
  SupplierID: any = '';
  TransportID?: any = '';
  BuiltyNo?: string = '';
  BuiltyAmount?: any = '';
}

export const formCommercial = [
  AddInputFld('GrnDate', 'GRN Date', 3, true, 'date'),
  AddInputFld('QtyRecvd', 'Quantity Received', 3, true, 'number'),

  AddLookupFld('Tentative', 'Is Tentative', '', 'ID', 'Value', 3, [
    { ID: '1', Value: 'Yes' },
    { ID: '0', Value: 'No' }

  ], true, { type: 'list',}),
  AddInputFld('TentativeQTY', '', 2, true, 'number', { disabled: true }),
  AddInputFld('NoOfPacks', 'No Of Packs', 3, true, 'number'),
  AddInputFld('BatchNo', 'Batch No', 3, true, 'text'),
  AddInputFld('MfgDate', 'Mfg Date', 3, true, 'date'),
  AddInputFld('ExpiryDate', 'Exp Date', 3, true, 'date'),
  AddInputFld('StoreRemarks', 'Store Remarks', 12, true, 'text'),
];
export const formProcurement = [

  AddLookupFld('SupplierID', 'Supplier', 'Customers?filter=AcctTypeID=' + AcctTypes.Suppliers, 'CustomerID', 'CustomerName', 3,null, true),
  AddInputFld('PPrice', 'Purchase Price', 3, true, 'number'),
  AddLookupFld('TransportID', 'Transporter', 'Customers?filter=AcctTypeID=' + AcctTypes.Transporter, 'CustomerID', 'CustomerName', 3,null, true, { type: 'lookup',}),
  AddInputFld('BuiltyNo', 'Builty No', 3, true, 'text'),
  AddInputFld('BuiltyAmount', 'Builty Amount', 3, false, 'number'),


  AddInputFld('PONo', 'Purchase Order No:', 3, false, 'number'),
  AddFormButton('Find PO', (row)=>{

  }, 2,'search', 'primary')

];
export const formQC = [

  AddInputFld('QtyRecvd', 'Quantity Received', 3, true, 'number',{readonly: true}),
  AddInputFld('Qty', 'Quantity Accepted', 3, true, 'number'),
  AddInputFld('QtyRejected', 'Quantity Rejected', 3, true, 'number', {readonly: true}),
  AddInputFld('QCRemarks', 'QC Remarks', 12, true, 'text'),

];
export const formProc1 = [

  AddInputFld('QtyRecvd', 'Quantity Received', 3, true, 'number'),
  AddInputFld('ProcurementRemarks', 'Procurement Remarks', 12, true, 'text'),

];

export interface GrnLog {
            // Primary key, auto-incremented
  GrnID?: number | null;     // Nullable int
  Date?: string | null;      // Nullable date in string format
  Time?: string | null;      // Nullable nvarchar(50)
  DepartmentID?: number | null; // Nullable int
  UserID?: number | null;    // Nullable int
  Remarks?: string | null;   // Nullable nvarchar(max)
}
