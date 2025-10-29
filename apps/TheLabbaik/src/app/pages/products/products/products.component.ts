import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { statusData } from '../../../factories/static.data';
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
        fldName: 'CategoryID',
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
        fldName: 'PCode',
        control: 'input',
        type: 'text',
        label: 'Barcode',
        size: 4,
      },
      {
        fldName: 'ProductName',
        control: 'input',
        type: 'text',
        label: 'Product Name',
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
        fldName: 'PackingWght',
        control: 'input',
        type: 'number',
        label: 'Packing Weight (gm/ml)',
        required: true,
        size: 3,
      },
      {
        fldName: 'Unit',
        control: 'select',
        type: 'lookup',
        label: 'Unit',
        listTable: 'qryunits',
        listData: [],
        displayFld: 'unit',
        valueFld: 'unit',
        required: true,
        size: 3,
      },
      {
        fldName: 'SPrice',
        control: 'input',
        type: 'number',
        label: 'Sale Price',
        required: false,
        size: 3,
      },
      {
        fldName: 'RetailRate',
        control: 'input',
        type: 'number',
        label: 'Retail Price',
        required: false,
        size: 3,
      },
      {
        fldName: 'Scheme',
        control: 'input',
        type: 'number',
        label: 'Scheme',
        required: false,
        size: 3,
      },
      {
        fldName: 'Discount',
        control: 'input',
        type: 'number',
        label: '% Age',
        required: false,
        size: 3,
      },
      {
        fldName: 'StatusID',
        control: 'select',
        type: 'list',
        label: 'Status',
        listTable: '',
        listData: statusData,
        displayFld: 'status',
        valueFld: 'id',
        required: true,
        size: 3,
      },
      {
        fldName: 'SortNo',
        control: 'input',
        type: 'number',
        label: 'Sort No',
        required: true,
        size: 2,
      },
    ],
  };
  public Settings = {
    tableName: 'qryproducts',
    pk: 'ProductID',
    crud: true,

    Columns: [
      { fldName: 'ProductID', label: 'ID' },
      { fldName: 'ProductName', label: 'Product Name' },
      { fldName: 'CategoryName', label: 'Category' },
      { fldName: 'Packing', label: 'Packing' },
      { fldName: 'SPrice', label: 'Sale Price' },
      { fldName: 'PackingWght', label: 'Weight' },
      { fldName: 'Unit', label: 'Unit' },
    ],
    Actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };
  public Filter = {
    CategoryID: '',
  };
  Categories: any = [];
  public Data: any = [];
  constructor(private http: HttpBase) {}

  ngOnInit() {
    this.http.getData('categories').then((a) => {
      this.Categories = a;
    });
    this.FilterData();
  }

  FilterData() {
    let filter = '1 = 1 ';

    if (this.Filter.CategoryID !== '')
      filter += ' AND CategoryID=' + this.Filter.CategoryID;
    this.http
      .getData('qryproducts', { filter: filter, orderby: 'SortNo' })
      .then((r: any) => {
        this.Data = r;
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        swal('Error!', 'Failed to load products', 'error');
      });
  }
  Clicked(e) {
    console.log(e);

    if (e.action === 'edit') {
      this.http.getData('products/' + e.data.ProductID).then((r: any) => {
        this.Add(r);
      });
    } else if (e.action === 'delete') {
      swal({
        text: `Do you really want to delete this product ${e.data.ProductName}  ?`,
        icon: 'warning',
        buttons: {
          cancel: true,
          confirm: true,
        },
      }).then((willDelete) => {
        if (willDelete) {
          this.http
            .Delete('products', e.data.ProductID)
            .then((r) => {
              this.FilterData();
              swal('Deleted!', 'Your product is deleted', 'success');
            })
            .catch((er) => {
              swal('Error!', 'Error whie deleting', 'error');
            });
        }
      });
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
