import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import {
  BudgetHead,
  BudgetHeadView,
  ExpenseHead,
  ExpenseHeadView,
  BudgetFilterCriteria,
  BudgetManagementState,
  BudgetFormMode,
  CreateBudgetHeadRequest,
  UpdateBudgetHeadRequest,
  CreateExpenseHeadRequest,
  UpdateExpenseHeadRequest,
  BudgetGridColumn,
  BudgetStatus
} from './budget-management.interface';
import { BudgetManagementService } from './budget-management.service';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { MyToastService } from '../../../services/toaster.server';
import { UserDepartments } from '../../../config/constants';

@Component({
  selector: 'app-budget-management',
  templateUrl: './budget-management.component.html',
  styleUrls: ['./budget-management.component.scss']
})
export class BudgetManagementComponent implements OnInit {
  @ViewChild('grdBudgets') grdBudgets!: DataGridComponent;
  @ViewChild('grdExpenseHeads') grdExpenseHeads!: DataGridComponent;

  // Forms
  filterForm!: FormGroup;
  budgetForm!: FormGroup;
  expenseHeadForm!: FormGroup;
  
  // Data arrays
  budgets: BudgetHeadView[] = [];
  expenseHeads: ExpenseHeadView[] = [];
  
  // Form state
  showForm: boolean = false;
  showExpenseHeadForm: boolean = false;
  formSubmitting: boolean = false;
  
  // Component state
  state: BudgetManagementState = {
    loading: false,
    selectedBudget: null,
    selectedExpenseHead: null,
    filterCriteria: {
      showInactive: false
    },
    userDepartment: UserDepartments.grpSales,
    canAdd: false,
    canEdit: false,
    canView: false,
    formMode: BudgetFormMode.View,
    showExpenseHeadDialog: false
  };

  // Grid columns for budget heads
  budgetColumns: any[] = [
    { field: 'BudgetID', headerText: 'Budget ID', width: 100, Type: 'number' },
    { field: 'BudgetName', headerText: 'Budget Name', width: 200, Type: 'text' },
    { field: 'Percentage', headerText: 'Percentage (%)', width: 120, Type: 'percentage' },
    { field: 'Balance', headerText: 'Balance (%)', width: 120, Type: 'percentage' },
    { field: 'StatusID', headerText: 'Status', width: 100, Type: 'status' },
    { field: 'CreatedDate', headerText: 'Created Date', width: 120, Type: 'date' }
  ];

  // Grid columns for expense heads
  expenseHeadColumns: any[] = [
    { field: 'HeadID', headerText: 'Head ID', width: 80, Type: 'number' },
    { field: 'Head', headerText: 'Expense Head', width: 250, Type: 'text' },
    { field: 'StatusID', headerText: 'Status', width: 100, Type: 'status' },
    { field: 'CreatedDate', headerText: 'Created Date', width: 120, Type: 'date' }
  ];

  // Status options
  statusOptions = [
    { value: BudgetStatus.Active, label: 'Active' },
    { value: BudgetStatus.Inactive, label: 'Inactive' }
  ];

  public bsModalRef!: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private budgetService: BudgetManagementService,
    private toast: MyToastService,
    private modalService: BsModalService
  ) {
    this.initializeForms();
    this.setUserPermissions();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  /**
   * Initialize forms
   */
  private initializeForms(): void {
    // Filter form
    this.filterForm = this.fb.group({
      budgetName: [''],
      showInactive: [false]
    });

    // Budget form
    this.budgetForm = this.fb.group({
      budgetName: ['', [Validators.required, Validators.maxLength(100)]],
      percentage: [0, [Validators.required, Validators.min(0.01), Validators.max(100)]],
      statusId: [BudgetStatus.Active, Validators.required]
    });

    // Expense Head form
    this.expenseHeadForm = this.fb.group({
      head: ['', [Validators.required, Validators.maxLength(100)]],
      statusId: [BudgetStatus.Active, Validators.required]
    });

    // Subscribe to filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.updateFilterCriteria();
    });
  }

  /**
   * Set user permissions based on department
   */
  private setUserPermissions(): void {
    const permissions = this.budgetService.getUserPermissions();
    this.state.canAdd = permissions.canAdd;
    this.state.canEdit = permissions.canEdit;
    this.state.canView = permissions.canView;
    this.state.userDepartment = this.getUserDepartment();
  }

  /**
   * Load initial data
   */
  private loadInitialData(): void {
    this.loadBudgets();
  }

  /**
   * Update filter criteria from form
   */
  private updateFilterCriteria(): void {
    const formValue = this.filterForm.value;
    this.state.filterCriteria = {
      budgetName: formValue.budgetName || undefined,
      showInactive: formValue.showInactive || false
    };
  }

  /**
   * Load budget heads
   * Equivalent to VB6 ShowData() function
   */
  loadBudgets(): void {
    this.state.loading = true;
    this.updateFilterCriteria();

    console.log('Loading budgets with criteria:', this.state.filterCriteria);

    this.budgetService.getBudgetHeads(this.state.filterCriteria).subscribe({
      next: (budgets) => {
        console.log('Budgets received:', budgets);
        console.log('Number of budgets:', budgets.length);
        this.budgets = budgets;
        this.state.loading = false;
        
        // Clear selected budget if it's not in the new list
        if (this.state.selectedBudget && !budgets.find(b => b.BudgetID === this.state.selectedBudget!.BudgetID)) {
          this.state.selectedBudget = null;
          this.expenseHeads = [];
        }
      },
      error: (error) => {
        this.state.loading = false;
        console.error('Error loading budgets:', error);
        this.toast.Error('Failed to load budgets', 'Error');
      }
    });
  }

  /**
   * Handle budget grid row selection
   * Equivalent to VB6 grdData_SelectionChange
   */
  onBudgetSelected(selectedItem: any): void {
    if (selectedItem && selectedItem.data) {
      const budget = selectedItem.data;
      this.state.selectedBudget = budget;
      this.loadExpenseHeads(budget.BudgetID);
    }
  }

  /**
   * Load expense heads for selected budget
   */
  private loadExpenseHeads(budgetId: number): void {
    this.budgetService.getExpenseHeads(budgetId).subscribe({
      next: (expenseHeads) => {
        this.expenseHeads = expenseHeads;
        console.log('Expense heads loaded:', expenseHeads);
      },
      error: (error) => {
        console.error('Error loading expense heads:', error);
        this.toast.Error('Failed to load expense heads', 'Error');
      }
    });
  }

  /**
   * Handle double-click on budget row
   * Navigate to budget details page
   */
  onBudgetDoubleClick(): void {
    if (this.state.selectedBudget) {
      this.viewBudgetDetails(this.state.selectedBudget);
    }
  }

  /**
   * Navigate to budget details page
   */
  viewBudgetDetails(budget: BudgetHeadView): void {
    this.router.navigate(['/budgets/budget-details', budget.BudgetID]);
  }

  /**
   * Navigate to budget transfer page
   */
  openBudgetTransfer(): void {
    this.router.navigate(['/budgets/budget-transfer']);
  }

  /**
   * Show add new budget form
   * Equivalent to VB6 btnAdd_Click
   */
  showAddBudgetForm(): void {
    this.state.formMode = BudgetFormMode.Add;
    this.showForm = true;
    this.budgetForm.reset();
    this.budgetForm.patchValue({
      statusId: BudgetStatus.Active
    });
  }

  /**
   * Edit existing budget
   * Equivalent to VB6 btnEdit_Click
   */
  editBudget(budget: BudgetHeadView): void {
    if (!this.state.canEdit) {
      this.toast.Warning('You do not have permission to edit budgets', 'Access Denied');
      return;
    }

    this.state.formMode = BudgetFormMode.Edit;
    this.showForm = true;
    this.budgetForm.patchValue({
      budgetName: budget.BudgetName,
      percentage: budget.Percentage,
      statusId: budget.StatusID
    });
  }

  /**
   * Hide budget form
   */
  hideBudgetForm(): void {
    this.showForm = false;
    this.budgetForm.reset();
    this.state.formMode = BudgetFormMode.View;
  }

  /**
   * Submit budget form
   * Equivalent to VB6 btnSave_Click
   */
  submitBudget(): void {
    if (this.budgetForm.invalid) {
      this.markFormGroupTouched(this.budgetForm);
      this.toast.Warning('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    const formValue = this.budgetForm.value;
    this.formSubmitting = true;

    if (this.state.formMode === BudgetFormMode.Add) {
      const request: CreateBudgetHeadRequest = {
        BudgetName: formValue.budgetName,
        Percentage: formValue.percentage,
        StatusID: formValue.statusId,
        CreatedBy: this.getUserID()
      };

      this.budgetService.createBudgetHead(request).subscribe({
        next: (result) => {
          this.formSubmitting = false;
          this.toast.Sucess('Budget created successfully', 'Success');
          this.hideBudgetForm();
          this.loadBudgets();
        },
        error: (error) => {
          this.formSubmitting = false;
          console.error('Error creating budget:', error);
          this.toast.Error(error.message || 'Failed to create budget', 'Error');
        }
      });
    } else if (this.state.formMode === BudgetFormMode.Edit && this.state.selectedBudget) {
      const request: UpdateBudgetHeadRequest = {
        BudgetID: this.state.selectedBudget.BudgetID,
        BudgetName: formValue.budgetName,
        Percentage: formValue.percentage,
        StatusID: formValue.statusId,
        ModifiedBy: this.getUserID()
      };

      this.budgetService.updateBudgetHead(request).subscribe({
        next: (result) => {
          this.formSubmitting = false;
          this.toast.Sucess('Budget updated successfully', 'Success');
          this.hideBudgetForm();
          this.loadBudgets();
        },
        error: (error) => {
          this.formSubmitting = false;
          console.error('Error updating budget:', error);
          this.toast.Error(error.message || 'Failed to update budget', 'Error');
        }
      });
    }
  }

  /**
   * Show expense heads dialog
   * Equivalent to VB6 btnExpenseHeads_Click
   */
  showExpenseHeadsDialog(): void {
    this.state.showExpenseHeadDialog = true;
    this.showExpenseHeadForm = true;
    this.expenseHeadForm.reset();
    this.expenseHeadForm.patchValue({
      statusId: BudgetStatus.Active
    });
  }

  /**
   * Hide expense head form
   */
  hideExpenseHeadForm(): void {
    this.showExpenseHeadForm = false;
    this.expenseHeadForm.reset();
    this.state.showExpenseHeadDialog = false;
  }

  /**
   * Submit expense head form
   */
  submitExpenseHead(): void {
    if (this.expenseHeadForm.invalid) {
      this.markFormGroupTouched(this.expenseHeadForm);
      this.toast.Warning('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    if (!this.state.selectedBudget) {
      this.toast.Warning('Please select a budget first', 'No Budget Selected');
      return;
    }

    const formValue = this.expenseHeadForm.value;
    this.formSubmitting = true;

    const request: CreateExpenseHeadRequest = {
      Head: formValue.head,
      BudgetID: this.state.selectedBudget.BudgetID,
      StatusID: formValue.statusId,
      CreatedBy: this.getUserID()
    };

    this.budgetService.createExpenseHead(request).subscribe({
      next: (result) => {
        this.formSubmitting = false;
        this.toast.Sucess('Expense head created successfully', 'Success');
        this.hideExpenseHeadForm();
        this.loadExpenseHeads(this.state.selectedBudget!.BudgetID);
      },
      error: (error) => {
        this.formSubmitting = false;
        console.error('Error creating expense head:', error);
        this.toast.Error('Failed to create expense head', 'Error');
      }
    });
  }

  /**
   * Cancel form operation
   * Equivalent to VB6 btnCancel_Click
   */
  cancelForm(): void {
    if (this.showForm) {
      this.hideBudgetForm();
    }
    if (this.showExpenseHeadForm) {
      this.hideExpenseHeadForm();
    }
  }

  /**
   * Export data to Excel
   * Equivalent to VB6 Print functionality
   */
  exportToExcel(): void {
    this.budgetService.exportToExcel(this.state.filterCriteria).subscribe({
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
    this.loadBudgets();
  }

  /**
   * Get status display text
   */
  getStatusText(statusId: number): string {
    return statusId === BudgetStatus.Active ? 'Active' : 'Inactive';
  }

  /**
   * Get status CSS class
   */
  getStatusClass(statusId: number): string {
    return statusId === BudgetStatus.Active ? 'badge badge-success' : 'badge badge-secondary';
  }

  /**
   * Format percentage display
   */
  formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
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
  getFieldError(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    if (field?.touched && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} cannot exceed ${maxLength} characters`;
      }
      if (field.errors['min']) {
        const minValue = field.errors['min'].min;
        return `${this.getFieldLabel(fieldName)} must be at least ${minValue}`;
      }
      if (field.errors['max']) {
        const maxValue = field.errors['max'].max;
        return `${this.getFieldLabel(fieldName)} cannot exceed ${maxValue}`;
      }
    }
    return '';
  }

  /**
   * Get field label for error messages
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'budgetName': 'Budget Name',
      'percentage': 'Percentage',
      'statusId': 'Status',
      'head': 'Expense Head'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Check if field has error
   */
  hasFieldError(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field?.touched && field.invalid);
  }

  /**
   * Get total percentage allocated
   */
  getTotalPercentageAllocated(): number {
    return this.budgets
      .filter(b => b.StatusID === BudgetStatus.Active)
      .reduce((total, budget) => total + budget.Percentage, 0);
  }

  /**
   * Get remaining percentage available
   */
  getRemainingPercentage(): number {
    return 100 - this.getTotalPercentageAllocated();
  }

  /**
   * Get budget statistics text
   */
  getBudgetStatsText(): string {
    const totalAllocated = this.getTotalPercentageAllocated();
    const remaining = this.getRemainingPercentage();
    return `Total Allocated: ${totalAllocated.toFixed(2)}% • Remaining: ${remaining.toFixed(2)}%`;
  }
}
