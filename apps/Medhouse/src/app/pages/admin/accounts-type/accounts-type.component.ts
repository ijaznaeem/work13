import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounts-type',
  templateUrl: './accounts-type.component.html',
  styleUrls: ['./accounts-type.component.scss']
})
export class AccountsTypeComponent implements OnInit {

  constructor() { }
  public form = {
    title: 'Account Types',
    tableName: 'AcctTypes',
    pk: 'AcctTypeID',
    columns: [
      {
        fldName: 'AcctType',
        data: 'Acct Type',
        control: 'input',
        type: 'text',
        label: 'Account Type',
        required: true
      }
    ]
  };
  public list = this.form;
  ngOnInit() {
  }

}
