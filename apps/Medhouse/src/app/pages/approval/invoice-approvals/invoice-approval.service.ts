import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpBase } from '../../../services/httpbase.service';
import { InvoiceApproval, InvoiceApprovalDetail, InvoiceApprovalFilter } from './invoice-approval.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceApprovalService {

  constructor(private httpBase: HttpBase) {
  }

  /**
   * Get invoice approvals data from qryInvoiceApprovals view
   * @param filter Filter criteria matching VB6 ShowData() method
   */
  getInvoiceApprovals(filter: InvoiceApprovalFilter): Observable<InvoiceApproval[]> {
    // Build query parameters matching VB6 logic
    const params = {
      dtcr: 'CR', // DtCr = 'CR' condition from VB6
      status: filter.status,
      dateFrom: filter.dateFrom.toISOString().split('T')[0],
      dateTo: filter.dateTo.toISOString().split('T')[0]
    };

    // In production, this would be:
    // return this.httpBase.getData('qryInvoiceApprovals', params);
    
    // For now, return mock data based on database schema
    return of(this.getMockInvoiceApprovals());
  }

  /**
   * Get invoice approval details from qryInvoiceApprovalDetails view
   * @param invoiceApprovalId The InvoiceApprovalID to get details for
   */
  getInvoiceApprovalDetails(invoiceApprovalId: number): Observable<InvoiceApprovalDetail[]> {
    // In production, this would be:
    // return this.httpBase.getData('qryInvoiceApprovalDetails', { InvoiceApprovalID: invoiceApprovalId });
    
    return of(this.getMockInvoiceApprovalDetails(invoiceApprovalId));
  }

  /**
   * Forward invoice approval to accounts department
   * Matches VB6 btnForward_Click logic
   */
  forwardApproval(invoiceApprovalId: number, forwardedTo: number): Observable<boolean> {
    const data = {
      invoiceApprovalId,
      forwardedTo
    };

    // In production, this would be:
    // return this.httpBase.putData(`invoiceapprovals/${invoiceApprovalId}/forward`, data);
    
    return of(true);
  }

  /**
   * Reject invoice approval with remarks
   * Matches VB6 btnReject_Click logic
   */
  rejectApproval(invoiceApprovalId: number, rejectionReason: string): Observable<boolean> {
    const data = {
      invoiceApprovalId,
      rejectionReason,
      status: 'Rejected'
    };

    // In production, this would be:
    // return this.httpBase.putData(`invoiceapprovals/${invoiceApprovalId}/reject`, data);
    
    return of(true);
  }

  /**
   * Print approval form
   * Matches VB6 btnEdit_Click (Print) logic
   */
  printApprovalForm(invoiceApprovalId: number): Observable<Blob> {
    // In production, this would return PDF blob:
    // return this.httpBase.getBlob(`invoiceapprovals/${invoiceApprovalId}/print`);
    
    return of(new Blob(['Mock PDF content'], { type: 'application/pdf' }));
  }

  /**
   * Mock data based on qryInvoiceApprovals view structure
   */
  private getMockInvoiceApprovals(): InvoiceApproval[] {
    return [
      {
        Date: new Date('2024-01-15'),
        CustomerName: 'ABC Pharmacy',
        Amount: 15000,
        AmntRecvd: 10000,
        Discount: 1500,
        NetAmount: 13500,
        Balance: 3500,
        CustomerID: 1,
        InvoiceApprovalID: 1,
        UserName: 'john.doe',
        SessionID: 101,
        UserID: 1,
        DtCr: 'CR',
        Type: 1,
        SalesmanID: 1,
        BusinessID: 1,
        PhoneNo1: '03001234567',
        CustBalance: 25000,
        SendSMS: 1,
        DivisionID: 1,
        Address: '123 Main Street, City Center',
        City: 'Karachi',
        Remarks: 'Pending approval from accounts department',
        Status: 'In Process',
        ForwardedID: 4,
        ForwardedDept: 'Accounts',
        ReferredBy3: 0,
        BonusType: 0
      },
      {
        Date: new Date('2024-01-16'),
        CustomerName: 'XYZ Medical Store',
        Amount: 22000,
        AmntRecvd: 20000,
        Discount: 2200,
        NetAmount: 19800,
        Balance: -200,
        CustomerID: 2,
        InvoiceApprovalID: 2,
        UserName: 'jane.smith',
        SessionID: 102,
        UserID: 2,
        DtCr: 'CR',
        Type: 1,
        SalesmanID: 2,
        BusinessID: 1,
        PhoneNo1: '03007654321',
        CustBalance: 15000,
        SendSMS: 1,
        DivisionID: 1,
        Address: '456 Business Avenue, Commercial Area',
        City: 'Lahore',
        Remarks: 'High volume customer - priority processing',
        Status: 'Completed',
        ForwardedID: 0,
        ForwardedDept: '',
        ReferredBy3: 0,
        BonusType: 1
      },
      {
        Date: new Date('2024-01-17'),
        CustomerName: 'City Healthcare',
        Amount: 8500,
        AmntRecvd: 0,
        Discount: 850,
        NetAmount: 7650,
        Balance: 7650,
        CustomerID: 3,
        InvoiceApprovalID: 3,
        UserName: 'admin',
        SessionID: 103,
        UserID: 3,
        DtCr: 'CR',
        Type: 1,
        SalesmanID: 1,
        BusinessID: 1,
        PhoneNo1: '03009876543',
        CustBalance: 5000,
        SendSMS: 0,
        DivisionID: 2,
        Address: '789 Healthcare Complex, Medical District',
        City: 'Islamabad',
        Remarks: 'Customer requested extended payment terms - rejected due to credit limit',
        Status: 'Rejected',
        ForwardedID: 0,
        ForwardedDept: '',
        ReferredBy3: 0,
        BonusType: 0
      }
    ];
  }

  /**
   * Mock data based on qryInvoiceApprovalDetails view structure
   */
  private getMockInvoiceApprovalDetails(invoiceApprovalId: number): InvoiceApprovalDetail[] {
    const detailsMap: { [key: number]: InvoiceApprovalDetail[] } = {
      1: [
        {
          ProductName: 'Panadol 500mg Tablets',
          Qty: 100,
          Bonus: 10,
          SPrice: 120,
          Amount: 12000,
          Discount: 1200,
          NetAmount: 10800,
          InvoiceApprovalID: 1,
          DetailID: 1,
          ProductID: 101,
          DiscRatio: 10,
          BatchNo: 'PND001',
          PPrice: 100
        },
        {
          ProductName: 'Brufen 400mg Tablets',
          Qty: 50,
          Bonus: 5,
          SPrice: 60,
          Amount: 3000,
          Discount: 300,
          NetAmount: 2700,
          InvoiceApprovalID: 1,
          DetailID: 2,
          ProductID: 102,
          DiscRatio: 10,
          BatchNo: 'BRF001',
          PPrice: 50
        }
      ],
      2: [
        {
          ProductName: 'Amoxil 250mg Capsules',
          Qty: 200,
          Bonus: 20,
          SPrice: 80,
          Amount: 16000,
          Discount: 1600,
          NetAmount: 14400,
          InvoiceApprovalID: 2,
          DetailID: 3,
          ProductID: 201,
          DiscRatio: 10,
          BatchNo: 'AMX001',
          PPrice: 65
        },
        {
          ProductName: 'Calpol Syrup 120ml',
          Qty: 75,
          Bonus: 7,
          SPrice: 80,
          Amount: 6000,
          Discount: 600,
          NetAmount: 5400,
          InvoiceApprovalID: 2,
          DetailID: 4,
          ProductID: 202,
          DiscRatio: 10,
          BatchNo: 'CAL001',
          PPrice: 70
        }
      ],
      3: [
        {
          ProductName: 'Disprin Tablets',
          Qty: 120,
          Bonus: 12,
          SPrice: 50,
          Amount: 6000,
          Discount: 600,
          NetAmount: 5400,
          InvoiceApprovalID: 3,
          DetailID: 5,
          ProductID: 301,
          DiscRatio: 10,
          BatchNo: 'DSP001',
          PPrice: 40
        },
        {
          ProductName: 'Pepto Bismol Syrup',
          Qty: 50,
          Bonus: 5,
          SPrice: 50,
          Amount: 2500,
          Discount: 250,
          NetAmount: 2250,
          InvoiceApprovalID: 3,
          DetailID: 6,
          ProductID: 302,
          DiscRatio: 10,
          BatchNo: 'PEP001',
          PPrice: 42
        }
      ]
    };

    return detailsMap[invoiceApprovalId] || [];
  }
}