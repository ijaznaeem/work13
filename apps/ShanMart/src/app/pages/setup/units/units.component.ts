
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnitsComponent  {

  public Form = {
    form: {
      title: 'Units',
      tableName: 'units',
      pk: 'ID',
      columns: [
        {
          fldName: 'UnitName',
          control: 'input',
          type: 'text',
          label: 'Unit Name'
        },
        {
          fldName: 'Value',
          control: 'number',
          type: 'text',
          label: 'Value'
        },
      ]
    },

  };

}
