import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cashaccounts',
  templateUrl: './cashaccounts.component.html',
  styleUrls: ['./cashaccounts.component.scss']
})
export class CashAccountsComponent implements OnInit {

  public list = {
    title: "Cash Accounts",
    tableName: "accounts",
    pk: "account_id",
    columns: [
      {
        fldName: "account_name",
        label: "Account Name",
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
  public form: any = {
    title: "Cash Accounts",
    tableName: "accounts",
    pk: "account_id",
    columns: []
  };
  dataModel: any = { account_name: '', account_type: '2', balance: '0' }
  Filter= 'account_type=2'
  constructor() {

    Object.assign(this.form.columns, this.list.columns);
    this.form.columns.push({

      fldName: "account_type ",
      label: "Account Type",
      control: "hidden",
      type: "number",

      size: 4

    })
  }

  ngOnInit() {
  }

}
