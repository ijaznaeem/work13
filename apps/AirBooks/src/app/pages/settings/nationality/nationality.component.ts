import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deps',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.scss']
})
export class NationalityComponent implements OnInit {
  public form = {
    title: 'Nationalities List',
    tableName: 'nationality',
    pk: 'nationality_id',
    columns: [
      {
        fldName: 'region',

        control: 'select',
        type: 'lookup',
        label: 'Select or Type Region',
        listTable: 'qryregions',
        valueFld: 'region',
        displayFld: 'region',

      },
      {
        fldName: 'nationality_name',
        control: 'input',
        type: 'text',
        label: 'Nationality Name',
        required: true
      }
    ]
  };
  public list = {
    tableName: 'nationality',
    pk: 'nationality_id',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
