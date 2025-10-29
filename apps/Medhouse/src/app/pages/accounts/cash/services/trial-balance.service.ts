import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { TrialBalanceEntry, TrialBalanceFilter } from '../interfaces/cash.interface';

@Injectable({
  providedIn: 'root'
})
export class TrialBalanceService {
  private apiUrl = '/api/trial-balance';

  constructor(private http: HttpClient) {}

  getTrialBalance(filter: TrialBalanceFilter): Observable<TrialBalanceEntry[]> {
    // Mock data for demonstration - replace with actual API call
    return this.generateMockTrialBalanceData(filter).pipe(delay(1000));
  }

  generateTrialBalanceReport(filter: TrialBalanceFilter): Observable<TrialBalanceEntry[]> {
    return this.getTrialBalance(filter);
  }

  exportTrialBalanceToCSV(filter: TrialBalanceFilter): Observable<string> {
    return this.getTrialBalance(filter).pipe(
      map(data => this.convertToCSV(data))
    );
  }

  getAccountSummary(filter: TrialBalanceFilter): Observable<any> {
    return this.getTrialBalance(filter).pipe(
      map(data => {
        const accountTypes = [...new Set(data.map(entry => entry.Type))];
        return {
          accountTypes: accountTypes.length,
          totalAccounts: data.length,
          totalDebits: data.reduce((sum, entry) => sum + (entry.Debit || 0), 0),
          totalCredits: data.reduce((sum, entry) => sum + (entry.Credit || 0), 0)
        };
      })
    );
  }

  private generateMockTrialBalanceData(filter: TrialBalanceFilter): Observable<TrialBalanceEntry[]> {
    const mockData: TrialBalanceEntry[] = [
      // Cash Accounts
      {
        Type: 'Cash',
        Account: 'Cash in Hand',
        Debit: 25000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Cash',
        Account: 'Petty Cash',
        Debit: 5000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Cash',
        Account: 'Bank Account - Current',
        Debit: 150000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Cash',
        Account: 'Bank Account - Savings',
        Debit: 75000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },

      // Sales Accounts
      {
        Type: 'Sale',
        Account: 'Pharmacy Sales',
        Debit: 0,
        Credit: 450000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Sale',
        Account: 'Medical Equipment Sales',
        Debit: 0,
        Credit: 125000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Sale',
        Account: 'Consultation Fees',
        Debit: 0,
        Credit: 85000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Sale',
        Account: 'Laboratory Services',
        Debit: 0,
        Credit: 65000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },

      // Purchase Accounts
      {
        Type: 'Purchase',
        Account: 'Medicine Purchases',
        Debit: 180000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Purchase',
        Account: 'Medical Equipment Purchases',
        Debit: 95000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Purchase',
        Account: 'Office Supplies',
        Debit: 15000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Purchase',
        Account: 'Laboratory Supplies',
        Debit: 25000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },

      // Production/Manufacturing Accounts
      {
        Type: 'Production',
        Account: 'Manufacturing Labor',
        Debit: 45000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Production',
        Account: 'Manufacturing Overhead',
        Debit: 30000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Production',
        Account: 'Quality Control',
        Debit: 12000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },

      // Expense Accounts
      {
        Type: 'Expense',
        Account: 'Salaries & Wages',
        Debit: 85000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Expense',
        Account: 'Rent Expense',
        Debit: 35000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Expense',
        Account: 'Utilities Expense',
        Debit: 18000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Expense',
        Account: 'Insurance Expense',
        Debit: 22000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Expense',
        Account: 'Marketing & Advertising',
        Debit: 15000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },

      // Liability Accounts
      {
        Type: 'Liability',
        Account: 'Accounts Payable',
        Debit: 0,
        Credit: 125000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Liability',
        Account: 'Accrued Expenses',
        Debit: 0,
        Credit: 35000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Liability',
        Account: 'Short-term Loan',
        Debit: 0,
        Credit: 50000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },

      // Asset Accounts
      {
        Type: 'Asset',
        Account: 'Inventory - Medicines',
        Debit: 220000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Asset',
        Account: 'Inventory - Equipment',
        Debit: 180000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Asset',
        Account: 'Accounts Receivable',
        Debit: 95000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Asset',
        Account: 'Prepaid Insurance',
        Debit: 15000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Asset',
        Account: 'Fixed Assets - Building',
        Debit: 500000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Asset',
        Account: 'Fixed Assets - Equipment',
        Debit: 300000.00,
        Credit: 0,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },

      // Equity Accounts
      {
        Type: 'Equity',
        Account: 'Owner\'s Capital',
        Debit: 0,
        Credit: 800000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Equity',
        Account: 'Retained Earnings',
        Debit: 0,
        Credit: 150000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },

      // Other Income
      {
        Type: 'Income',
        Account: 'Interest Income',
        Debit: 0,
        Credit: 8000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Income',
        Account: 'Rental Income',
        Debit: 0,
        Credit: 12000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      },
      {
        Type: 'Income',
        Account: 'Commission Income',
        Debit: 0,
        Credit: 25000.00,
        Period: `${filter.fromDate.toDateString()} - ${filter.toDate.toDateString()}`
      }
    ];

    // Filter data based on date range (simulate filtering effect)
    const filteredData = mockData.map(entry => ({
      ...entry,
      // Simulate date-based adjustments
      Debit: entry.Debit ? entry.Debit * this.getDateMultiplier(filter) : 0,
      Credit: entry.Credit ? entry.Credit * this.getDateMultiplier(filter) : 0
    }));

    return of(filteredData);
  }

  private getDateMultiplier(filter: TrialBalanceFilter): number {
    const daysDiff = Math.abs(filter.toDate.getTime() - filter.fromDate.getTime()) / (1000 * 60 * 60 * 24);
    // Simulate varying amounts based on date range
    return Math.max(0.1, Math.min(1.0, daysDiff / 30));
  }

  private convertToCSV(data: TrialBalanceEntry[]): string {
    const headers = ['Type', 'Account', 'Debit', 'Credit', 'Period'];
    const csvContent = [
      headers.join(','),
      ...data.map(entry => [
        `"${entry.Type}"`,
        `"${entry.Account}"`,
        entry.Debit || 0,
        entry.Credit || 0,
        `"${entry.Period}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // API methods (replace mock implementations with actual HTTP calls)
  
  getTrialBalanceFromAPI(filter: TrialBalanceFilter): Observable<TrialBalanceEntry[]> {
    const params = new HttpParams()
      .set('fromDate', filter.fromDate.toISOString())
      .set('toDate', filter.toDate.toISOString());

    return this.http.get<TrialBalanceEntry[]>(`${this.apiUrl}/entries`, { params });
  }

  generateTrialBalanceReportAPI(filter: TrialBalanceFilter): Observable<Blob> {
    const params = new HttpParams()
      .set('fromDate', filter.fromDate.toISOString())
      .set('toDate', filter.toDate.toISOString());

    return this.http.get(`${this.apiUrl}/report`, { 
      params, 
      responseType: 'blob' 
    });
  }

  exportTrialBalanceToCSVAPI(filter: TrialBalanceFilter): Observable<Blob> {
    const params = new HttpParams()
      .set('fromDate', filter.fromDate.toISOString())
      .set('toDate', filter.toDate.toISOString());

    return this.http.get(`${this.apiUrl}/export/csv`, { 
      params, 
      responseType: 'blob' 
    });
  }

  getAccountSummaryAPI(filter: TrialBalanceFilter): Observable<any> {
    const params = new HttpParams()
      .set('fromDate', filter.fromDate.toISOString())
      .set('toDate', filter.toDate.toISOString());

    return this.http.get(`${this.apiUrl}/summary`, { params });
  }

  // Utility methods for trial balance calculations
  
  calculateTrialBalanceTotals(entries: TrialBalanceEntry[]): { totalDebits: number, totalCredits: number, difference: number } {
    const totalDebits = entries.reduce((sum, entry) => sum + (entry.Debit || 0), 0);
    const totalCredits = entries.reduce((sum, entry) => sum + (entry.Credit || 0), 0);
    const difference = totalDebits - totalCredits;

    return { totalDebits, totalCredits, difference };
  }

  isTrialBalanceBalanced(entries: TrialBalanceEntry[], tolerance: number = 0.01): boolean {
    const { difference } = this.calculateTrialBalanceTotals(entries);
    return Math.abs(difference) < tolerance;
  }

  groupTrialBalanceByType(entries: TrialBalanceEntry[]): { [key: string]: TrialBalanceEntry[] } {
    return entries.reduce((groups, entry) => {
      if (!groups[entry.Type]) {
        groups[entry.Type] = [];
      }
      groups[entry.Type].push(entry);
      return groups;
    }, {} as { [key: string]: TrialBalanceEntry[] });
  }

  getAccountTypesSummary(entries: TrialBalanceEntry[]): any[] {
    const grouped = this.groupTrialBalanceByType(entries);
    
    return Object.keys(grouped).map(type => {
      const typeEntries = grouped[type];
      const totalDebits = typeEntries.reduce((sum, entry) => sum + (entry.Debit || 0), 0);
      const totalCredits = typeEntries.reduce((sum, entry) => sum + (entry.Credit || 0), 0);
      
      return {
        type,
        accountCount: typeEntries.length,
        totalDebits,
        totalCredits,
        netAmount: totalDebits - totalCredits
      };
    });
  }

  validateTrialBalanceEntries(entries: TrialBalanceEntry[]): { isValid: boolean, errors: string[] } {
    const errors: string[] = [];
    
    entries.forEach((entry, index) => {
      if (!entry.Type || entry.Type.trim() === '') {
        errors.push(`Entry ${index + 1}: Type is required`);
      }
      
      if (!entry.Account || entry.Account.trim() === '') {
        errors.push(`Entry ${index + 1}: Account name is required`);
      }
      
      if ((entry.Debit || 0) < 0) {
        errors.push(`Entry ${index + 1}: Debit amount cannot be negative`);
      }
      
      if ((entry.Credit || 0) < 0) {
        errors.push(`Entry ${index + 1}: Credit amount cannot be negative`);
      }
      
      if ((entry.Debit || 0) > 0 && (entry.Credit || 0) > 0) {
        errors.push(`Entry ${index + 1}: Entry cannot have both debit and credit amounts`);
      }
      
      if ((entry.Debit || 0) === 0 && (entry.Credit || 0) === 0) {
        errors.push(`Entry ${index + 1}: Entry must have either a debit or credit amount`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}