import { Component, OnInit } from '@angular/core';
import { CompanyForm } from '../../../factories/forms.factory';
import { AddInputFld } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';

@Component({
  selector: 'app-raw-categories',
  templateUrl: './raw-categories.component.html',
  styleUrls: ['./raw-categories.component.scss'],
})
export class RawCategoriesComponent implements OnInit {
  public form = {
    title: 'Raw Categories',
    tableName: 'categories',
    pk: 'CategoryID',
    columns: [
      {
        fldName: 'CategoryName',
        data: 'CategoryName',
        control: 'input',
        type: 'text',
        label: 'Category Name',
        required: true,
      },
    ],
  };
  model: any = {
    Type: 1,
  };

  public list = {
    title: 'Categories',
    tableName: 'qrycategoriesraw',
    pk: 'CategoryID',
    columns: [
      {
        data: 'CategoryName',
        label: 'Category Name',
       
      }
    ]
  };

  constructor() {}

  ngOnInit() {}
}
