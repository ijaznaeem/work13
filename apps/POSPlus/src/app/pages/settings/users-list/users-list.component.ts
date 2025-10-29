import { Component, OnInit } from '@angular/core';
import { Status } from '../../../factories/constants';

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
        fldName: 'username',
        control: 'input',
        type: 'text',
        label: 'User Name',
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
        fldName: 'GroupID',
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
      {
        fldName: 'StatusID',
        control: 'select',
        type: 'list',
        label: 'Status',
        listData: Status,
        displayFld: 'Status',
        valueFld: 'ID',
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
        data: 'FullName',
        label: 'Full Name',
      },
      {
        fldName: 'username',
        data: 'username',
        label: 'User Name',
      },
      {
        data: 'GroupName',
        label: 'Group',
      },

    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
