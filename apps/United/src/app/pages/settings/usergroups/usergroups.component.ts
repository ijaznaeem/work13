import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usergroups',
  templateUrl: './usergroups.component.html',
  styleUrls: ['./usergroups.component.scss']
})
export class UsergroupsComponent implements OnInit {
  public form = {
    title: 'User Groups',
    tableName: 'usergroups',
    pk: 'GroupID',
    columns: [
      {
        fldName: 'GroupName',
        control: 'input',
        type: 'text',
        label: 'Group Name',
        required: true
      },
    ]
  };
  public list = {
    tableName: 'usergroups',
    pk: 'GroupID',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
