import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  public form = {
    title: 'Users List',
    tableName: 'users',
    pk: 'userid',
    columns: [
      {
        fldName: 'name',
        control: 'input',
        type: 'text',
        label: 'Full Name',
        required: true,
        size: 12
      },
      {
        fldName: 'username',
        control: 'input',
        type: 'text',
        label: 'UserName',
        required: true,
        size: 6
      },
      {
        fldName: 'password',
        control: 'input',
        type: 'password',
        label: 'Password',
        size: 6
      },
      {
        fldName: 'dept_id',
        control: 'select',
        type: 'list',
        label: 'Group',
        listTable: 'depts',
        listdata: [],
        displayFld: 'dept_name',
        valueFld: 'dept_id',
        required: true,
        size: 6
      },
      {
        fldName: 'group_id',
        control: 'select',
        type: 'list',
        label: 'Group',
        listTable: 'usergroups',
        listdata: [],
        displayFld: 'group_name',
        valueFld: 'group_id',
        required: true,
        size: 6
      },


    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
