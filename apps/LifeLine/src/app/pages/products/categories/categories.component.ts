import { Component, OnInit } from '@angular/core';
import { CompanyForm } from '../../../factories/forms.factory';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor() { }
  public form = {
    title: 'Ctegories',
    tableName: 'categories',
    pk: 'CategoryID',
    columns: [
      {
        fldName: 'CategoryName',
        data: 'CategoryName',
        control: 'input',
        type: 'text',
        label: 'Category Name',
        required: true
      }
    ]
  };
  public list = this.form;
  ngOnInit() {
  }

}
