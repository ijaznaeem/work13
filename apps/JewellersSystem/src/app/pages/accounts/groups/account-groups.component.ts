import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-groups',
  templateUrl: './account-groups.component.html',
  styleUrls: ['./account-groups.component.scss']
})
export class AccountGroupsComponent implements OnInit {

  constructor() { }
  public form = {
    title: 'Account Groups',
    tableName: 'Groups',
    pk: 'GroupID',
    columns: [
      {
        fldName: 'GroupName',
        data: 'GroupName',
        control: 'input',
        type: 'text',
        label: 'Group Name',
        required: true
      }
    ]
  };
  public list = this.form;
  ngOnInit() {
  }

}
