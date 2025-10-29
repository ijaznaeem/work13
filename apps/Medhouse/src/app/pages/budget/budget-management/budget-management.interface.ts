import { UserDepartments } from '../../../config/constants';

/**
 * Base Budget Head entity matching database table structure
 */
export interface BudgetHead {
  BudgetID: number;
  BudgetName: string;
  Percentage: number;
  StatusID: number;
  CreatedDate: Date;
  CreatedBy: number;
  ModifiedDate?: Date;
  ModifiedBy?: number;
}

/**
 * Budget Head view model for display in grid (from qryBudgets view)
 */
export interface BudgetHeadView extends BudgetHead {
  Balance: number;           // Calculated remaining percentage
  ExpenseHeadCount: number;  // Number of expense heads under this budget
  TotalAllocated: number;    // Total allocated from this budget
  IsEditable: boolean;       // Whether current user can edit
}

/**
 * Expense Head entity
 */
export interface ExpenseHead {
  HeadID: number;
  Head: string;
  BudgetID: number;
  StatusID: number;
  CreatedDate: Date;
  CreatedBy: number;
  ModifiedDate?: Date;
  ModifiedBy?: number;
}

/**
 * Expense Head view model
 */
export interface ExpenseHeadView extends ExpenseHead {
  BudgetName: string;
  IsActive: boolean;
}

/**
 * Budget filter criteria
 */
export interface BudgetFilterCriteria {
  statusId?: number;
  budgetName?: string;
  showInactive?: boolean;
}

/**
 * Budget Management component state
 */
export interface BudgetManagementState {
  loading: boolean;
  selectedBudget: BudgetHeadView | null;
  selectedExpenseHead: ExpenseHeadView | null;
  filterCriteria: BudgetFilterCriteria;
  userDepartment: UserDepartments;
  canAdd: boolean;
  canEdit: boolean;
  canView: boolean;
  formMode: BudgetFormMode;
  showExpenseHeadDialog: boolean;
}

/**
 * Form modes for budget management
 */
export enum BudgetFormMode {
  View = 'view',
  Add = 'add',
  Edit = 'edit'
}

/**
 * Create budget head request
 */
export interface CreateBudgetHeadRequest {
  BudgetName: string;
  Percentage: number;
  StatusID: number;
  CreatedBy: number;
}

/**
 * Update budget head request
 */
export interface UpdateBudgetHeadRequest {
  BudgetID: number;
  BudgetName: string;
  Percentage: number;
  StatusID: number;
  ModifiedBy: number;
}

/**
 * Create expense head request
 */
export interface CreateExpenseHeadRequest {
  Head: string;
  BudgetID: number;
  StatusID: number;
  CreatedBy: number;
}

/**
 * Update expense head request
 */
export interface UpdateExpenseHeadRequest {
  HeadID: number;
  Head: string;
  BudgetID: number;
  StatusID: number;
  ModifiedBy: number;
}

/**
 * Budget permissions based on user role
 */
export interface BudgetPermissions {
  canAdd: boolean;
  canEdit: boolean;
  canView: boolean;
  canDelete: boolean;
  canManageExpenseHeads: boolean;
  canViewReports: boolean;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

/**
 * Budget validation result
 */
export interface BudgetValidationResult {
  isValid: boolean;
  errors: string[];
  totalPercentage: number;
  remainingPercentage: number;
}

/**
 * Budget status enum
 */
export enum BudgetStatus {
  Active = 1,
  Inactive = 0
}

/**
 * Budget detail component state
 */
export interface BudgetDetailState {
  loading: boolean;
  budgetId: number;
  budgetHead: BudgetHeadView | null;
  selectedExpenseHead: ExpenseHeadView | null;
  canAdd: boolean;
  canEdit: boolean;
  canView: boolean;
  canDelete: boolean;
  permissions: BudgetPermissions;
}

/**
 * Grid column definition
 */
export interface BudgetGridColumn {
  field: string;
  headerText: string;
  width: number;
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'status';
  format?: string;
  allowSorting?: boolean;
  allowFiltering?: boolean;
}
