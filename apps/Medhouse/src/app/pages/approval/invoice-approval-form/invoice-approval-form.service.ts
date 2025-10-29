import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpBase } from '../../../services/httpbase.service';
import { 
  Customer, 
  Business, 
  Division, 
  Product, 
  BonusSlab, 
  CustomerRate,
  InvoiceApprovalFormData,
  InvoiceApprovalDetailFormData,
  InvoiceApprovalDetailView
} from './invoice-approval-form.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceApprovalFormService {

  constructor(private httpBase: HttpBase) { }

  /**
   * Get all businesses
   */
  getBusinesses(): Observable<Business[]> {
    // In production: return this.httpBase.getData('businesses');
    return of(this.getMockBusinesses());
  }

  /**
   * Get all divisions
   */
  getDivisions(): Observable<Division[]> {
    // In production: return this.httpBase.getData('divisions');
    return of(this.getMockDivisions());
  }

  /**
   * Get customers by division and business
   * Matches VB6 FillCustomers function
   */
  getCustomers(divisionId: number, businessId: number): Observable<Customer[]> {
    const params = {
      divisionId: divisionId === -1 ? null : divisionId,
      businessId,
      status: 1,
      acctType: 'Customer'
    };
    // In production: return this.httpBase.getData('qrycustomers', params);
    return of(this.getMockCustomers().filter(c => 
      (divisionId === -1 || c.DivisionID === divisionId) && 
      c.BusinessID === businessId &&
      c.Status === 1 &&
      c.AcctType === 'Customer'
    ));
  }

  /**
   * Get customer by ID
   */
  getCustomer(customerId: number): Observable<Customer> {
    // In production: return this.httpBase.getData('customers', { CustomerID: customerId });
    const customer = this.getMockCustomers().find(c => c.CustomerID === customerId);
    return of(customer!);
  }

  /**
   * Get products for stock selection
   * Matches VB6 qryStockSummaryFG query
   */
  getProducts(customerId?: number, type: number = 1): Observable<Product[]> {
    const params: any = { Type: type };
    if (customerId) {
      // Add customer-specific filtering if needed
      params['CustomerId'] = customerId;
    }
    // In production: return this.httpBase.getData('qryStockSummaryFG', params);
    return of(this.getMockProducts().filter(p => p.Type === type));
  }

  /**
   * Get product by ID
   */
  getProduct(productId: number): Observable<Product> {
    // In production: return this.httpBase.getData('qryStockSummaryFG', { ProductID: productId });
    const product = this.getMockProducts().find(p => p.ProductID === productId);
    return of(product!);
  }

  /**
   * Get bonus slabs for a product
   */
  getBonusSlabs(productId: number): Observable<BonusSlab[]> {
    // In production: return this.httpBase.getData('bonusslabs', { ProductID: productId });
    return of(this.getMockBonusSlabs().filter(b => b.ProductID === productId));
  }

  /**
   * Get customer rates for specific product
   */
  getCustomerRates(customerId: number, productId: number): Observable<CustomerRate | null> {
    const params = { CustomerID: customerId, ProductID: productId };
    // In production: return this.httpBase.getData('customerrates', params);
    const rate = this.getMockCustomerRates().find(r => 
      r.CustomerID === customerId && r.ProductID === productId
    );
    return of(rate || null);
  }

  /**
   * Save invoice approval
   * Matches VB6 SaveInvoice function
   */
  saveInvoiceApproval(invoice: InvoiceApprovalFormData): Observable<number> {
    // In production: return this.httpBase.postData('invoiceapprovals', invoice);
    console.log('Saving invoice approval:', invoice);
    return of(Math.floor(Math.random() * 1000) + 1); // Return mock ID
  }

  /**
   * Save invoice approval detail
   */
  saveInvoiceApprovalDetail(detail: InvoiceApprovalDetailFormData): Observable<number> {
    // In production: return this.httpBase.postData('invoiceapprovaldetails', detail);
    console.log('Saving invoice approval detail:', detail);
    return of(Math.floor(Math.random() * 1000) + 1); // Return mock ID
  }

  /**
   * Delete invoice approval detail
   */
  deleteInvoiceApprovalDetail(detailId: number): Observable<boolean> {
    // In production: return this.httpBase.deleteData('invoiceapprovaldetails', detailId);
    console.log('Deleting invoice approval detail:', detailId);
    return of(true);
  }

  /**
   * Get invoice approval details for display
   * Matches VB6 SelectMed2 function query
   */
  getInvoiceApprovalDetails(invoiceApprovalId: number, timestamp?: number): Observable<InvoiceApprovalDetailView[]> {
    const params: any = { InvoiceApprovalID: invoiceApprovalId };
    if (timestamp) {
      params['TimeStamp'] = timestamp;
    }
    // In production: return this.httpBase.getData('qryinvoiceapprovaldetails', params);
    return of(this.getMockInvoiceApprovalDetails(invoiceApprovalId));
  }

  /**
   * Delete temporary invoice approval details
   * Matches VB6 CancelInvoice function
   */
  deleteTempInvoiceApprovalDetails(timestamp: number): Observable<boolean> {
    const params = { InvoiceApprovalID: -1, TimeStamp: timestamp };
    // In production: return this.httpBase.deleteData('invoiceapprovaldetails', params);
    console.log('Deleting temp invoice approval details for timestamp:', timestamp);
    return of(true);
  }

  /**
   * Update invoice approval details with final ID
   * Matches VB6 SaveInvoice function update
   */
  updateInvoiceApprovalDetailsId(finalId: number, timestamp: number): Observable<boolean> {
    const data = { InvoiceApprovalID: finalId, TimeStamp: timestamp };
    // In production: return this.httpBase.putData('invoiceapprovaldetails/updateid', data);
    console.log('Updating invoice approval details ID:', data);
    return of(true);
  }

  /**
   * Generate timestamp for temporary records
   */
  generateTimestamp(): number {
    return Date.now();
  }

  // Mock data methods
  private getMockBusinesses(): Business[] {
    return [
      { BusinessID: 1, BusinessName: 'Retail Pharmacy' },
      { BusinessID: 2, BusinessName: 'Wholesale Distribution' },
      { BusinessID: 3, BusinessName: 'Hospital Supply' }
    ];
  }

  private getMockDivisions(): Division[] {
    return [
      { DivisionID: 1, DivisionName: 'Karachi Division', Status: 1 },
      { DivisionID: 2, DivisionName: 'Lahore Division', Status: 1 },
      { DivisionID: 3, DivisionName: 'Islamabad Division', Status: 1 }
    ];
  }

  private getMockCustomers(): Customer[] {
    return [
      {
        CustomerID: 1,
        CustomerName: 'ABC Pharmacy',
        Address: '123 Main Street, Karachi',
        Balance: 25000,
        Limit: 50000,
        DiscountRatio: 10,
        BonusType: 1,
        PhoneNo1: '03001234567',
        City: 'Karachi',
        DivisionID: 1,
        BusinessID: 1,
        Status: 1,
        AcctType: 'Customer'
      },
      {
        CustomerID: 2,
        CustomerName: 'XYZ Medical Store',
        Address: '456 Business Avenue, Lahore',
        Balance: 15000,
        Limit: 30000,
        DiscountRatio: 8,
        BonusType: 0,
        PhoneNo1: '03007654321',
        City: 'Lahore',
        DivisionID: 2,
        BusinessID: 1,
        Status: 1,
        AcctType: 'Customer'
      },
      {
        CustomerID: 3,
        CustomerName: 'City Healthcare',
        Address: '789 Healthcare Complex, Islamabad',
        Balance: 5000,
        Limit: 20000,
        DiscountRatio: 5,
        BonusType: 0,
        PhoneNo1: '03009876543',
        City: 'Islamabad',
        DivisionID: 3,
        BusinessID: 2,
        Status: 1,
        AcctType: 'Customer'
      }
    ];
  }

  private getMockProducts(): Product[] {
    return [
      {
        ProductID: 101,
        ProductName: 'Panadol 500mg Tablets',
        Stock: 500,
        SPrice: 120,
        PPrice: 100,
        Type: 1,
        BatchNo: 'PND001'
      },
      {
        ProductID: 102,
        ProductName: 'Brufen 400mg Tablets',
        Stock: 300,
        SPrice: 60,
        PPrice: 50,
        Type: 1,
        BatchNo: 'BRF001'
      },
      {
        ProductID: 201,
        ProductName: 'Amoxil 250mg Capsules',
        Stock: 200,
        SPrice: 80,
        PPrice: 65,
        Type: 1,
        BatchNo: 'AMX001'
      },
      {
        ProductID: 202,
        ProductName: 'Calpol Syrup 120ml',
        Stock: 150,
        SPrice: 80,
        PPrice: 70,
        Type: 1,
        BatchNo: 'CAL001'
      }
    ];
  }

  private getMockBonusSlabs(): BonusSlab[] {
    return [
      { SlabID: 1, ProductID: 101, Qty: 100, Bonus: 10 },
      { SlabID: 2, ProductID: 101, Qty: 50, Bonus: 5 },
      { SlabID: 3, ProductID: 102, Qty: 60, Bonus: 6 },
      { SlabID: 4, ProductID: 201, Qty: 100, Bonus: 10 },
      { SlabID: 5, ProductID: 202, Qty: 50, Bonus: 5 }
    ];
  }

  private getMockCustomerRates(): CustomerRate[] {
    return [
      { CustomerID: 1, ProductID: 101, CustomRate: 115, DiscRatio: 12 },
      { CustomerID: 1, ProductID: 102, DiscRatio: 15 },
      { CustomerID: 2, ProductID: 201, CustomRate: 75 }
    ];
  }

  private getMockInvoiceApprovalDetails(invoiceApprovalId: number): InvoiceApprovalDetailView[] {
    const detailsMap: { [key: number]: InvoiceApprovalDetailView[] } = {
      1: [
        {
          SNO: 1,
          ProductName: 'Panadol 500mg Tablets',
          Qty: 100,
          Bonus: 10,
          SPrice: 120,
          Amount: 12000,
          Discount: 1200,
          NetAmount: 10800,
          BatchNo: 'PND001',
          ProductID: 101,
          DetailID: 1,
          TimeStamp: Date.now()
        },
        {
          SNO: 2,
          ProductName: 'Brufen 400mg Tablets',
          Qty: 50,
          Bonus: 5,
          SPrice: 60,
          Amount: 3000,
          Discount: 300,
          NetAmount: 2700,
          BatchNo: 'BRF001',
          ProductID: 102,
          DetailID: 2,
          TimeStamp: Date.now()
        }
      ]
    };

    return detailsMap[invoiceApprovalId] || [];
  }
}