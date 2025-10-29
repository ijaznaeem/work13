import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { FirstDayOfMonth } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDate } from '../../../factories/utilities';
import { 
  InvoiceReturnApproval, 
  InvoiceReturnApprovalDetail, 
  InvoiceReturnApprovalView, 
  InvoiceReturnStatus, 
  FilterCriteria, 
  InvoiceReturnApprovalsState,
  GridColumn
} from './invoice-return-approvals.interface';
import { InvoiceReturnApprovalsService } from './invoice-return-approvals.service';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { MyToastService } from '../../../services/toaster.server';
import { UserDepartments } from '../../../config/constants';

@Component({
  selector: 'app-invoice-return-approvals',
  templateUrl: './invoice-return-approvals.component.html',
  styleUrls: ['./invoice-return-approvals.component.scss']
})
export class InvoiceReturnApprovalsComponent implements OnInit {
  @ViewChild('grdData') grdData!: DataGridComponent;
  @ViewChild('grdDetails') grdDetails!: DataGridComponent;

  // Form for filters
  filterForm!: FormGroup;
  
  // Data arrays
  approvals: InvoiceReturnApprovalView[] = [];
  approvalDetails: InvoiceReturnApprovalDetail[] = [];
  
  // Component state
  state: InvoiceReturnApprovalsState = {
    loading: false,
    selectedApproval: null,
    selectedDetails: [],
    filterCriteria: {
      fromDate: new Date(FirstDayOfMonth()),
      toDate: new Date(GetDate()),
      status: InvoiceReturnStatus.Completed
    },
    userDepartment: UserDepartments.grpSales,
    canApprove: false,
    canReject: false,
    canForward: false
  };

  // Grid columns for main approvals grid
  approvalColumns: any[] = [
    { field: 'SNO', headerText: 'S.No', width: 60, Type: 'number' },
    { field: 'Date', headerText: 'Date', width: 100, Type: 'date' },
    { field: 'CustomerName', headerText: 'Customer Name', width: 200, Type: 'text' },
    { field: 'Address', headerText: 'Address', width: 150, Type: 'text' },
    { field: 'Amount', headerText: 'Amount', width: 100, Type: 'currency' },
    { field: 'Discount', headerText: 'Discount', width: 100, Type: 'currency' },
    { field: 'NetAmount', headerText: 'Net Amount', width: 100, Type: 'currency' },
    { field: 'ForwardedToName', headerText: 'Forwarded To', width: 120, Type: 'text' },
    { field: 'Status', headerText: 'Status', width: 100, Type: 'status' }
  ];

  // Grid columns for detail items grid
  detailColumns: any[] = [
    { field: 'ProductName', headerText: 'Product Name', width: 200, Type: 'text' },
    { field: 'Qty', headerText: 'Qty', width: 80, Type: 'number' },
    { field: 'Bonus', headerText: 'Bonus', width: 80, Type: 'number' },
    { field: 'SPrice', headerText: 'S.Price', width: 100, Type: 'currency' },
    { field: 'Amount', headerText: 'Amount', width: 100, Type: 'currency' },
    { field: 'Discount', headerText: 'Discount', width: 100, Type: 'currency' },
    { field: 'NetAmount', headerText: 'Net Amount', width: 100, Type: 'currency' }
  ];

  // Status options
  statusOptions = Object.values(InvoiceReturnStatus);
  
  // Selected remarks for display
  selectedRemarks = '';

  public bsModalRef!: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private invoiceReturnService: InvoiceReturnApprovalsService,
    private toast: MyToastService,
    private modalService: BsModalService
  ) {
    this.initializeForm();
    this.setUserPermissions();
  }

  ngOnInit(): void {
    // Initialize default dates if not already set
    this.setDefaultDates();
    // Don't auto-load data on init - user must click Load Data button
  }

  /**
   * Set default dates (first day of month to current date)
   */
  private setDefaultDates(): void {
    if (!this.state.filterCriteria.fromDate) {
      this.state.filterCriteria.fromDate = new Date(FirstDayOfMonth());
    }
    if (!this.state.filterCriteria.toDate) {
      this.state.filterCriteria.toDate = new Date(GetDate());
    }
    
    // Update form with current dates if form is already initialized
    if (this.filterForm) {
      this.filterForm.patchValue({
        fromDate: this.formatDateForInput(this.state.filterCriteria.fromDate),
        toDate: this.formatDateForInput(this.state.filterCriteria.toDate)
      });
    }
  }

  /**
   * Initialize the filter form
   */
  private initializeForm(): void {
    // Ensure dates are properly formatted for HTML date inputs
    const fromDate = this.formatDateForInput(this.state.filterCriteria.fromDate);
    const toDate = this.formatDateForInput(this.state.filterCriteria.toDate);
    
    this.filterForm = this.fb.group({
      fromDate: [fromDate, Validators.required],
      toDate: [toDate, Validators.required],
      status: [this.state.filterCriteria.status, Validators.required]
    });
  }

  /**
   * Set user permissions based on department
   * Matches VB6 Form_Load logic
   */
  private setUserPermissions(): void {
    const permissions = this.invoiceReturnService.getUserPermissions();
    this.state.canReject = permissions.canReject;
    this.state.canForward = permissions.canForward;
    this.state.canApprove = permissions.canApprove;
    this.state.userDepartment = this.invoiceReturnService.getCurrentUserDepartment();
  }

  /**
   * Get first day of current month
   * Using the shared utility function for consistency
   */
  private getFirstDayOfMonth(): Date {
    return new Date(FirstDayOfMonth());
  }

  /**
   * Get current date
   * Using the shared utility function for consistency
   */
  private getCurrentDate(): Date {
    return new Date(GetDate());
  }

  /**
   * Format date for HTML date input (YYYY-MM-DD)
   */
  private formatDateForInput(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Parse date from HTML date input
   */
  private parseDateFromInput(dateString: string): Date {
    if (!dateString) return new Date();
    return new Date(dateString + 'T00:00:00.000Z');
  }

  /**
   * Load invoice return approvals based on current filter
   * Equivalent to VB6 ShowData() function
   */
  loadApprovals(): void {
    if (this.filterForm && this.filterForm.invalid) {
      return;
    }

    this.state.loading = true;
    
    // Update filter criteria from form values
    const formValues = this.filterForm?.value || {};
    this.state.filterCriteria = {
      fromDate: formValues.fromDate ? this.parseDateFromInput(formValues.fromDate) : new Date(FirstDayOfMonth()),
      toDate: formValues.toDate ? this.parseDateFromInput(formValues.toDate) : new Date(GetDate()),
      status: formValues.status || InvoiceReturnStatus.Completed
    };

    this.invoiceReturnService.getInvoiceReturnApprovals(this.state.filterCriteria)
      .subscribe({
        next: (approvals) => {
          this.approvals = approvals;
          this.state.loading = false;
          
          // Update data grid
          if (this.grdData) {
            this.grdData.SetDataSource(this.approvals);
          }
          
          // Clear details and remarks when data changes
          this.approvalDetails = [];
          this.selectedRemarks = '';
          this.state.selectedApproval = null;
        },
        error: (error) => {
          console.error('Error loading approvals:', error);
          this.toast.Error('Error loading invoice return approvals', 'Error');
          this.state.loading = false;
        }
      });
  }

  /**
   * Handle approval selection change
   * Equivalent to VB6 grdData_SelectionChange
   */
  onApprovalSelectionChange(selectedItems: any[]): void {
    if (selectedItems && selectedItems.length > 0) {
      const selectedApproval = selectedItems[0] as InvoiceReturnApprovalView;
      this.state.selectedApproval = selectedApproval;
      this.selectedRemarks = selectedApproval.Remarks || '';
      
      // Load approval details
      this.loadApprovalDetails(selectedApproval.InvoiceApprovalID);
    } else {
      this.state.selectedApproval = null;
      this.selectedRemarks = '';
      this.approvalDetails = [];
      
      if (this.grdDetails) {
        this.grdDetails.SetDataSource([]);
      }
    }
  }

  /**
   * Load details for selected approval
   */
  private loadApprovalDetails(approvalId: number): void {
    this.invoiceReturnService.getInvoiceReturnApprovalDetails(approvalId)
      .subscribe({
        next: (details) => {
          this.approvalDetails = details;
          this.state.selectedDetails = details;
          
          // Update details grid
          if (this.grdDetails) {
            this.grdDetails.SetDataSource(this.approvalDetails);
          }
        },
        error: (error) => {
          console.error('Error loading approval details:', error);
          this.toast.Error('Error loading approval details', 'Error');
        }
      });
  }

  /**
   * Add new invoice return approval
   * Equivalent to VB6 btnadd_Click
   */
  addApproval(): void {
    // This would typically open the invoice approval form
    this.invoiceReturnService.loadInvoiceReturnApprovalForm();
    this.toast.Info('Add Invoice Return Approval form will be opened here', 'Info');
    // After form closes, refresh data
    this.loadApprovals();
  }

  /**
   * Forward approval to another department
   * Equivalent to VB6 btnForward_Click
   */
  forwardApproval(): void {
    if (!this.state.selectedApproval) {
      this.toast.Warning('Please select an approval to forward', 'Warning');
      return;
    }

    swal({
      title: 'Forward Approval',
      text: 'Are you sure you want to forward this approval to Accounts department?',
      icon: 'warning',
      buttons: [true, 'Yes, Forward'],
      dangerMode: false,
    }).then((willForward) => {
      if (willForward) {
        this.invoiceReturnService.forwardApproval(
          this.state.selectedApproval!.InvoiceApprovalID, 
          UserDepartments.grpAccounts
        ).subscribe({
          next: () => {
            this.toast.Sucess('Approval forwarded to Accounts', 'Success');
            this.loadApprovals();
          },
          error: (error) => {
            console.error('Error forwarding approval:', error);
            this.toast.Error('Error forwarding approval', 'Error');
          }
        });
      }
    });
  }

  /**
   * Reject selected approval with reason
   * Equivalent to VB6 btnReject_Click
   */
  rejectApproval(): void {
    if (!this.state.selectedApproval) {
      this.toast.Warning('Please select an approval to reject', 'Warning');
      return;
    }

    swal({
      title: 'Reject Approval',
      text: 'Are you sure you want to reject this approval?',
      icon: 'warning',
      buttons: [true, 'Yes, Reject'],
      dangerMode: true,
    }).then((willReject) => {
      if (willReject) {
        swal({
          title: 'Rejection Reason',
          text: 'Please provide a reason for rejection:',
          content: {
            element: 'input',
            attributes: {
              placeholder: 'Enter rejection reason...',
              type: 'text',
            },
          },
          buttons: [true, 'Submit'],
        }).then((reason) => {
          if (reason && reason.trim()) {
            this.invoiceReturnService.rejectApproval(
              this.state.selectedApproval!.InvoiceApprovalID, 
              reason.trim()
            ).subscribe({
              next: () => {
                this.toast.Success('Approval rejected successfully', 'Success');
                this.loadApprovals();
              },
              error: (error) => {
                console.error('Error rejecting approval:', error);
                this.toast.Error('Error rejecting approval', 'Error');
              }
            });
          } else {
            this.toast.Warning('Rejection reason is required', 'Warning');
          }
        });
      }
    });
  }

  /**
   * Print approval form
   * Equivalent to VB6 btnEdit_Click (Print functionality)
   */
  printApproval(): void {
    if (!this.state.selectedApproval) {
      this.toast.Warning('Please select an approval to print', 'Warning');
      return;
    }

    this.invoiceReturnService.printApprovalForm(this.state.selectedApproval.InvoiceApprovalID)
      .subscribe({
        next: () => {
          this.toast.Success('Print initiated', 'Success');
        },
        error: (error) => {
          console.error('Error printing approval:', error);
          this.toast.Error('Error printing approval', 'Error');
        }
      });
  }

  /**
   * Add remarks to selected approval
   * Equivalent to VB6 double-click functionality
   */
  addRemarks(): void {
    if (!this.state.selectedApproval) {
      this.toast.Warning('Please select an approval to add remarks', 'Warning');
      return;
    }

    swal({
      title: 'Add Remarks',
      text: 'Enter additional remarks:',
      content: {
        element: 'textarea',
        attributes: {
          placeholder: 'Enter your remarks here...',
          rows: 4,
          cols: 50,
        },
      },
      buttons: [true, 'Add Remarks'],
    }).then((remarks) => {
      if (remarks && remarks.trim()) {
        this.invoiceReturnService.addRemarks(
          this.state.selectedApproval!.InvoiceApprovalID, 
          remarks.trim()
        ).subscribe({
          next: () => {
            this.toast.Success('Remarks added successfully', 'Success');
            this.loadApprovals();
          },
          error: (error) => {
            console.error('Error adding remarks:', error);
            this.toast.Error('Error adding remarks', 'Error');
          }
        });
      }
    });
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
   * Format date for display in dd-MMM-yyyy format
   */
  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return '';
    }
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    
    return `${day}-${month}-${year}`;
  }

  /**
   * Track by function for ngFor performance
   */
  trackByApprovalId(index: number, item: InvoiceReturnApprovalView): number {
    return item.InvoiceApprovalID;
  }

  /**
   * Track by function for details grid
   */
  trackByDetailId(index: number, item: InvoiceReturnApprovalDetail): number {
    return item.DetailID;
  }

  /**
   * Handle grid row double-click to add remarks
   */
  onRowDoubleClick(): void {
    this.addRemarks();
  }

  /**
   * Check if current user can perform action
   */
  canPerformAction(action: 'reject' | 'forward' | 'approve'): boolean {
    switch (action) {
      case 'reject':
        return this.state.canReject;
      case 'forward':
        return this.state.canForward;
      case 'approve':
        return this.state.canApprove;
      default:
        return false;
    }
  }

  /**
   * Get CSS class for status
   */
  getStatusClass(status: InvoiceReturnStatus): string {
    switch (status) {
      case InvoiceReturnStatus.InProcess:
        return 'badge badge-warning';
      case InvoiceReturnStatus.Completed:
        return 'badge badge-success';
      case InvoiceReturnStatus.Rejected:
        return 'badge badge-danger';
      default:
        return 'badge badge-secondary';
    }
  }

  /**
   * Get formatted date range string for display
   */
  getDateRangeText(): string {
    const fromDate = this.formatDate(this.state.filterCriteria.fromDate);
    const toDate = this.formatDate(this.state.filterCriteria.toDate);
    return `${fromDate} to ${toDate}`;
  }

  /**
   * Check if current dates are default (first of month to today)
   */
  isUsingDefaultDates(): boolean {
    const defaultFromDate = this.formatDateForInput(new Date(FirstDayOfMonth()));
    const defaultToDate = this.formatDateForInput(new Date(GetDate()));
    const currentFromDate = this.formatDateForInput(this.state.filterCriteria.fromDate);
    const currentToDate = this.formatDateForInput(this.state.filterCriteria.toDate);
    
    return currentFromDate === defaultFromDate && currentToDate === defaultToDate;
  }

  /**
   * Get readable date range description
   */
  getDateRangeDescription(): string {
    if (this.isUsingDefaultDates()) {
      return 'Current month to date';
    }
    return this.getDateRangeText();
  }
}