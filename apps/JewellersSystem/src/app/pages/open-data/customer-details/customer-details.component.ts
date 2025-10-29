import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDate } from '../../../../../../../libs/future-tech-lib/src/lib/utilities/utilities';
import { GetDateJSON, JSON2Date } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  public data: any = [];
  public Products: object[];
  public Users: object[];

  public Filter = {
    FromDate: GetDateJSON(new Date(GetDate(null))),
    ToDate: GetDateJSON(new Date(GetDate(null))),
    CustomerID: '',
    MobileNo: '',
    PIN: '',
  };

  customer: any = {};

  constructor(
    private http: HttpBase,
    private ps: PrintDataService,
    private myToaster: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.Filter.FromDate.day = 1;
    this.http.getUsers().then((r: any) => {
      this.Users = r;
    });

  }
  FindCustomer() {
    this.Filter.CustomerID = "";
    let filter =
      "PhoneNo1 = '" +
      this.Filter.MobileNo +
      "' and  PinCode = " +
      this.Filter.PIN;
    this.http.getData('customers?bid=1&filter=' + filter).then((r: any) => {
      if (r.length > 0) {
        this.customer = r[0];
        this.Filter.CustomerID = this.customer.CustomerID;
        this.Filter = { ... this.Filter}
      } else {
        this.myToaster.Error('Inavlid PIN or Mobile no', 'Error')
      }
    });
  }
  GetDate(n) {
    if (n == 1) {
      return JSON2Date(this.Filter.FromDate);
    } else {
      return JSON2Date(this.Filter.ToDate);
    }
  }
  PrintReport() {
    this.ps.PrintData.Title = "Customer Accounts Report"
    this.ps.PrintData.SubTitle = "From: " + (this.Filter.FromDate)
    this.ps.PrintData.SubTitle += " To: " + (this.Filter.ToDate)
    this.ps.PrintData.CustomerName = "Customer: " + this.customer.CustomerName;

    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.router.navigateByUrl('/print/print-html');

  }
}
