import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';

@Component({
  selector: 'app-customer-accts',
  templateUrl: './customer-accts.component.html',
  styleUrls: ['./customer-accts.component.scss'],
})
export class CustomerAcctsComponent implements OnInit {
  @ViewChild('Customer') Customer;
  public data: any = [];
  public Products: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    CustomerID: '',
    ProductID: '',
  };
  setting = {
    crud: true,
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
      },
    ],
    Actions: [
      {
        action: 'checked',
        title: 'OK',
        icon: 'check',
        class: 'warning',
      },
    ],
    Data: [],
  };

  backgroundConfig = {
    condition: (row, index) => row.Reconciled === '1',
    color: 'lightgreen',
  };
  public toolbarOptions: object[];
  customer: any = {};
  Customers: any;

  constructor(
    private http: HttpBase,
    private cache: CachedDataService,
    private ps: PrintDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http.getUsers().then((r: any) => {
      this.Users = r;
    });
    this.Customers = this.cache.Accounts$;
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
                Date: JSON2Date(this.Filter.FromDate),
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
    console.log('Clicked', e);
    if (e.action === 'checked') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to mark this as Account is Reconciled?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, OK',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.Reconciled(e.data);
          this.FilterData()
          Swal.fire('Marked!', 'The entry has been marked as Reconciled.', 'success');
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
  formatDate(d) {
    return JSON2Date(d);
  }
  Reconciled(row) {
    this.http
      .postData('customeraccts/' + row.DetailID, { Reconciled: 1 })
      .then((r) => {
        console.log('Reconciled', r);
      });
  }
}
