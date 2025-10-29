import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-airlines',
  templateUrl: './airlines.component.html',
  styleUrls: ['./airlines.component.scss']
})
export class AirlinesComponent implements OnInit {
  public form = {
    title: 'Air Lines',
    tableName: 'airlines',
    pk: 'id',
    columns: [
      {
        fldName: 'iata',
        control: 'input',
        type: 'text',
        label: 'IATA Code',
        required: true,
        size: 6
      },
      {
        fldName: 'icao',
        control: 'input',
        type: 'text',
        label: 'ICAO Code',
        required: true,
        size: 6
      },
      {
        fldName: 'airline',
        control: 'input',
        type: 'text',
        label: 'Airline Name',
        required: true,
        size: 12
      }
    ]
  };
  public list = {
    tableName: 'airlines',
    pk: 'id',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
