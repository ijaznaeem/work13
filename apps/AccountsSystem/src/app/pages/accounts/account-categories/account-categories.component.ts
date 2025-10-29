import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-categories',
  templateUrl: './account-categories.component.html',
  styleUrls: ['./account-categories.component.scss']
})
export class AccountCategoriesComponent implements OnInit {
  public form = {
    title: 'Categories',
    tableName: 'accountcats',
    pk: 'ID',
    columns: [
      {
        fldName: 'CatID',
        control: 'input',
        type: 'text',
        label: 'Category Code',
        required: true,
        size: 6
      },
      {
        fldName: 'Category',
        control: 'input',
        type: 'text',
        label: 'Category',
        required: true,
        size: 6
      },


      // {
      //   fldName: 'Type',
      //   control: 'select',
      //   type: 'list',
      //   label: '',
      //   listTable: '',
      //   listData: [{ id: 1, Type: 'Balance Sheet' }, { id: 2, Type: 'Profit Loss' }],
      //   displayFld: 'Type',
      //   valueFld: 'id',
      //   placeHolder: 'Selec Category type',
      //   required: true,
      //   size: 6
      // },


    ]
  };

  public list = {
    title: 'Account Categories',
    tableName: 'accountcats',
    pk: 'ID',
    columns: [
      { fldName: 'CatID', label: 'Code', },
      { fldName: 'Category', label: 'Category', },

    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
