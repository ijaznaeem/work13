import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { RecoveryEntry, RecoveryFilter, Business, Division } from '../interfaces/cash.interface';

@Injectable({
  providedIn: 'root'
})
export class RecoveryByDivisionService {
  private baseUrl = '/api/recovery';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Mock data for development/testing
  private mockBusinesses: Business[] = [
    { businessID: 1, businessName: 'Pharmacy Operations', status: 1 },
    { businessID: 2, businessName: 'Medical Equipment', status: 1 },
    { businessID: 3, businessName: 'Diagnostics Center', status: 1 },
    { businessID: 4, businessName: 'Consultation Services', status: 1 }
  ];

  private mockDivisions: Division[] = [
    { divisionID: 1, divisionName: 'Retail Pharmacy', businessID: 1, status: 1 },
    { divisionID: 2, divisionName: 'Hospital Pharmacy', businessID: 1, status: 1 },
    { divisionID: 3, divisionName: 'Online Pharmacy', businessID: 1, status: 1 },
    { divisionID: 4, divisionName: 'Surgical Equipment', businessID: 2, status: 1 },
    { divisionID: 5, divisionName: 'Diagnostic Equipment', businessID: 2, status: 1 },
    { divisionID: 6, divisionName: 'Laboratory Services', businessID: 3, status: 1 },
    { divisionID: 7, divisionName: 'Imaging Services', businessID: 3, status: 1 },
    { divisionID: 8, divisionName: 'General Consultation', businessID: 4, status: 1 },
    { divisionID: 9, divisionName: 'Specialist Consultation', businessID: 4, status: 1 }
  ];

  private mockRecoveryEntries: RecoveryEntry[] = [
    {
      DetailID: 1,
      Date: '2025-01-15',
      CustomerName: 'City General Hospital',
      Description: 'Payment for pharmaceutical supplies - Invoice #PH-2025-001',
      AmountReceived: 15000.00,
      BusinessID: 1,
      DivisionID: 2,
      Status: 'RECOVERY'
    },
    {
      DetailID: 2,
      Date: '2025-01-16',
      CustomerName: 'Metro Medical Center',
      Description: 'Recovery for medical equipment lease - Contract #ME-2025-002',
      AmountReceived: 8500.75,
      BusinessID: 2,
      DivisionID: 4,
      Status: 'RECOVERY'
    },
    {
      DetailID: 3,
      Date: '2025-01-18',
      CustomerName: 'Family Health Clinic',
      Description: 'Payment for diagnostic services - Invoice #DG-2025-003',
      AmountReceived: 3200.50,
      BusinessID: 3,
      DivisionID: 6,
      Status: 'RECOVERY'
    },
    {
      DetailID: 4,
      Date: '2025-01-20',
      CustomerName: 'Regional Healthcare',
      Description: 'Outstanding pharmacy invoice recovery - Invoice #PH-2024-455',
      AmountReceived: 12750.00,
      BusinessID: 1,
      DivisionID: 1,
      Status: 'RECOVERY'
    },
    {
      DetailID: 5,
      Date: '2025-01-22',
      CustomerName: 'Emergency Care Unit',
      Description: 'Payment for surgical equipment - Invoice #SE-2025-004',
      AmountReceived: 22000.00,
      BusinessID: 2,
      DivisionID: 4,
      Status: 'RECOVERY'
    },
    {
      DetailID: 6,
      Date: '2025-01-24',
      CustomerName: 'Wellness Center',
      Description: 'Consultation fees recovery - Invoice #CN-2025-005',
      AmountReceived: 1850.25,
      BusinessID: 4,
      DivisionID: 8,
      Status: 'RECOVERY'
    },
    {
      DetailID: 7,
      Date: '2025-01-26',
      CustomerName: 'Suburban Hospital',
      Description: 'Laboratory services payment - Invoice #LS-2025-006',
      AmountReceived: 5600.00,
      BusinessID: 3,
      DivisionID: 6,
      Status: 'RECOVERY'
    },
    {
      DetailID: 8,
      Date: '2025-01-28',
      CustomerName: 'Medical Plaza',
      Description: 'Online pharmacy order recovery - Invoice #OP-2025-007',
      AmountReceived: 4200.80,
      BusinessID: 1,
      DivisionID: 3,
      Status: 'RECOVERY'
    },
    {
      DetailID: 9,
      Date: '2025-01-30',
      CustomerName: 'Heart Specialist Clinic',
      Description: 'Specialist consultation recovery - Invoice #SC-2025-008',
      AmountReceived: 3500.00,
      BusinessID: 4,
      DivisionID: 9,
      Status: 'RECOVERY'
    },
    {
      DetailID: 10,
      Date: '2025-02-02',
      CustomerName: 'Diagnostic Center',
      Description: 'Imaging services payment - Invoice #IS-2025-009',
      AmountReceived: 7800.50,
      BusinessID: 3,
      DivisionID: 7,
      Status: 'RECOVERY'
    },
    {
      DetailID: 11,
      Date: '2025-02-04',
      CustomerName: 'Community Hospital',
      Description: 'Pharmaceutical supplies recovery - Invoice #PH-2025-010',
      AmountReceived: 18500.75,
      BusinessID: 1,
      DivisionID: 2,
      Status: 'RECOVERY'
    },
    {
      DetailID: 12,
      Date: '2025-02-06',
      CustomerName: 'Private Medical Center',
      Description: 'Diagnostic equipment lease payment - Invoice #DE-2025-011',
      AmountReceived: 9200.00,
      BusinessID: 2,
      DivisionID: 5,
      Status: 'RECOVERY'
    },
    {
      DetailID: 13,
      Date: '2025-02-08',
      CustomerName: 'Rural Health Clinic',
      Description: 'General consultation fees - Invoice #GC-2025-012',
      AmountReceived: 2100.00,
      BusinessID: 4,
      DivisionID: 8,
      Status: 'RECOVERY'
    },
    {
      DetailID: 14,
      Date: '2025-02-10',
      CustomerName: 'Medical Equipment Corp',
      Description: 'Surgical equipment recovery - Invoice #SE-2025-013',
      AmountReceived: 35000.00,
      BusinessID: 2,
      DivisionID: 4,
      Status: 'RECOVERY'
    },
    {
      DetailID: 15,
      Date: '2025-02-12',
      CustomerName: 'Health Plus Pharmacy',
      Description: 'Retail pharmacy payment - Invoice #RP-2025-014',
      AmountReceived: 6750.25,
      BusinessID: 1,
      DivisionID: 1,
      Status: 'RECOVERY'
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Get recovery data by division based on filter criteria
   */
  getRecoveryByDivision(filter: RecoveryFilter): Observable<RecoveryEntry[]> {
    // In a real application, this would make an HTTP request
    // For now, return mock data with filtering
    return of(this.mockRecoveryEntries).pipe(
      map(entries => this.filterRecoveryEntries(entries, filter)),
      delay(500) // Simulate API delay
    );

    // Real implementation would be:
    // const params = this.buildFilterParams(filter);
    // return this.http.get<RecoveryEntry[]>(`${this.baseUrl}/by-division`, { params });
  }

  /**
   * Get list of businesses
   */
  getBusinesses(): Observable<Business[]> {
    // In a real application, this would make an HTTP request
    return of(this.mockBusinesses).pipe(delay(200));

    // Real implementation would be:
    // return this.http.get<Business[]>(`${this.baseUrl}/businesses`);
  }

  /**
   * Get list of divisions, optionally filtered by business
   */
  getDivisions(businessID?: number): Observable<Division[]> {
    // In a real application, this would make an HTTP request
    let divisions = this.mockDivisions;
    if (businessID && businessID > 0) {
      divisions = divisions.filter(d => d.businessID === businessID);
    }
    return of(divisions).pipe(delay(200));

    // Real implementation would be:
    // const params = businessID ? new HttpParams().set('businessID', businessID.toString()) : new HttpParams();
    // return this.http.get<Division[]>(`${this.baseUrl}/divisions`, { params });
  }

  /**
   * Exclude a recovery entry from active recovery tracking
   */
  excludeFromRecovery(detailID: number): Observable<any> {
    // In a real application, this would make an HTTP request
    const index = this.mockRecoveryEntries.findIndex(e => e.DetailID === detailID);
    if (index !== -1) {
      this.mockRecoveryEntries[index].Status = ''; // Clear status to exclude from recovery
    }
    
    return of({ success: true, message: 'Entry excluded from recovery successfully' }).pipe(
      delay(300)
    );

    // Real implementation would be:
    // return this.http.patch(`${this.baseUrl}/exclude/${detailID}`, {}, this.httpOptions);
  }

  /**
   * Generate printable recovery report
   */
  generateRecoveryReport(filter: RecoveryFilter): Observable<RecoveryEntry[]> {
    return this.getRecoveryByDivision(filter).pipe(
      map(entries => entries.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()))
    );
  }

  /**
   * Get recovery summary statistics
   */
  getRecoverySummary(filter: RecoveryFilter): Observable<any> {
    return this.getRecoveryByDivision(filter).pipe(
      map(entries => {
        const totalAmount = entries.reduce((sum, entry) => sum + (entry.AmountReceived || 0), 0);
        const totalEntries = entries.length;
        
        // Group by business
        const businessSummary = entries.reduce((acc, entry) => {
          const businessID = entry.BusinessID;
          if (!acc[businessID]) {
            acc[businessID] = { count: 0, amount: 0 };
          }
          acc[businessID].count++;
          acc[businessID].amount += entry.AmountReceived;
          return acc;
        }, {} as any);

        // Group by division
        const divisionSummary = entries.reduce((acc, entry) => {
          const divisionID = entry.DivisionID;
          if (!acc[divisionID]) {
            acc[divisionID] = { count: 0, amount: 0 };
          }
          acc[divisionID].count++;
          acc[divisionID].amount += entry.AmountReceived;
          return acc;
        }, {} as any);

        return {
          totalAmount,
          totalEntries,
          averageAmount: totalEntries > 0 ? totalAmount / totalEntries : 0,
          businessSummary,
          divisionSummary
        };
      })
    );
  }

  /**
   * Export recovery data to CSV format
   */
  exportRecoveryToCSV(filter: RecoveryFilter): Observable<string> {
    return this.getRecoveryByDivision(filter).pipe(
      map(entries => {
        const headers = ['Date', 'Customer Name', 'Description', 'Amount Received', 'Business', 'Division'];
        const csvData = entries.map(entry => {
          const business = this.mockBusinesses.find(b => b.businessID === entry.BusinessID);
          const division = this.mockDivisions.find(d => d.divisionID === entry.DivisionID);
          
          return [
            new Date(entry.Date).toLocaleDateString(),
            `"${entry.CustomerName}"`,
            `"${entry.Description}"`,
            entry.AmountReceived.toFixed(2),
            `"${business?.businessName || 'Unknown'}"`,
            `"${division?.divisionName || 'Unknown'}"`
          ];
        });

        const csvContent = [
          headers.join(','),
          ...csvData.map(row => row.join(','))
        ].join('\n');

        return csvContent;
      })
    );
  }

  /**
   * Get recovery trends over time
   */
  getRecoveryTrends(filter: RecoveryFilter): Observable<any[]> {
    return this.getRecoveryByDivision(filter).pipe(
      map(entries => {
        // Group entries by date
        const trends = entries.reduce((acc, entry) => {
          const date = new Date(entry.Date).toDateString();
          if (!acc[date]) {
            acc[date] = { date, count: 0, amount: 0 };
          }
          acc[date].count++;
          acc[date].amount += entry.AmountReceived;
          return acc;
        }, {} as any);

        return Object.values(trends).sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      })
    );
  }

  /**
   * Validate recovery filter parameters
   */
  validateRecoveryFilter(filter: RecoveryFilter): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Date validations
    if (!filter.fromDate) {
      errors.push('From date is required');
    }

    if (!filter.toDate) {
      errors.push('To date is required');
    }

    if (filter.fromDate && filter.toDate) {
      if (filter.fromDate > filter.toDate) {
        errors.push('From date cannot be later than to date');
      }

      const daysDiff = Math.abs(filter.toDate.getTime() - filter.fromDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 365) {
        errors.push('Date range cannot exceed 365 days');
      }
    }

    // Business and division validations
    if (filter.businessID && filter.businessID < 0) {
      errors.push('Invalid business ID');
    }

    if (filter.divisionID && filter.divisionID < 0) {
      errors.push('Invalid division ID');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Filter recovery entries based on criteria
   */
  private filterRecoveryEntries(entries: RecoveryEntry[], filter: RecoveryFilter): RecoveryEntry[] {
    return entries.filter(entry => {
      // Date filtering
      const entryDate = new Date(entry.Date);
      const fromDate = new Date(filter.fromDate);
      const toDate = new Date(filter.toDate);

      // Set time to start/end of day for proper comparison
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      const dateInRange = entryDate >= fromDate && entryDate <= toDate;

      // Business filtering
      const businessMatch = !filter.businessID || filter.businessID === 0 || entry.BusinessID === filter.businessID;

      // Division filtering
      const divisionMatch = !filter.divisionID || filter.divisionID === 0 || entry.DivisionID === filter.divisionID;

      // Status filtering (only show active recovery entries)
      const statusMatch = entry.Status === 'RECOVERY';

      return dateInRange && businessMatch && divisionMatch && statusMatch;
    });
  }

  /**
   * Build HTTP params for API requests
   */
  private buildFilterParams(filter: RecoveryFilter): HttpParams {
    let params = new HttpParams();

    if (filter.fromDate) {
      params = params.set('fromDate', filter.fromDate.toISOString().split('T')[0]);
    }

    if (filter.toDate) {
      params = params.set('toDate', filter.toDate.toISOString().split('T')[0]);
    }

    if (filter.businessID && filter.businessID > 0) {
      params = params.set('businessID', filter.businessID.toString());
    }

    if (filter.divisionID && filter.divisionID > 0) {
      params = params.set('divisionID', filter.divisionID.toString());
    }

    return params;
  }

  /**
   * Get business name by ID
   */
  getBusinessName(businessID: number): string {
    const business = this.mockBusinesses.find(b => b.businessID === businessID);
    return business?.businessName || 'Unknown Business';
  }

  /**
   * Get division name by ID
   */
  getDivisionName(divisionID: number): string {
    const division = this.mockDivisions.find(d => d.divisionID === divisionID);
    return division?.divisionName || 'Unknown Division';
  }

  /**
   * Bulk exclude multiple entries from recovery
   */
  bulkExcludeFromRecovery(detailIDs: number[]): Observable<any> {
    detailIDs.forEach(id => {
      const index = this.mockRecoveryEntries.findIndex(e => e.DetailID === id);
      if (index !== -1) {
        this.mockRecoveryEntries[index].Status = '';
      }
    });
    
    return of({ 
      success: true, 
      message: `${detailIDs.length} entries excluded from recovery successfully` 
    }).pipe(delay(500));

    // Real implementation would be:
    // return this.http.patch(`${this.baseUrl}/bulk-exclude`, { detailIDs }, this.httpOptions);
  }
}