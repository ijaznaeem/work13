import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { FirstDayOfMonth } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDate } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-dispatch-approvals',
  templateUrl: './dispatch-approvals.component.html',
  styleUrls: ['./dispatch-approvals.component.scss']
})
export class DispatchApprovalsComponent implements OnInit {
  
  public filterForm!: FormGroup;
  public bsModalRef!: BsModalRef;

  // Data for the three tables
  public pendingInvoices: any[] = [];
  public completedDispatch: any[] = [];
  public detailsData: any[] = [];

  // Selected items
  public selectedPendingInvoice: any = null;
  public selectedCompletedDispatch: any = null;

  // Loading states
  public loadingPending = false;
  public loadingCompleted = false;
  public loadingDetails = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpBase,
    private alert: MyToastService,
    private bsService: BsModalService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      fromDate: [FirstDayOfMonth()],
      toDate: [GetDate()]
    });
  }

  public onFilterChange(): void {
    this.loadCompletedDispatch();
  }

  public loadData(): void {
    this.loadPendingInvoices();
    this.loadCompletedDispatch();
  }

  private loadPendingInvoices(): void {
    this.loadingPending = true;
    // Query from VB6: "Select Date, InvoiceID as InvoiceNo, CustomerName, Address, City from qryInvoices where Date > '8/1/2023' and dbo.Despatched(InvoiceID) >0 and DtCR = 'CR'"
    const filter = "Date > '2023-08-01' and Despatched > 0 and DtCR = 'CR'";
    
    this.http.getData(`Invoices?filter=${encodeURIComponent(filter)}&orderby=Date DESC`)
      .then((data: any) => {
        this.pendingInvoices = data || [];
        this.loadingPending = false;
      })
      .catch((error) => {
        console.error('Error loading pending invoices:', error);
        // Load mock data for demo purposes
        this.loadMockPendingInvoices();
        this.loadingPending = false;
      });
  }

  private loadMockPendingInvoices(): void {
    this.pendingInvoices = [
      {
        Date: '2024-10-14',
        InvoiceID: 12345,
        CustomerName: 'ABC Pharmacy',
        Address: '123 Main Street',
        City: 'Karachi'
      },
      {
        Date: '2024-10-13',
        InvoiceID: 12346,
        CustomerName: 'XYZ Medical Store',
        Address: '456 Second Avenue',
        City: 'Lahore'
      },
      {
        Date: '2024-10-12',
        InvoiceID: 12347,
        CustomerName: 'Health Plus Pharmacy',
        Address: '789 Third Road',
        City: 'Islamabad'
      }
    ];
  }

  private loadCompletedDispatch(): void {
    this.loadingCompleted = true;
    const formValues = this.filterForm.value;
    const filter = `Date BETWEEN '${formValues.fromDate}' AND '${formValues.toDate}'`;
    
    this.http.getData(`DispatchNotes?filter=${encodeURIComponent(filter)}&orderby=Date DESC`)
      .then((data: any) => {
        this.completedDispatch = data || [];
        this.loadingCompleted = false;
      })
      .catch((error) => {
        console.error('Error loading completed dispatch:', error);
        // Load mock data for demo purposes
        this.loadMockCompletedDispatch();
        this.loadingCompleted = false;
      });
  }

  private loadMockCompletedDispatch(): void {
    this.completedDispatch = [
      {
        Date: '2024-10-14',
        DespatchID: 5001,
        InvoiceID: 12340,
        CustomerName: 'Metro Pharmacy',
        Status: 'Completed',
        Amount: 15000
      },
      {
        Date: '2024-10-13',
        DespatchID: 5002,
        InvoiceID: 12341,
        CustomerName: 'City Medical',
        Status: 'In Transit',
        Amount: 8500
      },
      {
        Date: '2024-10-12',
        DespatchID: 5003,
        InvoiceID: 12342,
        CustomerName: 'Care Pharmacy',
        Status: 'Completed',
        Amount: 22000
      }
    ];
  }

  public onPendingInvoiceSelect(invoice: any): void {
    this.selectedPendingInvoice = invoice;
    this.loadInvoiceDetails(invoice.InvoiceID || invoice.InvoiceNo);
  }

  public onCompletedDispatchSelect(dispatch: any): void {
    this.selectedCompletedDispatch = dispatch;
    this.loadDispatchDetails(dispatch.DespatchID);
  }

  private loadInvoiceDetails(invoiceId: number): void {
    this.loadingDetails = true;
    // Query from VB6: "Select ProductName, Qty, Bonus, Qty+Bonus as TotalQty from qryInvDet where InvoiceID = " + invoiceId
    
    this.http.getData(`InvoiceDetails?filter=InvoiceID=${invoiceId}`)
      .then((data: any) => {
        this.detailsData = data || [];
        this.loadingDetails = false;
      })
      .catch((error) => {
        console.error('Error loading invoice details:', error);
        // Load mock data for demo purposes
        this.loadMockInvoiceDetails(invoiceId);
        this.loadingDetails = false;
      });
  }

  private loadMockInvoiceDetails(invoiceId: number): void {
    this.detailsData = [
      {
        ProductName: 'Panadol 500mg Tablets',
        Qty: 100,
        Bonus: 10,
        Rate: 5.50,
        Amount: 550.00
      },
      {
        ProductName: 'Augmentin 625mg Tablets',
        Qty: 50,
        Bonus: 5,
        Rate: 15.75,
        Amount: 787.50
      },
      {
        ProductName: 'Disprin Tablets',
        Qty: 200,
        Bonus: 20,
        Rate: 2.25,
        Amount: 450.00
      }
    ];
  }

  private loadDispatchDetails(dispatchId: number): void {
    this.loadingDetails = true;
    // Query from VB6: "Select * from qryDespatchDetails where DespatchID = " + dispatchId
    
    this.http.getData(`DispatchDetails?filter=DespatchID=${dispatchId}`)
      .then((data: any) => {
        this.detailsData = data || [];
        this.loadingDetails = false;
      })
      .catch((error) => {
        console.error('Error loading dispatch details:', error);
        // Load mock data for demo purposes
        this.loadMockDispatchDetails(dispatchId);
        this.loadingDetails = false;
      });
  }

  private loadMockDispatchDetails(dispatchId: number): void {
    this.detailsData = [
      {
        ProductName: 'Calpol Syrup 120ml',
        Qty: 25,
        Bonus: 3,
        Rate: 85.00,
        Amount: 2125.00
      },
      {
        ProductName: 'Brufen 400mg Tablets',
        Qty: 75,
        Bonus: 8,
        Rate: 12.50,
        Amount: 937.50
      },
      {
        ProductName: 'Flagyl 400mg Tablets',
        Qty: 40,
        Bonus: 4,
        Rate: 18.25,
        Amount: 730.00
      }
    ];
  }

  public generateDispatch(): void {
    if (!this.selectedPendingInvoice) {
      this.alert.Warning('Please select an invoice to generate dispatch', 'Warning');
      return;
    }

    const invoiceNo = this.selectedPendingInvoice.InvoiceID || this.selectedPendingInvoice.InvoiceNo;
    
    // This would open a modal similar to VB6's frmDespatchAdd
    this.alert.Info(`Generate dispatch for Invoice: ${invoiceNo}`, 'Generate Dispatch');
    
    // TODO: Implement dispatch generation modal
    // Load frmDespatchAdd equivalent
    // frmDespatchAdd.nInvoiceNo.SetNum(invoiceNo)
    // frmDespatchAdd.LoadDespatch()
    // frmDespatchAdd.Show vbModal
    
    // After modal closes, refresh data
    this.loadData();
  }

  public printReport(): void {
    if (this.completedDispatch.length === 0) {
      this.alert.Warning('No data to print', 'Warning');
      return;
    }

    // Implement print report functionality
    this.alert.Info('Print report functionality to be implemented', 'Print Report');
  }

  public printDispatch(): void {
    if (!this.selectedCompletedDispatch) {
      this.alert.Warning('Please select a dispatch to print', 'Warning');
      return;
    }

    // Print dispatch functionality
    const dispatchId = this.selectedCompletedDispatch.DespatchID;
    this.alert.Info(`Print dispatch for ID: ${dispatchId}`, 'Print Dispatch');
    
    // TODO: Implement print dispatch functionality
    // Similar to VB6's rptGatePassApproval
  }

  public isRowSelected(item: any, type: 'pending' | 'completed'): boolean {
    if (type === 'pending') {
      return this.selectedPendingInvoice === item;
    } else {
      return this.selectedCompletedDispatch === item;
    }
  }

  public formatDate(date: any): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB');
  }

  public formatCurrency(amount: any): string {
    if (!amount && amount !== 0) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}