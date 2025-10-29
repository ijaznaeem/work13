/**
 * Invoice Return Approvals Interfaces
 * Based on the VB6 frmInvoiceApprovalsReturn form and database schema
 */

export interface InvoiceReturnApproval {
  InvoiceApprovalID: number;
  Date: Date;
  CustomerName: string;
  Address: string;
  Amount: number;
  Discount: number;
  NetAmount: number;
  ForwardedTo: number;
  ForwardedToName?: string;
  Remarks: string;
  Status: InvoiceReturnStatus;
  BusinessID: number;
  DivisionID: number;
  DtCr: 'DT' | 'CR';
}

export interface InvoiceReturnApprovalDetail {
  DetailID: number;
  InvoiceApprovalID: number;
  ProductName: string;
  Qty: number;
  Bonus: number;
  SPrice: number;
  Amount: number;
  Discount: number;
  NetAmount: number;
}

export interface InvoiceReturnApprovalView extends InvoiceReturnApproval {
  SNO: number;
  CustomerID?: number;
  SalesmanID?: number;
  AmntRecvd?: number;
  SessionID?: number;
  Type?: number;
}

export enum InvoiceReturnStatus {
  InProcess = 'In Process',
  Completed = 'Completed',
  Rejected = 'Rejected'
}

export interface Department {
  DeptID: number;
  DeptName: string;
}

export interface FilterCriteria {
  fromDate: Date;
  toDate: Date;
  status: InvoiceReturnStatus;
}

export interface ApprovalAction {
  approvalId: number;
  action: 'approve' | 'reject' | 'forward';
  remarks?: string;
  forwardTo?: number;
}

export interface Business {
  BusinessID: number;
  BusinessName: string;
  ShortName?: string;
}

export interface Division {
  DivisionID: number;
  DivisionName: string;
}

export interface Customer {
  CustomerID: number;
  CustomerName: string;
  Address: string;
  DiscountRatio: number;
  BonusType: number;
}

export interface Product {
  ProductID: number;
  ProductName: string;
  SPrice: number;
  PPrice: number;
  Stock: number;
  PackSize: number;
}

// User Department Constants (matching VB6 constants)
export enum UserDepartments {
  grpCEO = 1,
  grpOperations = 2,
  grpGM = 3,
  grpAccounts = 4,
  grpSales = 5,
  grpProduction = 6,
  grpQuality = 7,
  grpPurchase = 8
}

// Grid column definitions
export interface GridColumn {
  field: string;
  header: string;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'currency';
  sortable?: boolean;
  filterable?: boolean;
}

// Form state management
export interface InvoiceReturnApprovalsState {
  loading: boolean;
  selectedApproval: InvoiceReturnApproval | null;
  selectedDetails: InvoiceReturnApprovalDetail[];
  filterCriteria: FilterCriteria;
  userDepartment: number;
  canApprove: boolean;
  canReject: boolean;
  canForward: boolean;
}