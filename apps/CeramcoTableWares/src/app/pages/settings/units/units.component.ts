import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
  public form = {
    title: 'Departaments',
    tableName: 'units',
    pk: 'UnitID',
    columns: [
      {
        fldName: 'Unit',
        control: 'input',
        type: 'text',
        label: 'Unit Name',
        required: true
      },
      {
        fldName: 'value',
        control: 'input',
        type: 'text',
        label: 'Unit Value',
        required: true
      }
    ]
  };
  public list = {
    tableName: 'units',
    pk: 'UnitID',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
