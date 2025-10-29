import { UserDepartments } from '../../../config/constants';

/**
 * Base Requisition entity matching database table structure
 */
export interface Requisition {
  ReqID: number;
  Date: Date;
  Time: string;
  DepartmentID: number;
  NatureOfWork: string;
  Description: string;
  InitiatedBy: number;
  Status: number;
  ForwardedTo: number;
  IsClosed: number;
}

/**
 * Requisition view model for display in grid (from qryrequisitions view)
 */
export interface RequisitionView extends Requisition {
  DeptName: string;           // Department name for DepartmentID
  InitiatingPerson: string;   // User name for InitiatedBy
  ForwardTo: string;         // User name for ForwardedTo
  ReceivedDate: Date;        // Last received date from history
  ForwardDate: Date;         // Last forward date from history
}

/**
 * Requisition History entity matching requisitionhistory table
 */
export interface RequisitionHistory {
  ID: number;
  Date: Date;
  Time: string;
  Remarks: string;
  DepatmentID: number;
  UserID: number;
  DocumentID: number;
  Type: number;
  StatusID: number;
  ForwardTo: number;
}

/**
 * Requisition History view model (from qryrequisitionhistory view)
 */
export interface RequisitionHistoryView extends RequisitionHistory {
  UserName: string;
  DeptName: string;
  UserFullName: string;
}

/**
 * Filter criteria for requisition list
 */
export interface RequisitionFilterCriteria {
  fromDate: Date;
  toDate: Date;
  departmentId: number | null;
  status: RequisitionStatusFilter;
  isLoading?: boolean;
}

/**
 * Requisition status filter options
 */
export enum RequisitionStatusFilter {
  ActiveOnly = 'Active Only',
  InActive = 'In Active',
  All = 'All'
}

/**
 * User model for dropdown selections
 */
export interface User {
  UserID: number;
  UserName: string;
  Department: number;
}

/**
 * Department model for dropdown selections
 */
export interface Department {
  DeptID: number;
  DeptName: string;
}

/**
 * Component state management
 */
export interface RequisitionListState {
  loading: boolean;
  selectedRequisition: RequisitionView | null;
  filterCriteria: RequisitionFilterCriteria;
  userDepartment: UserDepartments;
  canAdd: boolean;
  canEdit: boolean;
  canView: boolean;
  isLoading: boolean;
  currentFilter: string;
}

/**
 * User permissions for requisition operations
 */
export interface RequisitionPermissions {
  canAdd: boolean;
  canEdit: boolean;
  canView: boolean;
  canManageAll: boolean;
  canViewAll: boolean;
}

/**
 * Grid column configuration
 */
export interface RequisitionGridColumn {
  field: string;
  headerText: string;
  width: number;
  type: 'text' | 'date' | 'number' | 'status' | 'action';
  sortable?: boolean;
  filterable?: boolean;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * Request for creating new requisition
 */
export interface CreateRequisitionRequest {
  Date: Date;
  Time: string;
  DepartmentID: number;
  NatureOfWork: string;
  Description: string;
  InitiatedBy: number;
  ForwardedTo?: number;
}

/**
 * Request for updating requisition
 */
export interface UpdateRequisitionRequest {
  ReqID: number;
  NatureOfWork?: string;
  Description?: string;
  ForwardedTo?: number;
  Status?: number;
  IsClosed?: number;
}