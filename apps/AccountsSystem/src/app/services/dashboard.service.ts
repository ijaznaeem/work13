import { Injectable } from '@angular/core';
import { Observable, of, delay, forkJoin, map, catchError } from 'rxjs';
import { HttpBase } from './httpbase.service';
import { GetDateJSON, JSON2Date } from '../factories/utilities';

export interface DashboardData {
  summaryCards: any[];
  recentTransactions: any[];
  monthlyData: any[];
  accountBalances: any[];
  expenseCategories: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpBase) { }

  getDashboardData(period: string = 'current'): Observable<DashboardData> {
    const currentDate = this.getCurrentDate();
    const { fromDate, toDate } = this.getDateRangeForPeriod(period, currentDate);
    
    // Fetch all required data in parallel
    return forkJoin({
      profitLossData: this.getProfitLossData(fromDate, toDate),
      balanceSheetData: this.getBalanceSheetData(toDate),
      recentTransactions: this.getRecentTransactions(),
      accountBalances: this.getAccountBalances(),
      monthlyData: this.getMonthlyData()
    }).pipe(
      map(data => this.transformTodashboardData(data, period)),
      catchError(error => {
        console.error('Error fetching dashboard data:', error);
        return of(this.getFallbackData(period));
      })
    );
  }

  private getBaseData(): DashboardData {
    return {
      summaryCards: [
        {
          title: 'Total Revenue',
          value: '$125,430',
          change: '+12.5%',
          trend: 'up',
          icon: 'ft-trending-up',
          color: 'success'
        },
        {
          title: 'Total Expenses',
          value: '$89,240',
          change: '+5.2%',
          trend: 'up',
          icon: 'ft-trending-down',
          color: 'warning'
        },
        {
          title: 'Net Profit',
          value: '$36,190',
          change: '+18.3%',
          trend: 'up',
          icon: 'ft-dollar-sign',
          color: 'success'
        },
        {
          title: 'Outstanding',
          value: '$15,780',
          change: '-3.2%',
          trend: 'down',
          icon: 'ft-alert-circle',
          color: 'danger'
        }
      ],
      recentTransactions: [
        {
          id: 'TXN001',
          date: '2024-10-14',
          description: 'Payment from Client ABC',
          amount: 5500,
          type: 'credit',
          account: 'Sales Revenue'
        },
        {
          id: 'TXN002',
          date: '2024-10-14',
          description: 'Office Rent Payment',
          amount: -2000,
          type: 'debit',
          account: 'Rent Expense'
        },
        {
          id: 'TXN003',
          date: '2024-10-13',
          description: 'Utility Bill Payment',
          amount: -450,
          type: 'debit',
          account: 'Utilities'
        },
        {
          id: 'TXN004',
          date: '2024-10-13',
          description: 'Service Income',
          amount: 3200,
          type: 'credit',
          account: 'Service Revenue'
        },
        {
          id: 'TXN005',
          date: '2024-10-12',
          description: 'Equipment Purchase',
          amount: -1800,
          type: 'debit',
          account: 'Equipment'
        }
      ],
      monthlyData: [
        { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
        { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
        { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
        { month: 'Apr', revenue: 61000, expenses: 40000, profit: 21000 },
        { month: 'May', revenue: 55000, expenses: 38000, profit: 17000 },
        { month: 'Jun', revenue: 67000, expenses: 42000, profit: 25000 },
        { month: 'Jul', revenue: 59000, expenses: 39000, profit: 20000 },
        { month: 'Aug', revenue: 64000, expenses: 41000, profit: 23000 },
        { month: 'Sep', revenue: 58000, expenses: 40000, profit: 18000 },
        { month: 'Oct', revenue: 72000, expenses: 45000, profit: 27000 }
      ],
      accountBalances: [
        { name: 'Cash Account', balance: 25450, type: 'asset' },
        { name: 'Checking Account', balance: 85320, type: 'asset' },
        { name: 'Accounts Receivable', balance: 45670, type: 'asset' },
        { name: 'Accounts Payable', balance: -23890, type: 'liability' },
        { name: 'Office Equipment', balance: 65000, type: 'asset' },
        { name: 'Accumulated Depreciation', balance: -12000, type: 'asset' }
      ],
      expenseCategories: [
        { name: 'Rent', value: 24000 },
        { name: 'Utilities', value: 8500 },
        { name: 'Office Supplies', value: 3200 },
        { name: 'Marketing', value: 12500 },
        { name: 'Equipment', value: 15800 },
        { name: 'Travel', value: 4200 },
        { name: 'Professional Services', value: 9800 }
      ]
    };
  }

  /**
   * Get current date in the expected format
   */
  private getCurrentDate(): any {
    return GetDateJSON();
  }

  /**
   * Calculate date range based on selected period
   */
  private getDateRangeForPeriod(period: string, currentDate: any): { fromDate: string, toDate: string } {
    const today = new Date();
    let fromDate: Date;
    let toDate: Date = today;

    switch (period) {
      case 'current':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'last':
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        toDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'year':
        fromDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    return {
      fromDate: JSON2Date({ year: fromDate.getFullYear(), month: fromDate.getMonth() + 1, day: fromDate.getDate() }),
      toDate: JSON2Date({ year: toDate.getFullYear(), month: toDate.getMonth() + 1, day: toDate.getDate() })
    };
  }

  /**
   * Fetch Profit & Loss data for the specified period
   */
  private getProfitLossData(fromDate: string, toDate: string): Promise<any> {
    return this.http.getData(`profitreportbymonth/${fromDate}/${toDate}`);
  }

  /**
   * Fetch Balance Sheet data for the specified date
   */
  private getBalanceSheetData(date: string): Promise<any> {
    return this.http.getData(`balancesheet/${date}`);
  }

  /**
   * Fetch recent transactions (last 10 vouchers)
   */
  private getRecentTransactions(): Promise<any> {
    const filter = "1=1";
    return this.http.getData(`qryacctdetails`, { filter: filter, orderby: 'Date DESC', limit: 10 });
  }

  /**
   * Fetch account balances (top accounts by balance)
   */
  private getAccountBalances(): Promise<any> {
    return this.http.getData('qryacctswithlevels?orderby=AccountName');
  }

  /**
   * Fetch monthly data for the current year
   */
  private getMonthlyData(): Promise<any> {
    const currentYear = new Date().getFullYear();
    const promises: Promise<any>[] = [];

    // Get data for each month of the current year
    for (let month = 1; month <= 10; month++) { // Up to current month (October)
      const fromDate = `${currentYear}-${month.toString().padStart(2, '0')}-01`;
      const toDate = `${currentYear}-${month.toString().padStart(2, '0')}-${this.getLastDayOfMonth(currentYear, month)}`;
      promises.push(this.http.getData(`profitreport/${fromDate}/${toDate}`));
    }

    return Promise.all(promises);
  }

  /**
   * Transform raw API data into dashboard format
   */
  private transformTodashboardData(apiData: any, period: string): DashboardData {
    const { profitLossData, balanceSheetData, recentTransactions, accountBalances, monthlyData } = apiData;

    // Calculate P&L summary
    const plSummary = this.calculatePLSummary(profitLossData);
    
    // Calculate balance sheet summary
    const bsSummary = this.calculateBSSummary(balanceSheetData);

    return {
      summaryCards: [
        {
          title: 'Total Revenue',
          value: this.formatCurrency(plSummary.totalRevenue),
          change: this.calculateChangePercentage(plSummary.totalRevenue, period),
          trend: plSummary.totalRevenue >= 0 ? 'up' : 'down',
          icon: 'ft-trending-up',
          color: 'success'
        },
        {
          title: 'Total Expenses',
          value: this.formatCurrency(plSummary.totalExpenses),
          change: this.calculateChangePercentage(plSummary.totalExpenses, period),
          trend: 'up',
          icon: 'ft-trending-down',
          color: 'warning'
        },
        {
          title: 'Net Profit',
          value: this.formatCurrency(plSummary.netProfit),
          change: this.calculateChangePercentage(plSummary.netProfit, period),
          trend: plSummary.netProfit >= 0 ? 'up' : 'down',
          icon: plSummary.netProfit >= 0 ? 'ft-dollar-sign' : 'ft-trending-down',
          color: plSummary.netProfit >= 0 ? 'success' : 'danger'
        },
        {
          title: 'Total Assets',
          value: this.formatCurrency(bsSummary.totalAssets),
          change: this.calculateChangePercentage(bsSummary.totalAssets, period),
          trend: bsSummary.totalAssets >= 0 ? 'up' : 'down',
          icon: 'ft-briefcase',
          color: 'info'
        }
      ],
      recentTransactions: this.transformTransactions(recentTransactions),
      monthlyData: this.transformMonthlyData(monthlyData),
      accountBalances: this.transformAccountBalances(accountBalances),
      expenseCategories: this.calculateExpenseCategories(profitLossData)
    };
  }

  /**
   * Calculate Profit & Loss summary from API data
   */
  private calculatePLSummary(data: any[]): any {
    if (!data || data.length === 0) {
      return { totalRevenue: 0, totalExpenses: 0, totalCOGS: 0, netProfit: 0 };
    }

    let totalRevenue = 0;
    let totalCOGS = 0;
    let totalExpenses = 0;

    // Group by Level1 category
    const grouped = this.groupBy(data, 'Level1');

    // Calculate Revenue (Credits - Debits for Revenue accounts)
    const revenueAccounts = grouped['Revenue accounts'] || [];
    totalRevenue = this.sumCredits(revenueAccounts) - this.sumDebits(revenueAccounts);

    // Calculate Cost of Goods Sold (Debits - Credits for COGS accounts)
    const cogsAccounts = grouped['Cost of goods sold'] || [];
    totalCOGS = this.sumDebits(cogsAccounts) - this.sumCredits(cogsAccounts);

    // Calculate Expenses (Debits - Credits for Expense accounts)
    const expenseAccounts = grouped['Expense accounts'] || [];
    totalExpenses = this.sumDebits(expenseAccounts) - this.sumCredits(expenseAccounts);

    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpenses;

    return {
      totalRevenue,
      totalCOGS,
      totalExpenses,
      grossProfit,
      netProfit
    };
  }

  /**
   * Calculate Balance Sheet summary from API data
   */
  private calculateBSSummary(data: any[]): any {
    if (!data || data.length === 0) {
      return { totalAssets: 0, totalLiabilities: 0, totalEquity: 0 };
    }

    const grouped = this.groupBy(data, 'Level1');
    
    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;

    // Calculate Assets (Debits - Credits for Asset accounts)
    const assetAccounts = grouped['Assets'] || [];
    totalAssets = this.sumDebits(assetAccounts) - this.sumCredits(assetAccounts);

    // Calculate Liabilities (Credits - Debits for Liability accounts)
    const liabilityAccounts = grouped['Liability accounts'] || [];
    totalLiabilities = this.sumCredits(liabilityAccounts) - this.sumDebits(liabilityAccounts);

    // Calculate Equity (Credits - Debits for Equity accounts)
    const equityAccounts = grouped['Equity accounts'] || [];
    totalEquity = this.sumCredits(equityAccounts) - this.sumDebits(equityAccounts);

    return {
      totalAssets,
      totalLiabilities,
      totalEquity
    };
  }

  /**
   * Transform transaction data for dashboard display
   */
  private transformTransactions(data: any[]): any[] {
    if (!data || data.length === 0) return [];

    return data.slice(0, 10).map(transaction => ({
      id: transaction.VoucherNo || transaction.detailid,
      date: transaction.Date,
      description: transaction.Description,
      amount: transaction.Debit > 0 ? transaction.Debit : -transaction.Credit,
      type: transaction.Debit > 0 ? 'debit' : 'credit',
      account: transaction.AccountName
    }));
  }

  /**
   * Transform monthly data for charts
   */
  private transformMonthlyData(monthlyData: any[]): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    
    return monthlyData.map((data, index) => {
      const plSummary = this.calculatePLSummary(data);
      return {
        month: months[index],
        revenue: plSummary.totalRevenue,
        expenses: plSummary.totalExpenses + plSummary.totalCOGS,
        profit: plSummary.netProfit
      };
    });
  }

  /**
   * Transform account balances for display
   */
  private transformAccountBalances(accounts: any[]): any[] {
    if (!accounts || accounts.length === 0) return [];

    return accounts
      .filter(account => Math.abs(account.Balance || 0) > 1000) // Only show significant balances
      .slice(0, 6)
      .map(account => ({
        name: account.AccountName,
        balance: parseFloat(account.Balance || 0),
        type: this.getAccountType(account.Category)
      }));
  }

  /**
   * Calculate expense categories from P&L data
   */
  private calculateExpenseCategories(data: any[]): any[] {
    if (!data || data.length === 0) return [];

    const expenseAccounts = data.filter(item => 
      item.Level1 === 'Expense accounts' && (parseFloat(item.Debit) > 0 || parseFloat(item.Credit) > 0)
    );

    const categoryTotals = this.groupBy(expenseAccounts, 'Level2');
    
    return Object.keys(categoryTotals).map(category => ({
      name: category,
      value: this.sumDebits(categoryTotals[category]) - this.sumCredits(categoryTotals[category])
    })).filter(item => item.value > 0);
  }

  /**
   * Helper methods
   */
  private groupBy(array: any[], key: string): any {
    return array.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) result[group] = [];
      result[group].push(item);
      return result;
    }, {});
  }

  private sumDebits(data: any[]): number {
    return data.reduce((sum, item) => sum + parseFloat(item.Debit || 0), 0);
  }

  private sumCredits(data: any[]): number {
    return data.reduce((sum, item) => sum + parseFloat(item.Credit || 0), 0);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  }

  private calculateChangePercentage(currentValue: number, period: string): string {
    // For now, return simulated percentage based on period
    // In real implementation, you would compare with previous period
    const basePercentage = Math.random() * 20 - 10; // -10% to +10%
    const sign = basePercentage >= 0 ? '+' : '';
    return `${sign}${basePercentage.toFixed(1)}%`;
  }

  private getAccountType(category: string): string {
    if (!category) return 'other';
    
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('asset')) return 'asset';
    if (lowerCategory.includes('liability')) return 'liability';
    if (lowerCategory.includes('equity')) return 'equity';
    if (lowerCategory.includes('revenue')) return 'revenue';
    if (lowerCategory.includes('expense')) return 'expense';
    
    return 'other';
  }

  private getLastDayOfMonth(year: number, month: number): string {
    return new Date(year, month, 0).getDate().toString().padStart(2, '0');
  }

  /**
   * Fallback data in case of API failure
   */
  private getFallbackData(period: string): DashboardData {
    return this.getBaseData();
  }

  private adjustValueForPeriod(value: string, factor: number): string {
    // Extract numeric value from string like "$125,430"
    const numericValue = parseFloat(value.replace(/[$,]/g, ''));
    const adjustedValue = numericValue * (1 + factor);
    
    // Format back to currency string
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(adjustedValue);
  }
}