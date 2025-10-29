import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GroupBy } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import {
  FindTotal,
  GetDateJSON,
  JSON2Date,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
@Component({
  selector: 'app-profit-report',
  templateUrl: './profit-report.component.html',
  styleUrls: ['./profit-report.component.scss'],
})
export class ProfitReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;
  public data: any = [];
  public bdata: object[] = [];
  public Salesman: any = [];
  public Routes: any = [];
  
  public profitLossSummary: any = {
    totalRevenue: 0,
    totalCostOfGoodsSold: 0,
    grossProfit: 0,
    totalExpenses: 0,
    netProfit: 0,
    grossProfitMargin: 0,
    netProfitMargin: 0
  };

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
  };
  expenses: any = [];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Profit Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    this.http
      .getData(
        'profitreport/' +
          JSON2Date(this.Filter.FromDate) +
          '/' +
          JSON2Date(this.Filter.ToDate)
      )
      .then((r: any) => {
        this.bdata = r;
        this.data = GroupBy(r, 'Level1');
        this.calculateProfitLossSummary(r);
        console.log('Profit Report Data:', this.data);
        console.log('P&L Summary:', this.profitLossSummary);
      });
  }

  GetGroupBy(data, prop) {
    return GroupBy(data, prop);
  }
  GetProps(obj) {
    return Object.keys(obj);
  }
  FindTotal(data, prop) {
    return FindTotal(data, prop);
  }

  /**
   * Calculate comprehensive Profit & Loss summary
   */
  calculateProfitLossSummary(data: any[]): void {
    if (!data || data.length === 0) {
      this.profitLossSummary = {
        totalRevenue: 0,
        totalCostOfGoodsSold: 0,
        grossProfit: 0,
        totalExpenses: 0,
        netProfit: 0,
        grossProfitMargin: 0,
        netProfitMargin: 0
      };
      return;
    }

    // Group data by Level1 categories
    const groupedByLevel1 = this.GetGroupBy(data, 'Level1');
    
    // Calculate Revenue (Credits for Revenue accounts)
    const revenueAccounts = groupedByLevel1['Revenue accounts'] || [];
    const totalRevenue = this.FindTotal(revenueAccounts, 'Credit') - this.FindTotal(revenueAccounts, 'Debit');
    
    // Calculate Cost of Goods Sold (Debits for Cost accounts)
    const cogsAccounts = groupedByLevel1['Cost of goods sold'] || [];
    const totalCostOfGoodsSold = this.FindTotal(cogsAccounts, 'Debit') - this.FindTotal(cogsAccounts, 'Credit');
    
    // Calculate Expenses (Debits for Expense accounts)
    const expenseAccounts = groupedByLevel1['Expense accounts'] || [];
    const totalExpenses = this.FindTotal(expenseAccounts, 'Debit') - this.FindTotal(expenseAccounts, 'Credit');
    
    // Calculate Gross Profit
    const grossProfit = totalRevenue - totalCostOfGoodsSold;
    
    // Calculate Net Profit
    const netProfit = grossProfit - totalExpenses;
    
    // Calculate margins
    const grossProfitMargin = totalRevenue !== 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const netProfitMargin = totalRevenue !== 0 ? (netProfit / totalRevenue) * 100 : 0;

    this.profitLossSummary = {
      totalRevenue: totalRevenue,
      totalCostOfGoodsSold: totalCostOfGoodsSold,
      grossProfit: grossProfit,
      totalExpenses: totalExpenses,
      netProfit: netProfit,
      grossProfitMargin: grossProfitMargin,
      netProfitMargin: netProfitMargin
    };
  }

  /**
   * Format currency with proper styling
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Get absolute value of a number
   */
  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  /**
   * Get amount display class based on positive/negative
   */
  getAmountClass(amount: number): string {
    return amount >= 0 ? 'text-success' : 'text-danger';
  }

  /**
   * Get profit status class
   */
  getProfitStatusClass(): string {
    return this.profitLossSummary.netProfit >= 0 ? 'text-success' : 'text-danger';
  }

  /**
   * Get profit status icon
   */
  getProfitStatusIcon(): string {
    return this.profitLossSummary.netProfit >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
  }

  /**
   * Calculate net amount for a category (Credit - Debit for Revenue, Debit - Credit for Expenses/COGS)
   */
  calculateNetAmount(categoryData: any[], isRevenue: boolean = false): number {
    const debits = this.FindTotal(categoryData, 'Debit');
    const credits = this.FindTotal(categoryData, 'Credit');
    return isRevenue ? credits - debits : debits - credits;
  }

  /**
   * Test method with sample profit report data
   */
  testWithSampleData(): void {
    const sampleData = [
      {
        "CategoryID": "400",
        "Level1": "Revenue accounts",
        "Level2": "Cash Sales",
        "AccountCode": "4004000000001",
        "AccountName": "Sales",
        "Debit": "0",
        "Credit": "100000"
      },
      {
        "CategoryID": "500",
        "Level1": "Cost of goods sold",
        "Level2": "Cost of Goods Sold",
        "AccountCode": "5005800000001",
        "AccountName": "Purchase A/C",
        "Debit": "60000",
        "Credit": "0"
      },
      {
        "CategoryID": "600",
        "Level1": "Expense accounts",
        "Level2": "Operating Expense",
        "AccountCode": "6006050000001",
        "AccountName": "Staff Salaries",
        "Debit": "15000",
        "Credit": "0"
      },
      {
        "CategoryID": "600",
        "Level1": "Expense accounts",
        "Level2": "Operating Expense",
        "AccountCode": "6006050000003",
        "AccountName": "Electricity",
        "Debit": "5000",
        "Credit": "0"
      }
    ];
    
    console.log('🧪 TESTING PROFIT REPORT WITH SAMPLE DATA:');
    this.bdata = sampleData;
    this.data = GroupBy(sampleData, 'Level1');
    this.calculateProfitLossSummary(sampleData);
    console.log('Sample P&L Summary:', this.profitLossSummary);
  }
}
