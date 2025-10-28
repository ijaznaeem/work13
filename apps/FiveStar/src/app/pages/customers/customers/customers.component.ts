import { Component, OnInit } from "@angular/core";
import { AcctTypes, StatusList } from "../../../factories/constants";

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
        listData: AcctTypes,
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
        label: "Mobile No",
        size: 6,
      },
      {
        fldName: "PhoneNo2",
        control: "input",
        type: "text",
        label: "Phone No",
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
        listData: StatusList,
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
        fldName: "Address",
        label: "Address",
      },

      {
        fldName: "City",
        label: "City",
      },
      {
        fldName: "PhoneNo1",
        label: "Mobile No",
      },
      {
        fldName: "PhoneNo1",
        label: "Phone No",
      },
      {
        fldName: "Status",
        label: "Status",
      },
    ],
  };
  constructor() {}

  ngOnInit() {}
  BeforeEdit(e) {
    //console.log(e.form.columns);
    e.form.columns[6].disabled = true;
  }
}
