import { MyToastService } from './../../../../services/toaster.server';
import { HttpBase } from './../../../../services/httpbase.service';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ProductsCategorySettings } from '../categories.settings';
@Component({
  selector: 'app-categorieslist',
  templateUrl: './categorieslist.component.html',
  styleUrls: ['./categorieslist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategorieslistComponent implements OnInit {
 public CategoryForm = {
    form: {
        title: 'Categories',
        tableName: 'categories',
        pk: 'CatID',
        columns: [
            {
                fldName: 'CatName',
                control: 'input',
                type: 'text',
                label: 'Category Name'
            },
            {
                fldName: 'CatCode',
                control: 'input',
                type: 'text',
                label: 'Category Code'
            }
        ]
    },
    list: {
        tableName: 'categories',
        pk: 'CategoryID',
        columns: [
            {
                fldName: 'CatID',
                label: 'ID'
            },
            {
                fldName: 'CatName',
                label: 'Category Name'
            },
            {
                fldName: 'CatCode',
                label: 'Code'
            }
        ]
    }
  };

  ngOnInit() {
  }


}
