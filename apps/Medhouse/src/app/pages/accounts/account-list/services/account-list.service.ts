import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
  CustomerAccount, 
  AccountTransaction, 
  AccountFilter, 
  Business, 
  Division, 
  AccountType,
  AccountSummary,
  InvoiceData,
  AccountStatementRequest,
  AccountStatementResponse,
  PaymentTransaction,
  CustomerBalance
} from '../interfaces/account-list.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountListService {
  private apiUrl = '/api/account-list';

  constructor(private http: HttpClient) {}

  // Customer Account Methods
  getCustomers(): Observable<CustomerAccount[]> {
    // Mock data for demonstration - replace with actual API call
    return this.generateMockCustomers().pipe(delay(500));
  }

  getCustomerById(customerId: number): Observable<CustomerAccount> {
    return this.getCustomers().pipe(
      map(customers => customers.find(c => c.customerID === customerId)!)
    );
  }

  // Business Methods
  getBusinesses(): Observable<Business[]> {
    return this.generateMockBusinesses().pipe(delay(300));
  }

  // Division Methods
  getDivisions(businessId?: number): Observable<Division[]> {
    return this.generateMockDivisions(businessId).pipe(delay(300));
  }

  // Account Type Methods
  getAccountTypes(): Observable<AccountType[]> {
    return this.generateMockAccountTypes().pipe(delay(300));
  }

  // Account Transaction Methods
  getAccountTransactions(filter: AccountFilter): Observable<AccountTransaction[]> {
    return this.generateMockAccountTransactions(filter).pipe(delay(800));
  }

  // Account Summary
  getAccountSummary(filter: AccountFilter): Observable<AccountSummary> {
    return this.getAccountTransactions(filter).pipe(
      map(transactions => this.calculateAccountSummary(transactions, filter.customerID))
    );
  }

  // Invoice Methods
  printSalesInvoice(invoiceNo: number): Observable<InvoiceData> {
    return this.generateMockInvoiceData(invoiceNo, 'SALES').pipe(delay(500));
  }

  printPurchaseInvoice(invoiceNo: number): Observable<InvoiceData> {
    return this.generateMockInvoiceData(invoiceNo, 'PURCHASE').pipe(delay(500));
  }

  // Report Generation
  generateAccountStatement(filter: AccountFilter): Observable<AccountTransaction[]> {
    return this.getAccountTransactions(filter);
  }

  // Export Methods
  exportAccountToCSV(filter: AccountFilter): Observable<string> {
    return this.getAccountTransactions(filter).pipe(
      map(data => this.convertToCSV(data))
    );
  }

  // Payment/Receipt Methods
  processPayment(payment: PaymentTransaction): Observable<any> {
    // Mock implementation - replace with actual API call
    return of({ success: true, transactionId: Math.floor(Math.random() * 10000) }).pipe(delay(1000));
  }

  // Customer Balance
  getCustomerBalance(customerId: number): Observable<CustomerBalance> {
    return this.generateMockCustomerBalance(customerId).pipe(delay(400));
  }

  // Private Mock Data Generation Methods
  private generateMockCustomers(): Observable<CustomerAccount[]> {
    const mockCustomers: CustomerAccount[] = [
      {
        customerID: 1,
        customerName: "Ahmed Medical Store",
        address: "Main Bazaar, Lahore",
        city: "Lahore",
        balance: 25000.00,
        limit: 50000.00,
        phoneNo1: "+92-300-1234567",
        email: "ahmed@medstore.com",
        sendSMS: true,
        businessID: 1,
        businessName: "Pharmacy",
        divisionID: 1,
        divisionName: "Retail",
        accountTypeID: 1,
        accountTypeName: "Customer",
        status: 1,
        createdDate: new Date('2023-01-15'),
        lastTransactionDate: new Date()
      },
      {
        customerID: 2,
        customerName: "City Hospital",
        address: "Medical Complex, Karachi",
        city: "Karachi",
        balance: -15000.00,
        limit: 100000.00,
        phoneNo1: "+92-321-7654321",
        email: "procurement@cityhospital.com",
        sendSMS: false,
        businessID: 2,
        businessName: "Hospital",
        divisionID: 3,
        divisionName: "Institutional",
        accountTypeID: 1,
        accountTypeName: "Customer",
        status: 1,
        createdDate: new Date('2022-08-20'),
        lastTransactionDate: new Date('2024-10-18')
      },
      {
        customerID: 3,
        customerName: "ABC Pharmaceuticals",
        address: "Industrial Area, Islamabad",
        city: "Islamabad",
        balance: 85000.00,
        limit: 200000.00,
        phoneNo1: "+92-51-9876543",
        email: "orders@abcpharma.com",
        sendSMS: true,
        businessID: 1,
        businessName: "Pharmacy",
        divisionID: 2,
        divisionName: "Wholesale",
        accountTypeID: 2,
        accountTypeName: "Supplier",
        status: 1,
        createdDate: new Date('2021-12-10'),
        lastTransactionDate: new Date('2024-10-20')
      },
      {
        customerID: 4,
        customerName: "Health Care Clinic",
        address: "Gulberg, Lahore",
        city: "Lahore",
        balance: 12500.00,
        limit: 30000.00,
        phoneNo1: "+92-42-5555666",
        email: "admin@healthcare.com",
        sendSMS: true,
        businessID: 2,
        businessName: "Hospital",
        divisionID: 4,
        divisionName: "Private Practice",
        accountTypeID: 1,
        accountTypeName: "Customer",
        status: 1,
        createdDate: new Date('2023-05-12'),
        lastTransactionDate: new Date('2024-10-19')
      },
      {
        customerID: 5,
        customerName: "MedEquip Solutions",
        address: "Technology Park, Karachi",
        city: "Karachi",
        balance: -5000.00,
        limit: 75000.00,
        phoneNo1: "+92-21-3334445",
        email: "sales@medequip.com",
        sendSMS: false,
        businessID: 3,
        businessName: "Equipment",
        divisionID: 5,
        divisionName: "Medical Devices",
        accountTypeID: 2,
        accountTypeName: "Supplier",
        status: 1,
        createdDate: new Date('2022-11-03'),
        lastTransactionDate: new Date('2024-10-17')
      }
    ];

    return of(mockCustomers);
  }

  private generateMockBusinesses(): Observable<Business[]> {
    const mockBusinesses: Business[] = [
      {
        businessID: 1,
        businessName: "Pharmacy",
        description: "Pharmaceutical Sales and Distribution",
        status: 1,
        address: "Main Office, Lahore",
        contactPerson: "Muhammad Ali",
        phoneNo: "+92-42-1111222",
        email: "info@pharmacy.com"
      },
      {
        businessID: 2,
        businessName: "Hospital",
        description: "Healthcare Services and Medical Equipment",
        status: 1,
        address: "Medical Center, Karachi",
        contactPerson: "Dr. Fatima Khan",
        phoneNo: "+92-21-3333444",
        email: "admin@hospital.com"
      },
      {
        businessID: 3,
        businessName: "Equipment",
        description: "Medical Equipment and Devices",
        status: 1,
        address: "Industrial Zone, Islamabad",
        contactPerson: "Ahmed Hassan",
        phoneNo: "+92-51-5555666",
        email: "sales@equipment.com"
      },
      {
        businessID: 4,
        businessName: "Laboratory",
        description: "Diagnostic and Laboratory Services",
        status: 1,
        address: "Lab Complex, Lahore",
        contactPerson: "Dr. Sara Ahmed",
        phoneNo: "+92-42-7777888",
        email: "info@laboratory.com"
      }
    ];

    return of(mockBusinesses);
  }

  private generateMockDivisions(businessId?: number): Observable<Division[]> {
    const allDivisions: Division[] = [
      {
        divisionID: 1,
        divisionName: "Retail",
        businessID: 1,
        businessName: "Pharmacy",
        description: "Retail pharmacy operations",
        status: 1,
        manager: "Ali Raza",
        location: "Lahore"
      },
      {
        divisionID: 2,
        divisionName: "Wholesale",
        businessID: 1,
        businessName: "Pharmacy",
        description: "Wholesale pharmaceutical distribution",
        status: 1,
        manager: "Hassan Sheikh",
        location: "Karachi"
      },
      {
        divisionID: 3,
        divisionName: "Institutional",
        businessID: 2,
        businessName: "Hospital",
        description: "Institutional sales to hospitals",
        status: 1,
        manager: "Dr. Ayesha Malik",
        location: "Islamabad"
      },
      {
        divisionID: 4,
        divisionName: "Private Practice",
        businessID: 2,
        businessName: "Hospital",
        description: "Private practice and clinics",
        status: 1,
        manager: "Dr. Omar Khan",
        location: "Lahore"
      },
      {
        divisionID: 5,
        divisionName: "Medical Devices",
        businessID: 3,
        businessName: "Equipment",
        description: "Medical devices and equipment",
        status: 1,
        manager: "Tariq Mahmood",
        location: "Karachi"
      }
    ];

    const filteredDivisions = businessId 
      ? allDivisions.filter(d => d.businessID === businessId)
      : allDivisions;

    return of(filteredDivisions);
  }

  private generateMockAccountTypes(): Observable<AccountType[]> {
    const mockAccountTypes: AccountType[] = [
      {
        accountTypeID: 1,
        accountType: "Customer",
        description: "Regular customer accounts",
        category: "CUSTOMER",
        status: 1,
        defaultCreditLimit: 50000,
        requiresApproval: false,
        allowNegativeBalance: true
      },
      {
        accountTypeID: 2,
        accountType: "Supplier",
        description: "Supplier and vendor accounts",
        category: "SUPPLIER",
        status: 1,
        defaultCreditLimit: 100000,
        requiresApproval: true,
        allowNegativeBalance: false
      },
      {
        accountTypeID: 3,
        accountType: "Employee",
        description: "Employee accounts",
        category: "EMPLOYEE",
        status: 1,
        defaultCreditLimit: 10000,
        requiresApproval: false,
        allowNegativeBalance: false
      },
      {
        accountTypeID: 4,
        accountType: "Hospital",
        description: "Hospital and healthcare facility accounts",
        category: "CUSTOMER",
        status: 1,
        defaultCreditLimit: 200000,
        requiresApproval: true,
        allowNegativeBalance: true
      }
    ];

    return of(mockAccountTypes);
  }

  private generateMockAccountTransactions(filter: AccountFilter): Observable<AccountTransaction[]> {
    const baseTransactions: AccountTransaction[] = [
      {
        DetailID: 1,
        Date: '2024-10-01',
        InvoiceNo: 1001,
        Description: 'Medicine Purchase - Panadol 500mg',
        Debit: 0,
        Credit: 15000.00,
        Balance: 10000.00,
        Status: 'POSTED',
        CustomerID: filter.customerID,
        InvoiceID: 1001,
        TransactionType: 'SALE'
      },
      {
        DetailID: 2,
        Date: '2024-10-03',
        InvoiceNo: 0,
        Description: 'Cash Payment Received',
        Debit: 10000.00,
        Credit: 0,
        Balance: 20000.00,
        Status: 'POSTED',
        CustomerID: filter.customerID,
        TransactionType: 'PAYMENT'
      },
      {
        DetailID: 3,
        Date: '2024-10-05',
        InvoiceNo: 1002,
        Description: 'Medical Equipment - Thermometer',
        Debit: 0,
        Credit: 8500.00,
        Balance: 11500.00,
        Status: 'POSTED',
        CustomerID: filter.customerID,
        InvoiceID: 1002,
        TransactionType: 'SALE'
      },
      {
        DetailID: 4,
        Date: '2024-10-08',
        InvoiceNo: 2001,
        Description: 'P.Purchase Return - Expired Items',
        Debit: 2500.00,
        Credit: 0,
        Balance: 14000.00,
        Status: 'POSTED',
        CustomerID: filter.customerID,
        InvoiceID: 2001,
        TransactionType: 'RETURN'
      },
      {
        DetailID: 5,
        Date: '2024-10-10',
        InvoiceNo: 1003,
        Description: 'Laboratory Services - Blood Test',
        Debit: 0,
        Credit: 3500.00,
        Balance: 10500.00,
        Status: 'POSTED',
        CustomerID: filter.customerID,
        InvoiceID: 1003,
        TransactionType: 'SERVICE'
      },
      {
        DetailID: 6,
        Date: '2024-10-12',
        InvoiceNo: 0,
        Description: 'Bank Transfer Payment',
        Debit: 5000.00,
        Credit: 0,
        Balance: 15500.00,
        Status: 'POSTED',
        CustomerID: filter.customerID,
        TransactionType: 'PAYMENT'
      },
      {
        DetailID: 7,
        Date: '2024-10-15',
        InvoiceNo: 1004,
        Description: 'Surgical Equipment - Syringes',
        Debit: 0,
        Credit: 12000.00,
        Balance: 3500.00,
        Status: 'POSTED',
        CustomerID: filter.customerID,
        InvoiceID: 1004,
        TransactionType: 'SALE'
      },
      {
        DetailID: 8,
        Date: '2024-10-18',
        InvoiceNo: 0,
        Description: 'Discount Applied - Bulk Purchase',
        Debit: 1500.00,
        Credit: 0,
        Balance: 5000.00,
        Status: 'POSTED',
        CustomerID: filter.customerID,
        TransactionType: 'ADJUSTMENT'
      },
      {
        DetailID: 9,
        Date: '2024-10-20',
        InvoiceNo: 1005,
        Description: 'Pharmacy Supplies - Vitamins',
        Debit: 0,
        Credit: 7500.00,
        Balance: -2500.00,
        Status: 'POSTED',
        CustomerID: filter.customerID,
        InvoiceID: 1005,
        TransactionType: 'SALE'
      },
      {
        DetailID: 10,
        Date: '2024-10-21',
        InvoiceNo: 0,
        Description: 'Interest Charged - Overdue Amount',
        Debit: 0,
        Credit: 250.00,
        Balance: -2750.00,
        Status: 'POSTED',
        CustomerID: filter.customerID,
        TransactionType: 'INTEREST'
      }
    ];

    // Filter by date range
    let filteredTransactions = baseTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.Date);
      return transactionDate >= filter.fromDate && transactionDate <= filter.toDate;
    });

    // Filter by search text if provided
    if (filter.searchText && filter.searchText.trim() !== '') {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.Description.toLowerCase().includes(filter.searchText!.toLowerCase())
      );
    }

    return of(filteredTransactions);
  }

  private generateMockInvoiceData(invoiceNo: number, type: 'SALES' | 'PURCHASE'): Observable<InvoiceData> {
    const mockInvoice: InvoiceData = {
      invoiceNo: invoiceNo,
      invoiceType: type,
      date: new Date(),
      customerID: 1,
      customerName: "Ahmed Medical Store",
      amount: 15000.00,
      taxAmount: 2250.00,
      discountAmount: 500.00,
      totalAmount: 16750.00,
      status: 'POSTED',
      paymentTerms: 'Net 30 Days',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: 'Standard pharmaceutical supplies order'
    };

    return of(mockInvoice);
  }

  private generateMockCustomerBalance(customerId: number): Observable<CustomerBalance> {
    const mockBalance: CustomerBalance = {
      customerID: customerId,
      customerName: "Ahmed Medical Store",
      currentBalance: 25000.00,
      creditLimit: 50000.00,
      availableCredit: 25000.00,
      overdueAmount: 0.00,
      lastPaymentDate: new Date('2024-10-15'),
      lastPaymentAmount: 10000.00,
      accountAge: 285,
      riskLevel: 'LOW'
    };

    return of(mockBalance);
  }

  private calculateAccountSummary(transactions: AccountTransaction[], customerId: number): AccountSummary {
    const totalDebits = transactions.reduce((sum, t) => sum + (t.Debit || 0), 0);
    const totalCredits = transactions.reduce((sum, t) => sum + (t.Credit || 0), 0);
    const currentBalance = transactions.length > 0 ? transactions[transactions.length - 1].Balance : 0;
    const transactionCount = transactions.length;
    const averageTransaction = transactionCount > 0 ? (totalDebits + totalCredits) / transactionCount : 0;

    return {
      customerID: customerId,
      customerName: "Customer Account",
      totalDebits,
      totalCredits,
      currentBalance,
      transactionCount,
      averageTransaction,
      lastTransactionDate: transactions.length > 0 ? new Date(transactions[transactions.length - 1].Date) : undefined,
      firstTransactionDate: transactions.length > 0 ? new Date(transactions[0].Date) : undefined,
      creditLimit: 50000,
      availableCredit: 50000 - Math.abs(currentBalance),
      overdueAmount: currentBalance < 0 ? Math.abs(currentBalance) : 0,
      overdueTransactions: transactions.filter(t => t.Balance < 0).length
    };
  }

  private convertToCSV(data: AccountTransaction[]): string {
    const headers = ['Date', 'Invoice No', 'Description', 'Debit', 'Credit', 'Balance', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map(transaction => [
        `"${new Date(transaction.Date).toLocaleDateString()}"`,
        transaction.InvoiceNo || '',
        `"${transaction.Description}"`,
        transaction.Debit || 0,
        transaction.Credit || 0,
        transaction.Balance || 0,
        `"${transaction.Status}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // API methods (replace mock implementations with actual HTTP calls)
  
  getCustomersFromAPI(): Observable<CustomerAccount[]> {
    return this.http.get<CustomerAccount[]>(`${this.apiUrl}/customers`);
  }

  getBusinessesFromAPI(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.apiUrl}/businesses`);
  }

  getDivisionsFromAPI(businessId?: number): Observable<Division[]> {
    let params = new HttpParams();
    if (businessId) {
      params = params.set('businessId', businessId.toString());
    }
    return this.http.get<Division[]>(`${this.apiUrl}/divisions`, { params });
  }

  getAccountTypesFromAPI(): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(`${this.apiUrl}/account-types`);
  }

  getAccountTransactionsFromAPI(filter: AccountFilter): Observable<AccountTransaction[]> {
    const params = new HttpParams()
      .set('customerID', filter.customerID.toString())
      .set('fromDate', filter.fromDate.toISOString())
      .set('toDate', filter.toDate.toISOString())
      .set('searchText', filter.searchText || '');

    return this.http.get<AccountTransaction[]>(`${this.apiUrl}/transactions`, { params });
  }

  generateAccountStatementFromAPI(request: AccountStatementRequest): Observable<AccountStatementResponse> {
    return this.http.post<AccountStatementResponse>(`${this.apiUrl}/account-statement`, request);
  }

  processPaymentAPI(payment: PaymentTransaction): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment`, payment);
  }

  exportAccountToCSVAPI(filter: AccountFilter): Observable<Blob> {
    const params = new HttpParams()
      .set('customerID', filter.customerID.toString())
      .set('fromDate', filter.fromDate.toISOString())
      .set('toDate', filter.toDate.toISOString());

    return this.http.get(`${this.apiUrl}/export/csv`, { 
      params, 
      responseType: 'blob' 
    });
  }

  // Utility methods for account operations
  
  validateCustomerAccount(account: CustomerAccount): { isValid: boolean, errors: string[] } {
    const errors: string[] = [];
    
    if (!account.customerName || account.customerName.trim() === '') {
      errors.push('Customer name is required');
    }
    
    if (!account.accountTypeID || account.accountTypeID <= 0) {
      errors.push('Valid account type is required');
    }
    
    if (account.limit < 0) {
      errors.push('Credit limit cannot be negative');
    }
    
    if (!account.city || account.city.trim() === '') {
      errors.push('City is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  calculateAccountAge(firstTransactionDate: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - firstTransactionDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  determineRiskLevel(balance: number, creditLimit: number, overdueAmount: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    const utilizationRatio = Math.abs(balance) / creditLimit;
    
    if (overdueAmount > 0) {
      return 'HIGH';
    } else if (utilizationRatio > 0.8) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  isAccountActive(lastTransactionDate?: Date): boolean {
    if (!lastTransactionDate) return false;
    
    const daysSinceLastTransaction = this.calculateAccountAge(lastTransactionDate);
    return daysSinceLastTransaction <= 90; // Consider active if transaction within 90 days
  }
}