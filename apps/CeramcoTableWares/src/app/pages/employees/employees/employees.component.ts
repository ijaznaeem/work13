import { Component, OnInit } from '@angular/core';
import { Status } from '../../../factories/constants';

@Component({
  selector: "app-employees",
  templateUrl: "./employees.component.html",
  styleUrls: ["./employees.component.scss"],
})
export class EmployeesComponent implements OnInit {
  public form = {
    title: "Employees",
    tableName: "employees",
    pk: "EmployeeID",
    columns: [

      {
        fldName: "EmployeeName",
        control: "input",
        type: "text",
        label: "Account Name",
        required: true,
        size:8,
      },
      {
        fldName: "DesignationID",
        control: "select",
        type: "lookup",
        label: "Designation",
        listTable: "empldesignation",
        listData: [],
        displayFld: "Designation",
        valueFld: "DesignationID",
        required: true,
        size: 4,
      },
      {
        fldName: "Address",
        control: "input",
        type: "text",
        label: "Address",
        size: 6,
      },
      {
        fldName: "MobileNo",
        control: "input",
        type: "text",
        label: "Mobile No",
        size: 6,
      },
      {
        fldName: "IDCardNo",
        control: "input",
        type: "text",
        label: "IDCardNo",
        size: 6,
      },
      {
        fldName: "JoiningDate",
        control: "input",
        type: "date",
        label: "Joining Date",
        size: 6,
      },
      {
        fldName: "ReferredBy",
        control: "input",
        type: "text",
        label: "Referrence",
        size: 6,
      },


      {
        fldName: "Salary",
        control: "input",
        type: "number",
        label: "Salary",
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
        fldName: "StatusID",
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
    tableName: "qryemployees",
    pk: "EmployeeID",
    columns: [

      {
        data: "EmployeeName",
        label: "Employee Name",
      },

      {
        data: "Address",
        label: "Address",
      },


      {
        data: "MobileNo",
        label: "Mobile No",
      },
      {
        data: "IDCardNo",
        label: "CNIC No",
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
