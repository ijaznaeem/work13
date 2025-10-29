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
        size: 6
      },
      {
        fldName: 'Address',
        control: 'input',
        type: 'text',
        label: 'Address',
        required: true,
        size: 6
      },
      {
        fldName: 'PhoneNo',
        control: 'input',
        type: 'text',
        label: 'Phone No',
        required: true,
        size: 6
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
        fldName: 'IsAdmin',
        control: 'select',
        type: 'list',
        label: 'Is Admin',
        listTable: '',
        listData: [{ id: 0, Type: 'Normal' }, { id: 1, Type: 'Admin' }],
        displayFld: 'Type',
        valueFld: 'id',
        placeHolder: 'Selec user type',
        required: true,
        size: 6
      },


    ]
  };

  public list = {
    title: 'Users List',
    tableName: 'users',
    pk: 'UserID',
    columns: [
      { data: 'FullName', label: 'Full Name', },
      { data: 'UserName', label: 'User Name', },
      { data: 'Address', label: 'Address', },
      { data: 'PhoneNo', label: 'Phone No', },
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
