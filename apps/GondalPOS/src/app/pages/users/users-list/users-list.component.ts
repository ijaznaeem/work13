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
        label: 'UserName',
        required: true,
        size: 6
      },
      {
        fldName: 'Password',
        control: 'input',
        type: 'password',
        label: 'Phone No',
        size: 6
      },
      {
        fldName: 'Rights',
        control: 'select',
        type: 'list',
        label: 'Rights',
        listTable: 'usergroups',
        listdata: [],
        displayFld: 'GroupName',
        valueFld: 'GroupID',
        required: true,
        size: 6
      },


    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
