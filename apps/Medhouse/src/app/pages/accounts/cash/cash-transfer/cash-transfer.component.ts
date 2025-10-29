import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { CashTransferService } from '../services/cash-transfer.service';
import { DailyCash, CashCustomer, CashTransaction } from '../interfaces/cash.interface';

export interface TransferAccount {
  customerID: number;
  customerName: string;
  balance: number;
  city: string;
  accountTypeID: number;
  status: number;
}

export interface TransactionType {
  acctTypeID: number;
  acctTypeName: string;
}

@Component({
  selector: 'app-cash-transfer',
  templateUrl: './cash-transfer.component.html',
  styleUrls: ['./cash-transfer.component.scss']
})
export class CashTransferComponent implements OnInit, OnDestroy {
  cashTransferForm!: FormGroup;
  
  // Data arrays
  fromAccounts: TransferAccount[] = [];
  toAccounts: TransferAccount[] = [];
  transactionTypes: TransactionType[] = [];
  
  // Selected data
  selectedFromAccount: TransferAccount | null = null;
  selectedToAccount: TransferAccount | null = null;
  
  // State management
  isLoading = false;
  isSubmitting = false;
  
  // Component lifecycle
  private destroy$ = new Subject<void>();
  
  // Form getters for easy access
  get f() { return this.cashTransferForm.controls; }

  constructor(
    private fb: FormBuilder,
    private cashTransferService: CashTransferService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.cashTransferForm = this.fb.group({
      fromAccountID: [0, [Validators.required, Validators.min(1)]],
      toAccountID: [0, [Validators.required, Validators.min(1)]],
      transactionTypeID: [0, [Validators.required, Validators.min(1)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      balance: [0] // Auto-calculated field
    });
  }

  private setupFormSubscriptions(): void {
    // Listen to from account changes
    this.f['fromAccountID'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(accountID => {
        if (accountID && accountID > 0) {
          this.onFromAccountChange(accountID);
        } else {
          this.selectedFromAccount = null;
        }
        this.updateBalances();
      });

    // Listen to to account changes
    this.f['toAccountID'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(accountID => {
        if (accountID && accountID > 0) {
          this.onToAccountChange(accountID);
        } else {
          this.selectedToAccount = null;
        }
        this.updateBalances();
      });

    // Listen to amount changes to update balance calculations
    this.f['amount'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateBalances();
      });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    
    // Load transfer accounts (account types 15 and 16 as per VB6 code)
    this.cashTransferService.getTransferAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accounts) => {
          this.fromAccounts = accounts;
          this.toAccounts = accounts;
          this.loadTransactionTypes();
        },
        error: (error) => {
          console.error('Error loading accounts:', error);
          this.isLoading = false;
        }
      });
  }

  private loadTransactionTypes(): void {
    this.cashTransferService.getTransactionTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types) => {
          this.transactionTypes = types;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading transaction types:', error);
          this.isLoading = false;
        }
      });
  }

  selectFromAccount(account: TransferAccount): void {
    this.selectedFromAccount = account;
    this.f['fromAccountID'].setValue(account.customerID);
  }

  selectToAccount(account: TransferAccount): void {
    this.selectedToAccount = account;
    this.f['toAccountID'].setValue(account.customerID);
  }

  private onFromAccountChange(accountID: number): void {
    const account = this.fromAccounts.find(a => a.customerID === accountID);
    if (account) {
      this.selectedFromAccount = account;
    }
  }

  private onToAccountChange(accountID: number): void {
    const account = this.toAccounts.find(a => a.customerID === accountID);
    if (account) {
      this.selectedToAccount = account;
    }
  }

  private updateBalances(): void {
    const amount = this.f['amount'].value || 0;
    
    if (this.selectedFromAccount && this.selectedToAccount) {
      // Calculate new balances after transfer
      const fromBalanceAfter = (this.selectedFromAccount.balance || 0) - amount;
      const toBalanceAfter = (this.selectedToAccount.balance || 0) + amount;
      
      // Store calculated values for display
      this.f['balance'].setValue(fromBalanceAfter);
    }
  }

  getFromBalanceAfterTransfer(): number {
    if (!this.selectedFromAccount) return 0;
    const amount = this.f['amount'].value || 0;
    return (this.selectedFromAccount.balance || 0) - amount;
  }

  getToBalanceAfterTransfer(): number {
    if (!this.selectedToAccount) return 0;
    const amount = this.f['amount'].value || 0;
    return (this.selectedToAccount.balance || 0) + amount;
  }

  isFormValid(): boolean {
    return this.cashTransferForm.valid && 
           this.selectedFromAccount !== null && 
           this.selectedToAccount !== null &&
           this.f['fromAccountID'].value !== this.f['toAccountID'].value;
  }

  hasError(controlName: string): boolean {
    const control = this.f[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(controlName: string): string {
    const control = this.f[controlName];
    
    if (control.errors?.['required']) {
      return `${this.getFieldName(controlName)} is required`;
    }
    
    if (control.errors?.['min']) {
      return `Please select a valid ${this.getFieldName(controlName)}`;
    }
    
    if (control.errors?.['minlength']) {
      return `${this.getFieldName(controlName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    
    return '';
  }

  private getFieldName(controlName: string): string {
    const fieldNames: { [key: string]: string } = {
      fromAccountID: 'From Account',
      toAccountID: 'To Account',
      transactionTypeID: 'Transaction Type',
      date: 'Date',
      description: 'Description',
      amount: 'Amount'
    };
    
    return fieldNames[controlName] || controlName;
  }

  // Validation for same account selection
  isSameAccountSelected(): boolean {
    return this.f['fromAccountID'].value > 0 && 
           this.f['toAccountID'].value > 0 && 
           this.f['fromAccountID'].value === this.f['toAccountID'].value;
  }

  // Validation for insufficient balance
  isInsufficientBalance(): boolean {
    if (!this.selectedFromAccount) return false;
    const amount = this.f['amount'].value || 0;
    return amount > (this.selectedFromAccount.balance || 0);
  }

  // Check if account requires budget validation
  isBudgetAccount(account: TransferAccount | null): boolean {
    if (!account) return false;
    // Budget accounts logic can be implemented based on business rules
    return account.accountTypeID === 15; // Example: account type 15 requires budget check
  }

  saveCashTransfer(): void {
    if (!this.isFormValid() || this.isSubmitting) {
      return;
    }

    // Validate same account selection
    if (this.isSameAccountSelected()) {
      alert('From Account and To Account cannot be the same');
      return;
    }

    // Validate insufficient balance
    if (this.isInsufficientBalance()) {
      alert('Insufficient balance in the From Account');
      return;
    }

    this.isSubmitting = true;

    const transferData: CashTransaction = {
      date: this.f['date'].value,
      customerID: this.f['fromAccountID'].value,
      description: this.f['description'].value,
      amountReceived: this.f['amount'].value,
      amountPaid: 0,
      referenceNo: '',
      type: 'TRANSFER'
    };

    this.cashTransferService.saveCashTransfer(transferData, this.f['toAccountID'].value, this.f['transactionTypeID'].value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Cash transfer saved successfully:', response);
          this.resetForm();
          this.isSubmitting = false;
          // Optionally show success message or navigate
          // this.router.navigate(['/accounts/cash']);
        },
        error: (error) => {
          console.error('Error saving cash transfer:', error);
          this.isSubmitting = false;
          // Handle error - show error message
        }
      });
  }

  private resetForm(): void {
    this.cashTransferForm.reset({
      fromAccountID: 0,
      toAccountID: 0,
      transactionTypeID: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
      balance: 0
    });
    
    this.selectedFromAccount = null;
    this.selectedToAccount = null;
  }

  cancel(): void {
    this.router.navigate(['/accounts/cash']);
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  }

  // Filter accounts to prevent selecting same account
  getToAccountOptions(): TransferAccount[] {
    const fromAccountID = this.f['fromAccountID'].value;
    return this.toAccounts.filter(account => account.customerID !== fromAccountID);
  }

  getFromAccountOptions(): TransferAccount[] {
    const toAccountID = this.f['toAccountID'].value;
    return this.fromAccounts.filter(account => account.customerID !== toAccountID);
  }
}