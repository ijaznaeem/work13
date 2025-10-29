// Customer Account Interfaces
export interface CustomerAccount {
  customerID: number;
  customerName: string;
  address?: string;
  city?: string;
  balance: number;
  limit: number;
  phoneNo1?: string;
  phoneNo2?: string;
  email?: string;
  sendSMS?: boolean;
  referredBy?: number;
  referredBy2?: number;
  referredBy3?: number;
  comRatio?: number;
  comRatio2?: number;
  comRatio3?: number;
  businessID?: number;
  businessName?: string;
  divisionID?: number;
  divisionName?: string;
  accountTypeID: number;
  accountTypeName?: string;
  status: number;
  createdDate?: Date;
  lastTransactionDate?: Date;
}

// Account Transaction Interface
export interface AccountTransaction {
  DetailID: number;
  Date: string;
  InvoiceNo?: number;
  Description: string;
  Debit: number;         // AmountReceived
  Credit: number;        // AmountPaid
  Balance: number;
  Status: string;
  CustomerID: number;
  InvoiceID?: number;
  ReferenceNo?: string;
  TransactionType?: string; // 'SALE', 'PURCHASE', 'PAYMENT', 'RECEIPT', etc.
  SessionID?: number;
  CreatedBy?: number;
  CreatedDate?: Date;
  ModifiedBy?: number;
  ModifiedDate?: Date;
}

// Filter Interface for Account Data
export interface AccountFilter {
  customerID: number;
  fromDate: Date;
  toDate: Date;
  accountTypeID?: number;
  businessID?: number;
  divisionID?: number;
  searchText?: string;
  transactionType?: string;
  minAmount?: number;
  maxAmount?: number;
  status?: string;
}

// Business Interface
export interface Business {
  businessID: number;
  businessName: string;
  description?: string;
  status: number;
  address?: string;
  contactPerson?: string;
  phoneNo?: string;
  email?: string;
  createdDate?: Date;
}

// Division Interface
export interface Division {
  divisionID: number;
  divisionName: string;
  businessID?: number;
  businessName?: string;
  description?: string;
  status: number;
  manager?: string;
  location?: string;
  createdDate?: Date;
}

// Account Type Interface
export interface AccountType {
  accountTypeID: number;
  accountType: string;
  description?: string;
  category?: string; // 'CUSTOMER', 'SUPPLIER', 'EMPLOYEE', etc.
  status: number;
  defaultCreditLimit?: number;
  requiresApproval?: boolean;
  allowNegativeBalance?: boolean;
}

// Account Summary Interface
export interface AccountSummary {
  customerID: number;
  customerName: string;
  totalDebits: number;
  totalCredits: number;
  currentBalance: number;
  transactionCount: number;
  averageTransaction: number;
  lastTransactionDate?: Date;
  firstTransactionDate?: Date;
  creditLimit: number;
  availableCredit: number;
  overdueAmount?: number;
  overdueTransactions?: number;
}

// Invoice Data Interface
export interface InvoiceData {
  invoiceNo: number;
  invoiceType: 'SALES' | 'PURCHASE';
  date: Date;
  customerID: number;
  customerName: string;
  amount: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  status: string;
  items?: InvoiceItem[];
  paymentTerms?: string;
  dueDate?: Date;
  notes?: string;
}

// Invoice Item Interface
export interface InvoiceItem {
  itemID: number;
  itemName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate?: number;
  discountRate?: number;
  category?: string;
}

// Account Statement Request
export interface AccountStatementRequest {
  customerID: number;
  fromDate: Date;
  toDate: Date;
  includeOpeningBalance?: boolean;
  includeClosingBalance?: boolean;
  groupByMonth?: boolean;
  showInvoiceDetails?: boolean;
  format?: 'PDF' | 'EXCEL' | 'CSV';
}

// Account Statement Response
export interface AccountStatementResponse {
  customerDetails: CustomerAccount;
  openingBalance: number;
  closingBalance: number;
  transactions: AccountTransaction[];
  summary: AccountSummary;
  generatedDate: Date;
  dateRange: {
    fromDate: Date;
    toDate: Date;
  };
}

// Customer Search Criteria
export interface CustomerSearchCriteria {
  searchText?: string;
  accountTypeID?: number;
  businessID?: number;
  divisionID?: number;
  status?: number;
  hasActiveTransactions?: boolean;
  minBalance?: number;
  maxBalance?: number;
  city?: string;
  balanceType?: 'POSITIVE' | 'NEGATIVE' | 'ZERO' | 'ALL';
}

// Transaction Search Criteria
export interface TransactionSearchCriteria {
  customerID?: number;
  fromDate?: Date;
  toDate?: Date;
  transactionType?: string;
  invoiceNo?: number;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
  status?: string;
  referenceNo?: string;
}

// Payment/Receipt Transaction
export interface PaymentTransaction {
  transactionID?: number;
  customerID: number;
  transactionType: 'PAYMENT' | 'RECEIPT';
  amount: number;
  date: Date;
  description: string;
  referenceNo?: string;
  paymentMethod?: string; // 'CASH', 'BANK', 'CHEQUE', 'CARD'
  bankDetails?: {
    bankName?: string;
    accountNo?: string;
    chequeNo?: string;
    chequeDate?: Date;
  };
  sessionID?: number;
  createdBy: number;
  approvedBy?: number;
  notes?: string;
}

// Customer Balance Information
export interface CustomerBalance {
  customerID: number;
  customerName: string;
  currentBalance: number;
  creditLimit: number;
  availableCredit: number;
  overdueAmount: number;
  lastPaymentDate?: Date;
  lastPaymentAmount?: number;
  accountAge: number; // in days
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Account Activity
export interface AccountActivity {
  customerID: number;
  period: string; // 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
  totalTransactions: number;
  totalDebits: number;
  totalCredits: number;
  netAmount: number;
  averageTransactionAmount: number;
  maxTransactionAmount: number;
  minTransactionAmount: number;
  activityDate: Date;
}

// Export Options
export interface ExportOptions {
  format: 'CSV' | 'EXCEL' | 'PDF';
  includeHeaders: boolean;
  includeCustomerDetails: boolean;
  includeSummary: boolean;
  dateFormat: string;
  currencyFormat: string;
  fileName?: string;
}

// Report Configuration
export interface ReportConfiguration {
  reportType: 'ACCOUNT_STATEMENT' | 'CUSTOMER_LEDGER' | 'TRANSACTION_HISTORY' | 'BALANCE_SUMMARY';
  parameters: {
    customerID?: number;
    fromDate?: Date;
    toDate?: Date;
    groupBy?: string;
    sortBy?: string;
    filterCriteria?: any;
  };
  format: 'PDF' | 'EXCEL' | 'CSV' | 'HTML';
  layout: 'PORTRAIT' | 'LANDSCAPE';
  includeCharts?: boolean;
  includeSubTotals?: boolean;
  pageSize?: 'A4' | 'LETTER' | 'LEGAL';
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
}

// Pagination Interface
export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  searchText?: string;
  filters?: { [key: string]: any };
}

// Account Validation Rules
export interface AccountValidationRules {
  minCreditLimit: number;
  maxCreditLimit: number;
  allowNegativeBalance: boolean;
  requireApprovalForLargeTransactions: boolean;
  largeTransactionThreshold: number;
  maxDailyTransactionLimit: number;
  maxMonthlyTransactionLimit: number;
  blockedStatuses: number[];
  mandatoryFields: string[];
}