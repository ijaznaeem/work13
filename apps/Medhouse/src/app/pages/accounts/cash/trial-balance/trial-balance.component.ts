import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import { TrialBalanceService } from '../services/trial-balance.service';
import { TrialBalanceEntry, TrialBalanceFilter } from '../interfaces/cash.interface';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss']
})
export class TrialBalanceComponent implements OnInit {
  filterForm: FormGroup;
  trialBalanceData: LocalDataSource = new LocalDataSource();
  selectedEntry: TrialBalanceEntry | null = null;
  isLoading = false;
  totalDebits = 0;
  totalCredits = 0;
  balanceDifference = 0;

  // Smart Table Settings
  tableSettings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    selectMode: 'single',
    columns: {
      Type: {
        title: 'Type',
        type: 'string',
        width: '15%',
        filter: false
      },
      Account: {
        title: 'Account',
        type: 'string',
        width: '45%',
        filter: false
      },
      Debit: {
        title: 'Debit',
        type: 'number',
        width: '20%',
        filter: false,
        valuePrepareFunction: (value: number) => {
          return value && value > 0 ? value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          }) : '';
        }
      },
      Credit: {
        title: 'Credit',
        type: 'number',
        width: '20%',
        filter: false,
        valuePrepareFunction: (value: number) => {
          return value && value > 0 ? value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          }) : '';
        }
      }
    },
    pager: {
      display: true,
      perPage: 50
    },
    noDataMessage: 'No trial balance data found for the selected date range'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private trialBalanceService: TrialBalanceService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setDefaultDateRange();
    this.loadTrialBalanceData();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });

    // Subscribe to form changes for auto-refresh
    this.filterForm.valueChanges.subscribe(() => {
      if (this.filterForm.valid) {
        this.loadTrialBalanceData();
      }
    });
  }

  private setDefaultDateRange(): void {
    const today = new Date();
    
    this.filterForm.patchValue({
      fromDate: this.formatDateForInput(today),
      toDate: this.formatDateForInput(today)
    });
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadTrialBalanceData(): void {
    if (!this.filterForm.valid) return;

    this.isLoading = true;
    const filter: TrialBalanceFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate)
    };

    this.trialBalanceService.getTrialBalance(filter).subscribe({
      next: (data) => {
        this.trialBalanceData.load(data);
        this.calculateTotals(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trial balance data:', error);
        this.toastr.error('Failed to load trial balance data', 'Error');
        this.isLoading = false;
      }
    });
  }

  private calculateTotals(data: TrialBalanceEntry[]): void {
    this.totalDebits = data.reduce((sum, entry) => sum + (entry.Debit || 0), 0);
    this.totalCredits = data.reduce((sum, entry) => sum + (entry.Credit || 0), 0);
    this.balanceDifference = this.totalDebits - this.totalCredits;
  }

  onRowSelect(event: any): void {
    this.selectedEntry = event.data;
  }

  printTrialBalance(): void {
    if (!this.filterForm.valid) {
      this.toastr.warning('Please select valid date range', 'Invalid Date Range');
      return;
    }

    const filter: TrialBalanceFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate)
    };

    this.trialBalanceService.generateTrialBalanceReport(filter).subscribe({
      next: (reportData) => {
        this.openPrintDialog(reportData);
      },
      error: (error) => {
        console.error('Error generating trial balance report:', error);
        this.toastr.error('Failed to generate trial balance report', 'Error');
      }
    });
  }

  private openPrintDialog(reportData: TrialBalanceEntry[]): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const htmlContent = this.generatePrintableReport(reportData);
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  private generatePrintableReport(data: TrialBalanceEntry[]): string {
    const fromDate = new Date(this.filterForm.value.fromDate).toLocaleDateString();
    const toDate = new Date(this.filterForm.value.toDate).toLocaleDateString();
    
    let html = `
      <html>
        <head>
          <title>Trial Balance Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .date-range { text-align: center; margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .amount { text-align: right; }
            .total { font-weight: bold; background-color: #f9f9f9; }
            .balance-difference { background-color: #fff3cd; color: #856404; }
            .type-group { background-color: #e7f3ff; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Trial Balance Report</h2>
          </div>
          <div class="date-range">
            <p>From: ${fromDate} To: ${toDate}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Account</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
            </thead>
            <tbody>
    `;

    // Group data by type for better presentation
    const groupedData = this.groupDataByType(data);
    
    Object.keys(groupedData).forEach(type => {
      html += `
        <tr class="type-group">
          <td colspan="4">${type}</td>
        </tr>
      `;
      
      groupedData[type].forEach(entry => {
        html += `
          <tr>
            <td></td>
            <td style="padding-left: 20px;">${entry.Account}</td>
            <td class="amount">${entry.Debit > 0 ? entry.Debit.toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</td>
            <td class="amount">${entry.Credit > 0 ? entry.Credit.toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</td>
          </tr>
        `;
      });
    });

    html += `
            <tr class="total">
              <td colspan="2"><strong>Total:</strong></td>
              <td class="amount"><strong>${this.totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
              <td class="amount"><strong>${this.totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            <tr class="balance-difference">
              <td colspan="2"><strong>Difference (Debit - Credit):</strong></td>
              <td class="amount" colspan="2"><strong>${this.balanceDifference.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            </tbody>
          </table>
          <div style="margin-top: 30px; text-align: center; color: #666;">
            <p>Report Generated: ${new Date().toLocaleString()}</p>
            ${Math.abs(this.balanceDifference) < 0.01 ? 
              '<p style="color: green; font-weight: bold;">✓ Trial Balance is in Balance</p>' : 
              '<p style="color: red; font-weight: bold;">⚠ Trial Balance is NOT in Balance</p>'}
          </div>
        </body>
      </html>
    `;

    return html;
  }

  private groupDataByType(data: TrialBalanceEntry[]): { [key: string]: TrialBalanceEntry[] } {
    return data.reduce((groups, entry) => {
      if (!groups[entry.Type]) {
        groups[entry.Type] = [];
      }
      groups[entry.Type].push(entry);
      return groups;
    }, {} as { [key: string]: TrialBalanceEntry[] });
  }

  refreshData(): void {
    this.loadTrialBalanceData();
  }

  exportToCSV(): void {
    if (!this.filterForm.valid) {
      this.toastr.warning('Please select valid date range', 'Invalid Date Range');
      return;
    }

    const filter: TrialBalanceFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate)
    };

    this.trialBalanceService.exportTrialBalanceToCSV(filter).subscribe({
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
    a.download = `trial-balance-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  getAccountSummary(): void {
    if (!this.filterForm.valid) return;

    const filter: TrialBalanceFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate)
    };

    this.trialBalanceService.getAccountSummary(filter).subscribe({
      next: (summary) => {
        this.showSummaryModal(summary);
      },
      error: (error) => {
        console.error('Error loading account summary:', error);
        this.toastr.error('Failed to load account summary', 'Error');
      }
    });
  }

  private showSummaryModal(summary: any): void {
    const balanceStatus = Math.abs(this.balanceDifference) < 0.01 ? 'BALANCED' : 'UNBALANCED';
    const statusColor = balanceStatus === 'BALANCED' ? 'success' : 'warning';
    
    const summaryText = `
      <div class="text-center">
        <h5>Trial Balance Summary</h5>
        <div class="row mt-3">
          <div class="col-6">
            <strong>Total Debits:</strong><br>
            ${this.totalDebits.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </div>
          <div class="col-6">
            <strong>Total Credits:</strong><br>
            ${this.totalCredits.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </div>
        </div>
        <hr>
        <div class="alert alert-${statusColor} mt-3">
          <strong>Status:</strong> ${balanceStatus}<br>
          <strong>Difference:</strong> ${this.balanceDifference.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </div>
        <div class="mt-3">
          <strong>Account Types:</strong> ${summary.accountTypes}<br>
          <strong>Total Accounts:</strong> ${summary.totalAccounts}
        </div>
      </div>
    `;
    
    this.toastr.info(summaryText, 'Trial Balance Summary', { 
      timeOut: 10000,
      enableHtml: true 
    });
  }

  isTrialBalanceBalanced(): boolean {
    return Math.abs(this.balanceDifference) < 0.01;
  }

  getBalanceStatusClass(): string {
    return this.isTrialBalanceBalanced() ? 'text-success' : 'text-warning';
  }

  getBalanceStatusIcon(): string {
    return this.isTrialBalanceBalanced() ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
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

  // Advanced filtering methods
  filterByAccountType(accountType: string): void {
    this.trialBalanceData.setFilter([
      {
        field: 'Type',
        search: accountType
      }
    ]);
  }

  clearFilters(): void {
    this.trialBalanceData.reset();
    this.loadTrialBalanceData();
  }

  viewAccountDetails(): void {
    if (!this.selectedEntry) {
      this.toastr.warning('Please select an account entry to view details', 'No Selection');
      return;
    }

    this.toastr.info(`
      <strong>Account Details:</strong><br>
      Type: ${this.selectedEntry.Type}<br>
      Account: ${this.selectedEntry.Account}<br>
      Debit: ${this.selectedEntry.Debit?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || 'N/A'}<br>
      Credit: ${this.selectedEntry.Credit?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || 'N/A'}
    `, 'Account Details', { 
      timeOut: 8000, 
      enableHtml: true 
    });
  }
}