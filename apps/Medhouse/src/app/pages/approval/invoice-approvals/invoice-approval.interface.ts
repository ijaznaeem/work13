// Invoice Approval interfaces based on database schema

export interface InvoiceApproval {
  // From qryInvoiceApprovals view
  Date: Date;
  CustomerName: string;
  Amount: number;
  AmntRecvd: number;
  Discount: number;
  NetAmount: number;
  Balance: number;
  CustomerID: number;
  InvoiceApprovalID: number;
  UserName: string;
  SessionID: number;
  UserID: number;
  DtCr: string;
  Type: number;
  SalesmanID: number;
  BusinessID: number;
  PhoneNo1: string;
  CustBalance: number;
  SendSMS: number;
  DivisionID: number;
  Address: string;
  City: string;
  Remarks: string;
  Status: string;
  ForwardedID: number;
  ForwardedDept: string;
  ReferredBy3: number;
  BonusType: number;
}

export interface InvoiceApprovalDetail {
  // From qryInvoiceApprovalDetails view
  ProductName: string;
  Qty: number;
  Bonus: number;
  SPrice: number;
  Amount: number;
  Discount: number;
  NetAmount: number;
  InvoiceApprovalID: number;
  // Additional fields from invoiceapprovaldetails table
  DetailID?: number;
  ProductID?: number;
  PPrice?: number;
  StockID?: number;
  MachineID?: number;
  PrevReading?: number;
  CurrentReading?: number;
  DiscRatio?: number;
  BatchNo?: string;
  TimeStamp?: number;
}

export interface InvoiceApprovalFilter {
  dateFrom: Date;
  dateTo: Date;
  status: string;
}

export interface Department {
  DeptID: number;
  DeptName: string;
  Right: number;
}

// Department constants matching VB6 code
export enum UserDepartments {
  grpCEO = 1,
  grpOperations = 2,
  grpGM = 3,
  grpAccounts = 4
}

// Status options for dropdown
export const INVOICE_APPROVAL_STATUSES = [
  'In Process',
  'Completed',
  'Rejected'
];