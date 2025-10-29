import { UserDepartments } from '../../../config/constants';

/**
 * Base Cash Transfer Approval entity matching database table structure
 */
export interface CashTransferApproval {
  ApprovalID: number;
  Date: Date;
  TransferFromID: number;
  TransferToID: number;
  FromBalance: number;
  ToBalance: number;
  Amount: number;
  ForwardedTo: number | null;
  Status: CashTransferStatus;
  Description: string;
}

/**
 * Cash Transfer Approval view model for display in grid (from qrycashtransferapproval view)
 */
export interface CashTransferApprovalView extends CashTransferApproval {
  TransferredFrom: string;      // Customer name for TransferFromID
  TransferredTo: string;        // Customer name for TransferToID
  ForwardedToName: string;      // Department name for ForwardedTo
  ForwardedToID: number;        // Same as ForwardedTo for clarity
  FromBalAfterTrans: number;    // FromBalance - Amount
  ToBalAfterTrans: number;      // ToBalance + Amount
}

/**
 * Cash Transfer Status enum matching VB6 form status options
 */
export enum CashTransferStatus {
  InProgress = 'In Progress',
  Approved = 'Approved',
  Posted = 'Posted',
  Cancelled = 'Cancelled',
  Rejected = 'Rejected'
}

/**
 * Filter criteria for cash transfer approvals
 */
export interface CashTransferFilterCriteria {
  fromDate: Date;
  toDate: Date;
  status: CashTransferStatus;
}

/**
 * Customer model for transfer selection
 */
export interface Customer {
  CustomerID: number;
  CustomerName: string;
  Balance: number;
  Address?: string;
}

/**
 * Department model for forwarding approvals
 */
export interface Department {
  DeptID: number;
  DeptName: string;
}

/**
 * Component state management
 */
export interface CashTransferApprovalsState {
  loading: boolean;
  selectedApproval: CashTransferApprovalView | null;
  filterCriteria: CashTransferFilterCriteria;
  userDepartment: UserDepartments;
  canApprove: boolean;
  canReject: boolean;
  canForward: boolean;
  canPost: boolean;
  canAdd: boolean;
}

/**
 * User permissions for cash transfer operations
 */
export interface CashTransferPermissions {
  canAdd: boolean;
  canApprove: boolean;
  canReject: boolean;
  canForward: boolean;
  canPost: boolean;
  canPrint: boolean;
  canViewAll: boolean;
}

/**
 * Cash transfer approval request for creating new approvals
 */
export interface CashTransferApprovalRequest {
  Date: Date;
  TransferFromID: number;
  TransferToID: number;
  Amount: number;
  Description: string;
  Status?: CashTransferStatus;
}

/**
 * Cash transfer approval update request
 */
export interface CashTransferApprovalUpdate {
  ApprovalID: number;
  Status?: CashTransferStatus;
  ForwardedTo?: number;
  Description?: string;
  Remarks?: string;
}

/**
 * Grid column configuration for cash transfer approvals
 */
export interface CashTransferGridColumn {
  field: string;
  headerText: string;
  width: number;
  Type: 'text' | 'number' | 'currency' | 'date' | 'status';
  format?: string;
  visible?: boolean;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

/**
 * Approval workflow action types
 */
export enum ApprovalAction {
  Forward = 'forward',
  Reject = 'reject',
  Post = 'post',
  Cancel = 'cancel'
}

/**
 * Approval workflow request
 */
export interface ApprovalWorkflowRequest {
  ApprovalID: number;
  Action: ApprovalAction;
  ForwardToDepartment?: UserDepartments;
  Remarks?: string;
  UserId?: number;
}

/**
 * Balance calculation result
 */
export interface BalanceCalculation {
  fromBalanceAfter: number;
  toBalanceAfter: number;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Export/Print options
 */
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeFilters: boolean;
  dateRange: {
    from: Date;
    to: Date;
  };
  status?: CashTransferStatus;
}