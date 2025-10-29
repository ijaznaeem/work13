import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MyToastService } from '../../../../../../../libs/future-tech-lib/src/lib/components/services/toaster.server';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
@Component({
  selector: 'app-customer-accts2',
  templateUrl: './customer-accts2.component.html',
  styleUrls: ['./customer-accts2.component.scss'],
})
export class CustomerAccts2Component implements OnInit {
  @ViewChild('Customer') Customer;
  public data: any = [];
  public Products: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    CustomerID: '',
    AcctTypeID: '',
  };
  setting = {
    Columns: [
      {
        label: 'Date',
        fldName: 'Date',
      },
      {
        label: 'Invoice No',
        fldName: 'RefID',
      },
      {
        label: 'Notes',
        fldName: 'Notes',
      },
      {
        label: 'Description',
        fldName: 'Description',
      },

      {
        label: 'Debit',
        fldName: 'Debit',
        sum: true,
      },
      {
        label: 'Credit',
        fldName: 'Credit',
        sum: true,
      },
      {
        label: 'Balance',
        fldName: 'Balance',
        type: 'number',
        format: '2.0',
      },
    ],
    Actions: [
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      }
    ],
    Data: [],
    crud: true,
  };

  public toolbarOptions: object[];
  customer: any = {};
  Customers: any;
  AcctType: any ;
  constructor(
    private http: HttpBase,
    private cache: CachedDataService,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {
    this.AcctType = this.cache.AcctTypes$;
  }

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http.getUsers().then((r: any) => {
      this.Users = r;
    });
    // this.Customers = this.cache.Accounts$;
    this.FilterData();
  }
  load() {}
  FilterData() {
    // tslint:disable-next-line:quotemark
    let filter =
      "Date between '" +
      JSON2Date(this.Filter.FromDate) +
      "' and '" +
      JSON2Date(this.Filter.ToDate) +
      "'";

    if (this.Filter.CustomerID === '' || this.Filter.CustomerID === null) {
      return;
    } else {
      filter += ' and CustomerID=' + this.Filter.CustomerID;
    }

    this.http
      .getData('qrycustomeraccts?filter=' + filter + '&orderby=DetailID')
      .then((r: any) => {
        this.data = r;
        if (this.data.length > 0) {
          this.customer.OpenBalance =
            (this.data[0].Balance - this.data[0].Debit) * 1 +
            this.data[0].Credit * 1;
          this.customer.CloseBalance = this.data[this.data.length - 1].Balance;

          this.data.unshift({
            Date: this.data[0].Date,
            Description: 'Opeing Balance ...',
            Debit: 0,
            Credit: 0,
            Balance: this.customer.OpenBalance,
          });
        } else {
          filter = " Date < '" + JSON2Date(this.Filter.FromDate) + "'";
          filter += ' and CustomerID=' + this.Filter.CustomerID;

          this.http
            .getData(
              'qrycustomeraccts?filter=' +
                filter +
                '&orderby=DetailID desc&limit=1'
            )
            .then((r: any) => {
              if (r.length > 0) {
                this.customer.OpenBalance = r[0].Balance;
                this.customer.CloseBalance = r[0].Balance;

              } else {
                this.customer.OpenBalance = 0;
                this.customer.CloseBalance = 0;
              }
              this.data.unshift({
                Date: JSON2Date(this.Filter.FromDate) ,
                Description: 'Opeing Balance ...',
                Debit: 0,
                Credit: 0,
                Balance: this.customer.OpenBalance,
              });
            });
        }
      });
  }

  Clicked(e) {
    if (e.action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.http
        .postData('deletecustomeracct', { DetailID: e.data.DetailID, CustomerID: e.data.CustomerID })
        .then((r: any) => {
          if (r) {
            this.myToaster.Sucess('Deleted Successfully', "Delete");
            this.FilterData();
          }
        })
        .catch((error: any) => {
          this.myToaster.Error('Failed to delete record. Please try again.', "Error");
          console.error('Error deleting customer account:', error);
        });
        }
      });
    }

  }
  PrintReport() {
    this.ps.PrintData.Title = 'Customer Accounts Report';
    this.ps.PrintData.SubTitle = 'From: ' + JSON2Date(this.Filter.FromDate);
    this.ps.PrintData.SubTitle += ' To: ' + JSON2Date(this.Filter.ToDate);
    this.ps.PrintData.CustomerName = 'Customer: ' + this.Customer.text;

    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');
  }
  DetailReport() {
    this.router.navigateByUrl(
      '/accounts/accountdetails/' +
        JSON2Date(this.Filter.FromDate) +
        '/' +
        JSON2Date(this.Filter.ToDate) +
        '/' +
        this.Filter.CustomerID
    );
  }
  CustomerSelected(e) {
    if (e.itemData) {
      this.http.getData('customers/' + e.itemData.CustomerID).then((r) => {
        this.customer = r;
        this.customer.OpenBalance = 0;
        this.customer.CloseBalance = 0;
      });
    }
  }
  TypeSelected(e) {
    if (e.itemData) {
      this.http.getAcctstList( e.itemData.AcctTypeID).then((r) => {
        this.Customers = r;

      });
    }
  }
  formatDate(d) {
    return JSON2Date(d);
  }
}
