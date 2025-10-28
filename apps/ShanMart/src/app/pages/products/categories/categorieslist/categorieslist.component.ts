import { Component, OnInit, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-categorieslist',
  templateUrl: './categorieslist.component.html',
  styleUrls: ['./categorieslist.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
          label: 'Category Name',
          size: 4,
        },
        {
          fldName: 'Image',
          control: 'file',
          type: 'image',
          label: 'Category Image',
          size: 4,
        },
      ],
    },
    list: {
      tableName: 'categories',
      pk: 'CategoryID',
      columns: [
        {
          fldName: 'CatID',
          label: 'ID',
        },
        {
          fldName: 'Image',
          label: 'Category Image',
          type: 'image',
        },
        {
          fldName: 'CatName',
          label: 'Category Name',
        },
      ],
    },
  };

  ngOnInit() {}
}
