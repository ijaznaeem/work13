import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import swal from 'sweetalert';
import { 
  BudgetHead,
  BudgetHeadView, 
  ExpenseHead,
  ExpenseHeadView,
  BudgetDetailState,
  CreateExpenseHeadRequest,
  UpdateExpenseHeadRequest,
  BudgetStatus,
  BudgetValidationResult
} from '../budget-management/budget-management.interface';
import { BudgetManagementService } from '../budget-management/budget-management.service';
import { DataGridComponent } from '../../components/data-grid/data-grid.component';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.scss']
})
export class BudgetDetailsComponent implements OnInit {
  @ViewChild('grdExpenseHeads') grdExpenseHeads!: DataGridComponent;

  // Forms
  expenseHeadForm!: FormGroup;
  
  // Data arrays
  expenseHeads: ExpenseHeadView[] = [];
  
  // Form state
  showExpenseForm: boolean = false;
  formSubmitting: boolean = false;
  isEditMode: boolean = false;
  
  // Component state
  state: BudgetDetailState = {
    loading: false,
    budgetId: 0,
    budgetHead: null,
    selectedExpenseHead: null,
    canAdd: false,
    canEdit: false,
    canView: false,
    canDelete: false,
    permissions: {
      canAdd: false,
      canEdit: false,
      canView: false,
      canDelete: false,
      canManageExpenseHeads: false,
      canViewReports: false
    }
  };

  // Grid columns for expense heads
  expenseHeadColumns: any[] = [
    { field: 'HeadID', headerText: 'Head ID', width: 80, Type: 'number' },
    { field: 'Head', headerText: 'Expense Head', width: 300, Type: 'text' },
    { field: 'Balance', headerText: 'Balance', width: 120, Type: 'currency' },
    { field: 'Perecentage', headerText: 'Percentage', width: 100, Type: 'number' },
    { field: 'IsActive', headerText: 'Status', width: 100, Type: 'status' }
  ];

  public bsModalRef!: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private budgetService: BudgetManagementService,
    private toast: MyToastService,
    private modalService: BsModalService
  ) {
    this.initializeForm();
    this.setUserPermissions();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const budgetId = parseInt(params['id']);
      if (budgetId && budgetId > 0) {
        this.state.budgetId = budgetId;
        this.loadBudgetDetails();
        this.loadExpenseHeads();
      } else {
        this.toast.Error('Invalid budget ID', 'Error');
        this.router.navigate(['/budgets/manage-budget-heads']);
      }
    });
  }

  /**
   * Initialize expense head form
   */
  private initializeForm(): void {
    this.expenseHeadForm = this.fb.group({
      headId: [0],
      head: ['', [Validators.required, Validators.maxLength(255)]],
      budgetId: [0, Validators.required],
      statusId: [BudgetStatus.Active, Validators.required]
    });
  }

  /**
   * Set user permissions based on department
   */
  private setUserPermissions(): void {
    const permissions = this.budgetService.getUserPermissions();
    this.state.permissions = permissions;
    this.state.canAdd = permissions.canManageExpenseHeads;
    this.state.canEdit = permissions.canManageExpenseHeads;
    this.state.canView = permissions.canView;
    this.state.canDelete = permissions.canDelete;
  }

  /**
   * Load budget head details
   */
  private loadBudgetDetails(): void {
    this.state.loading = true;
    
    this.budgetService.getBudgetHeadById(this.state.budgetId).subscribe({
      next: (budgetHead) => {
        this.state.budgetHead = budgetHead;
        this.state.loading = false;
      },
      error: (error) => {
        this.state.loading = false;
        console.error('Error loading budget details:', error);
        this.toast.Error('Failed to load budget details', 'Error');
        this.router.navigate(['/budgets/manage-budget-heads']);
      }
    });
  }

  /**
   * Load expense heads for the current budget
   */
  private loadExpenseHeads(): void {
    this.budgetService.getExpenseHeads(this.state.budgetId).subscribe({
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
   * Handle expense head grid row selection
   */
  onExpenseHeadSelected(selectedItem: any): void {
    if (selectedItem && selectedItem.data) {
      this.state.selectedExpenseHead = selectedItem.data;
    }
  }

  /**
   * Handle double-click on expense head row to edit
   */
  onExpenseHeadDoubleClick(): void {
    if (this.state.selectedExpenseHead && this.state.canEdit) {
      this.editExpenseHead(this.state.selectedExpenseHead);
    }
  }

  /**
   * Show add new expense head form
   */
  showAddExpenseHeadForm(): void {
    this.isEditMode = false;
    this.showExpenseForm = true;
    this.expenseHeadForm.reset();
    this.expenseHeadForm.patchValue({
      headId: 0,
      budgetId: this.state.budgetId,
      statusId: BudgetStatus.Active
    });
  }

  /**
   * Show edit expense head form
   */
  editExpenseHead(expenseHead: ExpenseHeadView): void {
    if (!this.state.canEdit) {
      this.toast.Warning('You do not have permission to edit expense heads', 'Access Denied');
      return;
    }

    this.isEditMode = true;
    this.showExpenseForm = true;
    this.expenseHeadForm.patchValue({
      headId: expenseHead.HeadID,
      head: expenseHead.Head,
      budgetId: expenseHead.BudgetID,
      statusId: expenseHead.IsActive ? BudgetStatus.Active : BudgetStatus.Inactive
    });
  }

  /**
   * Hide expense head form
   */
  hideExpenseHeadForm(): void {
    this.showExpenseForm = false;
    this.isEditMode = false;
    this.expenseHeadForm.reset();
    this.state.selectedExpenseHead = null;
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

    const formValue = this.expenseHeadForm.value;
    this.formSubmitting = true;

    if (this.isEditMode) {
      // Update existing expense head
      const request: UpdateExpenseHeadRequest = {
        HeadID: formValue.headId,
        Head: formValue.head,
        BudgetID: formValue.budgetId,
        StatusID: formValue.statusId,
        ModifiedBy: this.getUserID()
      };

      this.budgetService.updateExpenseHead(request).subscribe({
        next: (result) => {
          this.formSubmitting = false;
          this.toast.Sucess('Expense head updated successfully', 'Success');
          this.hideExpenseHeadForm();
          this.loadExpenseHeads();
        },
        error: (error) => {
          this.formSubmitting = false;
          console.error('Error updating expense head:', error);
          this.toast.Error('Failed to update expense head', 'Error');
        }
      });
    } else {
      // Create new expense head
      const request: CreateExpenseHeadRequest = {
        Head: formValue.head,
        BudgetID: formValue.budgetId,
        StatusID: formValue.statusId,
        CreatedBy: this.getUserID()
      };

      this.budgetService.createExpenseHead(request).subscribe({
        next: (result) => {
          this.formSubmitting = false;
          this.toast.Sucess('Expense head created successfully', 'Success');
          this.hideExpenseHeadForm();
          this.loadExpenseHeads();
        },
        error: (error) => {
          this.formSubmitting = false;
          console.error('Error creating expense head:', error);
          this.toast.Error('Failed to create expense head', 'Error');
        }
      });
    }
  }

  /**
   * Delete selected expense head
   */
  deleteExpenseHead(): void {
    if (!this.state.selectedExpenseHead) {
      this.toast.Warning('Please select an expense head to delete', 'Selection Required');
      return;
    }

    if (!this.state.canDelete) {
      this.toast.Warning('You do not have permission to delete expense heads', 'Access Denied');
      return;
    }

    swal({
      title: 'Confirm Delete',
      text: `Are you sure you want to delete the expense head "${this.state.selectedExpenseHead.Head}"?`,
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true
    }).then((confirmed) => {
      if (confirmed && this.state.selectedExpenseHead) {
        const request: UpdateExpenseHeadRequest = {
          HeadID: this.state.selectedExpenseHead.HeadID,
          Head: this.state.selectedExpenseHead.Head,
          BudgetID: this.state.selectedExpenseHead.BudgetID,
          StatusID: BudgetStatus.Inactive,
          ModifiedBy: this.getUserID()
        };

        this.budgetService.updateExpenseHead(request).subscribe({
          next: (result) => {
            this.toast.Sucess('Expense head deleted successfully', 'Success');
            this.loadExpenseHeads();
            this.state.selectedExpenseHead = null;
          },
          error: (error) => {
            console.error('Error deleting expense head:', error);
            this.toast.Error('Failed to delete expense head', 'Error');
          }
        });
      }
    });
  }

  /**
   * Navigate back to budget management
   */
  goBack(): void {
    this.router.navigate(['/budgets/manage-budget-heads']);
  }

  /**
   * Refresh expense heads data
   */
  refreshData(): void {
    this.loadExpenseHeads();
    this.loadBudgetDetails();
  }

  /**
   * Export expense heads to Excel
   */
  exportToExcel(): void {
    // Implementation would export current expense heads data
    this.toast.Info('Export functionality not yet implemented', 'Info');
  }

  /**
   * Get status display text
   */
  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  /**
   * Get status CSS class
   */
  getStatusClass(isActive: boolean): string {
    return isActive ? 'badge badge-success' : 'badge badge-danger';
  }

  /**
   * Format currency display
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  }

  /**
   * Format percentage display
   */
  formatPercentage(value: number): string {
    return `${(value || 0).toFixed(2)}%`;
  }

  /**
   * Get current user ID
   */
  private getUserID(): number {
    // This would come from your authentication service
    return 1;
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
    const field = this.expenseHeadForm.get(fieldName);
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
      'head': 'Expense Head Name',
      'budgetId': 'Budget',
      'statusId': 'Status'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Check if field has error
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.expenseHeadForm.get(fieldName);
    return !!(field?.touched && field.invalid);
  }

  /**
   * Get budget summary info for display
   */
  getBudgetSummaryText(): string {
    if (!this.state.budgetHead) return '';
    
    return `Budget: ${this.state.budgetHead.BudgetName} | Allocation: ${this.formatPercentage(this.state.budgetHead.Percentage)} | Balance: ${this.formatCurrency(this.state.budgetHead.Balance)}`;
  }

  /**
   * Get page title
   */
  getPageTitle(): string {
    return this.state.budgetHead ? 
      `Budget Details - ${this.state.budgetHead.BudgetName}` : 
      'Budget Details';
  }
}