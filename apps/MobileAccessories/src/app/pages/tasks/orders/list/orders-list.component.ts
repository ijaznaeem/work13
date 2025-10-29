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
import { InvoiceComponent } from '../../invoices/invoice/invoice.component';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  Categories: any = [];
  viewMode = 'card';
  data: any = [];
  orderDetails: any = [];
  totalOrdersAmount: number = 0;
  UploadFolder = UPLOADS_URL;

  formModel: any = {
    CategoryID: '',
    ProductName: '',
    SPrice: 0,
    isPosted: '',
  };

  FilterForm = {
    title: 'Filter Products',
    columns: [
      AddInputFld('FromDate', 'From Date', 2, false, 'date'),
      AddInputFld('ToDate', 'To Date', 2, false, 'date'),
      AddListFld('IsPosted', 'Status', null, 'value', 'label', 2, [
        { label: 'All', value: '' },
        { label: 'Posted', value: '1' },
        { label: 'Unposted', value: '0' },
      ]),
      AddInputFld('Search', 'Search', 2, false, 'text'),
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
      AddFormButton(
        'Add Order',
        (e) => {
          this.AddNew();
        },
        1,
        'plus',
        'warning'
      ),
    ],
  };

  public Settings = {
    Checkbox: false,
    crud: false,
    Columns: [
      { fldName: 'OrderID', label: 'ID' },
      { fldName: 'Date', label: 'Date', type: 'date' },
      { fldName: 'CustomerName', label: 'Customer', type: 'string' },
      { fldName: 'Amount', label: 'Amount', type: 'number' },
      { fldName: 'Status', label: 'Status', type: 'string' },
    ],
    Actions: [
      {
        action: 'invoice',
        title: 'Create Invoice',
        icon: 'file-invoice',
        class: 'success',
      },
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public Filter: any = {
    FromDate: getYMDDate(
      new Date(new Date().setDate(new Date().getDate() - 30))
    ),
    ToDate: getYMDDate(new Date()),
    Search: '',
    IsPosted: '0',
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
    if (this.Filter.IsPosted !== '') {
      filter += " and isPosted = '" + this.Filter.IsPosted + "'";
    }

    // Load orders
    this.http
      .getData('qryorders', { filter: filter, orderby: 'OrderID DESC' })
      .then((orders: any) => {
        this.data = [...orders];
        this.calculateTotalAmount();
        this.loadOrderDetails();
      });
  }

  // Load detailed order information with products
  loadOrderDetails() {
    if (this.data.length === 0) {
      this.orderDetails = [];
      return;
    }

    const orderIds = this.data.map((order) => order.OrderID).join(',');

    this.http
      .getData('qryorderreport', {
        filter: `OrderID IN (${orderIds})`,
        orderby: 'OrderID, DetailID',
      })
      .then((details: any) => {
        this.orderDetails = details.map((detail) => ({
          ...detail,
          Image:
            detail.Image && detail.Image.startsWith('http')
              ? detail.Image
              : this.UploadFolder + detail.Image,
        }));
        this.attachOrderDetails();
      })
      .catch(() => {
        // Fallback: load basic order details if enhanced query fails
        this.http
          .getData('qryorderdetails', {
            filter: `OrderID IN (${orderIds})`,
            orderby: 'OrderID, DetailID',
          })
          .then((details: any) => {
            this.orderDetails = details.map((detail) => ({
              ...detail,
              Image:
                detail.Image && detail.Image.startsWith('http')
                  ? detail.Image
                  : this.UploadFolder + (detail.Image || 'dummy.jpg'),
              Color: detail.Color || 'N/A',
              Size: detail.Size || 'N/A',
              Notes: detail.Notes || '',
            }));
            this.attachOrderDetails();
          });
      });
  }

  // Attach order details to each order in the flat data array
  attachOrderDetails() {
    this.data = this.data.map((order) => ({
      ...order,
      details: this.orderDetails.filter(
        (detail) => detail.OrderID === order.OrderID
      ),
    }));
  }

  // Calculate total amount of all orders
  calculateTotalAmount() {
    this.totalOrdersAmount = this.data.reduce((total, order) => {
      return total + parseFloat(order.Amount || 0);
    }, 0);
  }

  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Orders List';
    this.ps.PrintData.SubTitle = GetFilter(this.Filter)
      .replace('1 = 1  and ', '')
      .replace('1 = 1', '');

    this.router.navigateByUrl('/print/print-html');
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'invoice') {
      if (e.data.IsPosted === '1' || e.data.IsPosted === 1) {
        Swal.fire('Error', 'Cannot view invoice for a posted order.', 'error');
        return;
      }
      this.CreateInvoice(e.data.OrderID);
    }
    if (e.action === 'print') {
      this.bill.PrintPDFBill(Object.assign({}, e.data, { Type: 'Order' }));
    }
    if (e.action === 'edit') {
      if (e.data.IsPosted === '1' || e.data.IsPosted === 1) {
        Swal.fire('Error', 'Cannot edit a posted order.', 'error');
        return;
      }

      this.formModel = e.data;
      this.AddNew(e.data.OrderID);
    } else if (e.action === 'delete') {
      if (e.data.IsPosted === '1' || e.data.IsPosted === 1) {
        Swal.fire('Error', 'Cannot delete a posted order.', 'error');
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
          this.http.Delete('orders', e.data.OrderID).then(() => {
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
    this.router.navigateByUrl('/tasks/order/' + (editid != 0 ? editid : ''));
  }
  CreateInvoice(orderID: number) {
    this.bsModelServices
      .show(InvoiceComponent, {
        class: 'modal-xl',
        ignoreBackdropClick: true,
        initialState: {
          OrderID: orderID,
        },
      })
      .onHidden?.subscribe(() => {
        this.FilterData(this.Filter);
      });
  }
}
