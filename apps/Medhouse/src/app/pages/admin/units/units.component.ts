import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

  constructor() { }
  public form = {
    title: 'Units',
    tableName: 'Units',
    pk: 'ID',
    columns: [
      {
        fldName: 'UnitName',
        data: 'UnitName',
        control: 'input',
        type: 'text',
        label: 'Unit Name',
        required: true
      }
    ]
  };
  public list = this.form;
  ngOnInit() {
  }

}
