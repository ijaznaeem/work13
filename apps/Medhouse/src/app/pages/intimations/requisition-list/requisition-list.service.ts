import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpBase } from '../../../services/httpbase.service';
import { UserDepartments } from '../../../config/constants';
import {
  Requisition,
  RequisitionView,
  RequisitionHistory,
  RequisitionHistoryView,
  RequisitionFilterCriteria,
  RequisitionPermissions,
  CreateRequisitionRequest,
  UpdateRequisitionRequest,
  User,
  Department,
  ApiResponse,
  RequisitionStatusFilter,
} from './requisition-list.interface';

@Injectable({
  providedIn: 'root',
})
export class RequisitionListService {
  constructor(private httpBase: HttpBase) {}

  /**
   * Get requisitions based on filter criteria
   * Equivalent to VB6 ShowData() function
   */
  getRequisitions(
    criteria: RequisitionFilterCriteria
  ): Observable<RequisitionView[]> {
    return new Observable((observer) => {
      let filter = this.buildFilter(criteria);

      const flds =
        'ReqID, Date, Time, InitiatingPerson, DeptName, NatureOfWork, ForwardTo, ' +
        'DepartmentID, IsClosed, Description, InitiatedBy, ForwardedTo, Status';

      console.log('getRequisitions filter:', filter);
      console.log('getRequisitions fields:', flds);

      this.httpBase
        .getData('qryRequisitions', {
          filter: filter,
          flds: flds,
          orderby: 'Date DESC',
        })
        .then((requisitions: any) => {
          const requisitionsArray = Array.isArray(requisitions)
            ? requisitions
            : requisitions ? [requisitions] : [];
          
          console.log('Raw requisitions from API:', requisitions);
          console.log('Processed requisitions:', requisitionsArray);
          
          observer.next(requisitionsArray);
          observer.complete();
        })
        .catch((error) => {
          console.error('getRequisitions failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Build WHERE clause based on filter criteria
   * Matches VB6 ShowData logic
   */
  private buildFilter(criteria: RequisitionFilterCriteria): string {
    const userDepartment = this.httpBase.getUserDept();
    const currentUserId = this.httpBase.getUserID();

    let filter = '';

    // Department-based filtering (matches VB6 Form_Load logic)
    if (this.isAdminOrManagementUser()) {
      filter = '1=1';
      if (criteria.departmentId && criteria.departmentId > 0) {
        filter += ` AND DepartmentID = ${criteria.departmentId}`;
      }
    } else {
      filter = `(InitiatedBy = ${currentUserId} OR ForwardedTo = ${currentUserId})`;
    }

    // Status filtering
    if (criteria.status === RequisitionStatusFilter.ActiveOnly) {
      filter += ' AND IsClosed = 0';
    } else if (criteria.status === RequisitionStatusFilter.InActive) {
      filter += ' AND IsClosed = 1';
    }

    // Loading mode filtering
    if (criteria.isLoading) {
      filter += ` AND (ForwardedTo = ${currentUserId} AND LastDate <> dbo.gdate())`;
    }

    // Date range filtering
    filter += ` AND Date BETWEEN '${this.formatDateForSQL(criteria.fromDate)}' AND '${this.formatDateForSQL(criteria.toDate)}'`;
   
    return filter;
  }

  /**
   * Get requisition history for selected requisition
   * Equivalent to VB6 grdData_SelectionChange
   */
  getRequisitionHistory(reqId: number): Observable<RequisitionHistoryView[]> {
    return new Observable((observer) => {
      const query = `SELECT Date, Remarks, Name, DeptName, ID, DocumentID, UserID 
                     FROM qryRequisitionHistory 
                     WHERE DocumentID = ${reqId} AND Type = 1`;

      this.httpBase
        .getData('requisition-history', { query })
        .then((history: any) => {
          const historyArray = Array.isArray(history) ? history : [history];
          observer.next(historyArray);
          observer.complete();
        })
        .catch((error) => {
          console.error('getRequisitionHistory failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Create new requisition
   * Equivalent to VB6 btnAddToInv_Click functionality
   */
  createRequisition(
    request: CreateRequisitionRequest
  ): Observable<Requisition> {
    return new Observable((observer) => {
      const data = {
        Date: this.formatDateForSQL(request.Date),
        Time: request.Time,
        DepartmentID: request.DepartmentID,
        NatureOfWork: request.NatureOfWork,
        Description: request.Description,
        InitiatedBy: request.InitiatedBy,
        ForwardedTo: request.ForwardedTo || null,
        Status: 0,
        IsClosed: 0,
      };

      this.httpBase
        .postData('requisitions', data)
        .then((result: any) => {
          observer.next(result);
          observer.complete();
        })
        .catch((error) => {
          console.error('createRequisition failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Update existing requisition
   */
  updateRequisition(request: UpdateRequisitionRequest): Observable<boolean> {
    return new Observable((observer) => {
      this.httpBase
        .putData(`requisitions/${request.ReqID}`, request)
        .then((result: any) => {
          observer.next(true);
          observer.complete();
        })
        .catch((error) => {
          console.error('updateRequisition failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Get all departments for dropdown
   */
  getDepartments(): Observable<Department[]> {
    return new Observable((observer) => {
      this.httpBase
        .getData('Departments')
        .then((departments: any) => {
          const departmentsArray = Array.isArray(departments)
            ? departments
            : [departments];
          observer.next(departmentsArray);
          observer.complete();
        })
        .catch((error) => {
          console.error('getDepartments failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Get all users for dropdown
   */
  getUsers(): Observable<User[]> {
    return new Observable((observer) => {
      this.httpBase
        .getData('Users')
        .then((users: any) => {
          const usersArray = Array.isArray(users) ? users : [users];
          observer.next(usersArray);
          observer.complete();
        })
        .catch((error) => {
          console.error('getUsers failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Get user permissions for requisition operations
   * Based on VB6 Form_Load permission logic
   */
  getUserPermissions(): RequisitionPermissions {
    const userDepartment = this.httpBase.getUserDept();

    return {
      canAdd: true, // All users can create requisitions
      canEdit: true, // Users can edit their own requisitions
      canView: true, // All users can view requisitions
      canManageAll: this.isAdminOrManagementUser(),
      canViewAll: this.isAdminOrManagementUser(),
    };
  }

  /**
   * Check if user is admin or management (can see all requisitions)
   * Matches VB6: nDepartment = 1 Or nDepartment = 9 Or nDepartment = 10 Or nDepartment = grpAdmin
   */
  private isAdminOrManagementUser(): boolean {
    const userDepartment = this.httpBase.getUserDept();
    return (
      userDepartment === 1 ||
      userDepartment === 9 ||
      userDepartment === 10 ||
      userDepartment === UserDepartments.grpAdmin
    );
  }

  /**
   * Format date for SQL query
   */
  private formatDateForSQL(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Export requisitions to Excel
   * Equivalent to VB6 PrintReport functionality
   */
  exportToExcel(criteria: RequisitionFilterCriteria): Observable<boolean> {
    return new Observable((observer) => {
      this.getRequisitions(criteria).subscribe({
        next: (requisitions) => {
          // This would typically call a report service or generate Excel file
          console.log('Export to Excel:', requisitions);
          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  /**
   * Check if requisition can be edited by current user
   */
  canEditRequisition(requisition: RequisitionView): boolean {
    const currentUserId = this.httpBase.getUserID();
    const userDepartment = this.httpBase.getUserDept();

    // Admin and management can edit all
    if (this.isAdminOrManagementUser()) {
      return true;
    }

    // Users can edit their own requisitions or ones forwarded to them
    return (
      requisition.InitiatedBy === currentUserId ||
      requisition.ForwardedTo === currentUserId
    );
  }

  /**
   * Forward requisition to another user/department
   */
  forwardRequisition(
    reqId: number,
    forwardToUserId: number,
    remarks: string
  ): Observable<boolean> {
    return new Observable((observer) => {
      const data = {
        ReqID: reqId,
        ForwardedTo: forwardToUserId,
        Remarks: remarks,
        Date: new Date(),
        Time: new Date().toTimeString(),
        UserID: this.httpBase.getUserID(),
        DepartmentID: this.httpBase.getUserDept(),
        Type: 1,
      };

      // Update requisition
      this.httpBase
        .putData(`requisitions/${reqId}`, { ForwardedTo: forwardToUserId })
        .then(() => {
          // Add to history
          return this.httpBase.postData('requisition-history', data);
        })
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch((error) => {
          console.error('forwardRequisition failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Close/Complete requisition
   */
  closeRequisition(reqId: number, remarks: string): Observable<boolean> {
    return new Observable((observer) => {
      const historyData = {
        ReqID: reqId,
        Remarks: remarks,
        Date: new Date(),
        Time: new Date().toTimeString(),
        UserID: this.httpBase.getUserID(),
        DepartmentID: this.httpBase.getUserDept(),
        Type: 2, // Completion type
        DocumentID: reqId,
      };

      // Update requisition to closed
      this.httpBase
        .putData(`requisitions/${reqId}`, { IsClosed: 1 })
        .then(() => {
          // Add completion history
          return this.httpBase.postData('requisition-history', historyData);
        })
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch((error) => {
          console.error('closeRequisition failed:', error);
          observer.error(error);
        });
    });
  }
}
