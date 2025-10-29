import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../services/httpbase.service';
import { InvoiceApprovalFormService } from './invoice-approval-form.service';
import {
  Customer,
  Business,
  Division,
  Product,
  BonusSlab,
  InvoiceApprovalFormData,
  InvoiceApprovalDetailFormData,
  InvoiceApprovalDetailView,
  InvoiceApprovalFormState
} from './invoice-approval-form.interface';
import { UserDepartments } from '../invoice-approvals/invoice-approval.interface';

@Component({
  selector: 'app-invoice-approval-form',
  templateUrl: './invoice-approval-form.component.html',
  styleUrls: ['./invoice-approval-form.component.scss']
})
export class InvoiceApprovalFormComponent implements OnInit {

  invoiceForm!: FormGroup;
  detailForm!: FormGroup;
  
  // Data collections
  businesses: Business[] = [];
  divisions: Division[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  invoiceDetails: InvoiceApprovalDetailView[] = [];
  
  // Form state
  formState: InvoiceApprovalFormState = {
    mode: 'new',
    isInvoiceCreated: false,
    invoiceApprovalId: -1,
    timestamp: 0,
    selectedCustomer: null,
    selectedBusiness: null,
    selectedDivision: null,
    discountRatio: 0,
    bonusEnabled: false,
    totalAmount: 0,
    discountAmount: 0,
    netAmount: 0
  };
  
  loading = false;
  calculatedAmount = 0;
  selectedProduct: Product | null = null;
  bonusSlabs: BonusSlab[] = [];

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private http: HttpBase,
    private invoiceFormService: InvoiceApprovalFormService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.startNewInvoice();
  }

  /**
   * Initialize reactive forms
   */
  private initializeForms(): void {
    this.invoiceForm = this.fb.group({
      businessId: [null, Validators.required],
      divisionId: [null, Validators.required],
      customerId: [null, Validators.required]
    });

    this.detailForm = this.fb.group({
      productId: [null, Validators.required],
      qty: [0, [Validators.required, Validators.min(1)]],
      sPrice: [0, [Validators.required, Validators.min(0)]],
      pPrice: [0],
      discRatio: [0, [Validators.min(0), Validators.max(100)]],
      bonus: [0, [Validators.min(0)]],
      batchNo: ['']
    });
  }

  /**
   * Load initial data (businesses, divisions)
   */
  private loadInitialData(): void {
    this.loading = true;
    
    // Load businesses
    this.invoiceFormService.getBusinesses().subscribe({
      next: (businesses) => {
        this.businesses = [
          { BusinessID: -1, BusinessName: '--Select Business--' },
          ...businesses
        ];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading businesses:', error);
        this.loading = false;
      }
    });

    // Load divisions
    this.invoiceFormService.getDivisions().subscribe({
      next: (divisions) => {
        this.divisions = divisions;
      },
      error: (error) => {
        console.error('Error loading divisions:', error);
      }
    });
  }

  /**
   * Start new invoice
   * Matches VB6 StartInvoice function
   */
  private startNewInvoice(): void {
    this.formState.mode = 'new';
    this.formState.isInvoiceCreated = false;
    this.formState.invoiceApprovalId = -1;
    this.formState.timestamp = this.invoiceFormService.generateTimestamp();
    this.resetTotals();
    this.loadInvoiceDetails();
  }

  /**
   * Handle business selection change
   * Matches VB6 cmbBusiness_Click
   */
  onBusinessChange(): void {
    this.loadCustomers();
  }

  /**
   * Handle division selection change
   * Matches VB6 cmbDivsion_Click
   */
  onDivisionChange(): void {
    this.loadCustomers();
  }

  /**
   * Load customers based on business and division
   * Matches VB6 FillCust function
   */
  private loadCustomers(): void {
    const businessId = this.invoiceForm.get('businessId')?.value;
    const divisionId = this.invoiceForm.get('divisionId')?.value || -1;

    if (businessId && businessId !== -1) {
      this.invoiceFormService.getCustomers(divisionId, businessId).subscribe({
        next: (customers) => {
          this.customers = customers;
        },
        error: (error) => {
          console.error('Error loading customers:', error);
        }
      });
    } else {
      this.customers = [];
    }
  }

  /**
   * Handle customer selection
   * Matches VB6 lstCustom_ItemSelected
   */
  onCustomerChange(): void {
    const customerId = this.invoiceForm.get('customerId')?.value;
    
    if (customerId) {
      this.invoiceFormService.getCustomer(customerId).subscribe({
        next: (customer) => {
          this.formState.selectedCustomer = customer;
          this.formState.discountRatio = customer.DiscountRatio;
          this.formState.bonusEnabled = customer.BonusType === 1;
          
          // Update detail form discount ratio
          this.detailForm.patchValue({ discRatio: customer.DiscountRatio });
          
          // Load products
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error loading customer:', error);
        }
      });
    } else {
      this.formState.selectedCustomer = null;
      this.products = [];
    }
  }

  /**
   * Load products for selection
   */
  private loadProducts(): void {
    const customerId = this.formState.selectedCustomer?.CustomerID;
    
    this.invoiceFormService.getProducts(customerId, 1).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  /**
   * Handle product selection
   * Matches VB6 aeDetails_ItemChanged "PRODUCTID" case
   */
  onProductChange(): void {
    const productId = this.detailForm.get('productId')?.value;
    
    if (productId) {
      this.invoiceFormService.getProduct(productId).subscribe({
        next: (product) => {
          this.selectedProduct = product;
          this.detailForm.patchValue({
            sPrice: product.SPrice,
            pPrice: product.PPrice
          });
          
          // Load bonus slabs if bonus is enabled
          if (this.formState.bonusEnabled) {
            this.loadBonusSlabs(productId);
          }
          
          // Check for customer-specific rates
          this.checkCustomerRates(productId);
          
          this.calculateAmount();
        },
        error: (error) => {
          console.error('Error loading product:', error);
        }
      });
    } else {
      this.selectedProduct = null;
      this.bonusSlabs = [];
    }
  }

  /**
   * Load bonus slabs for selected product
   */
  private loadBonusSlabs(productId: number): void {
    this.invoiceFormService.getBonusSlabs(productId).subscribe({
      next: (bonusSlabs) => {
        this.bonusSlabs = bonusSlabs.sort((a, b) => b.Qty - a.Qty); // Sort descending by qty
      },
      error: (error) => {
        console.error('Error loading bonus slabs:', error);
      }
    });
  }

  /**
   * Check customer-specific rates
   * Matches VB6 CheckRates function
   */
  private checkCustomerRates(productId: number): void {
    if (!this.formState.selectedCustomer) return;

    this.invoiceFormService.getCustomerRates(
      this.formState.selectedCustomer.CustomerID,
      productId
    ).subscribe({
      next: (customerRate) => {
        if (customerRate) {
          if (customerRate.DiscRatio !== undefined) {
            this.detailForm.patchValue({ discRatio: customerRate.DiscRatio });
          }
          if (customerRate.CustomRate && customerRate.CustomRate > 0) {
            this.detailForm.patchValue({ sPrice: customerRate.CustomRate });
          }
        }
      },
      error: (error) => {
        console.error('Error loading customer rates:', error);
      }
    });
  }

  /**
   * Handle quantity or price change
   * Matches VB6 aeDetails_ItemChanged "QTY", "SPRICE" cases
   */
  onQuantityOrPriceChange(): void {
    this.calculateAmount();
    this.calculateBonus();
  }

  /**
   * Calculate amount for current item
   */
  calculateAmount(): void {
    const qty = this.detailForm.get('qty')?.value || 0;
    const sPrice = this.detailForm.get('sPrice')?.value || 0;
    this.calculatedAmount = qty * sPrice;
  }

  /**
   * Calculate bonus based on quantity
   * Matches VB6 bonus calculation logic
   */
  private calculateBonus(): void {
    if (!this.formState.bonusEnabled || this.bonusSlabs.length === 0) {
      this.detailForm.patchValue({ bonus: 0 });
      return;
    }

    const qty = this.detailForm.get('qty')?.value || 0;
    let bonus = 0;
    let remainingQty = qty;

    for (const slab of this.bonusSlabs) {
      if (remainingQty >= slab.Qty) {
        bonus += slab.Bonus * Math.floor(remainingQty / slab.Qty);
        remainingQty = remainingQty % slab.Qty;
      }
    }

    this.detailForm.patchValue({ bonus: bonus });
  }

  /**
   * Add product to invoice
   * Matches VB6 btnAddToInv_Click
   */
  addToInvoice(): void {
    if (this.detailForm.invalid || !this.formState.selectedCustomer || !this.selectedProduct) {
      alert('Please fill all required fields and select customer');
      return;
    }

    const qty = this.detailForm.get('qty')?.value || 0;
    const bonus = this.detailForm.get('bonus')?.value || 0;
    const availableStock = this.selectedProduct.Stock;

    // Check stock availability including bonus
    if ((qty + bonus) > availableStock) {
      alert('Not enough stock');
      return;
    }

    // Create detail record
    const detail: InvoiceApprovalDetailFormData = {
      InvoiceApprovalID: this.formState.invoiceApprovalId,
      ProductID: this.detailForm.get('productId')?.value,
      Qty: qty,
      SPrice: this.detailForm.get('sPrice')?.value,
      PPrice: this.detailForm.get('pPrice')?.value,
      StockID: 0,
      DiscRatio: this.detailForm.get('discRatio')?.value || 0,
      BatchNo: this.detailForm.get('batchNo')?.value || '',
      Bonus: bonus,
      TimeStamp: this.formState.timestamp
    };

    this.invoiceFormService.saveInvoiceApprovalDetail(detail).subscribe({
      next: () => {
        this.detailForm.reset();
        this.detailForm.patchValue({ 
          discRatio: this.formState.discountRatio,
          productId: null 
        });
        this.selectedProduct = null;
        this.calculatedAmount = 0;
        this.loadInvoiceDetails();
      },
      error: (error) => {
        console.error('Error saving detail:', error);
        alert('Error adding product to invoice');
      }
    });
  }

  /**
   * Delete selected detail
   * Matches VB6 btnDel_Click
   */
  deleteDetail(detail: InvoiceApprovalDetailView): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.invoiceFormService.deleteInvoiceApprovalDetail(detail.DetailID).subscribe({
        next: () => {
          this.loadInvoiceDetails();
        },
        error: (error) => {
          console.error('Error deleting detail:', error);
          alert('Error deleting item');
        }
      });
    }
  }

  /**
   * Load invoice details
   * Matches VB6 SelectMed2 function
   */
  private loadInvoiceDetails(): void {
    this.invoiceFormService.getInvoiceApprovalDetails(
      this.formState.invoiceApprovalId,
      this.formState.timestamp
    ).subscribe({
      next: (details) => {
        this.invoiceDetails = details.map((detail, index) => ({
          ...detail,
          SNO: index + 1
        }));
        this.calculateTotals();
      },
      error: (error) => {
        console.error('Error loading invoice details:', error);
      }
    });
  }

  /**
   * Calculate invoice totals
   * Matches VB6 calculation logic
   */
  private calculateTotals(): void {
    this.formState.totalAmount = this.invoiceDetails.reduce((sum, detail) => sum + detail.Amount, 0);
    this.formState.discountAmount = this.invoiceDetails.reduce((sum, detail) => sum + detail.Discount, 0);
    this.formState.netAmount = this.formState.totalAmount - this.formState.discountAmount;
  }

  /**
   * Reset totals
   */
  private resetTotals(): void {
    this.formState.totalAmount = 0;
    this.formState.discountAmount = 0;
    this.formState.netAmount = 0;
  }

  /**
   * Save invoice
   * Matches VB6 btnSave2_Click and SaveInvoice function
   */
  saveInvoice(): void {
    if (this.invoiceForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    if (this.invoiceDetails.length === 0) {
      alert('No record to save');
      return;
    }

    if (!this.formState.selectedCustomer) {
      alert('No customer selected');
      return;
    }

    const invoiceData: InvoiceApprovalFormData = {
      CustomerID: this.formState.selectedCustomer.CustomerID,
      CustomerName: this.formState.selectedCustomer.CustomerName,
      Date: new Date(),
      Amount: this.formState.totalAmount,
      Discount: this.formState.discountAmount,
      NetAmount: this.formState.netAmount,
      AmntRecvd: 0,
      SessionID: 1, // This should come from session service
      SalesmanID: this.invoiceForm.get('businessId')?.value,
      DivisionID: this.invoiceForm.get('divisionId')?.value,
      BusinessID: this.invoiceForm.get('businessId')?.value,
      DtCr: 'CR',
      Type: 1,
      Status: 'In Process',
      ForwardedTo: UserDepartments.grpGM
    };

    this.invoiceFormService.saveInvoiceApproval(invoiceData).subscribe({
      next: (invoiceId) => {
        // Update details with final invoice ID
        this.invoiceFormService.updateInvoiceApprovalDetailsId(
          invoiceId,
          this.formState.timestamp
        ).subscribe({
          next: () => {
            alert('Invoice approval saved successfully');
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating detail IDs:', error);
            alert('Error finalizing invoice');
          }
        });
      },
      error: (error) => {
        console.error('Error saving invoice:', error);
        alert('Error saving invoice');
      }
    });
  }

  /**
   * Cancel invoice
   * Matches VB6 CancelInvoice function
   */
  cancelInvoice(): void {
    if (this.formState.timestamp > 0) {
      this.invoiceFormService.deleteTempInvoiceApprovalDetails(this.formState.timestamp).subscribe({
        next: () => {
          this.closeModal();
        },
        error: (error) => {
          console.error('Error canceling invoice:', error);
          this.closeModal();
        }
      });
    } else {
      this.closeModal();
    }
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.bsModalRef.hide();
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
   * Track by function for ngFor
   */
  trackByDetailId(index: number, item: InvoiceApprovalDetailView): number {
    return item.DetailID;
  }
}