import { Component, OnInit } from '@angular/core';
import { Status } from '../../../factories/constants';

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements OnInit {
  public form = {
    title: "Customers",
    tableName: "customers",
    pk: "CustomerID",
    columns: [
      {
        fldName: "AcctTypeID",
        control: "select",
        type: "list",
        label: "Acct Type",
        listTable: "accttypes",
        listData: [],
        displayFld: "AcctType",
        valueFld: "AcctTypeID",
        required: true,
        size: 6,
      },
      {
        fldName: "CustomerName",
        control: "input",
        type: "text",
        label: "Account Name",
        required: true,
        size: 12,
      },
      {
        fldName: "Address",
        control: "input",
        type: "text",
        label: "Address",
        size: 6,
      },

      {
        fldName: "City",
        control: "select",
        type: "lookup",
        label: "City",
        listTable: "qrycities",
        listData: [],
        displayFld: "City",
        valueFld: "City",

        size: 4,
      },
      {
        fldName: "PhoneNo1",
        control: "input",
        type: "text",
        label: "Phone No 1",
        size: 6,
      },
      {
        fldName: "PhoneNo2",
        control: "input",
        type: "text",
        label: "Phone No 2",
        size: 6,
      },

      {
        fldName: "NTNNo",
        control: "input",
        type: "text",
        label: "NTN/CNIC",
        size: 6,
      },
      {
        fldName: 'RouteID',
        control: 'select',
        type: 'lookup',
        label: 'Route',
        listTable: 'routes',
        listData: [],
        displayFld: 'RouteName',
        valueFld: 'RouteID',
        required: true,
        size: 6
      },
      {
        fldName: "STN",
        control: "input",
        type: "number",
        label: "STN/NTN No",
        size: 6,
      },
      {
        fldName: "Balance",
        control: "input",
        type: "number",
        label: "Balance",
        size: 6,
      },
      {
        fldName: "Status",
        control: "select",
        type: "list",
        label: "Status",
        listTable: "",
        listData: Status,
        displayFld: "Status",
        valueFld: "ID",
        required: true,
        size: 6,
      },
    ],
  };
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
