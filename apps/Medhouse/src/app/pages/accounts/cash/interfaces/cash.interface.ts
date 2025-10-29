export interface DailyCash {
  detailID?: number;
  customerID: number;
  customerName?: string;
  date: Date;
  description: string;
  amountPaid: number;
  amountReceived: number;
  balance: number;
  referenceNo?: number;
  sessionID?: number;
  status: number;
  salesmanID?: number;
  salesmanName?: string;
  codNo?: string;
  businessID?: number;
  businessName?: string;
  divisionID?: number;
  divisionName?: string;
}

export interface CashCustomer {
  customerID: number;
  customerName: string;
  address: string;
  city: string;
  balance: number;
  limit: number;
  phoneNo1?: string;
  sendSMS?: boolean;
  referredBy?: number;
  referredBy2?: number;
  referredBy3?: number;
  comRatio?: number;
  comRatio2?: number;
  comRatio3?: number;
  businessID?: number;
  divisionID?: number;
  status: number;
  accountTypeID?: number;
}

export interface Business {
  businessID: number;
  businessName: string;
  status?: number;
  description?: string;
}

export interface Division {
  divisionID: number;
  divisionName: string;
  businessID?: number;
  status?: number;
  description?: string;
}

export interface Salesman {
  salesmanID: number;
  salesmanName: string;
}

export interface CashTransaction {
  date: Date | string;
  customerID: number;
  businessID?: number;
  divisionID?: number;
  description: string;
  debit?: number;
  credit?: number;
  amountPaid?: number;
  amountReceived?: number;
  referenceNo?: string | number;
  invoiceID?: number;
  sessionID?: number;
  status?: number;
  type?: string; // 'RECOVERY', 'BANK', etc.
}

export interface CashReceivedRequest {
  dailyCash: DailyCash;
  sendSMS?: boolean;
  processIncentives?: boolean;
}

export interface CashReceivedResponse {
  success: boolean;
  transactionID?: number;
  message?: string;
}

// Other Income Report Interfaces
export interface OtherIncomeEntry {
  EXPEDID: number;
  Date: string;
  Description: string;
  Amount: number;
  Reference?: string;
  Remarks?: string;
  Status: number; // 0 = Draft, 1 = Posted
}

export interface OtherIncomeFilter {
  fromDate: Date;
  toDate: Date;
  status?: number; // Optional filter by status
  minAmount?: number;
  maxAmount?: number;
  searchText?: string;
}

// Recovery by Division Interfaces
export interface RecoveryEntry {
  DetailID: number;
  Date: string;
  CustomerName: string;
  Description: string;
  AmountReceived: number;
  BusinessID?: number;
  DivisionID?: number;
  Status: string; // 'RECOVERY' for active entries
}

export interface RecoveryFilter {
  fromDate: Date;
  toDate: Date;
  businessID?: number;
  divisionID?: number;
  customerName?: string;
}

// Payment Report Interfaces
export interface PaymentEntry {
  DetailID: number;
  Date: string;
  CustomerName: string; // Supplier/Vendor name
  Description: string;
  AmountPaid: number;
  AcctTypeID: number; // 7 or 17 as per VB6 form
  InvoiceID: number; // 0 for non-invoice payments
}

export interface PaymentFilter {
  fromDate: Date;
  toDate: Date;
  minAmount?: number;
  maxAmount?: number;
  supplierName?: string;
}

export interface PaymentSummary {
  totalPayments: number;
  averagePayment: number;
  paymentCount: number;
  topSuppliers: { name: string; amount: number }[];
}

// Trial Balance Interfaces
export interface TrialBalanceEntry {
  Type: string;
  Account: string;
  Debit: number;
  Credit: number;
  Period: string;
}

export interface TrialBalanceFilter {
  fromDate: Date;
  toDate: Date;
}

export interface TrialBalanceTotals {
  totalDebits: number;
  totalCredits: number;
  difference: number;
  isBalanced: boolean;
}

export interface AccountTypeSummary {
  type: string;
  accountCount: number;
  totalDebits: number;
  totalCredits: number;
  netAmount: number;
}