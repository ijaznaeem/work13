import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { AddLookupFld } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
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
        'RawProductID',
        'Select Raw Product',
        'qryrawproducts',
        'ProductID',
        'ProductName',
        4,
        null,
        true,
        { type: 'list' }
      ),
      {
        fldName: 'RawRatio',
        control: 'input',
        type: 'number',
        label: 'R/M Ratio',
        required: false,
        size: 3,
      },
      {
        fldName: 'RawRatio',
        control: 'input',
        type: 'number',
        label: 'R/M Ratio',
        required: false,
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
      { data: 'ProductName', label: 'Product Name' },
      { data: 'SPrice', label: 'Sale Price' },
      { data: 'RawRatio', label: 'R/M Ratio' },

    ],
    actions: [
      { action: 'edit', title: 'Edit', icon: 'pencil', class: 'primary' },
      { action: 'delete', title: 'Delete', icon: 'trash', class: 'danger' },
    ],
  };
  public Filter = {
    TypeID: '',
  };
  Companies: any = [];
  Categories: any = [];

  constructor(private http: HttpBase) {}

  ngOnInit() {
    
  }

  FilterData() {
    let filter = '1 = 1 ';
    if (this.Filter.TypeID !== '')
      filter += ' AND TypeID=' + this.Filter.TypeID;

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
    TypeID: 2
  }) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.dataList.realoadTable();
        console.log(r);
      }
    });
  }
}
