import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CashTransaction } from '../interfaces/cash.interface';
import { TransferAccount, TransactionType } from '../cash-transfer/cash-transfer.component';

@Injectable({
  providedIn: 'root'
})
export class CashTransferService {
  private baseUrl = 'api/cash'; // Update with your actual API base URL

  constructor(private http: HttpClient) {}

  /**
   * Get transfer accounts (account types 15 and 16 as per VB6 code)
   */
  getTransferAccounts(): Observable<TransferAccount[]> {
    const params = new HttpParams()
      .set('accountTypes', '15,16') // Transfer account types
      .set('status', '1'); // Active accounts only
    
    return this.http.get<TransferAccount[]>(`${this.baseUrl}/transfer-accounts`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching transfer accounts:', error);
          return of(this.getMockTransferAccounts());
        })
      );
  }

  /**
   * Get transaction types for transfer operations
   */
  getTransactionTypes(): Observable<TransactionType[]> {
    return this.http.get<TransactionType[]>(`${this.baseUrl}/transaction-types`)
      .pipe(
        catchError(error => {
          console.error('Error fetching transaction types:', error);
          return of(this.getMockTransactionTypes());
        })
      );
  }

  /**
   * Get account details by ID
   */
  getAccountDetails(accountID: number): Observable<TransferAccount> {
    return this.http.get<TransferAccount>(`${this.baseUrl}/accounts/${accountID}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching account details:', error);
          return of(this.getMockAccount(accountID));
        })
      );
  }

  /**
   * Check available budget for an account
   */
  checkAvailableBudget(accountID: number, budgetType: number = 2): Observable<number> {
    const params = new HttpParams()
      .set('accountID', accountID.toString())
      .set('budgetType', budgetType.toString());
    
    return this.http.get<{ budget: number }>(`${this.baseUrl}/budget-check`, { params })
      .pipe(
        map(response => response.budget),
        catchError(error => {
          console.error('Error checking budget:', error);
          return of(500000); // Mock budget amount
        })
      );
  }

  /**
   * Check if account is a budget account
   */
  isBudgetAccount(accountID: number): Observable<boolean> {
    return this.http.get<{ isBudgetAccount: boolean }>(`${this.baseUrl}/is-budget-account/${accountID}`)
      .pipe(
        map(response => response.isBudgetAccount),
        catchError(error => {
          console.error('Error checking budget account:', error);
          return of(false);
        })
      );
  }

  /**
   * Save cash transfer transaction
   */
  saveCashTransfer(fromTransaction: CashTransaction, toAccountID: number, transactionTypeID: number): Observable<any> {
    // Validate transaction data before sending
    if (!this.validateTransferData(fromTransaction, toAccountID)) {
      throw new Error('Invalid transfer data');
    }

    const payload = {
      fromTransaction,
      toAccountID,
      transactionTypeID,
      createdAt: new Date().toISOString()
    };

    return this.http.post<any>(`${this.baseUrl}/cash-transfer`, payload)
      .pipe(
        catchError(error => {
          console.error('Error saving cash transfer:', error);
          throw error;
        })
      );
  }

  /**
   * Add account entries for cash transfer (dual entry)
   */
  addTransferAccountEntries(
    date: string,
    fromAccountID: number,
    toAccountID: number,
    description: string,
    amount: number,
    transactionTypeID: number
  ): Observable<boolean> {
    
    const accountEntries = this.createAccountEntries(
      date, fromAccountID, toAccountID, description, amount, transactionTypeID
    );

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
   * Create account entries based on transaction type
   */
  private createAccountEntries(
    date: string,
    fromAccountID: number,
    toAccountID: number,
    description: string,
    amount: number,
    transactionTypeID: number
  ): any[] {
    
    if (transactionTypeID === 7) {
      // Transaction type 7 logic (as per VB6 code)
      return [
        {
          date,
          customerID: fromAccountID,
          description,
          debit: 0,
          credit: amount,
          type: 'TRANSFER'
        },
        {
          date,
          customerID: toAccountID,
          description,
          debit: amount,
          credit: 0,
          type: 'TRANSFER'
        }
      ];
    } else {
      // Default logic for other transaction types
      return [
        {
          date,
          customerID: fromAccountID,
          description,
          debit: 0,
          credit: amount,
          type: 'TRANSFER'
        },
        {
          date,
          customerID: toAccountID,
          description,
          debit: amount,
          credit: 0,
          type: 'TRANSFER'
        }
      ];
    }
  }

  /**
   * Validate transfer data before submission
   */
  private validateTransferData(fromTransaction: CashTransaction, toAccountID: number): boolean {
    if (!fromTransaction.customerID || fromTransaction.customerID <= 0) return false;
    if (!toAccountID || toAccountID <= 0) return false;
    if (fromTransaction.customerID === toAccountID) return false;
    if (!fromTransaction.date) return false;
    if (!fromTransaction.description || fromTransaction.description.trim().length < 3) return false;
    if (!fromTransaction.amountReceived || fromTransaction.amountReceived <= 0) return false;
    
    return true;
  }

  // Mock data methods for development/testing
  private getMockTransferAccounts(): TransferAccount[] {
    return [
      {
        customerID: 201,
        customerName: 'Cash Account - Main',
        balance: 500000,
        city: 'Karachi',
        accountTypeID: 15,
        status: 1
      },
      {
        customerID: 202,
        customerName: 'Bank Account - HBL',
        balance: 750000,
        city: 'Karachi',
        accountTypeID: 15,
        status: 1
      },
      {
        customerID: 203,
        customerName: 'Petty Cash',
        balance: 25000,
        city: 'Karachi',
        accountTypeID: 16,
        status: 1
      },
      {
        customerID: 204,
        customerName: 'Branch Cash Account',
        balance: 180000,
        city: 'Lahore',
        accountTypeID: 15,
        status: 1
      },
      {
        customerID: 205,
        customerName: 'Bank Account - UBL',
        balance: 420000,
        city: 'Islamabad',
        accountTypeID: 15,
        status: 1
      }
    ];
  }

  private getMockTransactionTypes(): TransactionType[] {
    return [
      { acctTypeID: 7, acctTypeName: 'Internal Transfer' },
      { acctTypeID: 8, acctTypeName: 'Bank Transfer' },
      { acctTypeID: 9, acctTypeName: 'Cash Transfer' },
      { acctTypeID: 10, acctTypeName: 'Petty Cash Transfer' }
    ];
  }

  private getMockAccount(accountID: number): TransferAccount {
    const accounts = this.getMockTransferAccounts();
    return accounts.find(a => a.customerID === accountID) || accounts[0];
  }
}