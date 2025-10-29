import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-groups',
  templateUrl: './customer-groups.component.html',
  styleUrls: ['./customer-groups.component.scss']
})
export class CustomergroupsComponent implements OnInit {
  public form = {
    title: 'Account Groups',
    tableName: 'customergroups',
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
  public list = {
    tableName: 'customergroups',
    pk: 'GroupID',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
