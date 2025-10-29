import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  DailyCash, 
  CashCustomer, 
  Business, 
  Division,
  Salesman,
  CashReceivedRequest,
  CashReceivedResponse
} from '../interfaces/cash.interface';

@Injectable({
  providedIn: 'root'
})
export class CashReceivedService {
  private baseUrl = 'api'; // Replace with your actual API base URL
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Subject for selected customer state management
  private selectedCustomerSubject = new BehaviorSubject<CashCustomer | null>(null);
  public selectedCustomer$ = this.selectedCustomerSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Business operations
  getBusinessList(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.baseUrl}/business`)
      .pipe(
        catchError(this.handleError<Business[]>('getBusinessList', []))
      );
  }

  // Division operations
  getDivisionList(): Observable<Division[]> {
    return this.http.get<Division[]>(`${this.baseUrl}/divisions`)
      .pipe(
        catchError(this.handleError<Division[]>('getDivisionList', []))
      );
  }

  // Customer operations
  getCustomers(businessId?: number, divisionId?: number): Observable<CashCustomer[]> {
    let url = `${this.baseUrl}/customers?status=1`;
    
    if (businessId) {
      url += `&businessID=${businessId}`;
    }
    
    if (divisionId) {
      url += `&divisionID=${divisionId}`;
    }
    
    return this.http.get<CashCustomer[]>(url)
      .pipe(
        catchError(this.handleError<CashCustomer[]>('getCustomers', []))
      );
  }

  getCustomerById(customerId: number): Observable<CashCustomer> {
    return this.http.get<CashCustomer>(`${this.baseUrl}/customers/${customerId}`)
      .pipe(
        catchError(this.handleError<CashCustomer>('getCustomerById'))
      );
  }

  // Salesman operations
  getSalesmenList(): Observable<Salesman[]> {
    return this.http.get<Salesman[]>(`${this.baseUrl}/salesman`)
      .pipe(
        catchError(this.handleError<Salesman[]>('getSalesmenList', []))
      );
  }

  // Cash operations
  saveCashReceived(cashRequest: CashReceivedRequest): Observable<CashReceivedResponse> {
    return this.http.post<CashReceivedResponse>(`${this.baseUrl}/cash/received`, cashRequest, this.httpOptions)
      .pipe(
        catchError(this.handleError<CashReceivedResponse>('saveCashReceived'))
      );
  }

  // Get cash transactions
  getCashTransactions(customerId?: number, dateFrom?: Date, dateTo?: Date): Observable<DailyCash[]> {
    let url = `${this.baseUrl}/cash/transactions`;
    const params = new URLSearchParams();
    
    if (customerId) {
      params.append('customerId', customerId.toString());
    }
    
    if (dateFrom) {
      params.append('dateFrom', dateFrom.toISOString().split('T')[0]);
    }
    
    if (dateTo) {
      params.append('dateTo', dateTo.toISOString().split('T')[0]);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return this.http.get<DailyCash[]>(url)
      .pipe(
        catchError(this.handleError<DailyCash[]>('getCashTransactions', []))
      );
  }

  // State management
  setSelectedCustomer(customer: CashCustomer | null): void {
    this.selectedCustomerSubject.next(customer);
  }

  getSelectedCustomer(): CashCustomer | null {
    return this.selectedCustomerSubject.value;
  }

  // Utility methods
  calculateBalance(customer: CashCustomer, amountReceived: number): number {
    return customer.balance - amountReceived;
  }

  validateCashTransaction(dailyCash: DailyCash): string[] {
    const errors: string[] = [];
    
    if (!dailyCash.customerID || dailyCash.customerID <= 0) {
      errors.push('Please select a customer account');
    }
    
    if (!dailyCash.description || dailyCash.description.trim() === '') {
      errors.push('Description is required');
    }
    
    if (dailyCash.amountReceived <= 0) {
      errors.push('Amount received must be greater than 0');
    }
    
    if (!dailyCash.date) {
      errors.push('Date is required');
    }
    
    return errors;
  }

  // Create new cash transaction object
  createNewCashTransaction(sessionId?: number): DailyCash {
    return {
      customerID: 0,
      date: new Date(),
      description: '',
      amountPaid: 0,
      amountReceived: 0,
      balance: 0,
      sessionID: sessionId || 1,
      status: 1,
      businessID: 0,
      divisionID: 0
    };
  }

  // SMS and notifications
  sendSMSNotification(customerId: number, amount: number): Observable<boolean> {
    const smsData = {
      customerId: customerId,
      amount: amount,
      type: 'cash_received'
    };
    
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/sms/send`, smsData, this.httpOptions)
      .pipe(
        map(response => response.success),
        catchError(this.handleError<boolean>('sendSMSNotification', false))
      );
  }

  // Incentives and commissions
  processIncentives(customerId: number, amount: number, month: number, year: number): Observable<boolean> {
    const incentiveData = {
      customerId: customerId,
      amount: amount,
      month: month,
      year: year
    };
    
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/incentives/process`, incentiveData, this.httpOptions)
      .pipe(
        map(response => response.success),
        catchError(this.handleError<boolean>('processIncentives', false))
      );
  }

  // Account transactions
  addToAccount(transaction: any): Observable<boolean> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/accounts/add-transaction`, transaction, this.httpOptions)
      .pipe(
        map(response => response.success),
        catchError(this.handleError<boolean>('addToAccount', false))
      );
  }

  // Session management
  getCurrentSessionId(): number {
    // This would typically come from a user session service
    return 1;
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return new Observable(observer => {
        observer.next(result as T);
        observer.complete();
      });
    };
  }
}