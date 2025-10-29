import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DailyCash, CashCustomer, Business, Division, CashTransaction } from '../interfaces/cash.interface';

@Injectable({
  providedIn: 'root'
})
export class SupplierPaymentService {
  private baseUrl = 'api/cash'; // Update with your actual API base URL

  constructor(private http: HttpClient) {}

  /**
   * Get all businesses for dropdown selection
   */
  getBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.baseUrl}/businesses`)
      .pipe(
        catchError(error => {
          console.error('Error fetching businesses:', error);
          return of(this.getMockBusinesses());
        })
      );
  }

  /**
   * Get divisions by business ID
   */
  getDivisions(businessID: number): Observable<Division[]> {
    const params = new HttpParams().set('businessID', businessID.toString());
    
    return this.http.get<Division[]>(`${this.baseUrl}/divisions`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching divisions:', error);
          return of(this.getMockDivisions(businessID));
        })
      );
  }

  /**
   * Get suppliers (customers with account type 7 or 17) by business and division
   */
  getSuppliers(businessID: number, divisionID: number): Observable<CashCustomer[]> {
    const params = new HttpParams()
      .set('businessID', businessID.toString())
      .set('divisionID', divisionID.toString())
      .set('accountTypes', '7,17') // Supplier account types as per VB6 code
      .set('status', '1'); // Active suppliers only
    
    return this.http.get<CashCustomer[]>(`${this.baseUrl}/suppliers`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching suppliers:', error);
          return of(this.getMockSuppliers());
        })
      );
  }

  /**
   * Get supplier details by ID
   */
  getSupplierDetails(supplierID: number): Observable<CashCustomer> {
    return this.http.get<CashCustomer>(`${this.baseUrl}/suppliers/${supplierID}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching supplier details:', error);
          return of(this.getMockSupplier(supplierID));
        })
      );
  }

  /**
   * Check available budget for a supplier
   */
  checkAvailableBudget(supplierID: number, budgetType: number = 2): Observable<number> {
    const params = new HttpParams()
      .set('supplierID', supplierID.toString())
      .set('budgetType', budgetType.toString());
    
    return this.http.get<{ budget: number }>(`${this.baseUrl}/budget-check`, { params })
      .pipe(
        map(response => response.budget),
        catchError(error => {
          console.error('Error checking budget:', error);
          return of(100000); // Mock budget amount
        })
      );
  }

  /**
   * Save supplier payment transaction
   */
  saveSupplierPayment(paymentData: CashTransaction): Observable<any> {
    // Validate payment data before sending
    if (!this.validatePaymentData(paymentData)) {
      throw new Error('Invalid payment data');
    }

    const payload = {
      ...paymentData,
      transactionType: 'SUPPLIER_PAYMENT',
      createdAt: new Date().toISOString()
    };

    return this.http.post<any>(`${this.baseUrl}/supplier-payment`, payload)
      .pipe(
        catchError(error => {
          console.error('Error saving supplier payment:', error);
          throw error;
        })
      );
  }

  /**
   * Process SMS notification for supplier payment
   */
  sendPaymentSMS(supplierID: number, amount: number, balance: number): Observable<boolean> {
    const smsData = {
      supplierID,
      amount,
      balance,
      messageType: 'SUPPLIER_PAYMENT'
    };

    return this.http.post<{ success: boolean }>(`${this.baseUrl}/send-sms`, smsData)
      .pipe(
        map(response => response.success),
        catchError(error => {
          console.error('Error sending SMS:', error);
          return of(false);
        })
      );
  }

  /**
   * Add transaction to accounts (dual entry)
   */
  addToAccounts(paymentData: CashTransaction): Observable<boolean> {
    const accountEntries = [
      {
        date: paymentData.date,
        customerID: paymentData.customerID,
        description: paymentData.description,
        debit: paymentData.amountPaid || 0,
        credit: 0,
        reference: paymentData.referenceNo,
        type: 'BANK'
      },
      {
        date: paymentData.date,
        customerID: paymentData.customerID, // This should be bank account ID in real implementation
        description: paymentData.description,
        debit: 0,
        credit: paymentData.amountPaid || 0,
        reference: paymentData.referenceNo,
        type: 'BANK'
      }
    ];

    return this.http.post<{ success: boolean }>(`${this.baseUrl}/account-entries`, { entries: accountEntries })
      .pipe(
        map(response => response.success),
        catchError(error => {
          console.error('Error adding account entries:', error);
          return of(false);
        })
      );
  }

  /**
   * Validate payment data before submission
   */
  private validatePaymentData(data: CashTransaction): boolean {
    if (!data.customerID || data.customerID <= 0) return false;
    if (!data.date) return false;
    if (!data.description || data.description.trim().length < 3) return false;
    if (!data.amountPaid || (data.amountPaid && data.amountPaid <= 0)) return false;
    
    return true;
  }

  // Mock data methods for development/testing
  private getMockBusinesses(): Business[] {
    return [
      { businessID: 1, businessName: 'Main Business', status: 1 },
      { businessID: 2, businessName: 'Branch Business', status: 1 },
      { businessID: 3, businessName: 'Wholesale Business', status: 1 }
    ];
  }

  private getMockDivisions(businessID: number): Division[] {
    return [
      { divisionID: 1, divisionName: 'General Division', businessID, status: 1 },
      { divisionID: 2, divisionName: 'Pharmaceutical Division', businessID, status: 1 },
      { divisionID: 3, divisionName: 'Surgical Division', businessID, status: 1 }
    ];
  }

  private getMockSuppliers(): CashCustomer[] {
    return [
      {
        customerID: 101,
        customerName: 'ABC Pharmaceuticals',
        address: '123 Main Street',
        city: 'Karachi',
        balance: 150000,
        limit: 500000,
        status: 1
      },
      {
        customerID: 102,
        customerName: 'XYZ Medical Supplies',
        address: '456 Industrial Area',
        city: 'Lahore',
        balance: 85000,
        limit: 300000,
        status: 1
      },
      {
        customerID: 103,
        customerName: 'Global Health Trading',
        address: '789 Business District',
        city: 'Islamabad',
        balance: 220000,
        limit: 750000,
        status: 1
      }
    ];
  }

  private getMockSupplier(supplierID: number): CashCustomer {
    const suppliers = this.getMockSuppliers();
    return suppliers.find(s => s.customerID === supplierID) || suppliers[0];
  }
}