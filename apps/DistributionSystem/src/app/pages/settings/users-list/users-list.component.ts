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
    pk: 'UserID',
    columns: [
      {
        fldName: 'FullName',
        control: 'input',
        type: 'text',
        label: 'Full Name',
        required: true,
        size: 12
      },
      {
        fldName: 'UserName',
        control: 'input',
        type: 'text',
        label: 'User Name',
        required: true,
        size: 6
      },
      {
        fldName: 'Password',
        control: 'input',
        type: 'password',
        label: 'Password',
        size: 6
      },

      {
        fldName: 'Rights',
        control: 'select',
        type: 'list',
        label: 'Group',
        listTable: 'usergroups',
        listdata: [],
        displayFld: 'GroupName',
        valueFld: 'GroupID',
        required: true,
        size: 6
      },


    ]
  };

  public list = {
    title: 'Users List',
    tableName: 'qryusers',
    pk: 'UserID',
    columns: [
      {
        fldName: 'FullName',
        label: 'Full Name',
      },
      {
        fldName: 'UserName',
        label: 'User Name',
      },
      {
        fldName: 'GroupName',
        label: 'Group',
      },

    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
