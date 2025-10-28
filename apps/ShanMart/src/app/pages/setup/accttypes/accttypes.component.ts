import { Component, OnInit, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-accttypes',
  templateUrl: './accttypes.component.html',
  styleUrls: ['./accttypes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AcctTypesComponent implements OnInit {
  public Form = {
    form: {
      title: 'Account Types',
      tableName: 'accttypes',
      pk: 'AcctTypeID',
      columns: [
        {
          fldName: 'AcctType',
          control: 'input',
          type: 'text',
          label: 'Acct Type'
        },
      ]
    },

  };

  ngOnInit() {
  }


}
