import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  AddFormButton,
  AddImage,
  AddInputFld,
  AddLookupFld,
  SetDataSrc,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { FtDataTableComponent } from '../../../../../../../libs/future-tech-lib/src/lib/components/ft-data-table/ft-data-table.component';
import { GetFilter } from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { PrintDataService } from '../../../services/print.data.services';
import { MyToastService } from '../../../services/toaster.server';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  @ViewChild('dataList') dataList: FtDataTableComponent;
  Categories: any = [];

  data: any = [];
  formModel: any = {
    CategoryID: '',
    ProductName: '',
    SPrice: 0,
  };

  FilterForm = {
    title: 'Filter Products',
    columns: [
      AddLookupFld(
        'CategoryID',
        'Select Category',
        'categories',
        'CategoryID',
        'CategoryName',
        4,
        [],
        false,
        { type: 'ngselect' }
      ),
      AddFormButton(
        'Filter',
        (e) => {
          this.FilterData(e);
        },
        1,
        'search',
        'primary'
      ),
      AddFormButton(
        'Add',
        (e) => {
          this.AddProduct();
        },
        1,
        'plus',
        'success'
      ),
    ],
  };
  public form = {
    title: 'Add Products',
    tableName: 'products',
    pk: 'ProductID',
    columns: [
      AddLookupFld(
        'CategoryID',
        'Select Category',
        'categories',
        'CategoryID',
        'CategoryName',
        4,
        [],
        false,
        { type: 'lookup' }
      ),
      AddFormButton(
        '',
        (e) => {
          this.AddCategory();
        },
        1,
        'plus',
        'warning'
      ),
      AddInputFld('ProductName', 'Product Name', 4, false),
      AddInputFld('SPrice', 'Selling Price', 2, false, 'number'),
      AddImage('Image', 'Product Image', 4, false, { folder: 'products' }),
      // AddFormButton(
      //   'Save',
      //   (e) => {

      //     this.SaveData(e.data);
      //     //this.FilterData(this.Filter);
      //   },
      //   1,
      //   'save',
      //   'success', {type: 'button' }
      // ),
      // AddFormButton(
      //   'New',
      //   (e) => {
      //    this.formModel = {};
      //   },
      //   1,
      //   'file',
      //   'primary'
      // ),
    ],
  };

  public Settings = {
    Checkbox: false,
    tableName: 'products',
    pk: 'ProductID',
    crud: true,
    columns: [
      { fldName: 'ProductID', label: 'ID',  data: 'ProductID' },
      { fldName: 'ProductName', label: 'ProductName', data: 'ProductName' },
      { fldName: 'SPrice', label: 'Selling Price', data: 'SPrice', type: 'number' },
    ],
    actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };

  public Filter: any = {};
  public filterList: string = '1=1';
  constructor(
    private ps: PrintDataService,
    private http: HttpBase,
    private toast: MyToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.FilterData(this.Filter);
  }

  FilterData(e) {
    let filter = GetFilter(this.Filter);
    this.filterList = filter;
    this.dataList.FilterTable(filter);
    this.dataList.realoadTable();


    this.http
      .getData('products', { filter: filter, orderby: 'ProductName' })
      .then((d: any) => {
        this.data = [...d];
      });
  }
  PrintReport() {
    this.ps.PrintData.HTMLData = document.getElementById('print-section');
    this.ps.PrintData.Title = 'Products List';
    this.ps.PrintData.SubTitle = GetFilter(this.Filter)
      .replace('1 = 1  and ', '')
      .replace('1 = 1', '');

    this.router.navigateByUrl('/print/print-html');
  }
  Clicked(e) {
    console.log(e);
    if (e.action === 'edit') {
      this.formModel = e.data;
      this.AddProduct(this.formModel);
    } else if (e.action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      }).then((result) => {
        if (result.value) {
          this.http.Delete('products', e.data.ProductID).then(() => {
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
  AddCategory() {
    this.http
      .openForm({
        title: 'Add Category',
        tableName: 'categories',
        columns: [AddInputFld('CategoryName', 'Category Name', 4, false)],
      })
      .then((data: any) => {
        console.log(data);

        if (data == 'save') {
          this.http.getData('categories').then((d: any) => {
            SetDataSrc(this.form, 'CategoryID', d);
          });
        }
      });
  }
  SaveData(data) {
    console.log(this.formModel);
    let id = '';
    if (this.formModel.ProductID) {
      id = '/' + this.formModel.ProductID;
    }

    this.http.postData('products' + id, this.formModel).then((d: any) => {
      this.toast.Sucess('Product Saved Successfully', 1);
      this.formModel = {};
    });
}
AddProduct(data: any = {}) {
    this.http
      .openForm(this.form, data)
      .then((result: any) => {
        if (result === 'save') {
          this.FilterData(this.Filter);
        }
      });
    }
}
