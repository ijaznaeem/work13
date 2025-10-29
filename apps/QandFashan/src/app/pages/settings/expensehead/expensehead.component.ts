import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-units',
  templateUrl: './expensehead.component.html',
  styleUrls: ['./expensehead.component.scss']
})
export class ExpenseheadComponent implements OnInit {
  public form = {
    title: 'Expense Head',
    tableName: 'expensehead',
    pk: 'HeadID',
    columns: [
      {
        fldName: 'HeadName',
        data: 'HeadName',
        control: 'input',
        type: 'text',
        label: 'Head Name',
        required: true,
        size: 8
      }
    ]
  };
  public list = {
    tableName: 'expensehead',
    pk: 'HeadID',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
