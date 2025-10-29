import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { 
  Requisition, 
  RequisitionView, 
  RequisitionHistory,
  RequisitionHistoryView,
  RequisitionFilterCriteria, 
  RequisitionListState,
  RequisitionGridColumn,
  User,
  Department,
  RequisitionStatusFilter,
  CreateRequisitionRequest
} from './requisition-list.interface';
import { RequisitionListService } from './requisition-list.service';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { MyToastService } from '../../../services/toaster.server';
import { UserDepartments } from '../../../config/constants';

@Component({
  selector: 'app-requisition-list',
  templateUrl: './requisition-list.component.html',
  styleUrls: ['./requisition-list.component.scss']
})
export class RequisitionListComponent implements OnInit {
  @ViewChild('grdData') grdData!: DataGridComponent;
  @ViewChild('grdHistory') grdHistory!: DataGridComponent;

  // Forms
  filterForm!: FormGroup;
  requisitionForm!: FormGroup;
  
  // Data arrays
  requisitions: RequisitionView[] = [];
  history: RequisitionHistoryView[] = [];
  users: User[] = [];
  departments: Department[] = [];
  
  // Form state
  showForm: boolean = false;
  formSubmitting: boolean = false;
  
  // Component state
  state: RequisitionListState = {
    loading: false,
    selectedRequisition: null,
    filterCriteria: {
      fromDate: this.getFirstDayOfMonth(),
      toDate: new Date(),
      departmentId: null,
      status: RequisitionStatusFilter.ActiveOnly,
      isLoading: false
    },
    userDepartment: UserDepartments.grpSales,
    canAdd: false,
    canEdit: false,
    canView: false,
    isLoading: false,
    currentFilter: ''
  };

  // Grid columns for requisitions
  requisitionColumns: any[] = [
    { field: 'Date', headerText: 'Date', width: 100, Type: 'date' },
    { field: 'ReqID', headerText: 'Req ID', width: 80, Type: 'number' },
    { field: 'InitiatingPerson', headerText: 'Initiated By', width: 120, Type: 'text' },
    { field: 'DeptName', headerText: 'Department', width: 120, Type: 'text' },
    { field: 'NatureOfWork', headerText: 'Nature of Work', width: 200, Type: 'text' },
    { field: 'ForwardTo', headerText: 'Forwarded To', width: 120, Type: 'text' },
    { field: 'IsClosed', headerText: 'Status', width: 80, Type: 'status' }
  ];

  // Grid columns for history
  historyColumns: any[] = [
    { field: 'Date', headerText: 'Date', width: 100, Type: 'date' },
    { field: 'Time', headerText: 'Time', width: 80, Type: 'text' },
    { field: 'Remarks', headerText: 'Remarks', width: 300, Type: 'text' },
    { field: 'UserName', headerText: 'User', width: 120, Type: 'text' },
    { field: 'DeptName', headerText: 'Department', width: 120, Type: 'text' }
  ];

  // Status options from enum
  statusOptions = Object.values(RequisitionStatusFilter);

  public bsModalRef!: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private requisitionService: RequisitionListService,
    private toast: MyToastService,
    private modalService: BsModalService
  ) {
    this.initializeForms();
    this.setUserPermissions();
  }

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadInitialData();
  }

  /**
   * Initialize forms
   */
  private initializeForms(): void {
    // Filter form
    const fromDate = this.formatDateForInput(this.state.filterCriteria.fromDate);
    const toDate = this.formatDateForInput(this.state.filterCriteria.toDate);
    
    this.filterForm = this.fb.group({
      fromDate: [fromDate, Validators.required],
      toDate: [toDate, Validators.required],
      departmentId: [this.state.filterCriteria.departmentId],
      status: [this.state.filterCriteria.status, Validators.required],
      isLoading: [this.state.filterCriteria.isLoading]
    });

    // Requisition form
    this.requisitionForm = this.fb.group({
      date: [this.formatDateForInput(new Date()), Validators.required],
      time: [new Date().toTimeString().substring(0, 8), Validators.required],
      departmentId: ['', Validators.required],
      natureOfWork: ['', [Validators.required, Validators.maxLength(1024)]],
      description: ['', Validators.maxLength(5000)],
      initiatedBy: [this.getUserID(), Validators.required],
      forwardedTo: ['']
    });
  }

  /**
   * Set user permissions based on department
   */
  private setUserPermissions(): void {
    const permissions = this.requisitionService.getUserPermissions();
    this.state.canAdd = permissions.canAdd;
    this.state.canEdit = permissions.canEdit;
    this.state.canView = permissions.canView;
    this.state.userDepartment = this.getUserDepartment();
    
    // Set department filter based on permissions
    if (!permissions.canViewAll) {
      this.filterForm.get('departmentId')?.disable();
    }
  }

  /**
   * Set default dates
   */
  private setDefaultDates(): void {
    const fromDate = this.getFirstDayOfMonth();
    const toDate = new Date(); // Today
    
    this.state.filterCriteria.fromDate = fromDate;
    this.state.filterCriteria.toDate = toDate;
  }

  /**
   * Get first day of current month
   */
  private getFirstDayOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  /**
   * Load initial data
   */
  private loadInitialData(): void {
    this.loadDepartments();
    this.loadUsers();
    this.loadRequisitions();
  }

  /**
   * Load departments for dropdown
   */
  private loadDepartments(): void {
    this.requisitionService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = [{ DeptID: 0, DeptName: 'All Departments' }, ...departments];
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.toast.Error('Failed to load departments', 'Error');
      }
    });
  }

  /**
   * Load users for dropdown
   */
  private loadUsers(): void {
    this.requisitionService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toast.Error('Failed to load users', 'Error');
      }
    });
  }

  /**
   * Update filter criteria from form
   */
  private updateFilterCriteria(): void {
    const formValue = this.filterForm.value;
    this.state.filterCriteria = {
      fromDate: new Date(formValue.fromDate),
      toDate: new Date(formValue.toDate),
      departmentId: formValue.departmentId || null,
      status: formValue.status,
      isLoading: formValue.isLoading || false
    };
  }

  /**
   * Load requisitions based on filter criteria
   * Equivalent to VB6 ShowData() function
   */
  loadRequisitions(): void {
    this.state.loading = true;
    this.updateFilterCriteria();

    console.log('Loading requisitions with criteria:', this.state.filterCriteria);

    this.requisitionService.getRequisitions(this.state.filterCriteria).subscribe({
      next: (requisitions) => {
        console.log('Requisitions received:', requisitions);
        console.log('Number of requisitions:', requisitions.length);
        this.requisitions = requisitions;
        this.state.loading = false;
        this.grdData.SetDataSource(this.requisitions);
        // Check for loading mode warning
        if (this.state.filterCriteria.isLoading && requisitions.length === 0) {
          // Handle empty loading state if needed
        }
      },
      error: (error) => {
        this.state.loading = false;
        console.error('Error loading requisitions:', error);
        this.toast.Error('Failed to load requisitions', 'Error');
      }
    });
  }

  /**
   * Handle grid row selection to load history
   * Equivalent to VB6 grdData_SelectionChange
   */
  onRequisitionSelected(selectedItem: any): void {
    if (selectedItem && selectedItem.data) {
      const requisition = selectedItem.data;
      this.state.selectedRequisition = requisition;
      this.loadRequisitionHistory(requisition.ReqID);
    }
  }

  /**
   * Load requisition history
   */
  private loadRequisitionHistory(reqId: number): void {
    this.requisitionService.getRequisitionHistory(reqId).subscribe({
      next: (history) => {
        this.history = history;
      },
      error: (error) => {
        console.error('Error loading requisition history:', error);
        this.toast.Error('Failed to load requisition history', 'Error');
      }
    });
  }

  /**
   * Handle double-click on requisition row
   * Equivalent to VB6 grdData_DblClick
   */
  onRequisitionDoubleClick(): void {
    if (this.state.selectedRequisition) {
      this.editRequisition(this.state.selectedRequisition);
    }
  }

  /**
   * Show add new requisition form
   * Equivalent to VB6 btnAddToInv_Click
   */
  showAddRequisitionForm(): void {
    this.showForm = true;
    this.requisitionForm.reset();
    this.requisitionForm.patchValue({
      date: this.formatDateForInput(new Date()),
      time: new Date().toTimeString().substring(0, 8),
      initiatedBy: this.getUserID(),
      departmentId: this.getUserDepartment()
    });
  }

  /**
   * Hide requisition form
   */
  hideRequisitionForm(): void {
    this.showForm = false;
    this.requisitionForm.reset();
  }

  /**
   * Submit new requisition
   */
  submitRequisition(): void {
    if (this.requisitionForm.invalid) {
      this.markFormGroupTouched(this.requisitionForm);
      this.toast.Warning('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    const formValue = this.requisitionForm.value;
    const request: CreateRequisitionRequest = {
      Date: new Date(formValue.date),
      Time: formValue.time,
      DepartmentID: parseInt(formValue.departmentId),
      NatureOfWork: formValue.natureOfWork,
      Description: formValue.description,
      InitiatedBy: parseInt(formValue.initiatedBy),
      ForwardedTo: formValue.forwardedTo ? parseInt(formValue.forwardedTo) : undefined
    };

    this.formSubmitting = true;

    this.requisitionService.createRequisition(request).subscribe({
      next: (result) => {
        this.formSubmitting = false;
        this.toast.Sucess('Requisition created successfully', 'Success');
        this.hideRequisitionForm();
        this.loadRequisitions();
      },
      error: (error) => {
        this.formSubmitting = false;
        console.error('Error creating requisition:', error);
        this.toast.Error('Failed to create requisition', 'Error');
      }
    });
  }

  /**
   * Edit existing requisition
   */
  editRequisition(requisition: RequisitionView): void {
    if (!this.requisitionService.canEditRequisition(requisition)) {
      this.toast.Warning('You do not have permission to edit this requisition', 'Access Denied');
      return;
    }

    // Open edit dialog - implementation would depend on your dialog system
    swal({
      title: 'Edit Requisition',
      text: `Editing requisition ${requisition.ReqID}`,
      icon: 'info',
      buttons: ['Cancel', 'OK']
    }).then((confirmed) => {
      if (confirmed) {
        // Handle edit logic here
        console.log('Edit requisition:', requisition);
      }
    });
  }

  /**
   * Export data to Excel
   * Equivalent to VB6 BtnPrint_Click
   */
  exportToExcel(): void {
    this.requisitionService.exportToExcel(this.state.filterCriteria).subscribe({
      next: (success) => {
        if (success) {
          this.toast.Sucess('Export completed successfully', 'Success');
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
   * Refresh data
   * Equivalent to VB6 btnShow_Click
   */
  refreshData(): void {
    this.loadRequisitions();
  }

  /**
   * Get status display text
   */
  getStatusText(isClosed: number): string {
    return isClosed === 1 ? 'Closed' : 'Open';
  }

  /**
   * Get status CSS class
   */
  getStatusClass(isClosed: number): string {
    return isClosed === 1 ? 'badge badge-success' : 'badge badge-warning';
  }

  /**
   * Format currency display
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  /**
   * Format date display
   */
  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  /**
   * Format date for HTML input
   */
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get current user ID
   */
  private getUserID(): number {
    // This would come from your authentication service
    // For now, using a placeholder
    return 1;
  }

  /**
   * Get current user department
   */
  private getUserDepartment(): UserDepartments {
    // This would come from your authentication service
    // For now, using a placeholder
    return UserDepartments.grpSales;
  }

  /**
   * Mark form group as touched for validation
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Get field error message for forms
   */
  getFieldError(fieldName: string): string {
    const field = this.requisitionForm.get(fieldName);
    if (field?.touched && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} cannot exceed ${maxLength} characters`;
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
      'time': 'Time',
      'departmentId': 'Department',
      'natureOfWork': 'Nature of Work',
      'description': 'Description',
      'initiatedBy': 'Initiated By',
      'forwardedTo': 'Forward To'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Check if field has error
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.requisitionForm.get(fieldName);
    return !!(field?.touched && field.invalid);
  }

  /**
   * Get date range text for display
   */
  getDateRangeText(): string {
    const from = this.formatDate(this.state.filterCriteria.fromDate);
    const to = this.formatDate(this.state.filterCriteria.toDate);
    return `From: ${from} To: ${to}`;
  }

  /**
   * Get status description for display
   */
  getStatusDescription(): string {
    const status = this.state.filterCriteria.status;
    const department = this.departments.find(d => d.DeptID === this.state.filterCriteria.departmentId);
    const deptText = department ? `Department: ${department.DeptName}` : 'All Departments';
    
    return `Status: ${status} • ${deptText}`;
  }
}