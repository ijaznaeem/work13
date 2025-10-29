import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpBase } from '../../../services/httpbase.service';
import { UserDepartments } from '../../../config/constants';
import {
  InvoiceReturnApproval,
  InvoiceReturnApprovalDetail,
  InvoiceReturnApprovalView,
  InvoiceReturnStatus,
  FilterCriteria,
  ApprovalAction
} from './invoice-return-approvals.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceReturnApprovalsService {

  constructor(private http: HttpBase) { }

  /**
   * Get invoice return approvals based on filter criteria
   * Equivalent to VB6 ShowData() function
   */
  getInvoiceReturnApprovals(filter: FilterCriteria): Observable<InvoiceReturnApprovalView[]> {
    let queryFilter = "DtCr = 'DT'";
    
    // Add status filter
    queryFilter += ` AND Status = '${filter.status}'`;
    
    // Add date filter for Posted/Rejected status
    if (filter.status === InvoiceReturnStatus.Completed || filter.status === InvoiceReturnStatus.Rejected) {
      const fromDate = this.formatDate(filter.fromDate);
      const toDate = this.formatDate(filter.toDate);
      queryFilter += ` AND Date BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    const params = {
      filter: queryFilter,
      orderby: 'Date DESC'
    };
    
    return from(this.http.getData('qryInvoiceApprovals', params)).pipe(
      map((data: any) => {
        return data.map((item:any, index:number) => ({
          ...item,
          SNO: index + 1,
          Date: new Date(item.Date)
        }));
      }),
      catchError(error => {
        console.error('Error fetching invoice return approvals:', error);
        throw error;
      })
    );
  }

  /**
   * Get invoice return approval details for selected approval
   * Equivalent to VB6 grdData_SelectionChange function
   */
  getInvoiceReturnApprovalDetails(approvalId: number): Observable<InvoiceReturnApprovalDetail[]> {
    const params = {
      filter: `InvoiceApprovalID=${approvalId}`
    };
    
    return from(this.http.getData('qryInvoiceApprovalDetails', params)).pipe(
      map((data: any) => data),
      catchError(error => {
        console.error('Error fetching invoice return approval details:', error);
        throw error;
      })
    );
  }

  /**
   * Forward approval to another department
   * Equivalent to VB6 btnForward_Click
   */
  forwardApproval(approvalId: number, forwardTo: UserDepartments): Observable<boolean> {
    const updateData = {
      forwardedto: forwardTo
    };
    
    return from(this.http.putData(`InvoiceApprovals/${approvalId}`, updateData)).pipe(
      map(() => true),
      catchError((error: any) => {
        console.error('Error forwarding approval:', error);
        throw error;
      })
    );
  }

  /**
   * Reject approval with remarks
   * Equivalent to VB6 btnReject_Click
   */
  rejectApproval(approvalId: number, rejectionReason: string): Observable<boolean> {
    const updateData = {
      Status: 'Rejected',
      remarks: rejectionReason
    };
    
    return from(this.http.putData(`InvoiceApprovals/${approvalId}`, updateData)).pipe(
      map(() => true),
      catchError((error: any) => {
        console.error('Error rejecting approval:', error);
        throw error;
      })
    );
  }

  /**
   * Approve/Complete approval
   * Custom method to complete the approval process
   */
  approveInvoiceReturn(approvalId: number, remarks?: string): Observable<boolean> {
    const updateData: any = {
      Status: 'Completed'
    };
    
    if (remarks) {
      updateData.remarks = remarks;
    }
    
    return from(this.http.putData(`InvoiceApprovals/${approvalId}`, updateData)).pipe(
      map(() => true),
      catchError((error: any) => {
        console.error('Error approving invoice return:', error);
        throw error;
      })
    );
  }

  /**
   * Print approval form
   * Equivalent to VB6 btnEdit_Click (Print functionality)
   */
  printApprovalForm(approvalId: number): Observable<any> {
    // This would typically generate a report or open print dialog
    // Implementation depends on your reporting system
    return new Observable(observer => {
      // Placeholder for print functionality
      console.log(`Printing approval form for ID: ${approvalId}`);
      observer.next({ success: true });
      observer.complete();
    });
  }

  /**
   * Add remarks to approval
   * Equivalent to double-click functionality in VB6 form
   */
  addRemarks(approvalId: number, newRemarks: string): Observable<boolean> {
    const updateData = {
      remarks: newRemarks
    };
    
    return from(this.http.putData(`InvoiceApprovals/${approvalId}`, updateData)).pipe(
      map(() => true),
      catchError((error: any) => {
        console.error('Error adding remarks:', error);
        throw error;
      })
    );
  }

  /**
   * Get user department permissions
   * Equivalent to VB6 department checking logic
   */
  getUserPermissions(): { canReject: boolean; canForward: boolean; canApprove: boolean } {
    const userDept = this.http.getUserDept() || UserDepartments.grpSales;
    
    const canReject = [
      UserDepartments.grpCEO, 
      UserDepartments.grpOperations, 
      UserDepartments.grpGM
    ].includes(userDept);
    
    const canForward = [
      UserDepartments.grpCEO, 
      UserDepartments.grpOperations, 
      UserDepartments.grpGM
    ].includes(userDept);
    
    const canApprove = [
      UserDepartments.grpCEO, 
      UserDepartments.grpOperations, 
      UserDepartments.grpGM,
      UserDepartments.grpAccounts
    ].includes(userDept);

    return { canReject, canForward, canApprove };
  }

  /**
   * Get current user department
   */
  getCurrentUserDepartment(): UserDepartments {
    return this.http.getUserDept() || UserDepartments.grpSales;
  }

  /**
   * Format date for SQL query
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get departments for forwarding
   */
  getDepartments(): Observable<{ id: UserDepartments; name: string }[]> {
    const departments = [
      { id: UserDepartments.grpCEO, name: 'CEO' },
      { id: UserDepartments.grpOperations, name: 'Operations' },
      { id: UserDepartments.grpGM, name: 'General Manager' },
      { id: UserDepartments.grpAccounts, name: 'Accounts' },
      { id: UserDepartments.grpSales, name: 'Sales' },
      { id: UserDepartments.grpProduction, name: 'Production' },
      { id: UserDepartments.grpQC, name: 'Quality Control' },
      { id: UserDepartments.grpProcurement, name: 'Procurement' }
    ];
    
    return of(departments);
  }

  /**
   * Load invoice return approval form
   * This would typically open the form dialog
   */
  loadInvoiceReturnApprovalForm(): void {
    // This method would be implemented to open the form dialog
    // Similar to VB6 LoadForm frmInvoiceApprovalFormRet
    console.log('Loading Invoice Return Approval Form...');
  }
}