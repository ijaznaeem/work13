import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { AddLookupFld } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { ProductStatus } from '../../../factories/static.data';
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
        fldName: 'ProductName',
        control: 'input',
        type: 'text',
        label: 'Proiduct Name',
        required: true,
        size: 12,
      },
      {
        fldName: 'SPrice',
        control: 'input',
        type: 'number',
        label: 'Sale Price',
        required: false,
        size: 3,
      },
      AddLookupFld(
        'UnitID',
        'Select Unit',
        'units',
        'UnitID',
        'Unit',
        4,null,
        true,
        { type: 'list' }
      ),
      AddLookupFld(
        'StatusID',
        'Select Status',
        '',
        'StatusID',
        'Status',
        4,
        ProductStatus,
        true,
        { type: 'list' }
      ),

    ],
  };
  public Settings = {
    tableName: 'qryproducts',
    pk: 'ProductID',
    crud: true,

    columns: [
      { data: 'ProductID', label: 'ID' },
      { data: 'ProductName', label: 'Product Name' },
      { data: 'SPrice', label: 'Sale Price' },
      { data: 'Unit', label: 'Unit Name' },
      { data: 'Status', label: 'Status'             },

    ],
    actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };
  public Filter = {
    StatusID: '',
  };
  Companies: any = [];
  Categories: any = [];

  constructor(private http: HttpBase) {}

  ngOnInit() {

  }

  FilterData() {
    let filter = '1 = 1 ';
    if (this.Filter.StatusID !== '')
      filter += ' AND StatusID=' + this.Filter.StatusID;

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
  Add(data: any = {
    TypeID: 2,
    StatusID: '1'
  }) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.dataList.realoadTable();
        console.log(r);
      }
    });
  }
}
