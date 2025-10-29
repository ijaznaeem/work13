import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpBase } from '../../../services/httpbase.service';
import { UserDepartments } from '../../../config/constants';
import { 
  CashTransferApproval,
  CashTransferApprovalView,
  CashTransferFilterCriteria,
  CashTransferPermissions,
  CashTransferApprovalRequest,
  CashTransferApprovalUpdate,
  Customer,
  Department,
  ApiResponse,
  ApprovalWorkflowRequest,
  ApprovalAction,
  CashTransferStatus,
  BalanceCalculation
} from './cash-transfer-approvals.interface';

@Injectable({
  providedIn: 'root'
})
export class CashTransferApprovalsService {

  constructor(private httpBase: HttpBase) { }

  /**
   * Get cash transfer approvals based on filter criteria
   * Equivalent to VB6 ShowData() function
   */
  getCashTransferApprovals(criteria: CashTransferFilterCriteria): Observable<CashTransferApprovalView[]> {
    const params = {
      fromDate: this.formatDateForApi(criteria.fromDate),
      toDate: this.formatDateForApi(criteria.toDate),
      status: criteria.status
    };

    return new Observable(observer => {
      this.httpBase.getData('qrycashtransferapproval', params)
        .then((approvals: any) => {
          const approvalsArray = Array.isArray(approvals) ? approvals : [approvals];
          const mappedApprovals = approvalsArray.map((approval: any) => ({
            ...approval,
            Date: new Date(approval.Date),
            FromBalAfterTrans: approval.FromBalance - approval.Amount,
            ToBalAfterTrans: approval.ToBalance + approval.Amount
          }));
          observer.next(mappedApprovals);
          observer.complete();
        })
        .catch(error => {
          console.error('getCashTransferApprovals failed:', error);
          observer.next([]);
          observer.complete();
        });
    });
  }

  /**
   * Get single cash transfer approval by ID
   */
  getCashTransferApprovalById(approvalId: number): Observable<CashTransferApprovalView> {
    return new Observable(observer => {
      this.httpBase.getData('qrycashtransferapproval', { ApprovalID: approvalId })
        .then((approvals: any) => {
          if (approvals && approvals.length > 0) {
            const approval = approvals[0];
            const mappedApproval = {
              ...approval,
              Date: new Date(approval.Date),
              FromBalAfterTrans: approval.FromBalance - approval.Amount,
              ToBalAfterTrans: approval.ToBalance + approval.Amount
            };
            observer.next(mappedApproval);
          } else {
            observer.error(new Error('Approval not found'));
          }
          observer.complete();
        })
        .catch(error => {
          console.error('getCashTransferApprovalById failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Create new cash transfer approval
   * Equivalent to VB6 btnadd_Click functionality
   */
  createCashTransferApproval(request: CashTransferApprovalRequest): Observable<CashTransferApproval> {
    const payload = {
      ...request,
      Date: this.formatDateForApi(request.Date),
      Status: request.Status || CashTransferStatus.InProgress
    };

    return new Observable(observer => {
      this.httpBase.postData('cashtransferapproval', payload)
        .then((result: any) => {
          observer.next(result);
          observer.complete();
        })
        .catch(error => {
          console.error('createCashTransferApproval failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Update cash transfer approval
   */
  updateCashTransferApproval(update: CashTransferApprovalUpdate): Observable<CashTransferApproval> {
    return new Observable(observer => {
      this.httpBase.postData(`cashtransferapproval/update/${update.ApprovalID}`, update)
        .then((result: any) => {
          observer.next(result);
          observer.complete();
        })
        .catch(error => {
          console.error('updateCashTransferApproval failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Forward approval to another department
   * Equivalent to VB6 btnForward_Click
   */
  forwardApproval(approvalId: number, toDepartment: UserDepartments, remarks?: string): Observable<boolean> {
    return new Observable(observer => {
      const updateData = {
        forwardedto: toDepartment,
        Status: 'Approved'
      };
      
      this.httpBase.postData(`cashtransferapproval/forward/${approvalId}`, updateData)
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch(error => {
          console.error('forwardApproval failed:', error);
          observer.next(false);
          observer.complete();
        });
    });
  }

  /**
   * Reject cash transfer approval
   * Equivalent to VB6 btnReject_Click
   */
  rejectApproval(approvalId: number, rejectionReason: string): Observable<boolean> {
    return new Observable(observer => {
      const updateData = {
        remarks: rejectionReason,
        Status: 'Rejected'
      };
      
      this.httpBase.postData(`cashtransferapproval/reject/${approvalId}`, updateData)
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch(error => {
          console.error('rejectApproval failed:', error);
          observer.next(false);
          observer.complete();
        });
    });
  }

  /**
   * Post approved cash transfer (accounting entries)
   * Equivalent to VB6 grdData_DblClick posting functionality
   */
  postApproval(approvalId: number): Observable<boolean> {
    return new Observable(observer => {
      const updateData = {
        ForwardedTo: UserDepartments.grpOperations,
        Status: 'Posted'
      };
      
      this.httpBase.postData(`cashtransferapproval/post/${approvalId}`, updateData)
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch(error => {
          console.error('postApproval failed:', error);
          observer.next(false);
          observer.complete();
        });
    });
  }

  /**
   * Cancel cash transfer approval
   */
  cancelApproval(approvalId: number, reason: string): Observable<boolean> {
    return new Observable(observer => {
      const updateData = {
        remarks: reason,
        Status: 'Cancelled'
      };
      
      this.httpBase.postData(`cashtransferapproval/cancel/${approvalId}`, updateData)
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch(error => {
          console.error('cancelApproval failed:', error);
          observer.next(false);
          observer.complete();
        });
    });
  }

  /**
   * Get available customers for transfer selection
   */
  getCustomersForTransfer(): Observable<Customer[]> {
    return new Observable(observer => {
      this.httpBase.getData('Customers')
        .then((customers: any) => {
          const customersArray = Array.isArray(customers) ? customers : [customers];
          observer.next(customersArray);
          observer.complete();
        })
        .catch(error => {
          console.error('getCustomersForTransfer failed:', error);
          observer.next([]);
          observer.complete();
        });
    });
  }

  /**
   * Get departments for forwarding approvals
   */
  getDepartments(): Observable<Department[]> {
    return new Observable(observer => {
      this.httpBase.getData('departments')
        .then((departments: any) => {
          const departmentsArray = Array.isArray(departments) ? departments : [departments];
          observer.next(departmentsArray);
          observer.complete();
        })
        .catch(error => {
          console.error('getDepartments failed:', error);
          observer.next([]);
          observer.complete();
        });
    });
  }

  /**
   * Get customer balance by ID
   */
  getCustomerBalance(customerId: number): Observable<number> {
    return new Observable(observer => {
      this.httpBase.getData('Customers', { CustomerID: customerId })
        .then((customers: any) => {
          const customersArray = Array.isArray(customers) ? customers : [customers];
          const customer = customersArray[0];
          observer.next(customer?.Balance || 0);
          observer.complete();
        })
        .catch(error => {
          console.error('getCustomerBalance failed:', error);
          observer.next(0);
          observer.complete();
        });
    });
  }

  /**
   * Calculate balance after transfer
   */
  calculateTransferBalance(fromCustomerId: number, toCustomerId: number, amount: number): Observable<BalanceCalculation> {
    return new Observable(observer => {
      Promise.all([
        this.httpBase.getData('Customers', { CustomerID: fromCustomerId }),
        this.httpBase.getData('Customers', { CustomerID: toCustomerId })
      ]).then(([fromCustomers, toCustomers]: [any, any]) => {
        const fromCustomersArray = Array.isArray(fromCustomers) ? fromCustomers : [fromCustomers];
        const toCustomersArray = Array.isArray(toCustomers) ? toCustomers : [toCustomers];
        
        const fromCustomer = fromCustomersArray[0];
        const toCustomer = toCustomersArray[0];
        
        if (fromCustomer && toCustomer) {
          const result: BalanceCalculation = {
            fromBalanceAfter: fromCustomer.Balance - amount,
            toBalanceAfter: toCustomer.Balance + amount,
            isValid: (fromCustomer.Balance - amount) >= 0,
            errorMessage: (fromCustomer.Balance - amount) < 0 ? 'Insufficient balance' : undefined
          };
          observer.next(result);
        } else {
          observer.next({
            fromBalanceAfter: 0,
            toBalanceAfter: 0,
            isValid: false,
            errorMessage: 'Customer not found'
          });
        }
        observer.complete();
      }).catch(error => {
        console.error('calculateTransferBalance failed:', error);
        observer.next({
          fromBalanceAfter: 0,
          toBalanceAfter: 0,
          isValid: false,
          errorMessage: 'Failed to calculate balance'
        });
        observer.complete();
      });
    });
  }

  /**
   * Print approval form
   * Equivalent to VB6 btnEdit_Click (Print functionality)
   */
  printApprovalForm(approvalId: number): Observable<boolean> {
    return new Observable(observer => {
      // For now, just return success - implement actual printing logic later
      console.log(`Printing approval form for ID: ${approvalId}`);
      observer.next(true);
      observer.complete();
    });
  }

  /**
   * Export approvals to Excel
   */
  exportToExcel(criteria: CashTransferFilterCriteria): Observable<boolean> {
    return new Observable(observer => {
      // For now, just return success - implement actual export logic later
      console.log('Exporting approvals to Excel:', criteria);
      observer.next(true);
      observer.complete();
    });
  }

  /**
   * Get user permissions for cash transfer operations
   * Based on VB6 Form_Load permission logic
   */
  getUserPermissions(): CashTransferPermissions {
    const userDepartment = this.getCurrentUserDepartment();

    let permissions: CashTransferPermissions = {
      canAdd: false,
      canApprove: false,
      canReject: false,
      canForward: false,
      canPost: false,
      canPrint: true, // Usually allowed for all users
      canViewAll: false
    };

    switch (userDepartment) {
      case UserDepartments.grpCEO:
      case UserDepartments.grpOperations:
      case UserDepartments.grpGM:
        // Full permissions for CEO, Operations, and GM
        permissions = {
          canAdd: true,
          canApprove: true,
          canReject: true,
          canForward: true,
          canPost: false, // Only accounts can post
          canPrint: true,
          canViewAll: true
        };
        break;

      case UserDepartments.grpAccounts:
        // Accounts can post but limited add permissions
        permissions = {
          canAdd: false,
          canApprove: false,
          canReject: false,
          canForward: false,
          canPost: true, // Only accounts can post
          canPrint: true,
          canViewAll: true
        };
        break;

      case UserDepartments.grpSales:
        // Sales can add but limited approvals
        permissions = {
          canAdd: true,
          canApprove: false,
          canReject: false,
          canForward: false,
          canPost: false,
          canPrint: true,
          canViewAll: false
        };
        break;

      default:
        // Default limited permissions
        permissions = {
          canAdd: false,
          canApprove: false,
          canReject: false,
          canForward: false,
          canPost: false,
          canPrint: true,
          canViewAll: false
        };
        break;
    }

    return permissions;
  }

  /**
   * Get current user's department
   * This should be integrated with your authentication service
   */
  getCurrentUserDepartment(): UserDepartments {
    // This should come from your authentication service
    // For now, returning a default value - integrate with actual auth service
    return UserDepartments.grpSales; // Default fallback
  }

  /**
   * Get default filter for user's department
   * Based on VB6 Form_Load logic
   */
  getDefaultFilterForUser(): CashTransferFilterCriteria {
    const userDept = this.getCurrentUserDepartment();
    
    let defaultStatus = CashTransferStatus.InProgress;
    
    if (userDept === UserDepartments.grpAccounts) {
      defaultStatus = CashTransferStatus.Approved; // Accounts sees approved items for posting
    }

    return {
      fromDate: this.getFirstDayOfMonth(),
      toDate: new Date(),
      status: defaultStatus
    };
  }

  /**
   * Load cash transfer approval form dialog
   * Equivalent to VB6 LoadForm dlgCashTransferApproval
   */
  loadCashTransferApprovalForm(): void {
    // This would typically open a dialog/modal for adding new cash transfer approval
    // Implementation depends on your modal service
    console.log('Load Cash Transfer Approval form dialog');
  }

  /**
   * Validate transfer request
   */
  validateTransferRequest(request: CashTransferApprovalRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.TransferFromID) {
      errors.push('Transfer From customer is required');
    }

    if (!request.TransferToID) {
      errors.push('Transfer To customer is required');
    }

    if (request.TransferFromID === request.TransferToID) {
      errors.push('Transfer From and Transfer To cannot be the same customer');
    }

    if (!request.Amount || request.Amount <= 0) {
      errors.push('Transfer amount must be greater than zero');
    }

    if (!request.Description || request.Description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!request.Date) {
      errors.push('Date is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format date for API calls
   */
  private formatDateForApi(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  /**
   * Get first day of current month
   */
  private getFirstDayOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  /**
   * Handle HTTP errors
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Let the app keep running by returning an empty result or throw error
      if (result !== undefined) {
        return of(result as T);
      } else {
        return throwError(error);
      }
    };
  }
}