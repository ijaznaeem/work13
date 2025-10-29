import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { OtherIncomeEntry, OtherIncomeFilter } from '../interfaces/cash.interface';

@Injectable({
  providedIn: 'root'
})
export class OtherIncomeReportService {
  private baseUrl = '/api/other-income';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Mock data for development/testing
  private mockOtherIncomeEntries: OtherIncomeEntry[] = [
    {
      EXPEDID: 1,
      Date: '2025-01-15',
      Description: 'Commission from partner sales',
      Amount: 2500.00,
      Reference: 'COM-2025-001',
      Remarks: 'Monthly commission payment',
      Status: 1
    },
    {
      EXPEDID: 2,
      Date: '2025-01-18',
      Description: 'Interest earned on fixed deposits',
      Amount: 850.75,
      Reference: 'INT-FD-2025-001',
      Remarks: 'Quarterly interest payment',
      Status: 1
    },
    {
      EXPEDID: 3,
      Date: '2025-01-20',
      Description: 'Rental income from property',
      Amount: 3200.00,
      Reference: 'RENT-2025-001',
      Remarks: 'Monthly rental payment',
      Status: 1
    },
    {
      EXPEDID: 4,
      Date: '2025-01-22',
      Description: 'Insurance claim settlement',
      Amount: 5000.00,
      Reference: 'INS-CLAIM-2025-001',
      Remarks: 'Equipment damage claim',
      Status: 0
    },
    {
      EXPEDID: 5,
      Date: '2025-01-25',
      Description: 'Dividend income from investments',
      Amount: 1200.50,
      Reference: 'DIV-2025-001',
      Remarks: 'Annual dividend payment',
      Status: 1
    },
    {
      EXPEDID: 6,
      Date: '2025-01-28',
      Description: 'Consulting service fees',
      Amount: 4500.00,
      Reference: 'CONS-2025-001',
      Remarks: 'Management consulting project',
      Status: 0
    },
    {
      EXPEDID: 7,
      Date: '2025-01-30',
      Description: 'Scrap material sale proceeds',
      Amount: 675.25,
      Reference: 'SCRAP-2025-001',
      Remarks: 'Monthly scrap sale',
      Status: 1
    },
    {
      EXPEDID: 8,
      Date: '2025-02-02',
      Description: 'Training program income',
      Amount: 3800.00,
      Reference: 'TRAIN-2025-001',
      Remarks: 'Employee training services',
      Status: 0
    },
    {
      EXPEDID: 9,
      Date: '2025-02-05',
      Description: 'Penalty recovery from vendor',
      Amount: 1500.00,
      Reference: 'PEN-REC-2025-001',
      Remarks: 'Late delivery penalty',
      Status: 1
    },
    {
      EXPEDID: 10,
      Date: '2025-02-08',
      Description: 'Grant funding received',
      Amount: 10000.00,
      Reference: 'GRANT-2025-001',
      Remarks: 'Government grant for research',
      Status: 0
    },
    {
      EXPEDID: 11,
      Date: '2025-02-12',
      Description: 'Royalty income from patents',
      Amount: 2200.75,
      Reference: 'ROY-2025-001',
      Remarks: 'Quarterly royalty payment',
      Status: 1
    },
    {
      EXPEDID: 12,
      Date: '2025-02-15',
      Description: 'Foreign exchange gain',
      Amount: 890.50,
      Reference: 'FX-GAIN-2025-001',
      Remarks: 'Currency conversion gain',
      Status: 1
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Get other income report data based on filter criteria
   */
  getOtherIncomeReport(filter: OtherIncomeFilter): Observable<OtherIncomeEntry[]> {
    // In a real application, this would make an HTTP request
    // For now, return mock data with filtering
    return of(this.mockOtherIncomeEntries).pipe(
      map(entries => this.filterEntries(entries, filter)),
      delay(500) // Simulate API delay
    );

    // Real implementation would be:
    // const params = this.buildFilterParams(filter);
    // return this.http.get<OtherIncomeEntry[]>(`${this.baseUrl}/report`, { params });
  }

  /**
   * Add a new other income entry
   */
  addOtherIncomeEntry(entry: OtherIncomeEntry): Observable<any> {
    // In a real application, this would make an HTTP POST request
    const newEntry = {
      ...entry,
      EXPEDID: Math.max(...this.mockOtherIncomeEntries.map(e => e.EXPEDID)) + 1
    };
    this.mockOtherIncomeEntries.push(newEntry);
    
    return of({ success: true, message: 'Income entry added successfully', data: newEntry }).pipe(
      delay(300)
    );

    // Real implementation would be:
    // return this.http.post(`${this.baseUrl}`, entry, this.httpOptions);
  }

  /**
   * Update an existing other income entry
   */
  updateOtherIncomeEntry(entry: OtherIncomeEntry): Observable<any> {
    // In a real application, this would make an HTTP PUT request
    const index = this.mockOtherIncomeEntries.findIndex(e => e.EXPEDID === entry.EXPEDID);
    if (index !== -1) {
      this.mockOtherIncomeEntries[index] = { ...entry };
    }
    
    return of({ success: true, message: 'Income entry updated successfully', data: entry }).pipe(
      delay(300)
    );

    // Real implementation would be:
    // return this.http.put(`${this.baseUrl}/${entry.EXPEDID}`, entry, this.httpOptions);
  }

  /**
   * Delete an other income entry
   */
  deleteOtherIncomeEntry(expedId: number): Observable<any> {
    // In a real application, this would make an HTTP DELETE request
    const index = this.mockOtherIncomeEntries.findIndex(e => e.EXPEDID === expedId);
    if (index !== -1) {
      this.mockOtherIncomeEntries.splice(index, 1);
    }
    
    return of({ success: true, message: 'Income entry deleted successfully' }).pipe(
      delay(300)
    );

    // Real implementation would be:
    // return this.http.delete(`${this.baseUrl}/${expedId}`, this.httpOptions);
  }

  /**
   * Get details of a specific other income entry
   */
  getOtherIncomeEntry(expedId: number): Observable<OtherIncomeEntry> {
    // In a real application, this would make an HTTP GET request
    const entry = this.mockOtherIncomeEntries.find(e => e.EXPEDID === expedId);
    if (!entry) {
      throw new Error('Income entry not found');
    }
    
    return of(entry).pipe(delay(200));

    // Real implementation would be:
    // return this.http.get<OtherIncomeEntry>(`${this.baseUrl}/${expedId}`);
  }

  /**
   * Generate printable report data
   */
  generateOtherIncomeReport(filter: OtherIncomeFilter): Observable<OtherIncomeEntry[]> {
    return this.getOtherIncomeReport(filter).pipe(
      map(entries => entries.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()))
    );
  }

  /**
   * Get other income summary statistics
   */
  getOtherIncomeSummary(filter: OtherIncomeFilter): Observable<any> {
    return this.getOtherIncomeReport(filter).pipe(
      map(entries => {
        const totalAmount = entries.reduce((sum, entry) => sum + (entry.Amount || 0), 0);
        const draftEntries = entries.filter(e => e.Status === 0).length;
        const postedEntries = entries.filter(e => e.Status === 1).length;
        const totalEntries = entries.length;

        return {
          totalAmount,
          totalEntries,
          draftEntries,
          postedEntries,
          averageAmount: totalEntries > 0 ? totalAmount / totalEntries : 0
        };
      })
    );
  }

  /**
   * Post/Unpost other income entries (change status)
   */
  changeEntryStatus(expedId: number, status: number): Observable<any> {
    const index = this.mockOtherIncomeEntries.findIndex(e => e.EXPEDID === expedId);
    if (index !== -1) {
      this.mockOtherIncomeEntries[index].Status = status;
    }
    
    const statusText = status === 1 ? 'posted' : 'unposted';
    return of({ 
      success: true, 
      message: `Income entry ${statusText} successfully` 
    }).pipe(delay(300));

    // Real implementation would be:
    // return this.http.patch(`${this.baseUrl}/${expedId}/status`, { status }, this.httpOptions);
  }

  /**
   * Validate other income entry data
   */
  validateOtherIncomeEntry(entry: OtherIncomeEntry): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required field validations
    if (!entry.Date) {
      errors.push('Date is required');
    }

    if (!entry.Description || entry.Description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!entry.Amount || entry.Amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    // Data format validations
    if (entry.Description && entry.Description.length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }

    if (entry.Reference && entry.Reference.length > 100) {
      errors.push('Reference cannot exceed 100 characters');
    }

    if (entry.Remarks && entry.Remarks.length > 1000) {
      errors.push('Remarks cannot exceed 1000 characters');
    }

    // Date validation
    if (entry.Date) {
      const entryDate = new Date(entry.Date);
      const today = new Date();
      if (entryDate > today) {
        errors.push('Date cannot be in the future');
      }
    }

    // Amount validation
    if (entry.Amount && (entry.Amount > 999999999.99)) {
      errors.push('Amount cannot exceed 999,999,999.99');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Filter entries based on criteria
   */
  private filterEntries(entries: OtherIncomeEntry[], filter: OtherIncomeFilter): OtherIncomeEntry[] {
    return entries.filter(entry => {
      const entryDate = new Date(entry.Date);
      const fromDate = new Date(filter.fromDate);
      const toDate = new Date(filter.toDate);

      // Set time to start/end of day for proper comparison
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      return entryDate >= fromDate && entryDate <= toDate;
    });
  }

  /**
   * Build HTTP params for API requests
   */
  private buildFilterParams(filter: OtherIncomeFilter): HttpParams {
    let params = new HttpParams();

    if (filter.fromDate) {
      params = params.set('fromDate', filter.fromDate.toISOString().split('T')[0]);
    }

    if (filter.toDate) {
      params = params.set('toDate', filter.toDate.toISOString().split('T')[0]);
    }

    return params;
  }

  /**
   * Export other income data to CSV format
   */
  exportToCSV(filter: OtherIncomeFilter): Observable<string> {
    return this.getOtherIncomeReport(filter).pipe(
      map(entries => {
        const headers = ['Date', 'Description', 'Amount', 'Reference', 'Status', 'Remarks'];
        const csvData = entries.map(entry => [
          new Date(entry.Date).toLocaleDateString(),
          `"${entry.Description}"`,
          entry.Amount.toFixed(2),
          `"${entry.Reference || ''}"`,
          entry.Status === 1 ? 'Posted' : 'Draft',
          `"${entry.Remarks || ''}"`
        ]);

        const csvContent = [
          headers.join(','),
          ...csvData.map(row => row.join(','))
        ].join('\n');

        return csvContent;
      })
    );
  }

  /**
   * Get available reference number suggestions
   */
  getReferenceSuggestions(prefix: string = ''): Observable<string[]> {
    const suggestions = [
      'COM-2025-',
      'INT-FD-2025-',
      'RENT-2025-',
      'INS-CLAIM-2025-',
      'DIV-2025-',
      'CONS-2025-',
      'SCRAP-2025-',
      'TRAIN-2025-',
      'PEN-REC-2025-',
      'GRANT-2025-',
      'ROY-2025-',
      'FX-GAIN-2025-'
    ].filter(ref => ref.toLowerCase().includes(prefix.toLowerCase()));

    return of(suggestions).pipe(delay(100));
  }
}