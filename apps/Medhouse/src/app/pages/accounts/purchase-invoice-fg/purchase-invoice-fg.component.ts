import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { 
  Customer, 
  Product, 
  PurchaseInvoiceFG, 
  PurchaseInvoiceDetail 
} from '../interfaces/purchase-invoice-fg.interface';
import { PurchaseInvoiceFgService } from '../services/purchase-invoice-fg.service';

@Component({
  selector: 'app-purchase-invoice-fg',
  templateUrl: './purchase-invoice-fg.component.html',
  styleUrls: ['./purchase-invoice-fg.component.scss']
})
export class PurchaseInvoiceFgComponent implements OnInit, OnDestroy {
  @ViewChild('customerModal', { static: false }) customerModal!: ElementRef;
  @ViewChild('qtyInput', { static: false }) qtyInput!: ElementRef;

  // Forms
  invoiceForm!: FormGroup;
  itemForm!: FormGroup;
  customerForm!: FormGroup;

  // Data
  customers: Customer[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCustomer: Customer | null = null;
  selectedProduct: Product | null = null;
  
  // Invoice data
  currentInvoice: PurchaseInvoiceFG | null = null;
  invoiceDetails: PurchaseInvoiceDetail[] = [];
  
  // UI State
  isInvoiceMode: boolean = false;
  isLoading: boolean = false;
  showCustomerList: boolean = false;
  showProductList: boolean = false;
  
  // Calculated totals
  totalAmount: number = 0;
  totalCommission: number = 0;
  balanceAmount: number = 0;

  // Search subjects
  private productSearchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private subscriptions: Subscription[] = [];

  // Grid columns for invoice details
  invoiceColumns = [
    { key: 'sno', title: 'S.No', width: '50px' },
    { key: 'productName', title: 'Product Name', width: '200px' },
    { key: 'qty', title: 'Qty', width: '80px', type: 'number' },
    { key: 'packing', title: 'Packing', width: '80px', type: 'number' },
    { key: 'pPrice', title: 'P.Price', width: '100px', type: 'currency' },
    { key: 'sPrice', title: 'S.Price', width: '100px', type: 'currency' },
    { key: 'batchNo', title: 'Batch No', width: '100px' },
    { key: 'amount', title: 'Amount', width: '120px', type: 'currency' },
    { key: 'actions', title: 'Actions', width: '80px' }
  ];

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseInvoiceFgService,
    private modalService: NgbModal
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupSubscriptions();
    this.setupProductSearch();
    this.startNewInvoice();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeForms(): void {
    this.invoiceForm = this.fb.group({
      customerSearch: [''],
      amountPaid: [0, [Validators.min(0)]],
      commission: [0]
    });

    this.itemForm = this.fb.group({
      productSearch: ['', Validators.required],
      qty: [0, [Validators.required, Validators.min(0.001)]],
      packing: [{ value: 0, disabled: true }],
      pPrice: [0, [Validators.required, Validators.min(0.01)]],
      sPrice: [0, [Validators.required, Validators.min(0.01)]],
      batchNo: ['', Validators.required],
      commRatio: [0, [Validators.min(0), Validators.max(100)]],
      amount: [{ value: 0, disabled: true }]
    });

    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      address: [''],
      city: [''],
      acctTypeId: [7]
    });
  }

  private loadInitialData(): void {
    this.loadCustomers();
    this.loadProducts('');
  }

  private setupSubscriptions(): void {
    // Watch for current invoice changes
    const invoiceSub = this.purchaseService.currentInvoice$
      .pipe(takeUntil(this.destroy$))
      .subscribe(invoice => {
        this.currentInvoice = invoice;
        this.updateInvoiceTotals();
      });

    // Watch for invoice details changes
    const detailsSub = this.purchaseService.invoiceDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe(details => {
        this.invoiceDetails = details;
        this.updateInvoiceTotals();
      });

    // Watch for amount paid changes
    const amountPaidSub = this.invoiceForm.get('amountPaid')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(amountPaid => {
        if (typeof amountPaid === 'number') {
          this.purchaseService.updateAmountPaid(amountPaid);
          this.calculateBalance();
        }
      });

    // Watch for item form changes to calculate amount
    const itemValuesSub = this.itemForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.calculateItemAmount();
      });

    this.subscriptions.push(invoiceSub, detailsSub);
    if (amountPaidSub) this.subscriptions.push(amountPaidSub);
    if (itemValuesSub) this.subscriptions.push(itemValuesSub);
  }

  private setupProductSearch(): void {
    this.productSearchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.loadProducts(searchTerm);
      });
  }

  // Data loading methods
  loadCustomers(): void {
    this.purchaseService.getCustomers().subscribe(
      customers => {
        this.customers = customers;
      },
      error => {
        console.error('Error loading customers:', error);
      }
    );
  }

  loadProducts(searchTerm: string): void {
    this.purchaseService.getProducts(searchTerm).subscribe(
      products => {
        this.products = products;
        this.filteredProducts = products;
      },
      error => {
        console.error('Error loading products:', error);
      }
    );
  }

  // Customer operations
  onCustomerSearch(event: any): void {
    const searchTerm = event.target.value;
    if (searchTerm.length > 0) {
      this.showCustomerList = true;
    } else {
      this.showCustomerList = false;
    }
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.purchaseService.setSelectedCustomer(customer);
    this.invoiceForm.patchValue({
      customerSearch: customer.customerName
    });
    this.showCustomerList = false;
  }

  openNewCustomerModal(): void {
    this.customerForm.reset({ acctTypeId: 7 });
    this.modalService.open(this.customerModal, { size: 'lg' });
  }

  saveNewCustomer(): void {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      this.purchaseService.createNewCustomer(customerData).subscribe(
        (newCustomer: Customer) => {
          this.customers.push(newCustomer);
          this.selectCustomer(newCustomer);
          this.modalService.dismissAll();
        },
        error => {
          console.error('Error creating customer:', error);
        }
      );
    }
  }

  // Product operations
  onProductSearch(event: any): void {
    const searchTerm = event.target.value;
    this.productSearchSubject.next(searchTerm);
    this.showProductList = searchTerm.length > 0;
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.itemForm.patchValue({
      productSearch: product.productName,
      pPrice: product.pPrice,
      sPrice: product.sPrice,
      packing: product.packing
    });
    this.showProductList = false;
    
    // Focus on quantity input
    setTimeout(() => {
      if (this.qtyInput) {
        this.qtyInput.nativeElement.focus();
      }
    }, 100);
  }

  // Item operations
  calculateItemAmount(): void {
    const pPrice = this.itemForm.get('pPrice')?.value || 0;
    const qty = this.itemForm.get('qty')?.value || 0;
    const amount = this.purchaseService.calculateAmount(pPrice, qty);
    
    this.itemForm.patchValue({ amount }, { emitEvent: false });
  }

  addItemToInvoice(): void {
    if (!this.selectedProduct || !this.itemForm.valid) {
      return;
    }

    const formValue = this.itemForm.value;
    const invoiceItem: PurchaseInvoiceDetail = {
      invoiceID: -1,
      productID: this.selectedProduct.productID,
      productName: this.selectedProduct.productName,
      qty: formValue.qty,
      packing: formValue.packing,
      pPrice: formValue.pPrice,
      sPrice: formValue.sPrice,
      batchNo: formValue.batchNo,
      amount: formValue.amount,
      commRatio: formValue.commRatio || 0
    };

    // Validate item
    const validationErrors = this.purchaseService.validateInvoiceItem(invoiceItem);
    if (validationErrors.length > 0) {
      alert('Validation errors: ' + validationErrors.join(', '));
      return;
    }

    this.purchaseService.addItemToInvoice(invoiceItem).subscribe(
      success => {
        if (success) {
          this.resetItemForm();
          // Focus back to product search
          setTimeout(() => {
            const productSearchEl = document.querySelector('[formControlName="productSearch"]') as HTMLElement;
            if (productSearchEl) {
              productSearchEl.focus();
            }
          }, 100);
        }
      },
      error => {
        console.error('Error adding item:', error);
      }
    );
  }

  removeItem(detailId: number): void {
    if (confirm('Are you sure you want to remove this item?')) {
      this.purchaseService.removeItemFromInvoice(detailId).subscribe(
        success => {
          if (!success) {
            console.error('Error removing item');
          }
        },
        error => {
          console.error('Error removing item:', error);
        }
      );
    }
  }

  private resetItemForm(): void {
    this.itemForm.reset({
      qty: 0,
      pPrice: 0,
      sPrice: 0,
      packing: 0,
      commRatio: 0,
      amount: 0
    });
    this.selectedProduct = null;
  }

  // Invoice operations
  startNewInvoice(): void {
    this.purchaseService.startNewInvoice();
    this.isInvoiceMode = true;
    this.selectedCustomer = null;
    this.invoiceForm.reset({ amountPaid: 0, commission: 0 });
    this.resetItemForm();
  }

  saveInvoice(printInvoice: boolean = false): void {
    if (!this.selectedCustomer || this.invoiceDetails.length === 0) {
      alert('Please select a customer and add at least one item.');
      return;
    }

    this.isLoading = true;
    
    this.purchaseService.saveInvoice(printInvoice).subscribe(
      invoiceId => {
        this.isLoading = false;
        alert(`Invoice saved successfully. Invoice ID: ${invoiceId}`);
        
        if (printInvoice) {
          this.printInvoice(invoiceId);
        }
        
        this.startNewInvoice();
      },
      error => {
        this.isLoading = false;
        console.error('Error saving invoice:', error);
        alert('Error saving invoice. Please try again.');
      }
    );
  }

  cancelInvoice(): void {
    if (confirm('Are you sure you want to cancel this invoice? All unsaved data will be lost.')) {
      this.purchaseService.cancelInvoice().subscribe(
        () => {
          this.isInvoiceMode = false;
          this.startNewInvoice();
        },
        error => {
          console.error('Error canceling invoice:', error);
        }
      );
    }
  }

  printInvoice(invoiceId: number): void {
    // Implement print functionality
    window.print();
  }

  // Calculation methods
  private updateInvoiceTotals(): void {
    if (this.currentInvoice) {
      this.totalAmount = this.currentInvoice.amount;
      this.calculateBalance();
    }
    
    this.totalCommission = this.invoiceDetails.reduce(
      (sum, item) => sum + (item.amount * item.commRatio / 100), 0
    );
  }

  private calculateBalance(): void {
    const amountPaid = this.invoiceForm.get('amountPaid')?.value || 0;
    this.balanceAmount = this.totalAmount - amountPaid;
  }

  // UI helper methods
  getCustomerBalance(): number {
    return this.selectedCustomer?.balance || 0;
  }

  isFormValid(): boolean {
    return this.selectedCustomer !== null && 
           this.invoiceDetails.length > 0 && 
           this.invoiceForm.valid;
  }

  // Keyboard event handlers
  onEnterKey(event: KeyboardEvent, action: string): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      
      switch (action) {
        case 'addItem':
          this.addItemToInvoice();
          break;
        case 'save':
          this.saveInvoice();
          break;
        default:
          break;
      }
    }
  }
}