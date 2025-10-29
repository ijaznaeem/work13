import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  GetDateJSON,
  JSON2Date
} from '../../../factories/utilities';
import { CachedDataService } from '../../../services/cacheddata.service';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { AccountsDetailSettings } from './accounts-detail.settings';

@Component({
  selector: 'app-accounts-detail',
  templateUrl: './accounts-detail.component.html',
  styleUrls: ['./accounts-detail.component.scss'],
})
export class AccountsDetailComponent implements OnInit {
  @ViewChild('Customer') Customer;
  @ViewChild('grdData') grdData;

  public data: any = [];
  public Products: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(),
    ToDate: GetDateJSON(),
    CustomerID: '',
    Dates: true,
    DrCr: 'both',
    FinYearID: '0',
  };

  settings = AccountsDetailSettings;
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
    this.Customers = this.cache.accounts$;
    this.FilterData();
  }
  FilterData() {
    let filter = '';

    this.http
      .postData('accountdetails', {
        ...this.Filter,
        FromDate: JSON2Date(this.Filter.FromDate),
        ToDate: JSON2Date(this.Filter.ToDate),
      })
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

          this.grdData.SetDataSource(this.data);
        } else {
          filter = " Date < '" + JSON2Date(this.Filter.FromDate) + "'";
          filter += ' and CustomerID=' + this.Filter.CustomerID;

          this.http
            .getData(
              'CustomerAccts?filter=' +
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
              this.grdData.SetDataSource(this.data);
            });
        }
      });
  }

  Clicked(e) {}
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
      this.http.getData('Customers/' + e.itemData.CustomerID).then((r) => {
        this.customer = r;
        this.customer.OpenBalance = 0;
        this.customer.CloseBalance = 0;
      });
    }
  }
  formatDate(d) {
    return JSON2Date(d);
  }
}
