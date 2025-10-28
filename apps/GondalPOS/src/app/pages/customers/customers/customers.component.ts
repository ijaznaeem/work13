import { Component, OnInit } from '@angular/core';

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
        fldName: "ContactPerson",
        control: "input",
        type: "text",
        label: "Contact Person",
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
        type: "list",
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
        fldName: "NTNNo",
        control: "input",
        type: "text",
        label: "NTN/CNIC",
        size: 6,
      },
      // {
      //   fldName: 'RouteID',
      //   control: 'select',
      //   type: 'list',
      //   label: 'Route',
      //   listTable: 'routes',
      //   listData: [],
      //   displayFld: 'RouteName',
      //   valueFld: 'RouteID',
      //   required: true,
      //   size: 6
      // },
      {
        fldName: "STN",
        control: "input",
        type: "number",
        label: "STN",
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
        listTable: "status",
        listData: [],
        displayFld: "Status",
        valueFld: "StatusID",
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
        fldName: "AcctType",
        label: "Acct Type",
      },
      {
        fldName: "CustomerName",
        label: "Account Name",
        required: true,
      },
      {
        fldName: "ContactPerson",
        label: "Contact Person",
        required: true,
      },
      {
        fldName: "Address",
        label: "Address",
      },

      {
        fldName: "City",
        label: "City",
      },
      {
        fldName: "PhoneNo1",
        label: "Phone No 1",
      },

      {
        fldName: "NTNNo",
        label: "NTN/CNIC",
      },

      {
        fldName: "STN",
        label: "STN",
      },
      {
        fldName: "Status",
        label: "Status",
      },
    ],
  };
  constructor() {}

  ngOnInit() {
    // this.list.columns.push({
    //   fldName: 'CustomerID',
    //   control: 'input',
    //   type: 'text',
    //   label: 'Customer ID',
    //   size: 0
    // });
  }
  BeforeEdit(e){
  console.log(e.form.columns[8]);
  e.form.columns[8].disabled = true;

  }
}
