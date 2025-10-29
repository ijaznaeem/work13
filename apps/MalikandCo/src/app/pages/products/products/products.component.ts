import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public form = {
    title: 'Products List',
    tableName: 'products',
    pk: 'ProductID',
    columns: [
      {
        fldName: 'Category',
        control: 'select',
        type: 'lookup',
        label: 'Category',
        listTable: 'categories',
        listdata: [],
        displayFld: 'CategoryName',
        valueFld: 'CategoryID',
        required: true,
        size: 4,
      },


      {
        fldName: 'ProductName',
        control: 'input',
        type: 'text',
        label: 'Proiduct Name',
        required: true,
        size: 12,
      },

      {
        fldName: 'Packing',
        control: 'input',
        type: 'number',
        label: 'Packing',
        required: true,
        size: 3,
      },
      {
        fldName: 'NetWeight',
        control: 'input',
        type: 'number',
        label: 'Net Wight',
        required: true,
        size: 3,
      },
      {
        fldName: 'LessKg',
        control: 'input',
        type: 'number',
        label: 'Less/KG',
        required: true,
        size: 3,
      },
      {
        fldName: 'ExtraExp',
        control: 'input',
        type: 'number',
        label: ' Plus Expense',
        required: true,
        size: 3,
      },
      {
        fldName: 'UnitID',
        control: 'select',
        type: 'lookup',
        label: 'Unit',
        listTable: 'units',
        listdata: [],
        displayFld: 'UnitName',
        valueFld: 'ID',
        required: true,
        size: 4,
      },
      {
        fldName: 'Weight',
        control: 'input',
        type: 'number',
        label: 'Weight (Kg)',
        required: true,
        size: 3,
      },

      {
        fldName: 'Status',
        control: 'select',
        type: 'list',
        label: 'Status',
        listTable: '',
        listData: [
          {
            ID: 1,
            Status: 'Active',
          },
          {
            ID: 0,
            Status: 'In-Active',
          },
        ],
        displayFld: 'Status',
        valueFld: 'ID',
        required: true,
        size: 4,
      },
    ],
  };
  public Settings = {
    tableName: 'qryproducts',
    pk: 'ProductID',
    crud: true,

    columns: [
      { data: 'ProductID', label: 'ID' },
      { data: 'ProductName', label: 'Product Name' },
      { data: 'Packing', label: 'Packing' },

    ],
    actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };
  public Filter = {
    CompanyID: '',
    CategoryID: '',
  };
  Companies: any = [];
  Categories: any = [];

  constructor(private http: HttpBase) {}

  ngOnInit() {

    this.http.getData('categories').then((a) => {
      this.Categories = a;
    });
  }

  FilterData() {
    let filter = '1 = 1 ';
    if (this.Filter.CompanyID !== '')
      filter += ' AND CompanyID=' + this.Filter.CompanyID;

    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;

    this.dataList.FilterTable(filter);
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('products/' + e.data.ProductID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'delete') {

      swal('Error!', 'Not Allowed', 'error');
      // // swal({
      // //   text: `Do you really want to delete this product ${e.data.ProductName}  ?`,
      // //   icon: 'warning',
      // //   buttons: {
      // //     cancel: true,
      // //     confirm: true,
      // //   },
      // // }).then((willDelete) => {
      // //   if (willDelete) {
      // //     this.http
      // //       .Delete('products', e.data.ProductID)
      // //       .then((r) => {
      // //         this.FilterData();
      // //         swal('Deleted!', 'Your product is deleted', 'success');
      // //       })
      // //       .catch((er) => {
      // //         swal('Error!', 'Error whie deleting', 'error');
      // //       });
      //   }
      // });
    }
  }
  Add(data: any = {}) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.dataList.realoadTable();
        console.log(r);
      }
    });
  }
}
