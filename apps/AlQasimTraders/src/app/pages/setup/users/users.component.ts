
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AddInputFld, AddLookupFld } from '../../components/crud-form/crud-form-helper';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {


  public form = {
    title: 'Users',
    tableName: 'users',
    pk: 'UserID',
    columns: [
      AddInputFld('Name', 'User Name', 6),
      AddInputFld('Password', 'Password', 6, true, 'password'),
      AddLookupFld('Rights', 'Rights', '', 'StatusID', 'Status', 4, [
        { StatusID: '1', Status: 'Admin' },
        { StatusID: '2', Status: 'Salesman' }
      ]),
    ]
  };

  public list = {
    title: 'Users',
    tableName: 'users',
    pk: 'UserID',
    columns: [
      AddInputFld('Name', 'User Name', 6),
    ]
  };


  constructor() {

  }

  ngOnInit() {
  }

}
