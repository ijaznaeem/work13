import { Component, OnInit } from '@angular/core';
import { CategoryForm } from '../../../factories/forms.factory';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor() { }
  public form = CategoryForm.form;
  public list = CategoryForm.list;
  ngOnInit() {
  }

}
