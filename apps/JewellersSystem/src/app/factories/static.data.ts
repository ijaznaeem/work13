import { GetDate } from "../../../../../libs/future-tech-lib/src/lib/utilities/utilities";

export const InquiryStatus = [
  {
    status_id: "0",
    status: "New",
  },
  {
    status_id: "1",
    status: "Assigned",
  },
  {
    status_id: "2",
    status: "Processed",
  },
];
export const OrdersStatus = [
  {
    status_id: "0",
    status: "Un-Completed",
  },
  {
    status_id: "1",
    status: "Completed",
  },


]
export const PaymentStatus = [
  {
    status_id: "0",
    status: "Un-Paid",
  },

  {
    status_id: "1",
    status: "Partial Paid",
  }]
export const customerTypes = [
  { id: '1', type: 'Walk In Customer' },
  { id: '2', type: 'Company' }

]
export const InvoiceStatus = [
  { id: '1', status: 'Draft' },
  { id: '2', status: 'Final' }

]
export const statusData = [
  { id: '0', status: 'In-Active' },
  { id: '1', status: 'Active' }

]
export  class CashModel {
  CashID= 0;
  AcctID: string = '';
  Date: String =  GetDate();
  BillNo: number = 0;
  Details: string = '';
  Income: number = 0;
  Expense: number = 0;
  Type: number = 0;
  RefAcct: number = 0;
  GoldTypeID: number = 0;
};

export enum enTransactionType {
  Cash = 1,
  Gold = 2,
  Chandi = 3,
  Labour = 4,
  Advance = 5,
}

