import { Component, OnInit, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-salemans',
  templateUrl: './salemans.component.html',
  styleUrls: ['./salemans.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SalesmanComponent  {
  public Form = {
    form: {
      title: 'Salesman',
      tableName: 'salesman',
      pk: 'SalesmanID',
      columns: [
        {
          fldName: 'SalesmanName',
          control: 'input',
          type: 'text',
          label: 'Salesman Name'
        },
        {
          fldName: 'Address',
          control: 'input',
          type: 'text',
          label: 'Address'
        },
        {
          fldName: 'PhoneNo',
          control: 'input',
          type: 'text',
          label: 'Phone No'
        },
        {
          fldName: 'City',
          control: 'input',
          type: 'text',
          label: 'City'
        },
      ]
    },

  };

}
