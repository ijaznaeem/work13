import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  public form = {
    title: 'Categories List',
    tableName: 'categories',
    pk: 'categoryID',
    columns: [
      {
        fldName: 'categoryName',
        control: 'input',
        type: 'text',
        label: 'Category Name',
        required: true,
        size: 6
      },



    ]
  };

  public list = {
    title: 'Users List',
    tableName: 'categories',
    pk: 'categoryID',
    columns: [
      { fldName: 'categoryName', label: 'Category Name', },

    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
