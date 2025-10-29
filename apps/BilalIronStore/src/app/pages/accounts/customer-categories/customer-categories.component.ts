import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-categories',
  templateUrl: './customer-categories.component.html',
  styleUrls: ['./customer-categories.component.scss']
})
export class CustomerCategoriesComponent implements OnInit {
  public form = {
    title: 'Customer Categories',
    tableName: 'custcats',
    pk: 'CustCatID',
    columns: [
      {
        fldName: 'CustCategory',
        data: 'CustCategory',
        control: 'input',
        type: 'text',
        label: 'Customer Category',
        required: true
      }
    ]
  };
  public list = {
    tableName: 'custcats',
    pk: 'CustCatID',
    columns: this.form.columns
  };
  constructor() { }

  ngOnInit() {
  }

}
