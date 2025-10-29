import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-status',
  templateUrl: './invoice-status.component.html',
  styleUrls: ['./invoice-status.component.scss']
})
export class InvoiceStatusComponent implements OnInit {
  public form = {
    title: 'Invoice Status List',
    tableName: 'inv_status',
    pk: 'id',
    columns: [
      {
        fldName: 'status',
        control: 'input',
        type: 'text',
        label: 'Status:',
        required: true
      }
    ]
  };
  public list = {
    tableName: 'inv_status',
    pk: 'id',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
