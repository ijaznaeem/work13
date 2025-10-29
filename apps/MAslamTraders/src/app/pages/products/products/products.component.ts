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
        size: 6,
      },
      {
        fldName: 'PCode',
        control: 'input',
        type: 'text',
        label: 'Code',
        size: 2,
      },
      {
        fldName: 'ProductName2',
        control: 'input',
        type: 'text',
        label: 'Urdu Name',
        size: 6,
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
        fldName: 'PPrice',
        control: 'input',
        type: 'number',
        label: 'Purchase Price',
        required: false,
        size: 3,
      },
      {
        fldName: 'Percentage',
        control: 'input',
        type: 'number',
        label: 'Percentage (%)',
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
      // {
      //   fldName: 'RateUnit',
      //   control: 'select',
      //   type: 'lookup',
      //   label: 'Rate Unit',
      //   listTable: '',
      //   listData: [
      //     { UnitName: 'KGs' },
      //     { UnitName: 'Feet' },
      //   ],
      //   displayFld: 'UnitName',
      //   valueFld: 'UnitName',
      //   required: true,
      //   size: 3,
      // },
      {
        fldName: 'UnitID',
        control: 'select',
        type: 'lookup',
        label: 'Unit',
        listTable: 'units',
        listData: [],
        displayFld: 'UnitName',
        valueFld: 'ID',
        required: true,
        size: 3,
      },
      {
        fldName: 'Weight',
        control: 'input',
        type: 'number',
        label: 'Weight (Kg)',
        required: true,
        size: 3,
      },
      // {
      //   fldName: 'Length',
      //   control: 'input',
      //   type: 'number',
      //   label: 'Length (Inches)',
      //   required: true,
      //   size: 3,
      // },
      {
        fldName: 'BaseRate',
        control: 'input',
        type: 'number',
        label: 'Base Rate',
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
        size: 3,
      },
    ],
  };
  public Settings = {
    tableName: 'qryproducts',
    pk: 'ProductID',
    crud: true,

    columns: [
      { data: 'ProductID', label: 'ID' },
      { data: 'PCode', label: 'Code' },
      { data: 'ProductName', label: 'Product Name' },
      { data: 'UnitName', label: 'Unit' },
      { data: 'Packing', label: 'Packing' },
      { data: 'SPrice', label: 'Sale Price' },
      { data: 'PPrice', label: 'Purchase' },
      { data: 'Weight', label: 'Weight' },
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
    let bfModelRef = this.http.openFormWithEvents(this.form, data);

    bfModelRef.content.Event.subscribe((r) => {
      console.log(r);

      if (r.res == 'save') {
        this.dataList.realoadTable();
        bfModelRef.hide();
        console.log(r);
      } else if (r.res == 'changed') {
        if (r.data.fldName == 'Percentage') {
          r.data.model.SPrice =
            r.data.model.PPrice * 1 +
            (r.data.model.PPrice * r.data.model.Percentage) / 100;
        }
      }
    });
  }
}
