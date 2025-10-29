import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import { OtherIncomeReportService } from '../services/other-income-report.service';
import { OtherIncomeEntry, OtherIncomeFilter } from '../interfaces/cash.interface';

@Component({
  selector: 'app-other-income-report',
  templateUrl: './other-income-report.component.html',
  styleUrls: ['./other-income-report.component.scss']
})
export class OtherIncomeReportComponent implements OnInit {
  @ViewChild('addIncomeModal') addIncomeModal: any;
  @ViewChild('editIncomeModal') editIncomeModal: any;
  @ViewChild('confirmDeleteModal') confirmDeleteModal: any;

  filterForm: FormGroup;
  incomeForm: FormGroup;
  otherIncomeData: LocalDataSource = new LocalDataSource();
  selectedIncomeEntry: OtherIncomeEntry | null = null;
  isEditMode = false;
  isLoading = false;
  totalAmount = 0;

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
        filter: false
      },
      Description: {
        title: 'Description',
        type: 'string',
        width: '35%',
        filter: false
      },
      Amount: {
        title: 'Amount',
        type: 'number',
        width: '15%',
        filter: false,
        valuePrepareFunction: (value: number) => {
          return value ? value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          }) : '0.00';
        }
      },
      Reference: {
        title: 'Reference',
        type: 'string',
        width: '20%',
        filter: false
      },
      Status: {
        title: 'Status',
        type: 'string',
        width: '15%',
        filter: false,
        valuePrepareFunction: (value: number) => {
          return value === 0 ? 'Draft' : 'Posted';
        }
      }
    },
    pager: {
      display: true,
      perPage: 20
    },
    noDataMessage: 'No other income entries found for the selected date range'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private otherIncomeService: OtherIncomeReportService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.setDefaultDateRange();
    this.loadOtherIncomeData();
  }

  private initializeForms(): void {
    // Filter form for date range
    this.filterForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });

    // Income entry form
    this.incomeForm = this.fb.group({
      expedId: [0],
      date: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      reference: ['', Validators.maxLength(100)],
      remarks: ['', Validators.maxLength(1000)],
      status: [0] // 0 = Draft, 1 = Posted
    });

    // Subscribe to form changes for auto-refresh
    this.filterForm.valueChanges.subscribe(() => {
      if (this.filterForm.valid) {
        this.loadOtherIncomeData();
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

  loadOtherIncomeData(): void {
    if (!this.filterForm.valid) return;

    this.isLoading = true;
    const filter: OtherIncomeFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate)
    };

    this.otherIncomeService.getOtherIncomeReport(filter).subscribe({
      next: (data) => {
        this.otherIncomeData.load(data);
        this.calculateTotalAmount(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading other income data:', error);
        this.toastr.error('Failed to load other income data', 'Error');
        this.isLoading = false;
      }
    });
  }

  private calculateTotalAmount(data: OtherIncomeEntry[]): void {
    this.totalAmount = data.reduce((sum, entry) => sum + (entry.Amount || 0), 0);
  }

  onRowSelect(event: any): void {
    this.selectedIncomeEntry = event.data;
  }

  openAddIncomeModal(): void {
    this.isEditMode = false;
    this.incomeForm.reset({
      expedId: 0,
      date: this.formatDateForInput(new Date()),
      description: '',
      amount: 0,
      reference: '',
      remarks: '',
      status: 0
    });
    this.modalService.open(this.addIncomeModal, { size: 'lg', backdrop: 'static' });
  }

  openEditIncomeModal(): void {
    if (!this.selectedIncomeEntry) {
      this.toastr.warning('Please select an income entry to edit', 'No Selection');
      return;
    }

    if (this.selectedIncomeEntry.Status === 1) {
      this.toastr.warning('Cannot edit posted entries', 'Edit Restricted');
      return;
    }

    this.isEditMode = true;
    this.incomeForm.patchValue({
      expedId: this.selectedIncomeEntry.EXPEDID,
      date: this.formatDateForInput(new Date(this.selectedIncomeEntry.Date)),
      description: this.selectedIncomeEntry.Description,
      amount: this.selectedIncomeEntry.Amount,
      reference: this.selectedIncomeEntry.Reference,
      remarks: this.selectedIncomeEntry.Remarks || '',
      status: this.selectedIncomeEntry.Status
    });
    this.modalService.open(this.editIncomeModal, { size: 'lg', backdrop: 'static' });
  }

  openDeleteConfirmModal(): void {
    if (!this.selectedIncomeEntry) {
      this.toastr.warning('Please select an income entry to delete', 'No Selection');
      return;
    }

    if (this.selectedIncomeEntry.Status === 1) {
      this.toastr.warning('Cannot delete posted entries', 'Delete Restricted');
      return;
    }

    this.modalService.open(this.confirmDeleteModal, { backdrop: 'static' });
  }

  saveIncomeEntry(): void {
    if (!this.incomeForm.valid) {
      this.markFormGroupTouched(this.incomeForm);
      return;
    }

    this.isLoading = true;
    const incomeData: OtherIncomeEntry = {
      EXPEDID: this.incomeForm.value.expedId,
      Date: this.incomeForm.value.date,
      Description: this.incomeForm.value.description,
      Amount: parseFloat(this.incomeForm.value.amount),
      Reference: this.incomeForm.value.reference,
      Remarks: this.incomeForm.value.remarks,
      Status: this.incomeForm.value.status
    };

    const operation = this.isEditMode 
      ? this.otherIncomeService.updateOtherIncomeEntry(incomeData)
      : this.otherIncomeService.addOtherIncomeEntry(incomeData);

    operation.subscribe({
      next: (response) => {
        const message = this.isEditMode ? 'Income entry updated successfully' : 'Income entry added successfully';
        this.toastr.success(message, 'Success');
        this.modalService.dismissAll();
        this.loadOtherIncomeData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving income entry:', error);
        this.toastr.error('Failed to save income entry', 'Error');
        this.isLoading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.selectedIncomeEntry) return;

    this.isLoading = true;
    this.otherIncomeService.deleteOtherIncomeEntry(this.selectedIncomeEntry.EXPEDID).subscribe({
      next: (response) => {
        this.toastr.success('Income entry deleted successfully', 'Success');
        this.modalService.dismissAll();
        this.selectedIncomeEntry = null;
        this.loadOtherIncomeData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting income entry:', error);
        this.toastr.error('Failed to delete income entry', 'Error');
        this.isLoading = false;
      }
    });
  }

  printReport(): void {
    if (!this.filterForm.valid) {
      this.toastr.warning('Please select valid date range', 'Invalid Date Range');
      return;
    }

    const filter: OtherIncomeFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate)
    };

    this.otherIncomeService.generateOtherIncomeReport(filter).subscribe({
      next: (reportData) => {
        // Open print dialog with formatted report
        this.openPrintDialog(reportData);
      },
      error: (error) => {
        console.error('Error generating report:', error);
        this.toastr.error('Failed to generate report', 'Error');
      }
    });
  }

  private openPrintDialog(reportData: any): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const htmlContent = this.generatePrintableReport(reportData);
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  private generatePrintableReport(data: OtherIncomeEntry[]): string {
    const fromDate = new Date(this.filterForm.value.fromDate).toLocaleDateString();
    const toDate = new Date(this.filterForm.value.toDate).toLocaleDateString();
    
    let html = `
      <html>
        <head>
          <title>Other Income Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .date-range { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .amount { text-align: right; }
            .total { font-weight: bold; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Other Income Report</h2>
          </div>
          <div class="date-range">
            <p>From: ${fromDate} To: ${toDate}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
    `;

    data.forEach(entry => {
      html += `
        <tr>
          <td>${new Date(entry.Date).toLocaleDateString()}</td>
          <td>${entry.Description}</td>
          <td>${entry.Reference || ''}</td>
          <td class="amount">${entry.Amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          <td>${entry.Status === 0 ? 'Draft' : 'Posted'}</td>
        </tr>
      `;
    });

    html += `
            <tr class="total">
              <td colspan="3"><strong>Total Amount:</strong></td>
              <td class="amount"><strong>${this.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    return html;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Utility methods for form validation
  isFieldInvalid(fieldName: string, form: FormGroup = this.incomeForm): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string, form: FormGroup = this.incomeForm): string {
    const field = form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
    }
    return '';
  }
}