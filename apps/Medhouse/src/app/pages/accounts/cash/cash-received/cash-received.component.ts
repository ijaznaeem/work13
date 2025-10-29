import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { 
  DailyCash, 
  CashCustomer, 
  Business, 
  Division, 
  Salesman,
  CashReceivedRequest 
} from '../interfaces/cash.interface';
import { CashReceivedService } from '../services/cash-received.service';

@Component({
  selector: 'app-cash-received',
  templateUrl: './cash-received.component.html',
  styleUrls: ['./cash-received.component.scss']
})
export class CashReceivedComponent implements OnInit, OnDestroy {
  @ViewChild('customerListModal', { static: false }) customerListModal!: ElementRef;

  // Forms
  cashForm!: FormGroup;

  // Data
  businesses: Business[] = [];
  divisions: Division[] = [];
  customers: CashCustomer[] = [];
  salesmen: Salesman[] = [];
  selectedCustomer: CashCustomer | null = null;
  
  // Current transaction
  currentTransaction: DailyCash | null = null;
  
  // UI State
  isLoading: boolean = false;
  showCustomerList: boolean = false;
  isSubmitting: boolean = false;

  // Subscriptions
  private destroy$ = new Subject<void>();
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private cashService: CashReceivedService,
    private modalService: NgbModal
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupSubscriptions();
    this.initializeNewTransaction();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeForm(): void {
    this.cashForm = this.fb.group({
      date: [new Date(), Validators.required],
      businessID: [0, Validators.required],
      divisionID: [0, Validators.required],
      customerID: [0, Validators.required],
      description: ['', Validators.required],
      amountReceived: [0, [Validators.required, Validators.min(0.01)]],
      referenceNo: [''],
      salesmanID: [0],
      codNo: ['']
    });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    
    // Load businesses
    this.cashService.getBusinessList().subscribe(
      businesses => {
        this.businesses = businesses;
      },
      error => {
        console.error('Error loading businesses:', error);
      }
    );

    // Load divisions
    this.cashService.getDivisionList().subscribe(
      divisions => {
        this.divisions = divisions;
      },
      error => {
        console.error('Error loading divisions:', error);
      }
    );

    // Load salesmen
    this.cashService.getSalesmenList().subscribe(
      salesmen => {
        this.salesmen = salesmen;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading salesmen:', error);
        this.isLoading = false;
      }
    );
  }

  private setupSubscriptions(): void {
    // Watch for business changes to reload customers
    const businessSub = this.cashForm.get('businessID')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessId => {
        if (businessId && businessId > 0) {
          this.loadCustomers();
        }
      });

    // Watch for division changes to reload customers
    const divisionSub = this.cashForm.get('divisionID')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(divisionId => {
        if (divisionId && divisionId > 0) {
          this.loadCustomers();
        }
      });

    // Watch for customer changes
    const customerSub = this.cashForm.get('customerID')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(customerId => {
        if (customerId && customerId > 0) {
          this.loadCustomerDetails(customerId);
        } else {
          this.selectedCustomer = null;
          this.cashService.setSelectedCustomer(null);
        }
      });

    // Watch for amount received changes to update balance
    const amountSub = this.cashForm.get('amountReceived')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.calculateBalance();
      });

    if (businessSub) this.subscriptions.push(businessSub);
    if (divisionSub) this.subscriptions.push(divisionSub);
    if (customerSub) this.subscriptions.push(customerSub);
    if (amountSub) this.subscriptions.push(amountSub);
  }

  private initializeNewTransaction(): void {
    const sessionId = this.cashService.getCurrentSessionId();
    this.currentTransaction = this.cashService.createNewCashTransaction(sessionId);
    
    this.cashForm.patchValue({
      date: new Date()
    });
  }

  // Data loading methods
  loadCustomers(): void {
    const businessId = this.cashForm.get('businessID')?.value;
    const divisionId = this.cashForm.get('divisionID')?.value;
    
    if (businessId && divisionId) {
      this.cashService.getCustomers(businessId, divisionId).subscribe(
        customers => {
          this.customers = customers;
        },
        error => {
          console.error('Error loading customers:', error);
        }
      );
    }
  }

  loadCustomerDetails(customerId: number): void {
    this.cashService.getCustomerById(customerId).subscribe(
      customer => {
        this.selectedCustomer = customer;
        this.cashService.setSelectedCustomer(customer);
        this.calculateBalance();
      },
      error => {
        console.error('Error loading customer details:', error);
      }
    );
  }

  // Customer selection methods
  openCustomerListModal(): void {
    if (this.customers.length > 0) {
      this.showCustomerList = true;
      this.modalService.open(this.customerListModal, { size: 'lg' });
    } else {
      alert('Please select Business and Division first.');
    }
  }

  selectCustomer(customer: CashCustomer): void {
    this.cashForm.patchValue({
      customerID: customer.customerID
    });
    this.modalService.dismissAll();
  }

  // Calculation methods
  calculateBalance(): void {
    if (this.selectedCustomer && this.currentTransaction) {
      const amountReceived = this.cashForm.get('amountReceived')?.value || 0;
      const newBalance = this.cashService.calculateBalance(this.selectedCustomer, amountReceived);
      this.currentTransaction.balance = newBalance;
    }
  }

  getCurrentBalance(): number {
    return this.currentTransaction?.balance || 0;
  }

  // Form submission
  saveCashReceived(): void {
    if (!this.cashForm.valid || !this.selectedCustomer) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    
    const formValue = this.cashForm.value;
    
    // Create DailyCash object
    const dailyCash: DailyCash = {
      customerID: formValue.customerID,
      customerName: this.selectedCustomer.customerName,
      date: formValue.date,
      description: formValue.description,
      amountPaid: 0,
      amountReceived: formValue.amountReceived,
      balance: this.getCurrentBalance(),
      referenceNo: formValue.referenceNo ? parseInt(formValue.referenceNo) : undefined,
      sessionID: this.cashService.getCurrentSessionId(),
      status: 1,
      salesmanID: formValue.salesmanID || undefined,
      codNo: formValue.codNo || undefined,
      businessID: formValue.businessID,
      divisionID: formValue.divisionID
    };

    // Validate transaction
    const validationErrors = this.cashService.validateCashTransaction(dailyCash);
    if (validationErrors.length > 0) {
      alert('Validation errors: ' + validationErrors.join(', '));
      this.isSubmitting = false;
      return;
    }

    // Create request
    const request: CashReceivedRequest = {
      dailyCash: dailyCash,
      sendSMS: this.selectedCustomer.sendSMS || false,
      processIncentives: true
    };

    // Submit the transaction
    this.cashService.saveCashReceived(request).subscribe(
      response => {
        this.isSubmitting = false;
        
        if (response && response.success) {
          alert(`Cash received transaction saved successfully. Transaction ID: ${response.transactionID}`);
          this.resetForm();
        } else {
          alert('Failed to save transaction: ' + (response?.message || 'Unknown error'));
        }
      },
      error => {
        this.isSubmitting = false;
        console.error('Error saving cash received:', error);
        alert('Error saving transaction. Please try again.');
      }
    );
  }

  // Form utilities
  private markFormGroupTouched(): void {
    Object.keys(this.cashForm.controls).forEach(key => {
      const control = this.cashForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  resetForm(): void {
    this.cashForm.reset();
    this.selectedCustomer = null;
    this.currentTransaction = null;
    this.cashService.setSelectedCustomer(null);
    this.initializeNewTransaction();
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      this.resetForm();
    }
  }

  // UI helper methods
  isFormValid(): boolean {
    return this.cashForm.valid && this.selectedCustomer !== null;
  }

  getBusinessName(businessId: number): string {
    const business = this.businesses.find(b => b.businessID === businessId);
    return business?.businessName || '';
  }

  getDivisionName(divisionId: number): string {
    const division = this.divisions.find(d => d.divisionID === divisionId);
    return division?.divisionName || '';
  }

  getSalesmanName(salesmanId: number): string {
    const salesman = this.salesmen.find(s => s.salesmanID === salesmanId);
    return salesman?.salesmanName || '';
  }

  // Form field getters for template
  get f() { 
    return this.cashForm.controls; 
  }

  // Error checking methods
  hasError(fieldName: string): boolean {
    const field = this.cashForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.cashForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['min']) {
        return `${fieldName} must be greater than ${field.errors['min'].min}`;
      }
    }
    return '';
  }
}