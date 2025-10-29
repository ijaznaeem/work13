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
    pk: 'group_id',
    columns: [
      {
        fldName: 'group_name',
        control: 'input',
        type: 'text',
        label: 'Group Name',
        required: true
      },
    ]
  };
  public list = {
    tableName: 'usergroups',
    pk: 'group_id',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
