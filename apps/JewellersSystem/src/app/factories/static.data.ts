import { GetDate } from '../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { getCurDate } from './utilities';

export const InquiryStatus = [
  {
    status_id: '0',
    status: 'New',
  },
  {
    status_id: '1',
    status: 'Assigned',
  },
  {
    status_id: '2',
    status: 'Processed',
  },
];
export const OrdersStatus = [
  {
    status_id: '0',
    status: 'Un-Completed',
  },
  {
    status_id: '1',
    status: 'Completed',
  },
];

export const customerTypes = [
  { id: '1', type: 'Walk In Customer' },
  { id: '2', type: 'Company' },
];
export const InvoiceStatus = [
  { id: '1', status: 'Draft' },
  { id: '2', status: 'Final' },
];
export const statusData = [
  { id: '0', status: 'In-Active' },
  { id: '1', status: 'Active' },
];
export class CashModel {
  CashID = 0;
  AcctID: string = '';
  Date: String = GetDate();
  BillNo: number = 0;
  Details: string = '';
  Income: number = 0;
  Expense: number = 0;
  Type: number = 0;
  RefAcct: number = 0;
  GoldTypeID: number = 0;
}

export enum enTransactionType {
  CashReceipt = 1,
  CashCashpaid = 2,
  AdvancePaid = 3,
  AdvanceReceived = 4,
  Labour = 5,
  Gold = 6,
  Chandi = 7,
}
export const GoldTypes = [

  { ID: '2', GoldType: '24K' },
  { ID: '3', GoldType: '21K/22K' },
];
export const TrType = [

  { ID: 'CR', Type: 'Sale' },
  { ID: 'DT', Type: 'Purchase' },
];
export class DailyCash {
  public Date = getCurDate();
  public BillNo = 0;
  public OrderNo = 0;
  public CustomerID = '';
  public RawGold = 0;
  public CutRatio = 0;
  public GoldCutting = 0;
  // public AdvanceGold = 0;
  public Gold = 0;
  public GoldRate = 0;
  public RateInGrams = 0;
  public AdvanceAmount = 0;
  public GoldAmount = 0;
  public Cash = 0;
  public TotalCash = 0;
  public CashReceived = 0;
  public Status = 'UnCompleted';
  public Notes = '';
  public Type = ''
  public TrType = 'CR';
  public GoldTypeID = '';
  public CBal = 0;
  public K24 = 0;
  public K22 = 0;

}
