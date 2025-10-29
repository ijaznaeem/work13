import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { SupplierPaymentService } from '../services/supplier-payment.service';
import { DailyCash, CashCustomer, Business, Division, CashTransaction } from '../interfaces/cash.interface';

@Component({
  selector: 'app-supplier-payment',
  templateUrl: './supplier-payment.component.html',
  styleUrls: ['./supplier-payment.component.scss']
})
export class SupplierPaymentComponent implements OnInit, OnDestroy {
  supplierPaymentForm!: FormGroup;
  
  // Data arrays
  suppliers: CashCustomer[] = [];
  businesses: Business[] = [];
  divisions: Division[] = [];
  
  // Selected data
  selectedSupplier: CashCustomer | null = null;
  
  // State management
  isLoading = false;
  isSubmitting = false;
  
  // Component lifecycle
  private destroy$ = new Subject<void>();
  
  // Form getters for easy access
  get f() { return this.supplierPaymentForm.controls; }

  constructor(
    private fb: FormBuilder,
    private supplierPaymentService: SupplierPaymentService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.supplierPaymentForm = this.fb.group({
      businessID: [0, [Validators.required, Validators.min(1)]],
      divisionID: [0, [Validators.required, Validators.min(1)]],
      supplierID: [0, [Validators.required, Validators.min(1)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['', [Validators.required, Validators.minLength(3)]],
      amountPaid: [0, [Validators.required, Validators.min(0.01)]],
      referenceNo: [''],
      sessionID: [1],
      status: [1]
    });
  }

  private setupFormSubscriptions(): void {
    // Listen to business changes to load divisions
    this.f['businessID'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessID => {
        if (businessID && businessID > 0) {
          this.loadDivisions(businessID);
        } else {
          this.divisions = [];
          this.f['divisionID'].setValue(0);
        }
      });

    // Listen to division changes to load suppliers
    this.f['divisionID'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(divisionID => {
        if (divisionID && divisionID > 0 && this.f['businessID'].value > 0) {
          this.loadSuppliers(this.f['businessID'].value, divisionID);
        } else {
          this.suppliers = [];
          this.f['supplierID'].setValue(0);
          this.selectedSupplier = null;
        }
      });

    // Listen to supplier changes to update supplier details
    this.f['supplierID'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(supplierID => {
        if (supplierID && supplierID > 0) {
          this.onSupplierChange(supplierID);
        } else {
          this.selectedSupplier = null;
        }
      });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    
    this.supplierPaymentService.getBusinesses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (businesses) => {
          this.businesses = businesses;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading businesses:', error);
          this.isLoading = false;
        }
      });
  }

  private loadDivisions(businessID: number): void {
    this.supplierPaymentService.getDivisions(businessID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (divisions) => {
          this.divisions = divisions;
        },
        error: (error) => {
          console.error('Error loading divisions:', error);
        }
      });
  }

  private loadSuppliers(businessID: number, divisionID: number): void {
    this.supplierPaymentService.getSuppliers(businessID, divisionID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (suppliers) => {
          this.suppliers = suppliers;
        },
        error: (error) => {
          console.error('Error loading suppliers:', error);
        }
      });
  }

  selectSupplier(supplier: CashCustomer): void {
    this.selectedSupplier = supplier;
    this.f['supplierID'].setValue(supplier.customerID);
  }

  private onSupplierChange(supplierID: number): void {
    const supplier = this.suppliers.find(s => s.customerID === supplierID);
    if (supplier) {
      this.selectedSupplier = supplier;
    }
  }

  getCurrentBalance(): number {
    if (!this.selectedSupplier) return 0;
    
    const amountPaid = this.f['amountPaid'].value || 0;
    return (this.selectedSupplier.balance || 0) - amountPaid;
  }

  isFormValid(): boolean {
    return this.supplierPaymentForm.valid && this.selectedSupplier !== null;
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
      businessID: 'Business',
      divisionID: 'Division',
      supplierID: 'Supplier',
      date: 'Date',
      description: 'Description',
      amountPaid: 'Amount Paid'
    };
    
    return fieldNames[controlName] || controlName;
  }

  saveSupplierPayment(): void {
    if (!this.isFormValid() || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const paymentData: CashTransaction = {
      customerID: this.f['supplierID'].value,
      date: this.f['date'].value,
      description: this.f['description'].value,
      amountPaid: this.f['amountPaid'].value,
      amountReceived: 0,
      referenceNo: this.f['referenceNo'].value || '',
      sessionID: this.f['sessionID'].value,
      status: this.f['status'].value
    };

    this.supplierPaymentService.saveSupplierPayment(paymentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Supplier payment saved successfully:', response);
          this.resetForm();
          this.isSubmitting = false;
          // Optionally show success message or navigate
          // this.router.navigate(['/accounts/cash']);
        },
        error: (error) => {
          console.error('Error saving supplier payment:', error);
          this.isSubmitting = false;
          // Handle error - show error message
        }
      });
  }

  private resetForm(): void {
    this.supplierPaymentForm.reset({
      businessID: 0,
      divisionID: 0,
      supplierID: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      amountPaid: 0,
      referenceNo: '',
      sessionID: 1,
      status: 1
    });
    
    this.selectedSupplier = null;
    this.suppliers = [];
    this.divisions = [];
  }

  cancel(): void {
    this.router.navigate(['/accounts/cash']);
  }

  // Validation method for budget checking
  private validateBudget(): boolean {
    if (!this.selectedSupplier || !this.f['amountPaid'].value) {
      return true; // Skip validation if no supplier or amount
    }

    const amountPaid = this.f['amountPaid'].value;
    const availableBalance = this.selectedSupplier.balance || 0;

    if (amountPaid > availableBalance) {
      return false;
    }

    return true;
  }

  // Method to check if amount exceeds available balance
  isAmountExceedsBalance(): boolean {
    if (!this.selectedSupplier) return false;
    
    const amountPaid = this.f['amountPaid'].value || 0;
    const availableBalance = this.selectedSupplier.balance || 0;
    
    return amountPaid > availableBalance;
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  }

  // Check if supplier is payable (has positive balance)
  isSupplierPayable(supplier: CashCustomer): boolean {
    return (supplier.balance || 0) > 0;
  }
}