import { Component, OnInit } from '@angular/core';
import { CustomerForm } from '../../../factories/forms.factory';

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements OnInit {
  public form = CustomerForm
  public list = {
    tableName: "qrycustomers",
    pk: "CustomerID",
    columns: [
      {
        data: "AcctType",
        label: "Acct Type",
      },
      {
        data: "CustomerName",
        label: "Account Name",
        required: true,
      },

      {
        data: "Address",
        label: "Address",
      },

      {
        data: "City",
        label: "City",
      },
      {
        data: "PhoneNo1",
        label: "Phone No 1",
      },
      {
        data: "PhoneNo2",
        label: "Phone No 2",
      },
      {
        data: "Status",
        label: "Status",
      },
    ],
  };
  constructor() {}

  ngOnInit() {

  }
}
