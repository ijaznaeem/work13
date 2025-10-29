import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintBillService } from '../../../services/print-bill.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss'],
})
export class OrderReportComponent implements OnInit {
  @ViewChild('RptTable') RptTable;

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    Deleted: false,
  };
  public data: object[];

  setting = {
    Checkbox: false,
    Columns: [
      {
        label: 'Order No',
        fldName: 'OrderID',
      },
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Customer Name',
        fldName: 'CustomerName',
      },
      {
        label: 'Address',
        fldName: 'Address',
      },
      {
        label: 'City',
        fldName: 'City',
      },
      {
        label: 'Refrence',
        fldName: 'Refrence',
      },
      {
        label: 'Amount',
        fldName: 'Amount',
        sum: true,
      },
      {
        label: 'Discount',
        fldName: 'Discount',
        sum: true,
      },
      {
        label: 'Delivery Charges',
        fldName: 'DeliveryCharges',
        sum: true,
      },
      {
        label: 'Labour',
        fldName: 'Labour',
        sum: true,
      },
      {
        label: 'Amount Received',
        fldName: 'AmntRecvd',
        sum: true,
      },

      {
        label: 'Net Amount',
        fldName: 'NetAmount',
        sum: true,
      },
    ],
    Actions: [
      {
        action: 'edit',
        title: 'Edit',
        icon: 'edit',
        class: 'primary',
      },
      {
        action: 'print',
        title: 'Print',
        icon: 'print',
        class: 'info',
      },
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
    ],
    Data: [],

  };

  public toolbarOptions: object[];
  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private router: Router,
    private bill: PrintBillService
  ) {}

  ngOnInit() {
    this.FilterData();
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Sale Report';
    this.ps.PrintData.SubTitle =
      'From :' +
      JSON2Date(this.Filter.FromDate) +
      ' To: ' +
      JSON2Date(this.Filter.ToDate);

    this.router.navigateByUrl('/print/print-html');
  }
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      'IsDeleted = ' +
      (this.Filter.Deleted ? 1 : 0) +
      " AND Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    this.http.getData('qryorders?filter=' + filter).then((r: any) => {
      this.data = r.map((obj: any) => {
        return {
          ...obj,
          details: [],
          Status: obj.IsPosted == 0 ? 'Un-Posted' : 'Posted',
        };
      });
    });
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: this.Filter.Deleted
          ? 'Restore this order?'
          : 'You really want to delete this order!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.Filter.Deleted ? 'Yes, restore it!' : 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.http
        .postData('orders/' + e.data.OrderID, {
          IsDeleted: this.Filter.Deleted ? 0 : 1,
        })
        .then(() => {
          this.FilterData();
          Swal.fire(
            this.Filter.Deleted ? 'Restored!' : 'Deleted!',
            this.Filter.Deleted
          ? 'Order has been restored.'
          : 'Order has been deleted.',
            'success'
          );
        });
        }
      });
    } else if (e.action === 'edit') {
      this.router.navigateByUrl('/sale/order/' + e.data.OrderID);
    } else if (e.action === 'print') {
      this.http.PrintSaleOrder(e.data.OrderID);
    }
  }


}
