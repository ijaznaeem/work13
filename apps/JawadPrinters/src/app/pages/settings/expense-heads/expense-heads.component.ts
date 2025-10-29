import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expense-heads',
  templateUrl: './expense-heads.component.html',
  styleUrls: ['./expense-heads.component.scss']
})
export class ExpenseHeadsComponent implements OnInit {
  public form = {
    title: 'Expense Heads',
    tableName: 'exp_heads',
    pk: 'HeadID',
    columns: [
      {
        fldName: 'HeadName',
        control: 'input',
        type: 'text',
        label: 'Head',
        required: true,
        size: 6
      },



    ]
  };

  public list = {
    title: 'Expense Heads List',
    tableName: 'exp_heads',
    pk: 'HeadID',
    columns: [
      { fldName: 'HeadName', label: 'Head Name', },

    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
