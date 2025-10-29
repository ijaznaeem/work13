import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  Customer, 
  Product, 
  PurchaseInvoiceFG, 
  PurchaseInvoiceDetail,
  StockUpdate,
  CustomerAccount,
  CashTransaction 
} from '../interfaces/purchase-invoice-fg.interface';

@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceFgService {
  private baseUrl = 'api'; // Replace with your actual API base URL
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Subject for invoice state management
  private currentInvoiceSubject = new BehaviorSubject<PurchaseInvoiceFG | null>(null);
  public currentInvoice$ = this.currentInvoiceSubject.asObservable();

  private invoiceDetailsSubject = new BehaviorSubject<PurchaseInvoiceDetail[]>([]);
  public invoiceDetails$ = this.invoiceDetailsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Customer operations
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers?accttypeid=7`)
      .pipe(
        catchError(this.handleError<Customer[]>('getCustomers', []))
      );
  }

  getCustomerById(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/customers/${customerId}`)
      .pipe(
        catchError(this.handleError<Customer>('getCustomerById'))
      );
  }

  createNewCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/customers`, customer, this.httpOptions)
      .pipe(
        catchError(this.handleError<Customer>('createNewCustomer'))
      );
  }

  // Product operations
  getProducts(searchTerm: string = ''): Observable<Product[]> {
    const url = searchTerm ? 
      `${this.baseUrl}/products?search=${searchTerm}&type=1` : 
      `${this.baseUrl}/products?type=1`;
    
    return this.http.get<Product[]>(url)
      .pipe(
        catchError(this.handleError<Product[]>('getProducts', []))
      );
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${productId}`)
      .pipe(
        catchError(this.handleError<Product>('getProductById'))
      );
  }

  // Invoice operations
  startNewInvoice(): void {
    const newInvoice: PurchaseInvoiceFG = {
      invoiceID: -1,
      customerID: 0,
      customerName: '',
      date: new Date(),
      amount: 0,
      amountPaid: 0,
      balance: 0,
      type: 1,
      status: 0,
      details: []
    };
    
    this.currentInvoiceSubject.next(newInvoice);
    this.invoiceDetailsSubject.next([]);
  }

  addItemToInvoice(item: PurchaseInvoiceDetail): Observable<boolean> {
    return new Observable(observer => {
      try {
        // Add item to temporary details
        const currentDetails = this.invoiceDetailsSubject.value;
        const newDetails = [...currentDetails, { ...item, invoiceID: -1 }];
        
        this.invoiceDetailsSubject.next(newDetails);
        this.updateInvoiceTotals(newDetails);
        
        observer.next(true);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  removeItemFromInvoice(detailId: number): Observable<boolean> {
    return new Observable(observer => {
      try {
        const currentDetails = this.invoiceDetailsSubject.value;
        const filteredDetails = currentDetails.filter(detail => 
          detail.detailID !== detailId
        );
        
        this.invoiceDetailsSubject.next(filteredDetails);
        this.updateInvoiceTotals(filteredDetails);
        
        observer.next(true);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  private updateInvoiceTotals(details: PurchaseInvoiceDetail[]): void {
    const currentInvoice = this.currentInvoiceSubject.value;
    if (currentInvoice) {
      const totalAmount = details.reduce((sum, item) => sum + item.amount, 0);
      const totalCommission = details.reduce((sum, item) => sum + (item.amount * item.commRatio / 100), 0);
      
      currentInvoice.amount = totalAmount;
      currentInvoice.balance = totalAmount - currentInvoice.amountPaid;
      
      this.currentInvoiceSubject.next({ ...currentInvoice });
    }
  }

  updateAmountPaid(amountPaid: number): void {
    const currentInvoice = this.currentInvoiceSubject.value;
    if (currentInvoice) {
      currentInvoice.amountPaid = amountPaid;
      currentInvoice.balance = currentInvoice.amount - amountPaid;
      this.currentInvoiceSubject.next({ ...currentInvoice });
    }
  }

  setSelectedCustomer(customer: Customer): void {
    const currentInvoice = this.currentInvoiceSubject.value;
    if (currentInvoice) {
      currentInvoice.customerID = customer.customerID;
      currentInvoice.customerName = customer.customerName;
      this.currentInvoiceSubject.next({ ...currentInvoice });
    }
  }

  // Save operations
  saveInvoice(printInvoice: boolean = false): Observable<number> {
    const invoice = this.currentInvoiceSubject.value;
    const details = this.invoiceDetailsSubject.value;
    
    if (!invoice || details.length === 0) {
      throw new Error('No invoice data to save');
    }

    const invoiceData = {
      ...invoice,
      details: details,
      printInvoice: printInvoice
    };

    return this.http.post<{ invoiceId: number }>(`${this.baseUrl}/purchase-invoices`, invoiceData, this.httpOptions)
      .pipe(
        map(response => response.invoiceId),
        catchError(this.handleError<number>('saveInvoice'))
      );
  }

  cancelInvoice(): Observable<boolean> {
    // Clear temporary invoice details
    return this.http.delete<boolean>(`${this.baseUrl}/purchase-invoice-details/temp`)
      .pipe(
        map(() => {
          this.currentInvoiceSubject.next(null);
          this.invoiceDetailsSubject.next([]);
          return true;
        }),
        catchError(this.handleError<boolean>('cancelInvoice', false))
      );
  }

  // Stock and accounting operations
  private updateStock(stockUpdate: StockUpdate): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/stock`, stockUpdate, this.httpOptions)
      .pipe(
        catchError(this.handleError<boolean>('updateStock', false))
      );
  }

  private addToCustomerAccount(account: CustomerAccount): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/customer-accounts`, account, this.httpOptions)
      .pipe(
        catchError(this.handleError<boolean>('addToCustomerAccount', false))
      );
  }

  private addToCash(cashTransaction: CashTransaction): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/cash-transactions`, cashTransaction, this.httpOptions)
      .pipe(
        catchError(this.handleError<boolean>('addToCash', false))
      );
  }

  // Utility methods
  calculateAmount(pPrice: number, qty: number): number {
    return pPrice * qty;
  }

  validateInvoiceItem(item: PurchaseInvoiceDetail): string[] {
    const errors: string[] = [];
    
    if (!item.batchNo || item.batchNo.trim() === '') {
      errors.push('Batch number is required');
    }
    
    if (item.qty <= 0) {
      errors.push('Quantity must be greater than 0');
    }
    
    if (item.pPrice <= 0) {
      errors.push('Purchase price must be greater than 0');
    }
    
    return errors;
  }

  // Get current state
  getCurrentInvoice(): PurchaseInvoiceFG | null {
    return this.currentInvoiceSubject.value;
  }

  getCurrentDetails(): PurchaseInvoiceDetail[] {
    return this.invoiceDetailsSubject.value;
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