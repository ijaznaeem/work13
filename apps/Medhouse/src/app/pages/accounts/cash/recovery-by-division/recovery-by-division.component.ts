import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalDataSource } from 'ng2-smart-table';
import { RecoveryByDivisionService } from '../services/recovery-by-division.service';
import { RecoveryEntry, RecoveryFilter, Business, Division } from '../interfaces/cash.interface';

@Component({
  selector: 'app-recovery-by-division',
  templateUrl: './recovery-by-division.component.html',
  styleUrls: ['./recovery-by-division.component.scss']
})
export class RecoveryByDivisionComponent implements OnInit {
  @ViewChild('confirmExcludeModal') confirmExcludeModal: any;

  filterForm: FormGroup;
  recoveryData: LocalDataSource = new LocalDataSource();
  selectedRecoveryEntry: RecoveryEntry | null = null;
  isLoading = false;
  totalRecovered = 0;

  businesses: Business[] = [];
  divisions: Division[] = [];
  filteredDivisions: Division[] = [];

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
        title: 'Customer Name',
        type: 'string',
        width: '30%',
        filter: false
      },
      Description: {
        title: 'Description',
        type: 'string',
        width: '35%',
        filter: false
      },
      AmountReceived: {
        title: 'Amount Received',
        type: 'number',
        width: '20%',
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
    noDataMessage: 'No recovery data found for the selected criteria'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private recoveryService: RecoveryByDivisionService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadBusinesses();
    this.loadDivisions();
    this.setDefaultDateRange();
    this.loadRecoveryData();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      businessID: [0], // 0 means "All"
      divisionID: [0]  // 0 means "All"
    });

    // Subscribe to form changes for auto-refresh
    this.filterForm.valueChanges.subscribe(() => {
      if (this.filterForm.valid) {
        this.loadRecoveryData();
      }
    });

    // Subscribe to business changes to filter divisions
    this.filterForm.get('businessID')?.valueChanges.subscribe((businessID) => {
      this.filterDivisionsByBusiness(businessID);
      this.filterForm.patchValue({ divisionID: 0 }, { emitEvent: false });
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

  loadBusinesses(): void {
    this.recoveryService.getBusinesses().subscribe({
      next: (data) => {
        this.businesses = [{ businessID: 0, businessName: '--All--' }, ...data];
      },
      error: (error) => {
        console.error('Error loading businesses:', error);
        this.toastr.error('Failed to load businesses', 'Error');
      }
    });
  }

  loadDivisions(): void {
    this.recoveryService.getDivisions().subscribe({
      next: (data) => {
        this.divisions = [{ divisionID: 0, divisionName: '--All--' }, ...data];
        this.filteredDivisions = [...this.divisions];
      },
      error: (error) => {
        console.error('Error loading divisions:', error);
        this.toastr.error('Failed to load divisions', 'Error');
      }
    });
  }

  private filterDivisionsByBusiness(businessID: number): void {
    if (businessID === 0) {
      // Show all divisions
      this.filteredDivisions = [...this.divisions];
    } else {
      // Filter divisions by business
      this.filteredDivisions = [
        { divisionID: 0, divisionName: '--All--' },
        ...this.divisions.filter(div => div.businessID === businessID)
      ];
    }
  }

  loadRecoveryData(): void {
    if (!this.filterForm.valid) return;

    this.isLoading = true;
    const filter: RecoveryFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate),
      businessID: this.filterForm.value.businessID || undefined,
      divisionID: this.filterForm.value.divisionID || undefined
    };

    this.recoveryService.getRecoveryByDivision(filter).subscribe({
      next: (data) => {
        this.recoveryData.load(data);
        this.calculateTotalRecovered(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recovery data:', error);
        this.toastr.error('Failed to load recovery data', 'Error');
        this.isLoading = false;
      }
    });
  }

  private calculateTotalRecovered(data: RecoveryEntry[]): void {
    this.totalRecovered = data.reduce((sum, entry) => sum + (entry.AmountReceived || 0), 0);
  }

  onRowSelect(event: any): void {
    this.selectedRecoveryEntry = event.data;
  }

  openExcludeConfirmModal(): void {
    if (!this.selectedRecoveryEntry) {
      this.toastr.warning('Please select a recovery entry to exclude', 'No Selection');
      return;
    }

    this.modalService.open(this.confirmExcludeModal, { backdrop: 'static' });
  }

  confirmExcludeFromRecovery(): void {
    if (!this.selectedRecoveryEntry) return;

    this.isLoading = true;
    this.recoveryService.excludeFromRecovery(this.selectedRecoveryEntry.DetailID).subscribe({
      next: (response) => {
        this.toastr.success('Entry excluded from recovery successfully', 'Success');
        this.modalService.dismissAll();
        this.selectedRecoveryEntry = null;
        this.loadRecoveryData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error excluding from recovery:', error);
        this.toastr.error('Failed to exclude entry from recovery', 'Error');
        this.isLoading = false;
      }
    });
  }

  printReport(): void {
    if (!this.filterForm.valid) {
      this.toastr.warning('Please select valid date range', 'Invalid Date Range');
      return;
    }

    const filter: RecoveryFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate),
      businessID: this.filterForm.value.businessID || undefined,
      divisionID: this.filterForm.value.divisionID || undefined
    };

    this.recoveryService.generateRecoveryReport(filter).subscribe({
      next: (reportData) => {
        this.openPrintDialog(reportData);
      },
      error: (error) => {
        console.error('Error generating report:', error);
        this.toastr.error('Failed to generate report', 'Error');
      }
    });
  }

  private openPrintDialog(reportData: RecoveryEntry[]): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const htmlContent = this.generatePrintableReport(reportData);
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  private generatePrintableReport(data: RecoveryEntry[]): string {
    const fromDate = new Date(this.filterForm.value.fromDate).toLocaleDateString();
    const toDate = new Date(this.filterForm.value.toDate).toLocaleDateString();
    const businessName = this.getSelectedBusinessName();
    const divisionName = this.getSelectedDivisionName();
    
    let html = `
      <html>
        <head>
          <title>Recovery by Division Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .filters { text-align: center; margin-bottom: 20px; color: #666; }
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
            <h2>Recovery by Division Report</h2>
          </div>
          <div class="filters">
            <p>Business: ${businessName} | Division: ${divisionName}</p>
            <p>From: ${fromDate} To: ${toDate}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Description</th>
                <th>Amount Received</th>
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
          <td class="amount">${entry.AmountReceived.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>
      `;
    });

    html += `
            <tr class="total">
              <td colspan="3"><strong>Total Recovered:</strong></td>
              <td class="amount"><strong>${this.totalRecovered.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
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

  private getSelectedBusinessName(): string {
    const businessID = this.filterForm.value.businessID;
    if (businessID === 0) return 'All Businesses';
    const business = this.businesses.find(b => b.businessID === businessID);
    return business?.businessName || 'Unknown';
  }

  private getSelectedDivisionName(): string {
    const divisionID = this.filterForm.value.divisionID;
    if (divisionID === 0) return 'All Divisions';
    const division = this.filteredDivisions.find(d => d.divisionID === divisionID);
    return division?.divisionName || 'Unknown';
  }

  refreshData(): void {
    this.loadRecoveryData();
  }

  exportToCSV(): void {
    if (!this.filterForm.valid) {
      this.toastr.warning('Please select valid date range', 'Invalid Date Range');
      return;
    }

    const filter: RecoveryFilter = {
      fromDate: new Date(this.filterForm.value.fromDate),
      toDate: new Date(this.filterForm.value.toDate),
      businessID: this.filterForm.value.businessID || undefined,
      divisionID: this.filterForm.value.divisionID || undefined
    };

    this.recoveryService.exportRecoveryToCSV(filter).subscribe({
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
    a.download = `recovery-by-division-${new Date().toISOString().split('T')[0]}.csv`;
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
}