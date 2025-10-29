import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { HttpBase } from '../../../services/httpbase.service';

@Component({
  selector: 'app-rawproducts',
  templateUrl: './rawproducts.component.html',
  styleUrls: ['./rawproducts.component.scss'],
})
export class RawProductsComponent implements OnInit {
  @ViewChild('dataList') dataList;

  public form = {
    title: 'Paw Products List',
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
        fldName: 'PPrice',
        control: 'input',
        type: 'number',
        label: 'Purchase Price',
        required: false,
        size: 3,
      },
    ],
  };
  public Settings = {
    tableName: 'qryrawproducts',
    pk: 'ProductID',
    crud: true,

    columns: [
      { data: 'ProductID', label: 'ID' },
      { data: 'ProductName', label: 'Product Name' },
      { data: 'PPrice', label: 'Purchase Price' },


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
    this.http.getData('companies').then((a) => {
      this.Companies = a;
    });
    this.http.getData('categories').then((a) => {
      this.Categories = a;
    });
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
  Add(data: any = {}) {
    this.http.openForm(this.form, data).then((r) => {
      if (r == 'save') {
        this.dataList.realoadTable();
        console.log(r);
      }
    });
  }
}
