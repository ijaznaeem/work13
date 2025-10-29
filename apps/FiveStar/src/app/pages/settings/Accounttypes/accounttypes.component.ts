import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-Accounttypes",
  templateUrl: "./accounttypes.component.html",
  styleUrls: ["./accounttypes.component.scss"],
})
export class SalesmanComponent implements OnInit {
  public form = {
    title: "Account types",
    tableName: "accttypes",
    pk: "AcctTypeID",
    columns: [
      {
        fldName: "AcctType",
        control: "input",
        type: "text",
        label: "Account Type",
        required: true,
        size: 12,
      },
    ],
  };
  public list = {
    tableName: "accttypes",
    pk: "AcctTypeID",
    columns: [
      {
        fldName: "AcctType",
        control: "input",
        type: "text",
        label: "Account Type",
        required: true,
        size: 12,
      },
  
    ],
  };
  constructor() {}

  ngOnInit() {}
}
