import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { FirstDayOfMonth } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDate } from '../../../factories/utilities';
import { 
  CashTransferApproval, 
  CashTransferApprovalView, 
  CashTransferStatus, 
  CashTransferFilterCriteria, 
  CashTransferApprovalsState,
  CashTransferGridColumn,
  Customer,
  Department
} from './cash-transfer-approvals.interface';
import { CashTransferApprovalsService } from './cash-transfer-approvals.service';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { MyToastService } from '../../../services/toaster.server';
import { UserDepartments } from '../../../config/constants';

@Component({
  selector: 'app-cash-transfer-approvals',
  templateUrl: './cash-transfer-approvals.component.html',
  styleUrls: ['./cash-transfer-approvals.component.scss']
})
export class CashTransferApprovalsComponent implements OnInit {
  @ViewChild('grdData') grdData!: DataGridComponent;



  // Form for filters
  filterForm!: FormGroup;
  
  // Form for cash transfer creation
  cashTransferForm!: FormGroup;
  
  // Data arrays
  approvals: CashTransferApprovalView[] = [];
  customers: Customer[] = [];
  departments: Department[] = [];
  
  // Form state
  showForm: boolean = false;
  formSubmitting: boolean = false;
  
  // Component state
  state: CashTransferApprovalsState = {
    loading: false,
    selectedApproval: null,
    filterCriteria: {
      fromDate: new Date(FirstDayOfMonth()),
      toDate: new Date(GetDate()),
      status: CashTransferStatus.InProgress
    },
    userDepartment: UserDepartments.grpSales,
    canApprove: false,
    canReject: false,
    canForward: false,
    canPost: false,
    canAdd: false
  };

  // Grid columns for cash transfer approvals
  approvalColumns: any[] = [
    { field: 'Date', headerText: 'Date', width: 100, Type: 'date' },
    { field: 'ApprovalID', headerText: 'Approval ID', width: 100, Type: 'number' },
    { field: 'Description', headerText: 'Description', width: 200, Type: 'text' },
    { field: 'Amount', headerText: 'Amount', width: 120, Type: 'currency' },
    { field: 'TransferredFrom', headerText: 'Transfer From', width: 150, Type: 'text' },
    { field: 'FromBalance', headerText: 'From Balance', width: 120, Type: 'currency' },
    { field: 'FromBalAfterTrans', headerText: 'From Bal. After', width: 120, Type: 'currency' },
    { field: 'TransferredTo', headerText: 'Transfer To', width: 150, Type: 'text' },
    { field: 'ToBalance', headerText: 'To Balance', width: 120, Type: 'currency' },
    { field: 'ToBalAfterTrans', headerText: 'To Bal. After', width: 120, Type: 'currency' },
    { field: 'Status', headerText: 'Status', width: 100, Type: 'status' },
    { field: 'ForwardedToName', headerText: 'Forwarded To', width: 120, Type: 'text' }
  ];

  // Status options from enum
  statusOptions = Object.values(CashTransferStatus);

  public bsModalRef!: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private cashTransferService: CashTransferApprovalsService,
    private toast: MyToastService,
    private modalService: BsModalService
  ) {
    this.initializeForm();
    this.setUserPermissions();
  }

  ngOnInit(): void {
    // Initialize default dates and permissions
    this.setDefaultDates();
    this.loadInitialData();
  }

  /**
   * Set default dates based on user department
   * Equivalent to VB6 Form_Load date initialization
   */
  private setDefaultDates(): void {
    const defaultFilter = this.cashTransferService.getDefaultFilterForUser();
    this.state.filterCriteria = defaultFilter;
    
    // Update form with current dates
    if (this.filterForm) {
      this.filterForm.patchValue({
        fromDate: this.formatDateForInput(this.state.filterCriteria.fromDate),
        toDate: this.formatDateForInput(this.state.filterCriteria.toDate),
        status: this.state.filterCriteria.status
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

    // Initialize cash transfer form
    this.cashTransferForm = this.fb.group({
      date: [this.formatDateForInput(new Date()), Validators.required],
      transferFromId: ['', Validators.required],
      transferToId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  /**
   * Set user permissions based on department
   * Matches VB6 Form_Load permission logic
   */
  private setUserPermissions(): void {
    const permissions = this.cashTransferService.getUserPermissions();
    this.state.canReject = permissions.canReject;
    this.state.canForward = permissions.canForward;
    this.state.canApprove = permissions.canApprove;
    this.state.canPost = permissions.canPost;
    this.state.canAdd = permissions.canAdd;
    this.state.userDepartment = this.cashTransferService.getCurrentUserDepartment();
  }

  /**
   * Load initial data (customers, departments, etc.)
   */
  private loadInitialData(): void {
    // Load customers for dropdown selections
    this.cashTransferService.getCustomersForTransfer()
      .subscribe({
        next: (customers) => {
          this.customers = customers;
        },
        error: (error) => {
          console.error('Error loading customers:', error);
        }
      });

    // Load departments for forwarding
    this.cashTransferService.getDepartments()
      .subscribe({
        next: (departments) => {
          this.departments = departments;
        },
        error: (error) => {
          console.error('Error loading departments:', error);
        }
      });
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
   * Load cash transfer approvals based on current filter
   * Equivalent to VB6 ShowData() function
   */
  loadApprovals(): void {
    if (this.filterForm && this.filterForm.invalid) {
      this.toast.Warning('Please check your filter criteria', 'Invalid Filter');
      return;
    }

    this.state.loading = true;
    
    // Update filter criteria from form values
    const formValues = this.filterForm?.value || {};
    this.state.filterCriteria = {
      fromDate: formValues.fromDate ? this.parseDateFromInput(formValues.fromDate) : new Date(FirstDayOfMonth()),
      toDate: formValues.toDate ? this.parseDateFromInput(formValues.toDate) : new Date(GetDate()),
      status: formValues.status || CashTransferStatus.InProgress
    };

    this.cashTransferService.getCashTransferApprovals(this.state.filterCriteria)
      .subscribe({
        next: (approvals) => {
          this.approvals = approvals;
          this.state.loading = false;
          
          // Update data grid
          if (this.grdData) {
            this.grdData.SetDataSource(this.approvals);
          }
          
          // Clear selection when data changes
          this.state.selectedApproval = null;
          
          if (approvals.length === 0) {
            this.toast.Info('No approvals found for the selected criteria', 'No Data');
          }
        },
        error: (error) => {
          console.error('Error loading approvals:', error);
          this.toast.Error('Error loading cash transfer approvals', 'Error');
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
      this.state.selectedApproval = selectedItems[0] as CashTransferApprovalView;
    } else {
      this.state.selectedApproval = null;
    }
  }

  /**
   * Add new cash transfer approval
   * Equivalent to VB6 btnadd_Click
   */
  addApproval(): void {
    if (!this.state.canAdd) {
      this.toast.Warning('You do not have permission to add approvals', 'Access Denied');
      return;
    }

    // This would typically open the cash transfer approval dialog
    this.cashTransferService.loadCashTransferApprovalForm();
    this.toast.Info('Add Cash Transfer Approval form will be opened here', 'Info');
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

    if (!this.state.canForward) {
      this.toast.Warning('You do not have permission to forward approvals', 'Access Denied');
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
        this.cashTransferService.forwardApproval(
          this.state.selectedApproval!.ApprovalID, 
          UserDepartments.grpAccounts
        ).subscribe({
          next: (success) => {
            if (success) {
              this.toast.Sucess('Approval forwarded to Accounts', 'Success');
              this.loadApprovals();
            } else {
              this.toast.Error('Failed to forward approval', 'Error');
            }
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

    if (!this.state.canReject) {
      this.toast.Warning('You do not have permission to reject approvals', 'Access Denied');
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
            this.cashTransferService.rejectApproval(
              this.state.selectedApproval!.ApprovalID, 
              reason.trim()
            ).subscribe({
              next: (success) => {
                if (success) {
                  this.toast.Success('Approval rejected successfully', 'Success');
                  this.loadApprovals();
                } else {
                  this.toast.Error('Failed to reject approval', 'Error');
                }
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

    this.cashTransferService.printApprovalForm(this.state.selectedApproval.ApprovalID)
      .subscribe({
        next: (success) => {
          if (success) {
            this.toast.Success('Print initiated', 'Success');
          } else {
            this.toast.Error('Failed to print approval', 'Error');
          }
        },
        error: (error) => {
          console.error('Error printing approval:', error);
          this.toast.Error('Error printing approval', 'Error');
        }
      });
  }

  /**
   * Post approved cash transfer (for accounts department)
   * Equivalent to VB6 grdData_DblClick functionality
   */
  postApproval(): void {
    if (!this.state.selectedApproval) {
      this.toast.Warning('Please select an approval to post', 'Warning');
      return;
    }

    if (!this.state.canPost) {
      this.toast.Warning('You do not have permission to post approvals', 'Access Denied');
      return;
    }

    if (this.state.selectedApproval.Status !== CashTransferStatus.Approved) {
      this.toast.Warning('Only approved transfers can be posted', 'Invalid Status');
      return;
    }

    swal({
      title: 'Post Cash Transfer',
      text: 'Are you sure you want to post this cash transfer to accounts?',
      icon: 'warning',
      buttons: [true, 'Yes, Post'],
      dangerMode: false,
    }).then((willPost) => {
      if (willPost) {
        this.cashTransferService.postApproval(this.state.selectedApproval!.ApprovalID)
          .subscribe({
            next: (success) => {
              if (success) {
                this.toast.Success('Cash Transfer Posted', 'Success');
                this.loadApprovals();
              } else {
                this.toast.Error('Failed to post cash transfer', 'Error');
              }
            },
            error: (error) => {
              console.error('Error posting approval:', error);
              this.toast.Error('Error posting cash transfer', 'Error');
            }
          });
      }
    });
  }

  /**
   * Handle grid row double-click to post (for accounts users)
   */
  onRowDoubleClick(): void {
    if (this.isAccountsDepartment() && 
        this.state.selectedApproval && 
        this.state.selectedApproval.Status === CashTransferStatus.Approved) {
      this.postApproval();
    }
  }

  /**
   * Check if current user can perform action
   */
  canPerformAction(action: 'reject' | 'forward' | 'post' | 'add'): boolean {
    switch (action) {
      case 'reject':
        return this.state.canReject;
      case 'forward':
        return this.state.canForward;
      case 'post':
        return this.state.canPost;
      case 'add':
        return this.state.canAdd;
      default:
        return false;
    }
  }

  /**
   * Get CSS class for status
   */
  getStatusClass(status: CashTransferStatus): string {
    switch (status) {
      case CashTransferStatus.InProgress:
        return 'badge badge-warning';
      case CashTransferStatus.Approved:
        return 'badge badge-success';
      case CashTransferStatus.Posted:
        return 'badge badge-primary';
      case CashTransferStatus.Rejected:
        return 'badge badge-danger';
      case CashTransferStatus.Cancelled:
        return 'badge badge-secondary';
      default:
        return 'badge badge-light';
    }
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
  trackByApprovalId(index: number, item: CashTransferApprovalView): number {
    return item.ApprovalID;
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
   * Get readable status description for user interface
   */
  getStatusDescription(): string {
    const status = this.state.filterCriteria.status;

    if (this.isAccountsDepartment() && status === CashTransferStatus.Approved) {
      return 'Double click to post approved transfers';
    } else {
      return 'Double click to view details';
    }
  }

  /**
   * Export current approvals to Excel
   */
  exportToExcel(): void {
    this.cashTransferService.exportToExcel(this.state.filterCriteria)
      .subscribe({
        next: (success) => {
          if (success) {
            this.toast.Success('Export completed successfully', 'Success');
          } else {
            this.toast.Error('Failed to export data', 'Error');
          }
        },
        error: (error) => {
          console.error('Error exporting to Excel:', error);
          this.toast.Error('Error exporting to Excel', 'Error');
        }
      });
  }

  /**
   * Check if user is from Accounts department
   */
  isAccountsDepartment(): boolean {
    return this.state.userDepartment === UserDepartments.grpAccounts;
  }

  /**
   * Check if user is from Sales department
   */
  isSalesDepartment(): boolean {
    return this.state.userDepartment === UserDepartments.grpSales;
  }

  /**
   * Show cash transfer form
   */
  showCashTransferForm(): void {
    this.showForm = true;
    this.loadCustomers();
  }

  /**
   * Hide cash transfer form
   */
  hideCashTransferForm(): void {
    this.showForm = false;
    this.cashTransferForm.reset();
    this.cashTransferForm.patchValue({
      date: this.formatDateForInput(new Date())
    });
  }

  /**
   * Load customers for dropdown lists
   */
  private loadCustomers(): void {
    this.cashTransferService.getCustomersForTransfer().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.toast.Error('Failed to load customers', 'Error');
      }
    });
  }

  /**
   * Get customer balance for validation
   */
  getCustomerBalance(customerId: number): void {
    if (!customerId) return;
    
    this.cashTransferService.getCustomerBalance(customerId).subscribe({
      next: (balance) => {
        // You can display this balance or use it for validation
        console.log(`Customer ${customerId} balance: ${balance}`);
      },
      error: (error) => {
        console.error('Error getting customer balance:', error);
      }
    });
  }

  /**
   * Submit cash transfer form
   */
  submitCashTransfer(): void {
    if (this.cashTransferForm.invalid) {
      this.markFormGroupTouched(this.cashTransferForm);
      this.toast.Warning('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    const formValue = this.cashTransferForm.value;
    
    // Validate transfer accounts are different
    if (formValue.transferFromId === formValue.transferToId) {
      this.toast.Error('Transfer From and Transfer To accounts must be different', 'Validation Error');
      return;
    }

    const request = {
      Date: new Date(formValue.date),
      TransferFromID: parseInt(formValue.transferFromId),
      TransferToID: parseInt(formValue.transferToId),
      Amount: parseFloat(formValue.amount),
      Description: formValue.description
    };

    this.formSubmitting = true;

    this.cashTransferService.createCashTransferApproval(request).subscribe({
      next: (result) => {
        this.formSubmitting = false;
        this.toast.Success('Cash transfer approval created successfully', 'Success');
        this.hideCashTransferForm();
        this.loadApprovals(); // Refresh the grid
      },
      error: (error) => {
        this.formSubmitting = false;
        console.error('Error creating cash transfer:', error);
        this.toast.Error('Failed to create cash transfer approval', 'Error');
      }
    });
  }

  /**
   * Mark all form controls as touched to show validation errors
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Get field error message
   */
  getFieldError(fieldName: string): string {
    const field = this.cashTransferForm.get(fieldName);
    if (field?.touched && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['min']) {
        return `Amount must be greater than 0`;
      }
      if (field.errors['maxlength']) {
        return `Description cannot exceed 500 characters`;
      }
    }
    return '';
  }

  /**
   * Get field label for error messages
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'date': 'Date',
      'transferFromId': 'Transfer From',
      'transferToId': 'Transfer To',
      'amount': 'Amount',
      'description': 'Description'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Check if field has error
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.cashTransferForm.get(fieldName);
    return !!(field?.touched && field.invalid);
  }
}