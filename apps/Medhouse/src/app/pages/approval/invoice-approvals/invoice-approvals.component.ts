import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../services/httpbase.service';
import { 
  InvoiceApproval, 
  InvoiceApprovalDetail, 
  InvoiceApprovalFilter,
  INVOICE_APPROVAL_STATUSES,
  UserDepartments 
} from './invoice-approval.interface';
import { InvoiceApprovalService } from './invoice-approval.service';
import { InvoiceApprovalFormComponent } from '../invoice-approval-form/invoice-approval-form.component';

@Component({
  selector: 'app-invoice-approvals',
  templateUrl: './invoice-approvals.component.html',
  styleUrls: ['./invoice-approvals.component.scss']
})
export class InvoiceApprovalsComponent implements OnInit {

  filterForm!: FormGroup;
  invoiceApprovals: InvoiceApproval[] = [];
  invoiceApprovalDetails: InvoiceApprovalDetail[] = [];
  selectedApproval: InvoiceApproval | null = null;
  selectedRemarks: string = '';
  
  statuses = INVOICE_APPROVAL_STATUSES;
  loading = false;
  
  // Department-based permissions (matching VB6 logic)
  canReject = false;
  canForward = false;
  currentDepartment: number = 1; // This should come from user service

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private http: HttpBase,
    private invoiceApprovalService: InvoiceApprovalService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setDepartmentPermissions();
    this.setDefaultDates();
    this.loadInvoiceApprovals();
  }

  /**
   * Initialize reactive form for filters
   */
  private initializeForm(): void {
    this.filterForm = this.fb.group({
      dateFrom: [new Date()],
      dateTo: [new Date()],
      status: ['Completed'] // Default to 'Completed' as in VB6
    });
  }

  /**
   * Set default date range (first day of month to today)
   * Matches VB6 Form_Load logic
   */
  private setDefaultDates(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.filterForm.patchValue({
      dateFrom: firstDayOfMonth,
      dateTo: today
    });
  }

  /**
   * Set department-based permissions
   * Matches VB6 Form_Load permission logic
   */
  private setDepartmentPermissions(): void {
    // In VB6: If Not (nDepartment = grpceo Or nDepartment = grpOperations Or nDepartment = grpGM)
    this.canReject = (
      this.currentDepartment === UserDepartments.grpCEO ||
      this.currentDepartment === UserDepartments.grpOperations ||
      this.currentDepartment === UserDepartments.grpGM
    );
    this.canForward = this.canReject;
  }

  /**
   * Load invoice approvals data
   * Matches VB6 ShowData() method
   */
  loadInvoiceApprovals(): void {
    if (this.filterForm.invalid) {
      return;
    }

    this.loading = true;
    const filter: InvoiceApprovalFilter = {
      dateFrom: this.filterForm.value.dateFrom,
      dateTo: this.filterForm.value.dateTo,
      status: this.filterForm.value.status
    };

    this.invoiceApprovalService.getInvoiceApprovals(filter).subscribe({
      next: (data) => {
        this.invoiceApprovals = data;
        this.loading = false;
        // Clear selection when data reloads
        this.selectedApproval = null;
        this.invoiceApprovalDetails = [];
        this.selectedRemarks = '';
      },
      error: (error) => {
        console.error('Error loading invoice approvals:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Handle approval selection change
   * Matches VB6 grdData_SelectionChange logic
   */
  onApprovalSelectionChange(approval: InvoiceApproval): void {
    this.selectedApproval = approval;
    this.selectedRemarks = approval.Remarks || '';
    this.loadApprovalDetails(approval.InvoiceApprovalID);
  }

  /**
   * Load approval details for selected invoice
   * Matches VB6 grdData_SelectionChange details loading
   */
  private loadApprovalDetails(invoiceApprovalId: number): void {
    this.invoiceApprovalService.getInvoiceApprovalDetails(invoiceApprovalId).subscribe({
      next: (details) => {
        this.invoiceApprovalDetails = details;
      },
      error: (error) => {
        console.error('Error loading approval details:', error);
        this.invoiceApprovalDetails = [];
      }
    });
  }

  /**
   * Forward approval to accounts department
   * Matches VB6 btnForward_Click logic
   */
  forwardApproval(): void {
    if (!this.selectedApproval) {
      alert('No row selected');
      return;
    }

    if (confirm('Are you sure?')) {
      this.invoiceApprovalService.forwardApproval(
        this.selectedApproval.InvoiceApprovalID, 
        UserDepartments.grpAccounts
      ).subscribe({
        next: () => {
          alert('Approval Forwarded to Account');
          this.loadInvoiceApprovals();
        },
        error: (error) => {
          console.error('Error forwarding approval:', error);
          alert('Error forwarding approval');
        }
      });
    }
  }

  /**
   * Reject approval with reason
   * Matches VB6 btnReject_Click logic
   */
  rejectApproval(): void {
    if (!this.selectedApproval) {
      alert('Select Invoice to reject');
      return;
    }

    if (confirm('Are you sure?')) {
      const rejectionReason = prompt('Please give rejection reason');
      if (rejectionReason && rejectionReason.trim()) {
        this.invoiceApprovalService.rejectApproval(
          this.selectedApproval.InvoiceApprovalID,
          rejectionReason
        ).subscribe({
          next: () => {
            this.loadInvoiceApprovals();
          },
          error: (error) => {
            console.error('Error rejecting approval:', error);
            alert('Error rejecting approval');
          }
        });
      }
    }
  }

  /**
   * Print approval form
   * Matches VB6 btnEdit_Click (Print) logic
   */
  printApproval(): void {
    if (!this.selectedApproval) {
      alert('No row selected');
      return;
    }

    this.invoiceApprovalService.printApprovalForm(this.selectedApproval.InvoiceApprovalID).subscribe({
      next: (pdfBlob) => {
        // Create blob URL and open in new window
        const url = window.URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error printing approval:', error);
        alert('Error printing approval');
      }
    });
  }

  /**
   * Add new approval
   * Matches VB6 btnadd_Click logic (references frmInvoiceApprovalForm)
   */
  addApproval(): void {
    const modalRef: BsModalRef = this.modalService.show(InvoiceApprovalFormComponent, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-xl'
    });

    // Subscribe to modal result if needed
    modalRef.onHide?.subscribe(() => {
      // Refresh data after modal closes
      this.loadInvoiceApprovals();
    });
  }

  /**
   * Handle status filter change
   * Matches VB6 cmbStatus_Click logic
   */
  onStatusChange(): void {
    this.loadInvoiceApprovals();
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge bg-success';
      case 'rejected': return 'badge bg-danger';
      case 'in process': return 'badge bg-warning text-dark';
      default: return 'badge bg-secondary';
    }
  }

  /**
   * TrackBy function for invoice approvals
   */
  trackByApprovalId(index: number, item: InvoiceApproval): number {
    return item.InvoiceApprovalID;
  }

  /**
   * TrackBy function for invoice approval details
   */
  trackByDetailId(index: number, item: InvoiceApprovalDetail): number {
    return item.DetailID || index;
  }
}