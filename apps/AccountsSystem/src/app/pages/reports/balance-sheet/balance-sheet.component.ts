import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FindTotal, GroupBy } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import {
  GetDateJSON,
  JSON2Date
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss'],
})
export class BalanceSheetComponent implements OnInit {
  public bdata: object[] = [];
  curCustomer: any = {};
  public balanceSheetSummary: any = {
    totalDebits: 0,
    totalCredits: 0,
    difference: 0,
    isBalanced: false,
    categories: []
  };

  public Filter = {
    Date: GetDateJSON(),
  };


  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.LoadData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Balance Sheet';
    this.ps.PrintData.SubTitle = 'As On  :' + JSON2Date(this.Filter.Date);

    this.router.navigateByUrl('/print/print-html');
  }
  LoadData() {
    this.http
      .getData('balancesheet/' + JSON2Date(this.Filter.Date) + '')
      .then((r: any) => {
        this.bdata = r;
        this.calculateBalanceSheetSummary(r);
        this.validateBalanceSheet(r);
      });
  }


  GetGroupBy(data:any, prop:string) {
    return GroupBy(data, prop);
  }
  GetProps(obj:any) {
    return Object.keys(obj);
  }
  FindTotal(data:any, prop:string){
   return FindTotal(data, prop)
  }

  /**
   * Calculates balance sheet summary including totals and differences
   */
  calculateBalanceSheetSummary(data: any[]): void {
    if (!data || data.length === 0) {
      this.balanceSheetSummary = {
        totalDebits: 0,
        totalCredits: 0,
        difference: 0,
        isBalanced: false,
        categories: []
      };
      return;
    }

    const totalDebits = this.FindTotal(data, 'Debit');
    const totalCredits = this.FindTotal(data, 'Credit');
    const difference = totalDebits - totalCredits;
    const isBalanced = Math.abs(difference) <= 0.01;

    // Calculate category summaries
    const groupedByLevel1 = this.GetGroupBy(data, 'Level1');
    const categories = this.GetProps(groupedByLevel1).map((category: string) => {
      const categoryData = groupedByLevel1[category];
      const categoryDebits = this.FindTotal(categoryData, 'Debit');
      const categoryCredits = this.FindTotal(categoryData, 'Credit');
      const netAmount = categoryDebits - categoryCredits;
      
      return {
        name: category,
        debits: categoryDebits,
        credits: categoryCredits,
        netAmount: netAmount,
        isPositive: netAmount >= 0
      };
    });

    this.balanceSheetSummary = {
      totalDebits: totalDebits,
      totalCredits: totalCredits,
      difference: difference,
      isBalanced: isBalanced,
      categories: categories
    };
  }

  /**
   * Validates the balance sheet for correctness
   * @param data - Balance sheet data array
   */
  validateBalanceSheet(data: any[]): void {
    console.log('=== BALANCE SHEET VALIDATION ===');
    
    if (!data || data.length === 0) {
      console.error('❌ No balance sheet data available for validation');
      return;
    }

    // 1. Calculate total debits and credits
    const totalDebits = this.FindTotal(data, 'Debit');
    const totalCredits = this.FindTotal(data, 'Credit');
    
    console.log(`📊 Total Debits: ${totalDebits}`);
    console.log(`📊 Total Credits: ${totalCredits}`);
    
    // 2. Check if debits equal credits (fundamental accounting equation)
    const difference = Math.abs(totalDebits - totalCredits);
    const tolerance = 0.01; // Allow for minor rounding differences
    
    if (difference <= tolerance) {
      console.log('✅ BALANCE SHEET IS BALANCED');
      console.log(`   Debits = Credits (${totalDebits})`);
    } else {
      console.error('❌ BALANCE SHEET IS NOT BALANCED');
      console.error(`   Difference: ${difference}`);
      console.error(`   Debits: ${totalDebits}, Credits: ${totalCredits}`);
    }

    // 3. Validate by categories
    console.log('\n📋 CATEGORY ANALYSIS:');
    const groupedByLevel1 = this.GetGroupBy(data, 'Level1');
    const categories = this.GetProps(groupedByLevel1);
    
    let assetsTotal = 0;
    let liabilitiesTotal = 0;
    let equityTotal = 0;
    
    categories.forEach((category: string) => {
      const categoryData = groupedByLevel1[category];
      const categoryDebits = this.FindTotal(categoryData, 'Debit');
      const categoryCredits = this.FindTotal(categoryData, 'Credit');
      const netAmount = categoryDebits - categoryCredits;
      
      console.log(`\n📁 ${category}:`);
      console.log(`   Debits: ${categoryDebits}`);
      console.log(`   Credits: ${categoryCredits}`);
      console.log(`   Net Amount: ${netAmount}`);
      
      // Categorize based on typical balance sheet structure
      if (category.toLowerCase().includes('asset')) {
        assetsTotal += netAmount;
        if (netAmount < 0) {
          console.warn(`⚠️  Warning: Assets should typically have positive balance, found: ${netAmount}`);
        }
      } else if (category.toLowerCase().includes('liabilit') || category.toLowerCase().includes('payable')) {
        liabilitiesTotal += Math.abs(netAmount);
        if (netAmount > 0) {
          console.warn(`⚠️  Warning: Liabilities should typically have negative balance, found: ${netAmount}`);
        }
      } else if (category.toLowerCase().includes('equity') || category.toLowerCase().includes('capital')) {
        equityTotal += Math.abs(netAmount);
        if (netAmount > 0) {
          console.warn(`⚠️  Warning: Equity should typically have negative balance, found: ${netAmount}`);
        }
      }
      
      // Validate subcategories
      const groupedByLevel2 = this.GetGroupBy(categoryData, 'Level2');
      const subCategories = this.GetProps(groupedByLevel2);
      
      subCategories.forEach((subCategory: string) => {
        const subCategoryData = groupedByLevel2[subCategory];
        const subDebits = this.FindTotal(subCategoryData, 'Debit');
        const subCredits = this.FindTotal(subCategoryData, 'Credit');
        console.log(`    └── ${subCategory}: Debits: ${subDebits}, Credits: ${subCredits}`);
      });
    });

    // 4. Validate accounting equation: Assets = Liabilities + Equity
    console.log('\n🔍 ACCOUNTING EQUATION CHECK:');
    console.log(`Assets: ${assetsTotal}`);
    console.log(`Liabilities: ${liabilitiesTotal}`);
    console.log(`Equity: ${equityTotal}`);
    
    const equationDifference = Math.abs(assetsTotal - (liabilitiesTotal + equityTotal));
    
    if (equationDifference <= tolerance) {
      console.log('✅ ACCOUNTING EQUATION BALANCED');
      console.log(`   Assets = Liabilities + Equity (${assetsTotal})`);
    } else {
      console.error('❌ ACCOUNTING EQUATION NOT BALANCED');
      console.error(`   Assets: ${assetsTotal}`);
      console.error(`   Liabilities + Equity: ${liabilitiesTotal + equityTotal}`);
      console.error(`   Difference: ${equationDifference}`);
    }

    // 5. Data quality checks
    console.log('\n🔎 DATA QUALITY CHECKS:');
    
    let issuesFound = 0;
    
    data.forEach((item, index) => {
      // Check for required fields
      if (!item.AccountCode || !item.AccountName) {
        console.error(`❌ Row ${index + 1}: Missing required fields (AccountCode or AccountName)`);
        issuesFound++;
      }
      
      // Check for negative values where inappropriate
      const debit = parseFloat(item.Debit || 0);
      const credit = parseFloat(item.Credit || 0);
      
      if (debit < 0) {
        console.error(`❌ Row ${index + 1}: Negative debit amount (${debit}) for account ${item.AccountName}`);
        issuesFound++;
      }
      
      if (credit < 0) {
        console.error(`❌ Row ${index + 1}: Negative credit amount (${credit}) for account ${item.AccountName}`);
        issuesFound++;
      }
      
      // Check for both debit and credit having values (should be rare)
      if (debit > 0 && credit > 0) {
        console.warn(`⚠️  Row ${index + 1}: Both debit (${debit}) and credit (${credit}) have values for account ${item.AccountName}`);
      }
      
      // Check for zero amounts (might indicate data issues)
      if (debit === 0 && credit === 0) {
        console.warn(`⚠️  Row ${index + 1}: Zero amounts for account ${item.AccountName} - might indicate inactive account`);
      }
    });
    
    console.log(`\n📊 VALIDATION SUMMARY:`);
    console.log(`   Total Records: ${data.length}`);
    console.log(`   Issues Found: ${issuesFound}`);
    console.log(`   Balance Check: ${difference <= tolerance ? 'PASSED' : 'FAILED'}`);
    console.log(`   Equation Check: ${equationDifference <= tolerance ? 'PASSED' : 'FAILED'}`);
    
    if (difference <= tolerance && equationDifference <= tolerance && issuesFound === 0) {
      console.log('🎉 BALANCE SHEET VALIDATION: ALL CHECKS PASSED');
    } else {
      console.log('⚠️  BALANCE SHEET VALIDATION: ISSUES DETECTED - REVIEW REQUIRED');
    }
    
    console.log('=== END BALANCE SHEET VALIDATION ===\n');
  }

  /**
   * Test method to validate with sample data
   * Remove this method in production
   */
  testWithSampleData(): void {
    const sampleData = [
      {
        "CategoryID": "100",
        "Level1": "Assets",
        "Level2": "Banks/Deposits",
        "AccountCode": "1001900000001",
        "AccountName": "Mezan Bank",
        "Debit": "148702",
        "Credit": "0"
      },
      {
        "CategoryID": "100",
        "Level1": "Assets",
        "Level2": "Cash on Hand",
        "AccountCode": "1001000000001",
        "AccountName": "Cash In Hand",
        "Debit": "617414",
        "Credit": "0"
      },
      {
        "CategoryID": "300",
        "Level1": "Equity accounts",
        "Level2": "Owner Equity",
        "AccountCode": "3003010000001",
        "AccountName": "Owner Equity",
        "Debit": "0",
        "Credit": "396423"
      },
      {
        "CategoryID": "300",
        "Level1": "Equity accounts",
        "Level2": "Owner Equity",
        "AccountCode": "3003010000002",
        "AccountName": "HAji Sab",
        "Debit": "14620",
        "Credit": "0"
      }
    ];
    
    console.log('🧪 TESTING WITH SAMPLE DATA:');
    this.bdata = sampleData; // Set the data for display
    this.calculateBalanceSheetSummary(sampleData);
    this.validateBalanceSheet(sampleData);
  }

  /**
   * Get balance status color class
   */
  getBalanceStatusClass(): string {
    return this.balanceSheetSummary.isBalanced ? 'text-success' : 'text-danger';
  }

  /**
   * Get balance status icon
   */
  getBalanceStatusIcon(): string {
    return this.balanceSheetSummary.isBalanced ? 'fa-check-circle' : 'fa-exclamation-triangle';
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
   * Get amount display class based on positive/negative
   */
  getAmountClass(amount: number): string {
    return amount >= 0 ? 'text-primary' : 'text-danger';
  }

  /**
   * Get absolute value of a number
   */
  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }
}
