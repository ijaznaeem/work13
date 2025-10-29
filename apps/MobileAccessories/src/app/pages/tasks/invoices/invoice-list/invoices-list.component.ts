import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import {
  AddFormButton,
  AddInputFld,
  AddListFld,
  AddSpace,
} from '../../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { DynamicTableComponent } from '../../../../../../../../libs/future-tech-lib/src/lib/components/dynamic-table/dynamic-table.component';
import { UPLOADS_URL } from '../../../../config/constants';
import { GetFilter, getYMDDate } from '../../../../factories/utilities';
import { HttpBase } from '../../../../services/httpbase.service';
import { PrintBillService } from '../../../../services/print-bill.service';
import { PrintDataService } from '../../../../services/print.data.services';
import { MyToastService } from '../../../../services/toaster.server';
import { InvoiceComponent } from '../invoice/invoice.component';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss'],
})
export class InvoicesListComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  Categories: any = [];

  data: any = [];
  groupedInvoices: any = [];
  invoiceDetails: any = [];
  totalInvoicesAmount: number = 0;
  viewMode: string = 'grouped'; // 'grouped' or 'table'
  UploadFolder = UPLOADS_URL;
  formModel: any = {
    CategoryID: '',
    ProductName: '',
    SPrice: 0,
    isPosted: '-1',
  };

  FilterForm = {
    title: 'Filter Invoices',
    columns: [
      AddInputFld('FromDate', 'From Date', 2, false, 'date'),
      AddInputFld('ToDate', 'To Date', 2, false, 'date'),
      AddListFld('IsPosted', 'Status', null, 'value', 'label', 2, [
        { label: 'All', value: '-1' },
        { label: 'Posted', value: '1' },
        { label: 'Unposted', value: '0' },
      ]),
      AddInputFld('Search', 'Search Customer/Invoice', 3, false, 'text'),
      AddSpace(2),
      AddFormButton(
        'Filter',
        (e) => {
          this.FilterData(e);
        },
        1,
        'search',
        'primary'
      ),

    ],
  };

  public Settings = {
    Checkbox: false,
    crud: false,
    Columns: [
      { fldName: 'InvoiceID', label: 'ID' },
      { fldName: 'Date', label: 'Date', type: 'date' },
      { fldName: 'CustomerName', label: 'Customer', type: 'string' },
      { fldName: 'Amount', label: 'Amount', type: 'number' },
      { fldName: 'Status', label: 'Status', type: 'string' },
    ],
    Actions: [
      {action: 'print', title: 'Print Invoice', icon: 'print', class: 'warning'},
      {action: 'post', title: 'Post Invoice', icon: 'check', class: 'success'},
      {action: 'edit', title: 'Edit Invoice', icon: 'pencil', class: 'primary'},
      {action: 'delete', title: 'Delete Invoice', icon: 'trash', class: 'danger'},
    ],
  };

  public Filter: any = {
    FromDate: getYMDDate(new Date()),
    ToDate: getYMDDate(new Date()),
    Search: '',
    IsPosted: '-1',
  };
  constructor(
    private ps: PrintDataService,
    private bill: PrintBillService,
    private http: HttpBase,
    private toast: MyToastService,
    private router: Router,
    private bsModelServices: BsModalService
  ) {}

  ngOnInit() {
    this.FilterData(this.Filter);
  }

  FilterData(e) {
    let filter =
      "Date between '" +
      this.Filter.FromDate +
      "' and '" +
      this.Filter.ToDate +
      "'";
    if (this.Filter.IsPosted != '-1' && this.Filter.IsPosted != '') {
      filter += " and isPosted = '" + this.Filter.IsPosted + "'";
    }

    // Load invoices
    this.http
      .getData('qryinvoices', { filter: filter, orderby: 'CustomerName, InvoiceID' })
      .then((invoices: any) => {
        this.data = [...invoices];
        this.calculateTotalAmount();
        this.loadInvoiceDetails();
      })
      .catch((error) => {
        console.error('Error loading invoices:', error);
        this.data = [];
        this.invoiceDetails = [];
        this.groupedInvoices = [];
      });
  }  // Load detailed invoice information with products
  loadInvoiceDetails() {
    if (this.data.length === 0) {
      this.groupedInvoices = [];
      return;
    }

    const invoiceIds = this.data.map(invoice => invoice.InvoiceID).join(',');

    // Try enhanced query first, then fallback to basic query
    this.http
      .getData('qryinvoicedetailswithproducts', {
        filter: `InvoiceID IN (${invoiceIds})`,
        orderby: 'CustomerName, InvoiceID, DetailID'
      })
      .then((details: any) => {
        this.invoiceDetails = details.map(detail => ({
          ...detail,
          // Ensure we have the correct field mappings
          InvoiceID: detail.InvoiceID || detail.invoiceID || detail.invoice_id,
          DetailID: detail.DetailID || detail.detailID || detail.detail_id,
          ProductID: detail.ProductID || detail.productID || detail.product_id,
          ProductName: detail.ProductName || detail.productName || detail.product_name || 'Unknown Product',
          Qty: detail.Qty || detail.qty || detail.quantity || 0,
          SPrice: detail.SPrice || detail.sprice || detail.price || 0,
          Amount: detail.Amount || detail.amount || (detail.Qty * detail.SPrice) || 0,
          Image: detail.Image && detail.Image.startsWith('http')
            ? detail.Image
            : this.UploadFolder + (detail.Image || 'default-product.png'),
          Color: detail.Color || detail.color || 'N/A',
          Size: detail.Size || detail.size || 'N/A',
          Notes: detail.Notes || detail.notes || ''
        }));

        this.groupInvoicesByCustomer();
      })
      .catch((error) => {
        // Fallback: load basic invoice details
        this.http
          .getData('qryinvoicedetails', {
            filter: `InvoiceID IN (${invoiceIds})`,
            orderby: 'InvoiceID, DetailID'
          })
          .then((details: any) => {
            this.invoiceDetails = details.map(detail => ({
              ...detail,
              // Ensure we have the correct field mappings for fallback
              InvoiceID: detail.InvoiceID || detail.invoiceID || detail.invoice_id,
              DetailID: detail.DetailID || detail.detailID || detail.detail_id,
              ProductName: detail.ProductName || detail.productName || detail.product_name || 'Unknown Product',
              Qty: detail.Qty || detail.qty || detail.quantity || 0,
              SPrice: detail.SPrice || detail.sprice || detail.price || 0,
              Amount: detail.Amount || detail.amount || (detail.Qty * detail.SPrice) || 0,
              Image: detail.Image && detail.Image.startsWith('http')
            ? detail.Image
            : this.UploadFolder + (detail.Image || 'dummy.jpg'),
              Color: detail.Color || detail.color || 'N/A',
              Size: detail.Size || detail.size || 'N/A',
              Notes: detail.Notes || detail.notes || ''
            }));

            this.groupInvoicesByCustomer();
          })
          .catch((fallbackError) => {
            console.error('Failed to load invoice details:', fallbackError);
            this.invoiceDetails = [];
            this.groupInvoicesByCustomer();
          });
      });
  }

  // Group invoices by customer
  groupInvoicesByCustomer() {
    const grouped = {};

    this.data.forEach(invoice => {
      const customerId = invoice.CustomerID;
      if (!grouped[customerId]) {
        grouped[customerId] = {
          customer: {
            CustomerID: invoice.CustomerID,
            CustomerName: invoice.CustomerName,
            CustomerAddress: invoice.Address || ''  + ( invoice.City ? ', ' + invoice.City : '') ,
            CustomerPhone: (invoice.PhoneNo1 ? invoice.PhoneNo1 + ', ' : '') + (invoice.PhoneNo2 ? invoice.PhoneNo2 : '')
          },
          invoices: [],
          totalAmount: 0
        };
      }

      // Add invoice details for this specific invoice
      const invoiceDetailsForThisInvoice = this.invoiceDetails.filter(detail =>
        detail.InvoiceID === invoice.InvoiceID
      );

      grouped[customerId].invoices.push({
        ...invoice,
        details: invoiceDetailsForThisInvoice
      });

      grouped[customerId].totalAmount += parseFloat(invoice.Amount || 0);
    });

    this.groupedInvoices = Object.values(grouped);
  }

  // Calculate total amount of all invoices
  calculateTotalAmount() {
    this.totalInvoicesAmount = this.data.reduce((total, invoice) => {
      return total + parseFloat(invoice.Amount || 0);
    }, 0);
  }

  // Toggle view mode
  toggleViewMode() {
    this.viewMode = this.viewMode === 'grouped' ? 'table' : 'grouped';
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Invoices List';
    this.ps.PrintData.SubTitle = GetFilter(this.Filter)
      .replace('1 = 1  and ', '')
      .replace('1 = 1', '');

    this.router.navigateByUrl('/print/print-html');
  }

  // Edit invoice from grouped view
  editInvoice(invoice: any) {
    if (invoice.IsPosted === '1' || invoice.IsPosted === 1) {
      this.toast.Error('Cannot edit posted invoice', 'Error');
      return;
    }
    this.AddNew(invoice.InvoiceID);
  }

  // Post invoice from grouped view
  postInvoice(invoice: any) {
    if (invoice.IsPosted === '1' || invoice.IsPosted === 1) {
      this.toast.Error('Invoice already posted', 'Error');
      return;
    }

    Swal.fire({
      title: 'Confirm Post',
      text: `Post invoice #${invoice.InvoiceID} for ${invoice.CustomerName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, post it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        this.http.postTask('postsales/' + invoice.InvoiceID, {}).then((r) => {
          this.toast.Sucess('Invoice Posted Successfully', 'Success');
          this.FilterData(this.Filter);
        });
      }
    });
  }

  // Print invoice from grouped view
  async printInvoice(invoice: any) {
    let data: any = { ...invoice };
    // data.details = await this.http.getData(
    //   'qryinvoicedetails?orderby=DetailID desc&filter=InvoiceID=' +
    //     invoice.InvoiceID
    // );
    this.bill.PrintPDFBill(Object.assign(data, {Type: 'Quotation'}), true);
  }

  // Delete invoice from grouped view
  deleteInvoice(invoice: any) {
    if (invoice.IsPosted === '1' || invoice.IsPosted === 1) {
      this.toast.Error('Cannot delete posted invoice', 'Error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `Delete invoice #${invoice.InvoiceID} for ${invoice.CustomerName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.http.Delete('invoices', invoice.InvoiceID).then(() => {
          Swal.fire('Deleted!', 'Invoice has been deleted.', 'success');
          this.FilterData(this.Filter);
        });
      }
    });
  }
  async Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
        if (e.data.IsPosted =='1') {
          this.toast.Error('Cannot edit posted invoice', 'Error');
          return;
        }
      this.formModel = e.data;
      this.AddNew(e.data.InvoiceID);
    } else if (e.action === 'post') {
        if (e.data.IsPosted =='1') {
          this.toast.Error('Invoice already posted', 'Error');
          return;
        }
      this.http.postTask('postsales/' + e.data.InvoiceID, {}).then((r) => {
        this.toast.Sucess('Invoice Posted Successfully', 'Success');
        this.FilterData(this.Filter);
      });
    } else if (e.action === 'print') {

      let data:any = {...e.data}
      data.details = await this.http.getData(
        'qryinvoicedetails?orderby=DetailID desc&filter=InvoiceID=' +
          e.data.InvoiceID
      );
      this.bill.PrintPDFBill(Object.assign(data, {Type: 'Quotation'}), true);

    } else if (e.action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
          this.http.Delete('invoices', e.data.InvoiceID).then(() => {
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
            this.FilterData(this.Filter);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }

  AddNew(editid = 0) {
    this.bsModelServices
      .show(InvoiceComponent, {
        class: 'modal-lg',
        ignoreBackdropClick: true,
        initialState: {
          EditID: editid,
        },
      })
      .onHidden?.subscribe(() => {
        this.FilterData(this.Filter);
      });
  }
  PostAll(e) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will post all unposted invoices!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, post them!',
      cancelButtonText: 'No, keep them unposted',
    }).then((result) => {
      if (result.value) {
        this.http.postTask('postsales', {}).then(() => {
          Swal.fire('Posted!', 'All unposted invoices have been posted.', 'success');
          this.FilterData(this.Filter);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your invoices are safe :)', 'error');
      }
    });
  }

}
