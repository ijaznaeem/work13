import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-airports',
  templateUrl: './airports.component.html',
  styleUrls: ['./airports.component.scss']
})
export class AirportsComponent implements OnInit {
  public form = {
    title: 'Airports',
    tableName: 'airport_codes',
    pk: 'id',
    columns: [
      {
        fldName: 'code',
        control: 'input',
        type: 'text',
        label: 'Code Name',
        required: true,
        size: 6
      },
      {
        fldName: 'city',
        control: 'input',
        type: 'text',
        label: 'City Name',
        required: true,
        size: 6
      },
      {
        fldName: 'airport_name',
        control: 'input',
        type: 'text',
        label: 'Airport Name',
        required: true,
        size: 12
      }
    ]
  };
  public list = {
    tableName: 'airport_codes',
    pk: 'id',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
