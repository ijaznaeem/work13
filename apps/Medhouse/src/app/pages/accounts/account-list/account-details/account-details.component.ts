import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import { AccountListService } from '../services/account-list.service';
import { 
  CustomerAccount, 
  AccountTransaction, 
  AccountFilter, 
  Business, 
  Division, 
  AccountType 
} from '../interfaces/account-list.interface';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
  filterForm: FormGroup;
  accountData: LocalDataSource = new LocalDataSource();
  selectedAccount: CustomerAccount | null = null;
  selectedTransaction: AccountTransaction | null = null;
  isLoading = false;
  searchText = '';
  
  // Dropdown data
  businesses: Business[] = [];
  divisions: Division[] = [];
  accountTypes: AccountType[] = [];
  customers: CustomerAccount[] = [];
  filteredCustomers: CustomerAccount[] = [];

  // Customer details
  selectedCustomerDetails = {
    city: '',
    limit: 0,
    balance: 0
  };

  // Smart Table Settings
  tableSettings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    selectMode: 'single',
    columns: {
      Date: {
        title: 'Date',
        type: 'string',
        width: '12%',
        filter: false,
        valuePrepareFunction: (value: string) => {
          return new Date(value).toLocaleDateString();
        }
      },
      InvoiceNo: {
        title: 'Invoice #',
        type: 'number',
        width: '10%',
        filter: false
      },
      Description: {
        title: 'Description',
        type: 'string',
        width: '35%',
        filter: false
      },
      Debit: {
        title: 'Debit',
        type: 'number',
        width: '15%',
        filter: false,
        valuePrepareFunction: (value: number) => {
          return value && value > 0 ? value.toLocaleString('en-US', { 
            style: 'currency', 
            currency: 'USD' 
          }) : '';
        }
      },
      Credit: {
        title: 'Credit',
        type: 'number',
        width: '15%',
        filter: false,
        valuePrepareFunction: (value: number) => {
          return value && value > 0 ? value.toLocaleString('en-US', { 
            style: 'currency', 
            currency: 'USD' 
          }) : '';
        }
      },
      Balance: {
        title: 'Balance',
        type: 'number',
        width: '13%',
        filter: false,
        valuePrepareFunction: (value: number) => {
          return value.toLocaleString('en-US', { 
            style: 'currency', 
            currency: 'USD' 
          });
        }
      }
    },
    pager: {
      display: true,
      perPage: 25
    },
    noDataMessage: 'No account transactions found for the selected criteria'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private accountListService: AccountListService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setDefaultDateRange();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      accountType: [''],
      business: [''],
      division: [''],
      customer: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      searchText: ['']
    });

    // Subscribe to form changes
    this.filterForm.get('accountType')?.valueChanges.subscribe(() => {
      this.filterCustomers();
    });

    this.filterForm.get('business')?.valueChanges.subscribe(() => {
      this.filterCustomers();
      this.loadDivisions();
    });

    this.filterForm.get('division')?.valueChanges.subscribe(() => {
      this.filterCustomers();
    });

    this.filterForm.get('customer')?.valueChanges.subscribe((customerId) => {
      if (customerId) {
        this.loadCustomerDetails(customerId);
        this.loadAccountData();
      }
    });

    this.filterForm.get('fromDate')?.valueChanges.subscribe(() => {
      this.loadAccountData();
    });

    this.filterForm.get('toDate')?.valueChanges.subscribe(() => {
      this.loadAccountData();
    });

    this.filterForm.get('searchText')?.valueChanges.subscribe((searchText) => {
      this.searchText = searchText || '';
      this.loadAccountData();
    });
  }

  private setDefaultDateRange(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.filterForm.patchValue({
      fromDate: this.formatDateForInput(firstDayOfMonth),
      toDate: this.formatDateForInput(today)
    });
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private loadInitialData(): void {
    this.isLoading = true;

    // Load businesses
    this.accountListService.getBusinesses().subscribe({
      next: (data) => {
        this.businesses = data;
      },
      error: (error) => {
        console.error('Error loading businesses:', error);
        this.toastr.error('Failed to load businesses', 'Error');
      }
    });

    // Load account types
    this.accountListService.getAccountTypes().subscribe({
      next: (data) => {
        this.accountTypes = data;
      },
      error: (error) => {
        console.error('Error loading account types:', error);
        this.toastr.error('Failed to load account types', 'Error');
      }
    });

    // Load customers
    this.accountListService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.filteredCustomers = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.toastr.error('Failed to load customers', 'Error');
        this.isLoading = false;
      }
    });

    // Load divisions for all businesses initially
    this.loadDivisions();
  }

  private loadDivisions(): void {
    const businessId = this.filterForm.get('business')?.value;
    
    this.accountListService.getDivisions(businessId).subscribe({
      next: (data) => {
        this.divisions = data;
      },
      error: (error) => {
        console.error('Error loading divisions:', error);
        this.toastr.error('Failed to load divisions', 'Error');
      }
    });
  }

  private filterCustomers(): void {
    const accountTypeId = this.filterForm.get('accountType')?.value;
    const businessId = this.filterForm.get('business')?.value;
    const divisionId = this.filterForm.get('division')?.value;

    this.filteredCustomers = this.customers.filter(customer => {
      let matches = true;

      if (accountTypeId && customer.accountTypeID !== accountTypeId) {
        matches = false;
      }

      if (businessId && customer.businessID !== businessId) {
        matches = false;
      }

      if (divisionId && customer.divisionID !== divisionId) {
        matches = false;
      }

      return matches;
    });
  }

  private loadCustomerDetails(customerId: number): void {
    if (!customerId) return;

    const customer = this.customers.find(c => c.customerID === customerId);
    if (customer) {
      this.selectedAccount = customer;
      this.selectedCustomerDetails = {
        city: customer.city || '',
        limit: customer.limit || 0,
        balance: customer.balance || 0
      };
    }
  }

  loadAccountData(): void {
    if (!this.filterForm.valid || !this.filterForm.get('customer')?.value) {
      return;
    }

    this.isLoading = true;
    const filter: AccountFilter = {
      customerID: this.filterForm.get('customer')?.value,
      fromDate: new Date(this.filterForm.get('fromDate')?.value),
      toDate: new Date(this.filterForm.get('toDate')?.value),
      searchText: this.searchText
    };

    this.accountListService.getAccountTransactions(filter).subscribe({
      next: (data) => {
        this.accountData.load(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading account data:', error);
        this.toastr.error('Failed to load account transactions', 'Error');
        this.isLoading = false;
      }
    });
  }

  onRowSelect(event: any): void {
    this.selectedTransaction = event.data;
  }

  onRowDblClick(event: any): void {
    this.viewInvoice();
  }

  viewInvoice(): void {
    if (!this.selectedTransaction || !this.selectedTransaction.InvoiceNo) {
      this.toastr.warning('Please select a transaction with an invoice', 'No Invoice Selected');
      return;
    }

    // Check if it's a purchase invoice (starts with "P.")
    const isPurchaseInvoice = this.selectedTransaction.Description.startsWith('P.');
    
    if (isPurchaseInvoice) {
      this.accountListService.printPurchaseInvoice(this.selectedTransaction.InvoiceNo).subscribe({
        next: (invoiceData) => {
          this.openInvoiceModal(invoiceData, 'Purchase Invoice');
        },
        error: (error) => {
          console.error('Error loading purchase invoice:', error);
          this.toastr.error('Failed to load purchase invoice', 'Error');
        }
      });
    } else {
      this.accountListService.printSalesInvoice(this.selectedTransaction.InvoiceNo).subscribe({
        next: (invoiceData) => {
          this.openInvoiceModal(invoiceData, 'Sales Invoice');
        },
        error: (error) => {
          console.error('Error loading sales invoice:', error);
          this.toastr.error('Failed to load sales invoice', 'Error');
        }
      });
    }
  }

  private openInvoiceModal(invoiceData: any, title: string): void {
    this.toastr.info(`
      <strong>${title} #${invoiceData.invoiceNo}</strong><br>
      Date: ${new Date(invoiceData.date).toLocaleDateString()}<br>
      Amount: ${invoiceData.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}<br>
      Customer: ${invoiceData.customerName}
    `, 'Invoice Details', { 
      timeOut: 8000, 
      enableHtml: true 
    });
  }

  printAccountStatement(): void {
    if (!this.filterForm.valid || !this.selectedAccount) {
      this.toastr.warning('Please select a customer and valid date range', 'Invalid Selection');
      return;
    }

    const filter: AccountFilter = {
      customerID: this.selectedAccount.customerID,
      fromDate: new Date(this.filterForm.get('fromDate')?.value),
      toDate: new Date(this.filterForm.get('toDate')?.value),
      searchText: this.searchText
    };

    this.accountListService.generateAccountStatement(filter).subscribe({
      next: (reportData) => {
        this.openPrintDialog(reportData);
      },
      error: (error) => {
        console.error('Error generating account statement:', error);
        this.toastr.error('Failed to generate account statement', 'Error');
      }
    });
  }

  private openPrintDialog(reportData: AccountTransaction[]): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const htmlContent = this.generateAccountStatementHTML(reportData);
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  private generateAccountStatementHTML(data: AccountTransaction[]): string {
    const fromDate = new Date(this.filterForm.get('fromDate')?.value).toLocaleDateString();
    const toDate = new Date(this.filterForm.get('toDate')?.value).toLocaleDateString();
    const customerName = this.selectedAccount?.customerName || 'Unknown Customer';
    
    let totalDebits = 0;
    let totalCredits = 0;
    let runningBalance = 0;

    let html = `
      <html>
        <head>
          <title>Account Statement - ${customerName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .customer-info { margin-bottom: 20px; background-color: #f8f9fa; padding: 15px; border-radius: 5px; }
            .date-range { text-align: center; margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .amount { text-align: right; }
            .total { font-weight: bold; background-color: #f9f9f9; }
            .debit { color: #dc3545; }
            .credit { color: #28a745; }
            .balance { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Account Statement</h2>
          </div>
          <div class="customer-info">
            <h3>${customerName}</h3>
            <p><strong>City:</strong> ${this.selectedCustomerDetails.city}</p>
            <p><strong>Credit Limit:</strong> ${this.selectedCustomerDetails.limit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            <p><strong>Current Balance:</strong> ${this.selectedCustomerDetails.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
          </div>
          <div class="date-range">
            <p>From: ${fromDate} To: ${toDate}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice #</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
    `;

    data.forEach(transaction => {
      totalDebits += transaction.Debit || 0;
      totalCredits += transaction.Credit || 0;
      runningBalance = transaction.Balance;

      html += `
        <tr>
          <td>${new Date(transaction.Date).toLocaleDateString()}</td>
          <td>${transaction.InvoiceNo || ''}</td>
          <td>${transaction.Description}</td>
          <td class="amount debit">${transaction.Debit > 0 ? transaction.Debit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : ''}</td>
          <td class="amount credit">${transaction.Credit > 0 ? transaction.Credit.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : ''}</td>
          <td class="amount balance">${transaction.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
        </tr>
      `;
    });

    html += `
            <tr class="total">
              <td colspan="3"><strong>Totals:</strong></td>
              <td class="amount"><strong>${totalDebits.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong></td>
              <td class="amount"><strong>${totalCredits.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong></td>
              <td class="amount"><strong>${runningBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong></td>
            </tr>
            </tbody>
          </table>
          <div style="margin-top: 30px; text-align: center; color: #666;">
            <p>Statement Generated: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    return html;
  }

  refreshData(): void {
    this.loadAccountData();
  }

  exportToCSV(): void {
    if (!this.filterForm.valid || !this.selectedAccount) {
      this.toastr.warning('Please select a customer and valid date range', 'Invalid Selection');
      return;
    }

    const filter: AccountFilter = {
      customerID: this.selectedAccount.customerID,
      fromDate: new Date(this.filterForm.get('fromDate')?.value),
      toDate: new Date(this.filterForm.get('toDate')?.value),
      searchText: this.searchText
    };

    this.accountListService.exportAccountToCSV(filter).subscribe({
      next: (csvContent) => {
        this.downloadCSV(csvContent);
      },
      error: (error) => {
        console.error('Error exporting to CSV:', error);
        this.toastr.error('Failed to export data', 'Error');
      }
    });
  }

  private downloadCSV(csvContent: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `account-statement-${this.selectedAccount?.customerName}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Utility methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.filterForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.filterForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
    }
    return '';
  }

  // Quick filter methods
  filterByAccountType(accountTypeId: number): void {
    this.filterForm.patchValue({ accountType: accountTypeId });
  }

  clearFilters(): void {
    this.filterForm.patchValue({
      accountType: '',
      business: '',
      division: '',
      searchText: ''
    });
    this.searchText = '';
    this.filteredCustomers = this.customers;
  }

  getAccountSummary(): void {
    if (!this.selectedAccount) {
      this.toastr.warning('Please select a customer account', 'No Account Selected');
      return;
    }

    const filter: AccountFilter = {
      customerID: this.selectedAccount.customerID,
      fromDate: new Date(this.filterForm.get('fromDate')?.value),
      toDate: new Date(this.filterForm.get('toDate')?.value)
    };

    this.accountListService.getAccountSummary(filter).subscribe({
      next: (summary) => {
        this.showAccountSummaryModal(summary);
      },
      error: (error) => {
        console.error('Error loading account summary:', error);
        this.toastr.error('Failed to load account summary', 'Error');
      }
    });
  }

  private showAccountSummaryModal(summary: any): void {
    const summaryText = `
      <div class="text-center">
        <h5>Account Summary - ${this.selectedAccount?.customerName}</h5>
        <div class="row mt-3">
          <div class="col-6">
            <strong>Total Debits:</strong><br>
            ${summary.totalDebits.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </div>
          <div class="col-6">
            <strong>Total Credits:</strong><br>
            ${summary.totalCredits.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </div>
        </div>
        <hr>
        <div class="mt-3">
          <strong>Net Balance:</strong><br>
          ${summary.currentBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}<br><br>
          <strong>Total Transactions:</strong> ${summary.transactionCount}<br>
          <strong>Average Transaction:</strong> ${summary.averageTransaction.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </div>
      </div>
    `;
    
    this.toastr.info(summaryText, 'Account Summary', { 
      timeOut: 10000,
      enableHtml: true 
    });
  }
}