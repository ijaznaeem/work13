import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import { PaymentReportService } from '../services/payment-report.service';
import { PaymentEntry, PaymentFilter } from '../interfaces/cash.interface';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {
  filterForm: FormGroup;
  paymentData: LocalDataSource = new LocalDataSource();
  selectedPaymentEntry: PaymentEntry | null = null;
  isLoading = false;
  totalPayments = 0;

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
        width: '15%',
        filter: false,
        valuePrepareFunction: (value: string) => {
          return new Date(value).toLocaleDateString();
        }
      },
      CustomerName: {
        title: 'Supplier/Vendor',
        type: 'string',
        width: '35%',
        filter: false
      },
      Description: {
        title: 'Description',
        type: 'string',
        width: '35%',
        filter: false
      },
      AmountPaid: {
        title: 'Amount Paid',
        type: 'number',
        width: '15%',
        filter: false,
        valuePrepareFunction: (value: number) => {
          return value ? value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          }) : '0.00';
        }
      }
    },
    pager: {
      display: true,
      perPage: 25
    },
    noDataMessage: 'No payment data found for the selected date range'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private paymentService: PaymentReportService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setDefaultDateRange();
    this.loadPaymentData();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });

    // Subscribe to form changes for auto-refresh
    this.filterForm.valueChanges.subscribe(() => {
      if (this.filterForm.valid) {
        this.loadPaymentData();
      }
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

  loadPaymentData(): void {
    if (!this.filterForm.valid) return;

    this.isLoading = true;
    const filter: PaymentFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate)
    };

    this.paymentService.getPaymentReport(filter).subscribe({
      next: (data) => {
        this.paymentData.load(data);
        this.calculateTotalPayments(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading payment data:', error);
        this.toastr.error('Failed to load payment data', 'Error');
        this.isLoading = false;
      }
    });
  }

  private calculateTotalPayments(data: PaymentEntry[]): void {
    this.totalPayments = data.reduce((sum, entry) => sum + (entry.AmountPaid || 0), 0);
  }

  onRowSelect(event: any): void {
    this.selectedPaymentEntry = event.data;
  }

  printReport(): void {
    if (!this.filterForm.valid) {
      this.toastr.warning('Please select valid date range', 'Invalid Date Range');
      return;
    }

    const filter: PaymentFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate)
    };

    this.paymentService.generatePaymentReport(filter).subscribe({
      next: (reportData) => {
        this.openPrintDialog(reportData);
      },
      error: (error) => {
        console.error('Error generating report:', error);
        this.toastr.error('Failed to generate report', 'Error');
      }
    });
  }

  private openPrintDialog(reportData: PaymentEntry[]): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const htmlContent = this.generatePrintableReport(reportData);
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  private generatePrintableReport(data: PaymentEntry[]): string {
    const fromDate = new Date(this.filterForm.value.fromDate).toLocaleDateString();
    const toDate = new Date(this.filterForm.value.toDate).toLocaleDateString();
    
    let html = `
      <html>
        <head>
          <title>Payment Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .date-range { text-align: center; margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .amount { text-align: right; }
            .total { font-weight: bold; background-color: #f9f9f9; }
            .summary { margin-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Payment Report</h2>
          </div>
          <div class="date-range">
            <p>From: ${fromDate} To: ${toDate}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Supplier/Vendor</th>
                <th>Description</th>
                <th>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
    `;

    data.forEach(entry => {
      html += `
        <tr>
          <td>${new Date(entry.Date).toLocaleDateString()}</td>
          <td>${entry.CustomerName}</td>
          <td>${entry.Description}</td>
          <td class="amount">${entry.AmountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>
      `;
    });

    html += `
            <tr class="total">
              <td colspan="3"><strong>Total Payments:</strong></td>
              <td class="amount"><strong>${this.totalPayments.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
            </tbody>
          </table>
          <div class="summary">
            <p><strong>Total Entries:</strong> ${data.length}</p>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    return html;
  }

  refreshData(): void {
    this.loadPaymentData();
  }

  exportToCSV(): void {
    if (!this.filterForm.valid) {
      this.toastr.warning('Please select valid date range', 'Invalid Date Range');
      return;
    }

    const filter: PaymentFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate)
    };

    this.paymentService.exportPaymentToCSV(filter).subscribe({
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
    a.download = `payment-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  getPaymentSummary(): void {
    if (!this.filterForm.valid) return;

    const filter: PaymentFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate)
    };

    this.paymentService.getPaymentSummary(filter).subscribe({
      next: (summary) => {
        this.showSummaryModal(summary);
      },
      error: (error) => {
        console.error('Error loading payment summary:', error);
        this.toastr.error('Failed to load payment summary', 'Error');
      }
    });
  }

  private showSummaryModal(summary: any): void {
    // Implementation for showing summary modal
    const summaryText = `
      Payment Summary:
      Total Amount: ${summary.totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      Total Payments: ${summary.totalPayments}
      Average Payment: ${summary.averagePayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      Largest Payment: ${summary.largestPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      Date Range: ${summary.dateRange}
    `;
    
    this.toastr.info(summaryText, 'Payment Summary', { 
      timeOut: 10000,
      enableHtml: true 
    });
  }

  viewPaymentDetails(): void {
    if (!this.selectedPaymentEntry) {
      this.toastr.warning('Please select a payment entry to view details', 'No Selection');
      return;
    }

    // Navigate to detailed view or open modal
    this.toastr.info(`
      <strong>Payment Details:</strong><br>
      Date: ${new Date(this.selectedPaymentEntry.Date).toLocaleDateString()}<br>
      Supplier: ${this.selectedPaymentEntry.CustomerName}<br>
      Amount: ${this.selectedPaymentEntry.AmountPaid.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}<br>
      Description: ${this.selectedPaymentEntry.Description}
    `, 'Payment Details', { 
      timeOut: 8000, 
      enableHtml: true 
    });
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
  filterBySupplier(supplierName: string): void {
    this.paymentData.setFilter([
      {
        field: 'CustomerName',
        search: supplierName
      }
    ]);
  }

  filterByAmountRange(minAmount: number, maxAmount: number): void {
    this.paymentData.setFilter([
      {
        field: 'AmountPaid',
        search: '',
        filter: (cell: number) => {
          return cell >= minAmount && cell <= maxAmount;
        }
      }
    ]);
  }

  clearFilters(): void {
    this.paymentData.reset();
    this.loadPaymentData();
  }
}