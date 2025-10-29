import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss'],
})
export class DesignationsComponent implements OnInit {
  public form = {
    title: 'Account Types',
    tableName: 'empldesignation',
    pk: 'DesignationID',
    columns: [
      {
        fldName: 'Designation',
        data: 'Designation',
        control: 'input',
        type: 'text',
        label: 'Account Type',
        required: true,
      },
    ],
  };
  public list = {
    tableName: 'empldesignation',
    pk: 'DesignationID',
    columns: this.form.columns,
  };
  constructor() {}

  ngOnInit() {}
}
