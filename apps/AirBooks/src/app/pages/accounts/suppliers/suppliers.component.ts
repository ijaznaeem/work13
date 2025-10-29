import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  public list = {
    title: "Suppliers",
    tableName: "accounts",
    pk: "account_id",
    columns: [
      {
        fldName: "account_name",
        label: "Supplier Name",
        control: "input",
        type: "text",
        size: 8,
        required: true
      },
      {
        fldName: "description",
        label: "Description",
        control: "input",
        type: "text",
        size: 8
      },
      {
        fldName: "balance",
        label: "Balance",
        control: "input",
        type: "number",
        size: 4
      },

    ],
  };
  public form :any= {
    title: "Suppliers",
    tableName: "accounts",
    pk: "account_id",
    columns: []
  };
  dataModel: any = { account_name: '', account_type: '1', balance: '0' }
  Filter= 'account_type=1'
  constructor() {

    Object.assign(this.form.columns, this.list.columns);
    this.form.columns.push({

        fldName: "account_type ",
        label: "Account Type",
        control: "hidden",
        type: "number",
        defaultvalue: 1,
        size: 4

    })
  }

  ngOnInit() {

  }

}
