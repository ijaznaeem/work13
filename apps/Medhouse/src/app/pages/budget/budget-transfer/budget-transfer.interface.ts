import { BudgetHeadView, BudgetPermissions } from '../budget-management/budget-management.interface';

/**
 * Budget Transfer entity matching VB6 functionality
 */
export interface BudgetTransfer {
  TransferID?: number;
  Date: Date;
  FromBudgetID: number;
  ToBudgetID: number;
  Amount: number;
  Description: string;
  TransactionType: BudgetTransactionType;
  CreatedDate: Date;
  CreatedBy: number;
}

/**
 * Budget Transfer view model for display
 */
export interface BudgetTransferView extends BudgetTransfer {
  FromBudgetName: string;
  ToBudgetName: string;
  FromCurrentBalance: number;
  ToCurrentBalance: number;
  FromBalanceAfterTransfer: number;
  ToBalanceAfterTransfer: number;
}

/**
 * Create budget transfer request
 */
export interface CreateBudgetTransferRequest {
  Date: Date;
  FromBudgetID: number;
  ToBudgetID: number;
  Amount: number;
  Description: string;
  TransactionType: BudgetTransactionType;
  CreatedBy: number;
}

/**
 * Budget transfer form state
 */
export interface BudgetTransferState {
  loading: boolean;
  fromBudget: BudgetHeadView | null;
  toBudget: BudgetHeadView | null;
  fromBalance: number;
  toBalance: number;
  fromBalanceAfterTransfer: number;
  toBalanceAfterTransfer: number;
  availableBudgets: BudgetHeadView[];
  permissions: BudgetPermissions;
  canTransfer: boolean;
}

/**
 * Budget transfer validation result
 */
export interface BudgetTransferValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fromBudgetAvailable: number;
  toBudgetCurrent: number;
}

/**
 * Budget transaction types enum
 * Equivalent to VB6 AcctTypes
 */
export enum BudgetTransactionType {
  Transfer = 1,
  Adjustment = 2,
  Allocation = 3,
  Reallocation = 4
}

/**
 * Budget transfer history entry
 */
export interface BudgetTransferHistory {
  HistoryID: number;
  Date: Date;
  BudgetID: number;
  BudgetName: string;
  Amount: number;
  TransferType: 'Debit' | 'Credit';
  Description: string;
  ReferenceID: number;
  CreatedBy: number;
  CreatedDate: Date;
}

/**
 * Budget balance calculation
 */
export interface BudgetBalance {
  BudgetID: number;
  BudgetName: string;
  AllocatedAmount: number;
  SpentAmount: number;
  TransferredIn: number;
  TransferredOut: number;
  CurrentBalance: number;
  AvailableBalance: number;
}

/**
 * Budget transfer filter criteria
 */
export interface BudgetTransferFilterCriteria {
  fromDate: Date;
  toDate: Date;
  fromBudgetId?: number;
  toBudgetId?: number;
  transactionType?: BudgetTransactionType;
  minAmount?: number;
  maxAmount?: number;
  createdBy?: number;
}

/**
 * Budget transfer summary statistics
 */
export interface BudgetTransferSummary {
  totalTransfers: number;
  totalAmountTransferred: number;
  averageTransferAmount: number;
  mostActiveFromBudget: string;
  mostActiveToBudget: string;
  dateRange: {
    from: Date;
    to: Date;
  };
}

/**
 * Transaction type options for dropdown
 */
export interface TransactionTypeOption {
  value: BudgetTransactionType;
  label: string;
  description: string;
}