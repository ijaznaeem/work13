import { Component, OnInit, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-cashtypes',
  templateUrl: './cashtypes.component.html',
  styleUrls: ['./cashtypes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CashTypesComponent  {
  public Form = {
    form: {
      title: 'Cash Types',
      tableName: 'cashtypes',
      pk: 'TypeID',
      columns: [
        {
          fldName: 'Description',
          control: 'input',
          type: 'text',
          label: 'Cash Type'
        },
      ]
    },

  };

}
