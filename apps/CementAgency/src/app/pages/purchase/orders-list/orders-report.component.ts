import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-orders-report',
  templateUrl: './orders-report.component.html',
  styleUrls: ['./orders-report.component.scss'],
})
export class OrdersReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

public orderActions = {
  confirm: {
    status: 'Confirmed',
    action: 'confirm',
    confirmMessage: 'Do you want to confirm this order?',
    successMessage: 'Order confirmed successfully'
  },
  ship: {
    status: 'Shipped',
    action: 'ship',
    confirmMessage: 'Do you want to mark this order as shipped?',
    successMessage: 'Order marked as shipped successfully'
  },
  complete: {
    status: 'Completed',
    action: 'complete',
    confirmMessage: 'Do you want to mark this order as completed?',
    successMessage: 'Order completed successfully'
  },
  cancel: {
    status: 'Cancelled',
    action: 'cancel',
    confirmMessage: 'Do you want to cancel this order?',
    successMessage: 'Order cancelled successfully'
  },
  pending: {
    status: 'Pending',
    action: 'pending',
    confirmMessage: 'Do you want to mark this order as pending?',
    successMessage: 'Order marked as pending successfully'
  }
};





  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Status: '',
    CustomerID: '',
  };
  setting = {
    Checkbox: false,
    Crud: true,
    Columns: [
      {
        label: 'Order No',
        fldName: 'OrderID',
      },
      {
        label: 'Order Date',
        fldName: 'OrderDate',
      },

      {
        label: 'Delivery Date',
        fldName: 'DeliveryDate',
      },
      {
        label: 'Customer',
        fldName: 'CustomerName',
      },
      {
        label: 'Delivery Address',
        fldName: 'DeliveryAddress',
      },
      {
        label: 'Product',
        fldName: 'ProductName',
      },
      {
        label: 'Quantity',
        fldName: 'Quantity',
        type: 'number',
      },
      {
        label: 'Amount',
        fldName: 'Total',
        sum: true,
        type: 'sum',
      },

      {
        label: 'Status',
        fldName: 'Status',
      },
    ],
    Actions: [
      {
        action: 'confirm',
        label: 'Confirm Order',
        class: 'btn-success btn-sm',
        icon: 'fa fa-check',

      },
      {
        action: 'ship',
        label: 'Mark as Shipped',
        class: 'btn-info btn-sm',
        icon: 'fa fa-truck',

      },
      {
        action: 'complete',
        label: 'Mark Complete',
        class: 'btn-primary btn-sm',
        icon: 'fa fa-check-circle',

      },
      {
        action: 'cancel',
        label: 'Cancel Order',
        class: 'btn-warning btn-sm',
        icon: 'fa fa-times',

      }
    ],
    Data: [],
  };

  nWhat = '1';
  Customers: any = [{ ItemID: '1', ItemName: 'Test Item' }];

  public data: object[];
  public Accounts: any;
  public selectedCustomer: any = {};
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private cachedData: CachedDataService,
    private router: Router
  ) {
    this.Accounts = this.cachedData.Accounts$;
  }

  ngOnInit() {
    this.LoadCustomers();
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title =
      'Orders Report ' +
      (this.Filter.CustomerID
        ? ' Customer: ' + this.selectedCustomer.CustomerName
        : '');
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  CustomerSelected(e) {
    console.log(e);
    this.selectedCustomer = e;
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "OrderDate between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";
    if (this.Filter.Status != '') {
      filter += " and Status ='" + this.Filter.Status + "'";
    }

    if (this.Filter.CustomerID)
      filter += ' and CustomerID=' + this.Filter.CustomerID;

    this.http.getData(`qryorders?filter=${filter}`).then((r: any) => {
      this.data = r;
    });
  }
  Clicked(e) {
    console.log(e);

    const actionConfig = this.orderActions[e.action];
    if (actionConfig) {
      Swal.fire({
        title: 'Are you sure?',
        text: actionConfig.confirmMessage,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, proceed!',
        cancelButtonText: 'No, cancel',
        confirmButtonColor: e.action === 'cancel' ? '#dc3545' : '#28a745',
        cancelButtonColor: '#6c757d'
      }).then((result) => {
        if (result.isConfirmed) {
          this.ChangeStatus(e.data, actionConfig.status, actionConfig.successMessage);
        }
      });
    }
  }
  ChangeStatus(row: any, status: string, successMessage: string = 'Order status updated successfully') {
    // Implement your status change logic here
    console.log(`Changing status of order ${row.OrderID} to ${status}`);

    this.http.postData('orders/' + row.OrderID, {
      OrderID: row.OrderID,
      Status: status
    }).then((res) => {
      Swal.fire('Success', successMessage, 'success');
      this.FilterData(); // Refresh the data after status change
    }).catch((error) => {
      console.error('Error updating order status:', error);
      Swal.fire('Error', 'Failed to update order status', 'error');
    });
  }
  async LoadCustomers() {
    try {
      this.cachedData.Accounts$.subscribe((data) => {
        this.Customers = data || [];
      });
    } catch (error) {
      console.error('Error loading customers:', error);
      this.Customers = [];
    }
  }
  getStatusList() {
    return Object.keys(this.orderActions);
    }
  }
