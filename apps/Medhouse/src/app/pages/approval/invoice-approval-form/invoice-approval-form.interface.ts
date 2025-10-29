// Invoice Approval Form interfaces based on database schema

export interface Customer {
  CustomerID: number;
  CustomerName: string;
  Address: string;
  Balance: number;
  Limit: number;
  DiscountRatio: number;
  BonusType: number;
  PhoneNo1: string;
  City: string;
  DivisionID: number;
  BusinessID: number;
  Status: number;
  AcctType: string;
}

export interface Business {
  BusinessID: number;
  BusinessName: string;
}

export interface Division {
  DivisionID: number;
  DivisionName: string;
  Status: number;
}

export interface Product {
  ProductID: number;
  ProductName: string;
  Stock: number;
  SPrice: number;
  PPrice: number;
  Type: number;
  BatchNo?: string;
}

export interface BonusSlab {
  SlabID: number;
  ProductID: number;
  Qty: number;
  Bonus: number;
}

export interface CustomerRate {
  CustomerID: number;
  ProductID: number;
  CustomRate?: number;
  DiscRatio?: number;
}

export interface InvoiceApprovalFormData {
  InvoiceApprovalID?: number;
  CustomerID: number;
  CustomerName: string;
  Date: Date;
  Amount: number;
  Discount: number;
  NetAmount: number;
  AmntRecvd: number;
  SessionID: number;
  SalesmanID: number;
  DivisionID: number;
  BusinessID: number;
  DtCr: string;
  Type: number;
  Status: string;
  ForwardedTo: number;
  Remarks?: string;
}

export interface InvoiceApprovalDetailFormData {
  DetailID?: number;
  InvoiceApprovalID: number;
  ProductID: number;
  Qty: number;
  SPrice: number;
  PPrice: number;
  StockID: number;
  MachineID?: number;
  PrevReading?: number;
  CurrentReading?: number;
  DiscRatio: number;
  BatchNo?: string;
  Bonus: number;
  TimeStamp: number;
}

export interface InvoiceApprovalDetailView {
  SNO: number;
  ProductName: string;
  Qty: number;
  Bonus: number;
  SPrice: number;
  Amount: number;
  Discount: number;
  NetAmount: number;
  BatchNo: string;
  ProductID: number;
  DetailID: number;
  TimeStamp: number;
}

export interface InvoiceApprovalFormState {
  mode: 'new' | 'edit';
  isInvoiceCreated: boolean;
  invoiceApprovalId: number;
  timestamp: number;
  selectedCustomer: Customer | null;
  selectedBusiness: Business | null;
  selectedDivision: Division | null;
  discountRatio: number;
  bonusEnabled: boolean;
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
}