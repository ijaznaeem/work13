import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { PaymentEntry, PaymentFilter } from '../interfaces/cash.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentReportService {
  private baseUrl = '/api/payments';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Mock data for development/testing
  private mockPaymentEntries: PaymentEntry[] = [
    {
      DetailID: 1,
      Date: '2025-01-15',
      CustomerName: 'MedSupply Corp',
      Description: 'Payment for pharmaceutical supplies - Invoice #PS-2025-001',
      AmountPaid: 15000.00,
      AcctTypeID: 7,
      InvoiceID: 0
    },
    {
      DetailID: 2,
      Date: '2025-01-16',
      CustomerName: 'Equipment Solutions Ltd',
      Description: 'Medical equipment purchase - Invoice #ME-2025-002',
      AmountPaid: 28500.75,
      AcctTypeID: 17,
      InvoiceID: 0
    },
    {
      DetailID: 3,
      Date: '2025-01-18',
      CustomerName: 'Healthcare Logistics',
      Description: 'Delivery and logistics services - Invoice #HL-2025-003',
      AmountPaid: 3200.50,
      AcctTypeID: 7,
      InvoiceID: 0
    },
    {
      DetailID: 4,
      Date: '2025-01-20',
      CustomerName: 'Pharma Distributors Inc',
      Description: 'Bulk pharmaceutical order payment - Invoice #PD-2025-004',
      AmountPaid: 45750.00,
      AcctTypeID: 17,
      InvoiceID: 0
    },
    {
      DetailID: 5,
      Date: '2025-01-22',
      CustomerName: 'Lab Equipment Co',
      Description: 'Laboratory testing equipment - Invoice #LE-2025-005',
      AmountPaid: 18200.00,
      AcctTypeID: 7,
      InvoiceID: 0
    },
    {
      DetailID: 6,
      Date: '2025-01-24',
      CustomerName: 'Surgical Instruments Ltd',
      Description: 'Surgical instruments and tools - Invoice #SI-2025-006',
      AmountPaid: 12850.25,
      AcctTypeID: 17,
      InvoiceID: 0
    },
    {
      DetailID: 7,
      Date: '2025-01-26',
      CustomerName: 'Medical Supplies Plus',
      Description: 'General medical supplies restock - Invoice #MS-2025-007',
      AmountPaid: 8600.00,
      AcctTypeID: 7,
      InvoiceID: 0
    },
    {
      DetailID: 8,
      Date: '2025-01-28',
      CustomerName: 'Diagnostic Equipment Inc',
      Description: 'X-ray and diagnostic equipment - Invoice #DE-2025-008',
      AmountPaid: 67200.80,
      AcctTypeID: 17,
      InvoiceID: 0
    },
    {
      DetailID: 9,
      Date: '2025-01-30',
      CustomerName: 'Pharmacy Wholesale',
      Description: 'Prescription medication bulk order - Invoice #PW-2025-009',
      AmountPaid: 23500.00,
      AcctTypeID: 7,
      InvoiceID: 0
    },
    {
      DetailID: 10,
      Date: '2025-02-02',
      CustomerName: 'Medical Technology Systems',
      Description: 'IT systems and software licenses - Invoice #MT-2025-010',
      AmountPaid: 15800.50,
      AcctTypeID: 17,
      InvoiceID: 0
    },
    {
      DetailID: 11,
      Date: '2025-02-04',
      CustomerName: 'Healthcare Facilities Corp',
      Description: 'Facility maintenance and repairs - Invoice #HF-2025-011',
      AmountPaid: 9200.75,
      AcctTypeID: 7,
      InvoiceID: 0
    },
    {
      DetailID: 12,
      Date: '2025-02-06',
      CustomerName: 'Biomedical Solutions',
      Description: 'Biomedical calibration services - Invoice #BS-2025-012',
      AmountPaid: 5400.00,
      AcctTypeID: 17,
      InvoiceID: 0
    },
    {
      DetailID: 13,
      Date: '2025-02-08',
      CustomerName: 'Professional Services LLC',
      Description: 'Consulting and professional services - Invoice #PS-2025-013',
      AmountPaid: 7100.00,
      AcctTypeID: 7,
      InvoiceID: 0
    },
    {
      DetailID: 14,
      Date: '2025-02-10',
      CustomerName: 'Emergency Equipment Co',
      Description: 'Emergency medical equipment - Invoice #EE-2025-014',
      AmountPaid: 31000.00,
      AcctTypeID: 17,
      InvoiceID: 0
    },
    {
      DetailID: 15,
      Date: '2025-02-12',
      CustomerName: 'Medical Research Supplies',
      Description: 'Research and development materials - Invoice #MR-2025-015',
      AmountPaid: 19750.25,
      AcctTypeID: 7,
      InvoiceID: 0
    },
    {
      DetailID: 16,
      Date: '2025-02-14',
      CustomerName: 'Hospital Equipment Leasing',
      Description: 'Monthly equipment lease payment - Invoice #HE-2025-016',
      AmountPaid: 22800.00,
      AcctTypeID: 17,
      InvoiceID: 0
    },
    {
      DetailID: 17,
      Date: '2025-02-16',
      CustomerName: 'Sterilization Services',
      Description: 'Equipment sterilization and maintenance - Invoice #SS-2025-017',
      AmountPaid: 4350.50,
      AcctTypeID: 7,
      InvoiceID: 0
    },
    {
      DetailID: 18,
      Date: '2025-02-18',
      CustomerName: 'Imaging Solutions Corp',
      Description: 'MRI and CT scan equipment service - Invoice #IS-2025-018',
      AmountPaid: 38900.00,
      AcctTypeID: 17,
      InvoiceID: 0
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Get payment report data based on filter criteria
   */
  getPaymentReport(filter: PaymentFilter): Observable<PaymentEntry[]> {
    // In a real application, this would make an HTTP request
    // For now, return mock data with filtering
    return of(this.mockPaymentEntries).pipe(
      map(entries => this.filterPaymentEntries(entries, filter)),
      delay(500) // Simulate API delay
    );

    // Real implementation would be:
    // const params = this.buildFilterParams(filter);
    // return this.http.get<PaymentEntry[]>(`${this.baseUrl}/report`, { params });
  }

  /**
   * Generate printable payment report
   */
  generatePaymentReport(filter: PaymentFilter): Observable<PaymentEntry[]> {
    return this.getPaymentReport(filter).pipe(
      map(entries => entries.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()))
    );
  }

  /**
   * Get payment summary statistics
   */
  getPaymentSummary(filter: PaymentFilter): Observable<any> {
    return this.getPaymentReport(filter).pipe(
      map(entries => {
        const totalAmount = entries.reduce((sum, entry) => sum + (entry.AmountPaid || 0), 0);
        const totalPayments = entries.length;
        const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;
        const largestPayment = entries.length > 0 ? Math.max(...entries.map(e => e.AmountPaid)) : 0;
        const smallestPayment = entries.length > 0 ? Math.min(...entries.map(e => e.AmountPaid)) : 0;

        // Group by supplier
        const supplierSummary = entries.reduce((acc, entry) => {
          if (!acc[entry.CustomerName]) {
            acc[entry.CustomerName] = { count: 0, amount: 0 };
          }
          acc[entry.CustomerName].count++;
          acc[entry.CustomerName].amount += entry.AmountPaid;
          return acc;
        }, {} as any);

        // Group by account type
        const accountTypeSummary = entries.reduce((acc, entry) => {
          const typeKey = entry.AcctTypeID === 7 ? 'Type 7' : 'Type 17';
          if (!acc[typeKey]) {
            acc[typeKey] = { count: 0, amount: 0 };
          }
          acc[typeKey].count++;
          acc[typeKey].amount += entry.AmountPaid;
          return acc;
        }, {} as any);

        return {
          totalAmount,
          totalPayments,
          averagePayment,
          largestPayment,
          smallestPayment,
          supplierSummary,
          accountTypeSummary,
          dateRange: `${filter.fromDate.toLocaleDateString()} - ${filter.toDate.toLocaleDateString()}`
        };
      })
    );
  }

  /**
   * Export payment data to CSV format
   */
  exportPaymentToCSV(filter: PaymentFilter): Observable<string> {
    return this.getPaymentReport(filter).pipe(
      map(entries => {
        const headers = ['Date', 'Supplier/Vendor', 'Description', 'Amount Paid', 'Account Type'];
        const csvData = entries.map(entry => [
          new Date(entry.Date).toLocaleDateString(),
          `"${entry.CustomerName}"`,
          `"${entry.Description}"`,
          entry.AmountPaid.toFixed(2),
          entry.AcctTypeID === 7 ? 'Type 7' : 'Type 17'
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
   * Get payment trends over time
   */
  getPaymentTrends(filter: PaymentFilter): Observable<any[]> {
    return this.getPaymentReport(filter).pipe(
      map(entries => {
        // Group entries by date
        const trends = entries.reduce((acc, entry) => {
          const date = new Date(entry.Date).toDateString();
          if (!acc[date]) {
            acc[date] = { date, count: 0, amount: 0 };
          }
          acc[date].count++;
          acc[date].amount += entry.AmountPaid;
          return acc;
        }, {} as any);

        return Object.values(trends).sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      })
    );
  }

  /**
   * Get top suppliers by payment amount
   */
  getTopSuppliers(filter: PaymentFilter, limit: number = 10): Observable<any[]> {
    return this.getPaymentReport(filter).pipe(
      map(entries => {
        const supplierTotals = entries.reduce((acc, entry) => {
          if (!acc[entry.CustomerName]) {
            acc[entry.CustomerName] = {
              name: entry.CustomerName,
              totalAmount: 0,
              paymentCount: 0,
              lastPaymentDate: entry.Date
            };
          }
          acc[entry.CustomerName].totalAmount += entry.AmountPaid;
          acc[entry.CustomerName].paymentCount++;
          
          // Update last payment date if current entry is more recent
          if (new Date(entry.Date) > new Date(acc[entry.CustomerName].lastPaymentDate)) {
            acc[entry.CustomerName].lastPaymentDate = entry.Date;
          }
          
          return acc;
        }, {} as any);

        return Object.values(supplierTotals)
          .sort((a: any, b: any) => b.totalAmount - a.totalAmount)
          .slice(0, limit);
      })
    );
  }

  /**
   * Validate payment filter parameters
   */
  validatePaymentFilter(filter: PaymentFilter): { isValid: boolean; errors: string[] } {
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

    // Amount range validations
    if (filter.minAmount && filter.minAmount < 0) {
      errors.push('Minimum amount cannot be negative');
    }

    if (filter.maxAmount && filter.maxAmount < 0) {
      errors.push('Maximum amount cannot be negative');
    }

    if (filter.minAmount && filter.maxAmount && filter.minAmount > filter.maxAmount) {
      errors.push('Minimum amount cannot be greater than maximum amount');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Search payments by supplier name
   */
  searchPaymentsBySupplier(supplierName: string, filter?: PaymentFilter): Observable<PaymentEntry[]> {
    let entries = this.mockPaymentEntries;
    
    // Apply date filter if provided
    if (filter) {
      entries = this.filterPaymentEntries(entries, filter);
    }

    // Filter by supplier name
    const filteredEntries = entries.filter(entry =>
      entry.CustomerName.toLowerCase().includes(supplierName.toLowerCase())
    );

    return of(filteredEntries).pipe(delay(300));
  }

  /**
   * Get payment details by ID
   */
  getPaymentDetails(detailID: number): Observable<PaymentEntry> {
    const entry = this.mockPaymentEntries.find(e => e.DetailID === detailID);
    if (!entry) {
      throw new Error('Payment entry not found');
    }
    
    return of(entry).pipe(delay(200));

    // Real implementation would be:
    // return this.http.get<PaymentEntry>(`${this.baseUrl}/${detailID}`);
  }

  /**
   * Get payment analytics data
   */
  getPaymentAnalytics(filter: PaymentFilter): Observable<any> {
    return this.getPaymentReport(filter).pipe(
      map(entries => {
        const monthlyTrends = this.calculateMonthlyTrends(entries);
        const supplierDistribution = this.calculateSupplierDistribution(entries);
        const accountTypeDistribution = this.calculateAccountTypeDistribution(entries);
        const weeklyTrends = this.calculateWeeklyTrends(entries);

        return {
          monthlyTrends,
          supplierDistribution,
          accountTypeDistribution,
          weeklyTrends,
          totalMetrics: {
            totalAmount: entries.reduce((sum, e) => sum + e.AmountPaid, 0),
            totalCount: entries.length,
            uniqueSuppliers: new Set(entries.map(e => e.CustomerName)).size,
            averagePayment: entries.length > 0 ? entries.reduce((sum, e) => sum + e.AmountPaid, 0) / entries.length : 0
          }
        };
      })
    );
  }

  /**
   * Filter payment entries based on criteria
   */
  private filterPaymentEntries(entries: PaymentEntry[], filter: PaymentFilter): PaymentEntry[] {
    return entries.filter(entry => {
      // Date filtering
      const entryDate = new Date(entry.Date);
      const fromDate = new Date(filter.fromDate);
      const toDate = new Date(filter.toDate);

      // Set time to start/end of day for proper comparison
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      const dateInRange = entryDate >= fromDate && entryDate <= toDate;

      // Amount filtering
      let amountInRange = true;
      if (filter.minAmount !== undefined) {
        amountInRange = amountInRange && entry.AmountPaid >= filter.minAmount;
      }
      if (filter.maxAmount !== undefined) {
        amountInRange = amountInRange && entry.AmountPaid <= filter.maxAmount;
      }

      // Account type filtering (7 or 17 as per VB6 form)
      const accountTypeMatch = entry.AcctTypeID === 7 || entry.AcctTypeID === 17;

      // Invoice ID filtering (only non-invoice payments)
      const nonInvoicePayment = entry.InvoiceID === 0;

      // Amount greater than 0
      const validAmount = entry.AmountPaid > 0;

      // Supplier name filtering
      let supplierMatch = true;
      if (filter.supplierName) {
        supplierMatch = entry.CustomerName.toLowerCase().includes(filter.supplierName.toLowerCase());
      }

      return dateInRange && amountInRange && accountTypeMatch && nonInvoicePayment && validAmount && supplierMatch;
    });
  }

  /**
   * Calculate monthly trends
   */
  private calculateMonthlyTrends(entries: PaymentEntry[]): any[] {
    const monthlyData = entries.reduce((acc, entry) => {
      const month = new Date(entry.Date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, amount: 0, count: 0 };
      }
      acc[month].amount += entry.AmountPaid;
      acc[month].count++;
      return acc;
    }, {} as any);

    return Object.values(monthlyData);
  }

  /**
   * Calculate supplier distribution
   */
  private calculateSupplierDistribution(entries: PaymentEntry[]): any[] {
    const supplierData = entries.reduce((acc, entry) => {
      if (!acc[entry.CustomerName]) {
        acc[entry.CustomerName] = { supplier: entry.CustomerName, amount: 0, count: 0 };
      }
      acc[entry.CustomerName].amount += entry.AmountPaid;
      acc[entry.CustomerName].count++;
      return acc;
    }, {} as any);

    return Object.values(supplierData)
      .sort((a: any, b: any) => b.amount - a.amount)
      .slice(0, 10); // Top 10 suppliers
  }

  /**
   * Calculate account type distribution
   */
  private calculateAccountTypeDistribution(entries: PaymentEntry[]): any[] {
    const typeData = entries.reduce((acc, entry) => {
      const type = entry.AcctTypeID === 7 ? 'Account Type 7' : 'Account Type 17';
      if (!acc[type]) {
        acc[type] = { type, amount: 0, count: 0 };
      }
      acc[type].amount += entry.AmountPaid;
      acc[type].count++;
      return acc;
    }, {} as any);

    return Object.values(typeData);
  }

  /**
   * Calculate weekly trends
   */
  private calculateWeeklyTrends(entries: PaymentEntry[]): any[] {
    const weeklyData = entries.reduce((acc, entry) => {
      const date = new Date(entry.Date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toLocaleDateString();
      
      if (!acc[weekKey]) {
        acc[weekKey] = { week: weekKey, amount: 0, count: 0 };
      }
      acc[weekKey].amount += entry.AmountPaid;
      acc[weekKey].count++;
      return acc;
    }, {} as any);

    return Object.values(weeklyData)
      .sort((a: any, b: any) => new Date(a.week).getTime() - new Date(b.week).getTime());
  }

  /**
   * Build HTTP params for API requests
   */
  private buildFilterParams(filter: PaymentFilter): HttpParams {
    let params = new HttpParams();

    if (filter.fromDate) {
      params = params.set('fromDate', filter.fromDate.toISOString().split('T')[0]);
    }

    if (filter.toDate) {
      params = params.set('toDate', filter.toDate.toISOString().split('T')[0]);
    }

    if (filter.minAmount !== undefined) {
      params = params.set('minAmount', filter.minAmount.toString());
    }

    if (filter.maxAmount !== undefined) {
      params = params.set('maxAmount', filter.maxAmount.toString());
    }

    if (filter.supplierName) {
      params = params.set('supplierName', filter.supplierName);
    }

    return params;
  }
}