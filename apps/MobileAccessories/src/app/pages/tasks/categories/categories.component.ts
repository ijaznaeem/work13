import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  AddInputFld
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { DynamicTableComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/dynamic-table/dynamic-table.component';
import { GetFilter } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { AddFormButton } from '../../components/crud-form/crud-form-helper';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @ViewChild('rptTable') rptTable: DynamicTableComponent;
  Categories: any = [];

  data: any = [];
  formModel: any = {
    CategoryID: '',
    ProductName: '',
    SPrice: 0,
  };

  public filter = {
    title: 'Add Categories',
    columns: [
      AddInputFld('CategoryName', 'Category Name', 4, true),

      AddFormButton(
        'Search',
        (e) => {
          this.FilterData(e);
        },
        2,
        'search',
        'primary'
      ),
      AddFormButton(
        'Add New',
        (e) => {
          this.FilterData(e);
        },
        2,
        'plus',
        'success'
      ),
    ],
  };

  public form = {
    title: 'Add Categories',
    tableName: 'categories',
    columns: [AddInputFld('CategoryName', 'Category Name', 4, true)],
  };

  public Settings = {
    Checkbox: false,
    crud: true,
    Columns: [{ fldName: 'CategoryName', label: 'Category Name' }],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public Filter: any = {
    search: '',
  };
  constructor(
    private ps: PrintDataService,
    private http: HttpBase,

    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData(this.Filter);
  }

  FilterData(e) {

    this.http
      .getData('categories', {
        orderby: 'CategoryName' })
      .then((d: any) => {
        this.data = [...d];
      });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Categories List';
    this.ps.PrintData.SubTitle = GetFilter(this.Filter)
      .replace('1 = 1  and ', '')
      .replace('1 = 1', '');

    this.router.navigateByUrl('/print/print-html');
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'edit') {
      this.formModel = e.data;
      this.AddCategory(e.data);

    } else if (e.action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then(async (result) => {
        if (result.value) {
          const products: any = await this.http.getData('products', {
            filter: 'CategoryID = ' + e.data.CategoryID,
          });
          if (products.length > 0) {
            Swal.fire(
              'Cannot Delete!',
              'This category is used in products.',
              'error'
            );
            return;
          }
          this.http.Delete(this.form.tableName, e.data.CategoryID).then(() => {
            Swal.fire('Deleted!', 'Your record is deleted.', 'success');
            this.FilterData(this.Filter);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Your record is safe :)', 'error');
        }
      });
    }
  }

  FormButtomClicked(e) {
    // console.log(e);
  }
  AddCategory(data={}) {
    this.http
      .openForm({
        title: 'Add Category',
        tableName: 'categories',
        pk: 'CategoryID',
        columns: [AddInputFld('CategoryName', 'Category Name', 4, false)],
      }, data)
      .then((data: any) => {
        console.log(data);

        if (data == 'save') {
          this.FilterData({});

        }
      });
  }

}
