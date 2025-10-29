import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import {
  BudgetTransfer,
  BudgetTransferState,
  CreateBudgetTransferRequest,
  BudgetTransactionType,
  BudgetTransferValidation,
  TransactionTypeOption
} from './budget-transfer.interface';
import { BudgetTransferService } from './budget-transfer.service';
import { BudgetHeadView } from '../budget-management/budget-management.interface';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-budget-transfer',
  templateUrl: './budget-transfer.component.html',
  styleUrls: ['./budget-transfer.component.scss']
})
export class BudgetTransferComponent implements OnInit {

  // Form
  transferForm!: FormGroup;
  
  // Form state
  formSubmitting: boolean = false;
  
  // Component state
  state: BudgetTransferState = {
    loading: false,
    fromBudget: null,
    toBudget: null,
    fromBalance: 0,
    toBalance: 0,
    fromBalanceAfterTransfer: 0,
    toBalanceAfterTransfer: 0,
    availableBudgets: [],
    permissions: {
      canAdd: false,
      canEdit: false,
      canView: false,
      canDelete: false,
      canManageExpenseHeads: false,
      canViewReports: false
    },
    canTransfer: false
  };

  // Dropdown options
  transactionTypes: TransactionTypeOption[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private transferService: BudgetTransferService,
    private toast: MyToastService
  ) {
    this.initializeForm();
    this.setUserPermissions();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  /**
   * Initialize transfer form
   */
  private initializeForm(): void {
    this.transferForm = this.fb.group({
      date: [this.formatDateForInput(new Date()), Validators.required],
      fromBudgetId: ['', Validators.required],
      toBudgetId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      transactionType: [BudgetTransactionType.Transfer, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(255)]]
    });

    // Watch for form changes to update balance calculations
    this.transferForm.get('fromBudgetId')?.valueChanges.subscribe((budgetId) => {
      this.onFromBudgetChange(budgetId);
    });

    this.transferForm.get('toBudgetId')?.valueChanges.subscribe((budgetId) => {
      this.onToBudgetChange(budgetId);
    });

    this.transferForm.get('amount')?.valueChanges.subscribe((amount) => {
      this.updateBalanceCalculations();
    });
  }

  /**
   * Set user permissions
   */
  private setUserPermissions(): void {
    const permissions = this.transferService.getUserPermissions();
    this.state.permissions = permissions;
    this.state.canTransfer = permissions.canAdd;

    if (!this.state.canTransfer) {
      this.transferForm.disable();
    }
  }

  /**
   * Load initial data
   */
  private loadInitialData(): void {
    this.state.loading = true;
    
    // Load available budgets
    this.transferService.getAvailableBudgets().subscribe({
      next: (budgets) => {
        this.state.availableBudgets = budgets;
        this.state.loading = false;
      },
      error: (error) => {
        this.state.loading = false;
        console.error('Error loading budgets:', error);
        this.toast.Error('Failed to load budget data', 'Error');
      }
    });

    // Load transaction types
    this.transactionTypes = this.transferService.getTransactionTypes();
  }

  /**
   * Handle from budget selection change
   * Equivalent to VB6 AddEdit1_ItemChanged for CustomerID
   */
  private onFromBudgetChange(budgetId: string): void {
    const id = parseInt(budgetId);
    if (!id || id <= 0) {
      this.state.fromBudget = null;
      this.state.fromBalance = 0;
      this.updateBalanceCalculations();
      return;
    }

    this.transferService.getBudgetHeadWithBalance(id).subscribe({
      next: (budget) => {
        this.state.fromBudget = budget;
        this.state.fromBalance = budget.Balance;
        this.updateBalanceCalculations();
      },
      error: (error) => {
        console.error('Error loading from budget:', error);
        this.toast.Error('Failed to load budget details', 'Error');
      }
    });
  }

  /**
   * Handle to budget selection change
   * Equivalent to VB6 AddEdit1_ItemChanged for @XXXXX
   */
  private onToBudgetChange(budgetId: string): void {
    const id = parseInt(budgetId);
    if (!id || id <= 0) {
      this.state.toBudget = null;
      this.state.toBalance = 0;
      this.updateBalanceCalculations();
      return;
    }

    this.transferService.getBudgetHeadWithBalance(id).subscribe({
      next: (budget) => {
        this.state.toBudget = budget;
        this.state.toBalance = budget.Balance;
        this.updateBalanceCalculations();
      },
      error: (error) => {
        console.error('Error loading to budget:', error);
        this.toast.Error('Failed to load budget details', 'Error');
      }
    });
  }

  /**
   * Update balance calculations after transfer
   * Equivalent to VB6 balance calculation logic
   */
  private updateBalanceCalculations(): void {
    const amount = parseFloat(this.transferForm.get('amount')?.value || '0');
    
    if (this.state.fromBudget && amount > 0) {
      this.state.fromBalanceAfterTransfer = this.transferService.calculateBalanceAfterTransfer(
        this.state.fromBalance,
        amount,
        true // isSource
      );
    } else {
      this.state.fromBalanceAfterTransfer = this.state.fromBalance;
    }

    if (this.state.toBudget && amount > 0) {
      this.state.toBalanceAfterTransfer = this.transferService.calculateBalanceAfterTransfer(
        this.state.toBalance,
        amount,
        false // isSource
      );
    } else {
      this.state.toBalanceAfterTransfer = this.state.toBalance;
    }
  }

  /**
   * Submit budget transfer
   * Equivalent to VB6 btnOK_Click
   */
  submitTransfer(): void {
    if (this.transferForm.invalid) {
      this.markFormGroupTouched(this.transferForm);
      this.toast.Warning('Please fill all required fields correctly', 'Validation Error');
      return;
    }

    if (!this.state.canTransfer) {
      this.toast.Warning('You do not have permission to create budget transfers', 'Access Denied');
      return;
    }

    const formValue = this.transferForm.value;
    const fromBudgetId = parseInt(formValue.fromBudgetId);
    const toBudgetId = parseInt(formValue.toBudgetId);
    const amount = parseFloat(formValue.amount);
    const transactionType = parseInt(formValue.transactionType);

    // Validate transfer first
    this.transferService.validateTransfer(fromBudgetId, toBudgetId, amount, transactionType).subscribe({
      next: (validation: BudgetTransferValidation) => {
        if (!validation.isValid) {
          this.toast.Error(validation.errors.join('<br>'), 'Validation Failed');
          return;
        }

        // Show warnings if any
        if (validation.warnings.length > 0) {
          const warningMessage = validation.warnings.join('<br>');
          swal({
            title: 'Warning',
            text: warningMessage + '\n\nDo you want to continue?',
            icon: 'warning',
            buttons: ['Cancel', 'Continue'],
          }).then((confirmed) => {
            if (confirmed) {
              this.executeTransfer();
            }
          });
        } else {
          this.executeTransfer();
        }
      },
      error: (error) => {
        console.error('Transfer validation failed:', error);
        this.toast.Error('Failed to validate transfer', 'Error');
      }
    });
  }

  /**
   * Execute the actual transfer
   */
  private executeTransfer(): void {
    const formValue = this.transferForm.value;
    const request: CreateBudgetTransferRequest = {
      Date: new Date(formValue.date),
      FromBudgetID: parseInt(formValue.fromBudgetId),
      ToBudgetID: parseInt(formValue.toBudgetId),
      Amount: parseFloat(formValue.amount),
      Description: formValue.description,
      TransactionType: parseInt(formValue.transactionType),
      CreatedBy: this.getUserID()
    };

    this.formSubmitting = true;

    this.transferService.executeBudgetTransfer(request).subscribe({
      next: (result) => {
        this.formSubmitting = false;
        this.toast.Sucess('Budget transfer completed successfully', 'Success');
        
        // Show success details
        swal({
          title: 'Transfer Successful',
          text: `Amount ${this.formatCurrency(request.Amount)} has been transferred from ${this.state.fromBudget?.BudgetName} to ${this.state.toBudget?.BudgetName}`,
          icon: 'success'
        }).then(() => {
          this.resetForm();
        });
      },
      error: (error) => {
        this.formSubmitting = false;
        console.error('Error executing transfer:', error);
        this.toast.Error('Failed to complete budget transfer', 'Error');
      }
    });
  }

  /**
   * Cancel transfer and go back
   */
  cancel(): void {
    swal({
      title: 'Cancel Transfer',
      text: 'Are you sure you want to cancel this transfer?',
      icon: 'warning',
      buttons: ['No', 'Yes'],
    }).then((confirmed) => {
      if (confirmed) {
        this.router.navigate(['/budgets/manage-budget-heads']);
      }
    });
  }

  /**
   * Reset form to initial state
   */
  resetForm(): void {
    this.transferForm.reset();
    this.transferForm.patchValue({
      date: this.formatDateForInput(new Date()),
      transactionType: BudgetTransactionType.Transfer
    });
    
    this.state.fromBudget = null;
    this.state.toBudget = null;
    this.state.fromBalance = 0;
    this.state.toBalance = 0;
    this.state.fromBalanceAfterTransfer = 0;
    this.state.toBalanceAfterTransfer = 0;
  }

  /**
   * Navigate back to budget management
   */
  goBack(): void {
    this.router.navigate(['/budgets/manage-budget-heads']);
  }

  /**
   * Get available budget options for "To" dropdown
   * Exclude the selected "From" budget
   */
  getAvailableToBudgets(): BudgetHeadView[] {
    const fromBudgetId = parseInt(this.transferForm.get('fromBudgetId')?.value || '0');
    return this.state.availableBudgets.filter(b => b.BudgetID !== fromBudgetId);
  }

  /**
   * Get transaction type label
   */
  getTransactionTypeLabel(type: BudgetTransactionType): string {
    const option = this.transactionTypes.find(t => t.value === type);
    return option ? option.label : 'Unknown';
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
    const field = this.transferForm.get(fieldName);
    if (field?.touched && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} must be greater than zero`;
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
      'date': 'Transfer Date',
      'fromBudgetId': 'From Budget',
      'toBudgetId': 'To Budget',
      'amount': 'Transfer Amount',
      'transactionType': 'Transaction Type',
      'description': 'Description'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Check if field has error
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.transferForm.get(fieldName);
    return !!(field?.touched && field.invalid);
  }

  /**
   * Get transfer summary text for display
   */
  getTransferSummaryText(): string {
    if (!this.state.fromBudget || !this.state.toBudget) return '';
    
    const amount = parseFloat(this.transferForm.get('amount')?.value || '0');
    if (amount <= 0) return '';

    return `Transfer ${this.formatCurrency(amount)} from "${this.state.fromBudget.BudgetName}" to "${this.state.toBudget.BudgetName}"`;
  }

  /**
   * Check if transfer is ready to submit
   */
  isTransferReady(): boolean {
    return this.transferForm.valid && 
           this.state.fromBudget !== null && 
           this.state.toBudget !== null &&
           parseFloat(this.transferForm.get('amount')?.value || '0') > 0;
  }

  /**
   * Get balance status class
   */
  getBalanceStatusClass(balance: number): string {
    if (balance < 0) return 'text-danger';
    if (balance < 1000) return 'text-warning';
    return 'text-success';
  }
}