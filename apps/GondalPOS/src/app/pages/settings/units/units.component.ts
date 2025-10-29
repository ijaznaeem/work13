import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
  public form = {
    title: 'Units',
    tableName: 'units',
    pk: 'UnitID',
    columns: [
      {
        fldName: 'UOM',
        control: 'input',
        type: 'text',
        label: 'UOM'
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
